const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const { authenticateToken, generateToken } = require('./auth');

const app = express();
const port = process.env.PORT || 3000;
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Basic route
app.get('/api/health', async (req, res) => {
  try {
    // Test DB connection by querying a simple 1
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ok', message: 'Backend and Database are running perfectly!' });
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ status: 'error', message: 'Database connection failed' });
  }
});

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name, phone } = req.body;
    
    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
        phone
      }
    });

    const token = generateToken(user);
    res.status(201).json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
  } catch (error) {
    res.status(500).json({ error: 'Server error during registration' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user);
    res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
  } catch (error) {
    res.status(500).json({ error: 'Server error during login' });
  }
});

// Protected route example
app.get('/api/users/me', authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, email: true, name: true, role: true, savingsAccount: true }
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Mock Dashboard Endpoints
app.get('/api/dashboard/summary', authenticateToken, async (req, res) => {
  // Return mock dashboard summary based on user
  res.json({
    savings: {
      totalSaved: 8400000,
      targetAmount: 15000000,
      interestEarned: 420000, // 5% of 8.4M
      progressPercent: 56
    },
    journey: {
      currentStep: 'Saving', // Registered, Saving, Qualified, Financing, Released, Repayment
      completedSteps: ['Registered', 'Saving']
    },
    vehicle: null, // User is still saving
    repayment: null
  });
});

// Mock Savings Calculator Endpoint
app.post('/api/savings/calculate', (req, res) => {
  const { targetAmount, monthlyContribution } = req.body;
  if (!targetAmount || !monthlyContribution) {
    return res.status(400).json({ error: 'Missing targetAmount or monthlyContribution' });
  }
  
  const months = Math.ceil(targetAmount / monthlyContribution);
  const totalInterest = (targetAmount * 0.05).toFixed(0);
  
  res.json({
    targetAmount,
    monthlyContribution,
    estimatedMonths: months,
    estimatedInterest: parseInt(totalInterest)
  });
});

app.listen(port, '0.0.0.0', () => {
  const { networkInterfaces } = require('os');
  const nets = networkInterfaces();
  let localIp = 'localhost';
  
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        localIp = net.address;
        break;
      }
    }
  }

  console.log(`Server running on http://0.0.0.0:${port}`);
  console.log(`📱 Access API on your phone at http://${localIp}:${port}`);
});
