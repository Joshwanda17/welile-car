const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Log a critical action to the AuditLog table.
 * @param {number} userId - ID of the user performing the action
 * @param {string} action - Describe the action (e.g. 'USER_LOGIN', 'LOAN_APPROVAL')
 * @param {string} details - Additional context or JSON stringified details
 * @param {string} ipAddress - Request IP
 */
const logAction = async (userId, action, details = null, ipAddress = null) => {
  try {
    await prisma.auditLog.create({
      data: {
        userId,
        action,
        details,
        ipAddress
      }
    });
  } catch (err) {
    console.error('Failed to write audit log:', err);
  }
};

module.exports = {
  logAction
};
