/**
 * Authentication Middleware
 * Verifies JWT tokens and attaches user information to requests
 * 
 * Usage: app.use('/api/protected-routes', auth);
 */

const jwt = require('jsonwebtoken');

/**
 * Middleware to verify JWT token from Authorization header
 * Attaches decoded user data to req.user
 */
const auth = (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ 
        message: 'No authorization header provided' 
      });
    }

    // Expected format: "Bearer <token>"
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(401).json({ 
        message: 'Invalid authorization header format. Use: Bearer <token>' 
      });
    }

    const token = parts[1];

    // Verify token
    const decoded = jwt.verify(
      token, 
      process.env.JWT_SECRET || 'your-secret-key'
    );

    // Attach user data to request
    req.user = decoded;
    
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        message: 'Token has expired' 
      });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        message: 'Invalid token' 
      });
    }

    return res.status(401).json({ 
      message: 'Authentication failed',
      error: error.message 
    });
  }
};

module.exports = auth;

/**
 * IMPLEMENTATION NOTES:
 * 
 * 1. Install jwt package:
 *    npm install jsonwebtoken
 * 
 * 2. Create token when user logs in (in your login controller):
 *    const token = jwt.sign(
 *      { userId: user._id, email: user.email },
 *      process.env.JWT_SECRET || 'your-secret-key',
 *      { expiresIn: '24h' }
 *    );
 * 
 * 3. Send token to client:
 *    res.json({ token, user: { id: user._id, email: user.email } });
 * 
 * 4. Client stores token in localStorage:
 *    localStorage.setItem('token', token);
 * 
 * 5. Use middleware in protected routes:
 *    router.get('/protected-endpoint', auth, controller.method);
 * 
 * 6. Access user in controllers:
 *    const userId = req.user.userId; // From decoded token
 * 
 * ENVIRONMENT VARIABLES:
 * Add to your .env file:
 *    JWT_SECRET=your-super-secret-key-change-this
 *    JWT_EXPIRE=24h
 */
