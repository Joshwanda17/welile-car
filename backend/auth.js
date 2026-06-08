const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key_for_development_only';

// Middleware to protect routes
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer TOKEN"

  if (token == null) {
    return res.status(401).json({ error: 'Authentication token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    
    // Store user info in request for downstream use
    req.user = user;
    next();
  });
};

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role }, 
    JWT_SECRET, 
    { expiresIn: '24h' }
  );
};

module.exports = {
  authenticateToken,
  generateToken,
  JWT_SECRET
};
