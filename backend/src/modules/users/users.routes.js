const express = require('express');
const { submitKyc, getMyProfile } = require('./users.controller');
const { authenticateToken } = require('../../shared/middleware/auth.middleware');

const router = express.Router();

router.get('/me', authenticateToken, getMyProfile);
router.post('/kyc', authenticateToken, submitKyc);

module.exports = router;
