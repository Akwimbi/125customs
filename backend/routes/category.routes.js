// backend/routes/category.routes.js
const express = require('express');
const router = express.Router();
const prisma = require('../services/prisma.service');

// Human-friendly labels for known category slugs. Any category not listed
// here just gets title-cased automatically, so new categories added to
// products don't require a code change here to show up correctly.
const CATEGORY_LABELS = {
  'asset-tags': 'Asset Tags',
  'equipment-labels': 'Equipment Labels',
  'pet-tags': 'Pet ID Tags',
  'keychains': 'Keychains',
  'trophies': 'Trophies & Awards',
  'signs': 'Signage & Plaques'
};

function toLabel(slug) {
  if (CATEGORY_LABELS[slug]) return CATEGORY_LABELS[slug];
  return slug.split(/[-_]/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

// GET /api/categories - derived from real, active products, not a hand-maintained
// list. This used to be hardcoded and drifted out of sync with actual product
// categories (different naming convention entirely, some categories missing,
// some that didn't exist in any real product).
router.get('/', async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true },
      select: { category: true }
    });

    const counts = {};
    for (const p of products) {
      counts[p.category] = (counts[p.category] || 0) + 1;
    }

    const categories = Object.entries(counts).map(([slug, productCount], index) => ({
      id: index + 1,
      slug,
      name: toLabel(slug),
      productCount
    }));

    res.json({
      success: true,
      count: categories.length,
      categories
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch categories' });
  }
});

// GET /api/categories/:slug - products in a given category
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const products = await prisma.product.findMany({
      where: { category: slug, isActive: true }
    });

    if (products.length === 0) {
      return res.status(404).json({ success: false, error: 'Category not found or has no active products' });
    }

    res.json({
      success: true,
      category: { slug, name: toLabel(slug), productCount: products.length },
      products
    });
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch category' });
  }
});

module.exports = router;
