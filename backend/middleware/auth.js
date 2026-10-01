const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
      );

      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User belonging to this token no longer exists'
        });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error('[Auth Middleware] Verification error:', error.message);
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired authentication token'
      });
    }
  } else {
    return res.status(401).json({
      success: false,
      message: 'Access denied: No token provided'
    });
  }
};

module.exports = { protect };
