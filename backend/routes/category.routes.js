// backend/routes/category.routes.js
const express = require('express');
const router = express.Router();

// Mock data
const categories = [
  { id: 1, name: 'Asset Tags', description: 'Industrial asset tagging solutions', productCount: 3 },
  { id: 2, name: 'Memorial Plaques', description: 'Custom memorial and commemorative plaques', productCount: 2 },
  { id: 3, name: 'Signage', description: 'Professional signage and wayfinding', productCount: 1 }
];

// GET /api/categories
router.get('/', (req, res) => {
  try {
    res.json({
      success: true,
      count: categories.length,
      categories
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/categories/:id
router.get('/:id', (req, res) => {
  try {
    const category = categories.find(c => c.id === parseInt(req.params.id));
    if (!category) {
      return res.status(404).json({ success: false, error: 'Category not found' });
    }
    res.json({ success: true, category });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
