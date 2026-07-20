// backend/routes/auth.routes.js
// Authentication routes for 125Customs API
const express = require('express');
const router = express.Router();
const authService = require('../services/auth.service');
const { protect } = require('../middleware/auth.middleware');

// POST /api/auth/register - Register new user
router.post('/register', async (req, res) => {
  try {
    const { email, password, name, audienceType } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        error: 'Email and password required' 
      });
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid email address'
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 8 characters'
      });
    }

    const allowedAudienceTypes = ['b2b', 'b2c', 'both'];
    const safeAudienceType = allowedAudienceTypes.includes(audienceType) ? audienceType : 'both';

    // role is never accepted from the client - every self-registration is a
    // customer account. Promoting someone to admin is a deliberate, separate
    // action, not something a signup form should ever be able to trigger.
    const result = await authService.register({ 
      email, 
      password, 
      name, 
      role: 'customer',
      audienceType: safeAudienceType
    });

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.status(201).json(result);
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Registration failed' 
    });
  }
});

// POST /api/auth/login - Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        error: 'Email and password required' 
      });
    }

    // Use auth service
    const result = await authService.login(email, password);

    if (!result.success) {
      return res.status(401).json(result);
    }

    res.json(result);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Login failed' 
    });
  }
});

// GET /api/auth/verify - Verify JWT token (protected)
router.get('/verify', protect, async (req, res) => {
  try {
    // req.user is set by the protect middleware
    res.json({
      success: true,
      user: req.user
    });
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Token verification failed' 
    });
  }
});

module.exports = router;