const express = require('express');
const { deposit, getHistory, paymentWebhook } = require('./transactions.controller');
const { authenticateToken } = require('../../shared/middleware/auth.middleware');

const router = express.Router();

router.post('/deposit', authenticateToken, deposit);
router.get('/history', authenticateToken, getHistory);
router.post('/webhook/payment', paymentWebhook);

module.exports = router;
