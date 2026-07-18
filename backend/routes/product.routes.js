// backend/routes/product.routes.js
// Product routes for 125Customs API
const express = require('express');
const router = express.Router();
const productService = require('../services/product.service');
const { protect, admin } = require('../middleware/auth.middleware');

// GET /api/products - Get all products (with optional filters)
router.get('/', async (req, res) => {
  try {
    const result = await productService.getProducts(req.query);
    if (result.success) {
      res.json(result);
    } else {
      res.status(500).json({ error: result.error });
    }
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// GET /api/products/:id - Get single product
router.get('/:id', async (req, res) => {
  try {
    const result = await productService.getProductById(req.params.id);
    if (result.success) {
      res.json(result);
    } else {
      if (result.error === 'Product not found') {
        res.status(404).json({ error: result.error });
      } else {
        res.status(500).json({ error: result.error });
      }
    }
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// POST /api/products - Create new product (Admin only)
router.post('/', protect, admin, async (req, res) => {
  try {
    // TODO: Add authentication middleware
    const result = await productService.createProduct(req.body);
    if (result.success) {
      res.status(201).json(result);
    } else {
      res.status(500).json({ error: result.error });
    }
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// PUT /api/products/:id - Update product (Admin only)
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const result = await productService.updateProduct(req.params.id, req.body);
    if (result.success) {
      res.json(result);
    } else {
      if (result.error === 'Product not found') {
        res.status(404).json({ error: result.error });
      } else {
        res.status(500).json({ error: result.error });
      }
    }
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// DELETE /api/products/:id - Delete product (Admin only)
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const result = await productService.deleteProduct(req.params.id);
    if (result.success) {
      res.json(result);
    } else {
      if (result.error === 'Product not found') {
        res.status(404).json({ error: result.error });
      } else {
        res.status(500).json({ error: result.error });
      }
    }
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

module.exports = router;