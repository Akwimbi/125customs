// backend/services/cart.service.js
// Cart management service (server-side persistence for B2B)
const prisma = require('./prisma.service');

// Sync cart to server (for B2B device switching)
async function syncCart({ sessionId, userId = null, isB2B = false, companyName = null, items = [] }) {
  // Find or create cart
  let cart = await prisma.cart.findUnique({
    where: { sessionId }
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: {
        sessionId,
        userId,
        isB2B,
        companyName
      }
    });
  } else {
    // Update cart metadata
    cart = await prisma.cart.update({
      where: { id: cart.id },
      data: {
        userId,
        isB2B,
        companyName,
        updatedAt: new Date()
      }
    });
  }

  // Clear existing items
  await prisma.cartItem.deleteMany({
    where: { cartId: cart.id }
  });

  // Add new items
  for (const item of items) {
    await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        subtotal: item.quantity * item.unitPrice,
        customizationDetails: item.customizationDetails || null,
        selectedOptions: item.selectedOptions || []
      }
    });
  }

  return getCartBySessionId(sessionId);
}

// Load cart from server
async function getCartBySessionId(sessionId) {
  const cart = await prisma.cart.findUnique({
    where: { sessionId },
    include: {
      items: {
        include: {
          product: {
            include: {
              options: true
            }
          }
        }
      }
    }
  });

  if (!cart) {
    return null;
  }

  // Calculate totals
  const subtotal = cart.items.reduce((sum, item) => sum + Number(item.subtotal), 0);
  const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  return {
    id: cart.id,
    sessionId: cart.sessionId,
    isB2B: cart.isB2B,
    companyName: cart.companyName,
    items: cart.items.map(item => ({
      id: item.id,
      productId: item.productId,
      quantity: item.quantity,
      unitPrice: Number(item.unitPrice),
      subtotal: Number(item.subtotal),
      customizationDetails: item.customizationDetails,
      selectedOptions: item.selectedOptions,
      product: item.product
    })),
    subtotal,
    itemCount,
    updatedAt: cart.updatedAt
  };
}

// Clear cart (after checkout)
async function clearCart(sessionId) {
  const cart = await prisma.cart.findUnique({
    where: { sessionId }
  });

  if (!cart) {
    return { success: true, message: 'Cart already empty' };
  }

  // Delete items
  await prisma.cartItem.deleteMany({
    where: { cartId: cart.id }
  });

  // Delete cart
  await prisma.cart.delete({
    where: { id: cart.id }
  });

  return { success: true, message: 'Cart cleared successfully' };
}

// Get cart summary (for header)
async function getCartSummary(sessionId) {
  const cart = await getCartBySessionId(sessionId);

  if (!cart) {
    return {
      itemCount: 0,
      subtotal: 0,
      isB2B: false
    };
  }

  return {
    itemCount: cart.itemCount,
    subtotal: cart.subtotal,
    isB2B: cart.isB2B
  };
}

module.exports = {
  syncCart,
  getCartBySessionId,
  clearCart,
  getCartSummary
};