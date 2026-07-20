// backend/app.js
// 125Customs Backend API - Express App Configuration
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();

// Security middleware
app.use(helmet()); // Adds security headers

// CORS configuration
// In development, Vite's dev server port isn't stable - it auto-increments
// whenever its configured port is already taken, which happens often on this
// machine. Hardcoding a single origin means CORS breaks every time that
// happens. So in development, allow any localhost/127.0.0.1 origin regardless
// of port; in production, stay strict to exactly FRONTEND_URL.
const isDev = process.env.NODE_ENV !== 'production';
app.use(cors({
  origin: isDev
    ? (origin, callback) => {
        if (!origin || /^https?:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin)) {
          return callback(null, true);
        }
        callback(new Error('Not allowed by CORS'));
      }
    : (process.env.FRONTEND_URL || 'http://localhost:5173'),
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
app.use(morgan('combined'));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API Routes
const authRoutes = require('./routes/auth.routes');
const productRoutes = require('./routes/product.routes');
const orderRoutes = require('./routes/order.routes');
const quoteRoutes = require('./routes/quote.routes');
const cartRoutes = require('./routes/cart.routes');
const paystackRoutes = require('./routes/paystack.routes');
const categoryRoutes = require('./routes/category.routes');
const serviceRoutes = require('./routes/service.routes');

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/quotes', quoteRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/paystack', paystackRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/services', serviceRoutes);

// API Info endpoint
app.get('/api', (req, res) => {
  res.json({
    message: '125Customs API - B2B + B2C Custom Engraving Platform',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      products: '/api/products',
      orders: '/api/orders',
      quotes: '/api/quotes',
      cart: '/api/cart',
      paystack: '/api/paystack'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

module.exports = app;
module.exports = app;
