const express = require('express');
const { authenticateToken } = require('../../shared/middleware/auth.middleware');
const { getSchedule, payInstallment, repaymentWebhook } = require('./repayments.controller');

const router = express.Router();

router.get('/schedule', authenticateToken, getSchedule);
router.post('/pay', authenticateToken, payInstallment);
router.post('/webhook/payment', repaymentWebhook);

module.exports = router;
