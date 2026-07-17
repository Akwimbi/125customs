// backend/routes/quote.routes.js
// Quote routes for B2B customers
const express = require('express');
const router = express.Router();
const quoteService = require('../services/quote.service');
const { protect, admin } = require('../middleware/auth.middleware');
const {
  validateCreateQuote,
  validateQuoteItem,
  validateApproveQuote,
  validateRejectQuote
} = require('../middleware/quoteValidation');

// POST /api/quotes - Create new quote request (protected)
router.post('/', protect, validateCreateQuote, async (req, res) => {
  try {
    const userId = req.user ? req.user.id : null; // should exist due to protect
    const {
      companyName,
      contactPerson,
      email,
      phone,
      projectDescription,
      quantity,
      materialPreference,
      serializationType,
      serializationData
    } = req.body;

    const quote = await quoteService.createQuote({
      userId,
      companyName,
      contactPerson,
      email,
      phone,
      projectDescription,
      quantity,
      materialPreference: materialPreference || '',
      serializationType: serializationType || '',
      serializationData: serializationData || ''
    });

    res.status(201).json({
      success: true,
      message: 'Quote request submitted successfully',
      quote
    });
  } catch (error) {
    console.error('Error creating quote:', error);
    res.status(500).json({ success: false, error: 'Failed to create quote request' });
  }
});

// GET /api/quotes/:id - Get quote by ID (protected)
router.get('/:id', protect, async (req, res) => {
  try {
    const quoteId = parseInt(req.params.id, 10);
    const quote = await quoteService.getQuoteById(quoteId);
    // Optional: ensure user owns the quote or is admin
    // if (quote.userId !== req.user.id && req.user.role !== 'admin') {
    //   return res.status(403).json({ success: false, error: 'Not authorized' });
    // }
    res.json({ success: true, quote });
  } catch (error) {
    console.error('Error fetching quote:', error);
    if (error.message === 'Quote not found') {
      return res.status(404).json({ success: false, error: 'Quote not found' });
    }
    res.status(500).json({ success: false, error: 'Failed to fetch quote' });
  }
});

// POST /api/quotes/:id/items - Add item to quote (protected)
router.post('/:id/items', protect, validateQuoteItem, async (req, res) => {
  try {
    const quoteId = parseInt(req.params.id, 10);
    const { productId, quantity, unitPrice } = req.body;

    const quoteItem = await quoteService.addQuoteItem(quoteId, {
      productId,
      quantity,
      unitPrice
    });

    // Fetch updated quote to return
    const updatedQuote = await quoteService.getQuoteById(quoteId);

    res.json({
      success: true,
      message: 'Item added to quote',
      quoteItem,
      quote: updatedQuote
    });
  } catch (error) {
    console.error('Error adding quote item:', error);
    if (error.message === 'Quote not found') {
      return res.status(404).json({ success: false, error: 'Quote not found' });
    }
    res.status(500).json({ success: false, error: 'Failed to add item to quote' });
  }
});

// POST /api/quotes/:id/approve - Approve quote (admin only)
router.post('/:id/approve', protect, admin, validateApproveQuote, async (req, res) => {
  try {
    const quoteId = parseInt(req.params.id, 10);
    const { totalAmount, notes } = req.body;

    const quote = await quoteService.approveQuote(quoteId, {
      totalAmount,
      notes
    });

    res.json({
      success: true,
      message: 'Quote approved successfully',
      quote
    });
  } catch (error) {
    console.error('Error approving quote:', error);
    if (error.message === 'Quote not found') {
      return res.status(404).json({ success: false, error: 'Quote not found' });
    }
    res.status(500).json({ success: false, error: 'Failed to approve quote' });
  }
});

// POST /api/quotes/:id/reject - Reject quote (admin only)
router.post('/:id/reject', protect, admin, validateRejectQuote, async (req, res) => {
  try {
    const quoteId = parseInt(req.params.id, 10);
    const { reason } = req.body;

    const quote = await quoteService.rejectQuote(quoteId, reason);

    res.json({
      success: true,
      message: 'Quote rejected',
      quote
    });
  } catch (error) {
    console.error('Error rejecting quote:', error);
    if (error.message === 'Quote not found') {
      return res.status(404).json({ success: false, error: 'Quote not found' });
    }
    res.status(500).json({ success: false, error: 'Failed to reject quote' });
  }
});

// GET /api/quotes - Get quotes for logged-in user (protected)
router.get('/', protect, async (req, res) => {
  try {
    const userId = req.user.id;
    const { status, limit = 20, offset = 0 } = req.query;
    const parseLimit = parseInt(limit, 10);
    const parseOffset = parseInt(offset, 10);

    const quotes = await quoteService.getQuotesByUser(userId, {
      status: status || null,
      limit: isNaN(parseLimit) ? 20 : parseLimit,
      offset: isNaN(parseOffset) ? 0 : parseOffset
    });

    res.json({ success: true, quotes, count: quotes.length });
  } catch (error) {
    console.error('Error fetching user quotes:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch quotes' });
  }
});

// GET /api/quotes/admin/all - Get all quotes (admin only)
router.get('/admin/all', protect, admin, async (req, res) => {
  try {
    const { status, limit = 50, offset = 0 } = req.query;
    const parseLimit = parseInt(limit, 10);
    const parseOffset = parseInt(offset, 10);

    const quotes = await quoteService.getAllQuotes({
      status: status || null,
      limit: isNaN(parseLimit) ? 50 : parseLimit,
      offset: isNaN(parseOffset) ? 0 : parseOffset
    });

    res.json({ success: true, quotes, count: quotes.length });
  } catch (error) {
    console.error('Error fetching all quotes:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch quotes' });
  }
});

module.exports = router;
