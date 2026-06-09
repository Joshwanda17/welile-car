/**
 * Calculate a Risk Score (0-100) based on user data.
 * @param {Object} user - The user object from Prisma
 * @param {number} totalSaved - The total amount the user has saved
 * @param {number} vehicleTarget - The required 30% deposit target
 * @returns {number} Score from 0 to 100
 */
const calculateRiskScore = (user, totalSaved, vehicleTarget) => {
  let score = 0;

  // 1. KYC Verification (up to 30 points)
  if (user.kycStatus === 'VERIFIED') score += 30;
  else if (user.kycStatus === 'PENDING') score += 10;

  // 2. Employment Status (up to 30 points)
  if (user.employmentStatus === 'Employed') score += 30;
  else if (user.employmentStatus === 'Self-Employed') score += 20;
  else if (user.employmentStatus === 'Student') score += 10;

  // 3. Savings Progress (up to 40 points)
  if (vehicleTarget > 0) {
    const progressPercent = Math.min(100, (totalSaved / vehicleTarget) * 100);
    // Grant up to 40 points based on progress towards the 30% deposit
    score += Math.round((progressPercent / 100) * 40);
  } else {
    // If no target, give base points for having some savings
    if (totalSaved > 100000) score += 10;
    if (totalSaved > 1000000) score += 20;
  }

  // Cap at 100
  return Math.min(100, score);
};

/**
 * Determine Risk Level string based on score
 */
const getRiskLevel = (score) => {
  if (score >= 70) return 'Low';
  if (score >= 40) return 'Medium';
  return 'High';
};

module.exports = {
  calculateRiskScore,
  getRiskLevel
};
