// backend/routes/service.routes.js
const express = require('express');
const router = express.Router();

// Mock data
const services = [
  { id: 1, name: 'Laser Engraving', description: 'Precision laser engraving for industrial and commercial applications', priceRange: 'KES 500 - 5,000' },
  { id: 2, name: 'CNC Routing', description: 'Computer-controlled routing for complex shapes and designs', priceRange: 'KES 1,000 - 10,000' },
  { id: 3, name: 'Custom Design', description: 'Bespoke design services for unique requirements', priceRange: 'Quote on request' }
];

// GET /api/services
router.get('/', (req, res) => {
  try {
    res.json({
      success: true,
      count: services.length,
      services
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/services/:id
router.get('/:id', (req, res) => {
  try {
    const service = services.find(s => s.id === parseInt(req.params.id));
    if (!service) {
      return res.status(404).json({ success: false, error: 'Service not found' });
    }
    res.json({ success: true, service });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
