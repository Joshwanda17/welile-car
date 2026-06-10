const express = require('express');
const { getDashboardSummary } = require('./dashboard.controller');
const { authenticateToken } = require('../../shared/middleware/auth.middleware');

const router = express.Router();

router.get('/summary', authenticateToken, getDashboardSummary);

module.exports = router;
