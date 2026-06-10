const { PrismaClient } = require('@prisma/client');
const { calculateRiskScore } = require('../../shared/utils/risk.util');

const prisma = new PrismaClient();

const applyForLoan = async (req, res) => {
  try {
    const userId = req.user.id;
    const { carId, carName, carPrice, requestedAmount } = req.body;

    // Fetch user and savings to calculate risk score
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { savingsAccount: true }
    });

    if (!user) return res.status(404).json({ error: 'User not found' });

    const totalSaved = Number(user.savingsAccount?.balance || 0);
    const vehicleTarget = carPrice * 0.3; // 30% deposit requirement

    // Calculate Risk Score
    const riskScore = calculateRiskScore(user, totalSaved, vehicleTarget);

    // Auto-underwriting rules
    let status = 'PENDING';
    if (riskScore < 40) {
      status = 'REJECTED'; // Too risky
    } else if (totalSaved < vehicleTarget) {
      status = 'REJECTED'; // Hasn't met 30% deposit
    } else if (riskScore >= 70) {
      status = 'APPROVED'; // Low risk auto-approval
    } else {
      status = 'UNDER_REVIEW'; // Medium risk requires manual review
    }

    // Since the frontend sends string IDs for cars (e.g., 'wish'), we'll find or create a numeric Vehicle for it.
    let vehicle = await prisma.vehicle.findFirst({
      where: { make: carName }
    });

    if (!vehicle) {
      vehicle = await prisma.vehicle.create({
        data: {
          make: carName,
          model: carId, // 'wish'
          year: 2015,
          price: carPrice,
          status: 'RESERVED'
        }
      });
    }

    // Create the Application
    const application = await prisma.loanApplication.create({
      data: {
        userId,
        vehicleId: vehicle.id,
        requestedAmount: requestedAmount,
        riskScore: riskScore,
        status: status
      }
    });

    // If approved, create a Financing Agreement and lock savings
    if (status === 'APPROVED') {
      await prisma.$transaction([
        // Freeze savings
        prisma.savingsAccount.update({
          where: { userId },
          data: { status: 'FROZEN' }
        }),
        // Create Financing Agreement
        prisma.financingAgreement.create({
          data: {
            customerId: userId,
            vehicleId: vehicle.id,
            principalAmount: requestedAmount,
            monthlyInstallment: requestedAmount / 6, // 6 months simplistic term
            interestRate: 15.00, // 15% flat rate
            endDate: new Date(new Date().setMonth(new Date().getMonth() + 6)),
            status: 'ACTIVE'
          }
        }),
        // Log action
        prisma.auditLog.create({
          data: {
            userId,
            action: 'LOAN_APPROVED',
            details: `Auto-approved loan for ${carName} based on score ${riskScore}`
          }
        })
      ]);
    } else {
      await prisma.auditLog.create({
        data: {
          userId,
          action: 'LOAN_APPLIED',
          details: `Applied for loan for ${carName}. Status: ${status}. Score: ${riskScore}`
        }
      });
    }

    res.json({
      message: 'Application submitted',
      applicationId: application.id,
      status: status,
      riskScore: riskScore
    });

  } catch (error) {
    console.error('Loan Apply Error:', error);
    res.status(500).json({ error: 'Server error processing loan application' });
  }
};

const getApplications = async (req, res) => {
  try {
    const applications = await prisma.loanApplication.findMany({
      include: {
        user: {
          select: { name: true, email: true, phone: true }
        },
        vehicle: true
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching applications' });
  }
};

module.exports = {
  applyForLoan,
  getApplications
};
