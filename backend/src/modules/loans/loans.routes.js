const express = require('express');
const { applyForLoan, getApplications } = require('./loans.controller');
const { authenticateToken } = require('../../shared/middleware/auth.middleware');

const router = express.Router();

router.post('/apply', authenticateToken, applyForLoan);
router.get('/admin/applications', authenticateToken, getApplications); // Ideally this would use an admin check middleware

module.exports = router;
