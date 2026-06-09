const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const deposit = async (req, res) => {
  try {
    const userId = req.user.id;
    const { amount, method } = req.body;

    if (!amount || amount < 1000) {
      return res.status(400).json({ error: 'Minimum deposit is 1000 UGX' });
    }

    // MOCK MOBILE MONEY PULL
    // In a real app, we would initiate a MoMo push to the user's phone here,
    // wait for the webhook, and THEN update the DB. For now, we instantly approve.

    // Get or create savings account
    let savings = await prisma.savingsAccount.findUnique({ where: { userId } });
    if (!savings) {
      savings = await prisma.savingsAccount.create({
        data: {
          userId,
          targetAmount: 15000000, // Default mock vehicle target
          balance: 0,
          interestEarned: 0
        }
      });
    }

    // Transaction
    const updatedSavings = await prisma.$transaction(async (tx) => {
      // 1. Create the transaction record
      await tx.savingsTransaction.create({
        data: {
          accountId: savings.id,
          amount: amount,
          type: 'DEPOSIT'
        }
      });

      // 2. Update balance
      return tx.savingsAccount.update({
        where: { id: savings.id },
        data: {
          balance: { increment: amount }
        }
      });
    });

    // Also create an audit log
    await prisma.auditLog.create({
      data: {
        userId,
        action: 'DEPOSIT',
        details: `Deposited ${amount} UGX via ${method} (MOCK)`
      }
    });

    res.json({
      message: 'Deposit successful',
      balance: updatedSavings.balance
    });
  } catch (error) {
    console.error('Deposit Error:', error);
    res.status(500).json({ error: 'Server error processing deposit' });
  }
};

const getHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const savings = await prisma.savingsAccount.findUnique({
      where: { userId },
      include: {
        transactions: {
          orderBy: { date: 'desc' },
          take: 50
        }
      }
    });

    if (!savings) {
      return res.json({ transactions: [] });
    }

    res.json({ transactions: savings.transactions });
  } catch (error) {
    console.error('History Error:', error);
    res.status(500).json({ error: 'Server error retrieving transactions' });
  }
};

module.exports = {
  deposit,
  getHistory
};
