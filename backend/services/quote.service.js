// backend/services/quote.service.js
// B2B Quote/RFQ service
const prisma = require('./prisma.service');
const { sendQuoteApproval } = require('./email.service');

// Create new quote request
async function createQuote({ userId, companyName, contactPerson, email, phone, projectDescription, quantity, materialPreference, serializationType, serializationData }) {
  // Generate quote number
  const quoteCount = await prisma.quote.count();
  const quoteNumber = `Q-${new Date().getFullYear()}-${String(quoteCount + 1).padStart(3, '0')}`;

  // Calculate valid until (30 days from now)
  const validUntil = new Date();
  validUntil.setDate(validUntil.getDate() + 30);

  // Create quote
  const quote = await prisma.quote.create({
    data: {
      quoteNumber,
      userId,
      companyName,
      contactPerson,
      email,
      phone,
      projectDescription,
      quantity,
      materialPreference,
      serializationType,
      serializationData,
      status: 'pending',
      validUntil
    }
  });

  return getQuoteById(quote.id);
}

// Get quote by ID
async function getQuoteById(quoteId) {
  const quote = await prisma.quote.findUnique({
    where: { id: quoteId },
    include: {
      items: {
        include: {
          product: true
        }
      },
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          audienceType: true,
          companyName: true
        }
      }
    }
  });

  if (!quote) {
    throw new Error('Quote not found');
  }

  return quote;
}

// Add item to quote
async function addQuoteItem(quoteId, { productId, quantity, unitPrice }) {
  const quoteItem = await prisma.quoteItem.create({
    data: {
      quoteId,
      productId,
      quantity,
      unitPrice,
      subtotal: quantity * unitPrice
    }
  });

  // Update quote total amount
  const items = await prisma.quoteItem.findMany({
    where: { quoteId }
  });

  const totalAmount = items.reduce((sum, item) => sum + item.subtotal, 0);

  await prisma.quote.update({
    where: { id: quoteId },
    data: { totalAmount }
  });

  return quoteItem;
}

// Approve quote (Admin)
async function approveQuote(quoteId, { totalAmount, notes = '' }) {
  const quote = await prisma.quote.update({
    where: { id: quoteId },
    data: {
      status: 'approved',
      totalAmount
    },
    include: {
      items: {
        include: {
          product: true
        }
      }
    }
  });

  // Send approval email
  try {
    await sendQuoteApproval({
      to: quote.email,
      quoteNumber: quote.quoteNumber,
      companyName: quote.companyName,
      totalAmount,
      pdfUrl: null // Will be generated client-side
    });
  } catch (error) {
    console.error('Failed to send quote approval email:', error.message);
    // Don't fail the approval if email fails
  }

  return quote;
}

// Reject quote (Admin)
// Reject quote
async function rejectQuote(quoteId, reason) {
  const quote = await prisma.quote.update({
    where: { id: parseInt(quoteId) },
    data: { 
      status: 'rejected',
      notes: reason
    }
  });

  return quote;
}

// Get quotes by user
async function getQuotesByUser(userId, { status = null, limit = 20, offset = 0 }) {
  const where = { userId };

  if (status) {
    where.status = status;
  }

  const quotes = await prisma.quote.findMany({
    where,
    include: {
      items: {
        include: {
          product: true
        }
      }
    },
    take: limit,
    skip: offset,
    orderBy: {
      createdAt: 'desc'
    }
  });

  return quotes;
}

// Get all quotes (Admin)
async function getAllQuotes({ status = null, limit = 50, offset = 0 }) {
  const where = {};

  if (status) {
    where.status = status;
  }

  const quotes = await prisma.quote.findMany({
    where,
    include: {
      items: {
        include: {
          product: true
        }
      },
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          audienceType: true,
          companyName: true
        }
      }
    },
    take: limit,
    skip: offset,
    orderBy: {
      createdAt: 'desc'
    }
  });

  return quotes;
}

module.exports = {
  createQuote,
  getQuoteById,
  addQuoteItem,
  approveQuote,
  rejectQuote,
  getQuotesByUser,
  getAllQuotes
};
