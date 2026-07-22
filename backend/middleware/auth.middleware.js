// backend/middleware/auth.middleware.js
// Authentication middleware for 125Customs API
const jwt = require('jsonwebtoken');
const prisma = require('../services/prisma.service');
require('dotenv').config();

// Protect routes - verify JWT token
const protect = async (req, res, next) => {
  let token;

  // Check for token in Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from database
      req.user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          audienceType: true
        }
      });

      if (!req.user) {
        return res.status(401).json({ 
          success: false, 
          message: 'Not authorized, user not found' 
        });
      }

      next();
    } catch (error) {
      console.error('Token verification error:', error.message);
      return res.status(401).json({ 
        success: false, 
        message: 'Not authorized, token failed' 
      });
    }
  }

  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'Not authorized, no token' 
    });
  }
};

// Optional auth - populates req.user if a valid token is present, but never
// blocks the request if there isn't one. For routes that support both guest
// and logged-in flows (like payment initialization) but still need to know
// who's calling when someone IS logged in, e.g. to verify order ownership.
const optionalAuth = async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          audienceType: true
        }
      });
    } catch (error) {
      // Invalid/expired token on an optional-auth route just means "treat as
      // guest" - don't block the request over it.
      req.user = null;
    }
  }
  next();
};

// Admin middleware - check if user is admin
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ 
      success: false, 
      message: 'Not authorized as an admin' 
    });
  }
};

module.exports = { protect, admin, optionalAuth };