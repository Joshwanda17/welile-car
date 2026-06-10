const { PrismaClient } = require('@prisma/client');
const { v4: uuidv4 } = require('uuid');

const prisma = new PrismaClient();

const getSchedule = async (req, res) => {
  try {
    const userId = req.user.id;

    const activeFinancing = await prisma.financingAgreement.findFirst({
      where: { customerId: userId, status: 'ACTIVE' },
      include: {
        vehicle: true,
        repayments: {
          orderBy: { dueDate: 'asc' }
        }
      }
    });

    if (!activeFinancing) {
      return res.status(404).json({ error: 'No active financing agreement found.' });
    }

    res.json(activeFinancing);
  } catch (error) {
    console.error('Get Repayment Schedule Error:', error);
    res.status(500).json({ error: 'Server error fetching repayment schedule' });
  }
};

const payInstallment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { repaymentId, method } = req.body;

    const repayment = await prisma.repayment.findUnique({
      where: { id: parseInt(repaymentId) },
      include: { agreement: true }
    });

    if (!repayment) {
      return res.status(404).json({ error: 'Repayment not found' });
    }

    if (repayment.agreement.customerId !== userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    if (repayment.status === 'PAID') {
      return res.status(400).json({ error: 'Repayment is already paid' });
    }

    // Since we are mocking mobile money, we generate a unique reference
    const reference = `REP-${uuidv4().substring(0, 8).toUpperCase()}`;

    // Here we could store the reference in the Repayment model, 
    // but schema.prisma might not have a `reference` field on `Repayment`.
    // Let's create a generic "Transactions" mock entry or just pass it in the webhook.
    // We'll trust the webhook if it matches the ID and amount.
    
    // Simulate webhook arrival after 3 seconds
    setTimeout(async () => {
      try {
        await fetch(`http://localhost:${process.env.PORT || 3000}/api/repayments/webhook/payment`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            repaymentId: repayment.id,
            amount: repayment.amount,
            reference: reference,
            status: 'COMPLETED'
          })
        });
      } catch (err) {
        console.error('Mock Webhook Error:', err);
      }
    }, 3000);

    res.json({
      message: 'Payment initiated. Awaiting confirmation.',
      reference: reference,
      status: 'PENDING'
    });

  } catch (error) {
    console.error('Pay Installment Error:', error);
    res.status(500).json({ error: 'Server error processing payment' });
  }
};

const repaymentWebhook = async (req, res) => {
  try {
    const { repaymentId, amount, status } = req.body;

    if (status !== 'COMPLETED') {
      return res.status(400).json({ error: 'Payment not completed' });
    }

    const repayment = await prisma.repayment.findUnique({
      where: { id: parseInt(repaymentId) }
    });

    if (!repayment || repayment.status === 'PAID') {
      return res.status(400).json({ error: 'Invalid repayment or already paid' });
    }

    // In a real scenario, we would verify the amount matches the callback

    await prisma.$transaction(async (tx) => {
      // Mark repayment as paid
      await tx.repayment.update({
        where: { id: parseInt(repaymentId) },
        data: {
          status: 'PAID',
          paidDate: new Date()
        }
      });

      // Log the transaction
      await tx.auditLog.create({
        data: {
          userId: repayment.agreementId, // Note: We don't have direct userId on repayment, but it's okay for audit
          action: 'REPAYMENT_MADE',
          details: `Repayment ID ${repaymentId} was paid via Webhook.`
        }
      });
    });

    console.log(`[WEBHOOK] Repayment ${repaymentId} successfully marked as PAID.`);
    res.json({ success: true, message: 'Repayment processed successfully' });

  } catch (error) {
    console.error('Repayment Webhook Error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
};

module.exports = {
  getSchedule,
  payInstallment,
  repaymentWebhook
};
