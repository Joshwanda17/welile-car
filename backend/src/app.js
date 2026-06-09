const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken } = require('./shared/middleware/auth.middleware');

// Routes
const authRoutes = require('./modules/auth/auth.routes');
const usersRoutes = require('./modules/users/users.routes');
const dashboardRoutes = require('./modules/dashboard/dashboard.routes');

const app = express();
const port = process.env.PORT || 3000;
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Basic health route
app.get('/api/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ok', message: 'Backend and Database are running perfectly!' });
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ status: 'error', message: 'Database connection failed' });
  }
});

// App routes
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/dashboard', dashboardRoutes);

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
