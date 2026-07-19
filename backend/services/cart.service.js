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

  // Add new items - price is intentionally NOT taken from the client or stored here.
  // It's always computed fresh from the product table when the cart is read (see
  // getCartBySessionId below), so there's nothing here for a client to tamper with.
  for (const item of items) {
    const product = await prisma.product.findUnique({ where: { id: item.productId } });
    if (!product) {
      throw new Error(`Product not found: ${item.productId}`);
    }
    await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId: item.productId,
        quantity: item.quantity,
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

  // Price is always computed here, from the product's current basePrice - never from
  // anything stored on the cart item itself. This is the only source of truth for cart pricing.
  const itemsWithPricing = cart.items.map(item => {
    const unitPrice = Number(item.product.basePrice);
    const itemSubtotal = unitPrice * item.quantity;
    return {
      id: item.id,
      productId: item.productId,
      quantity: item.quantity,
      unitPrice,
      subtotal: itemSubtotal,
      customizationDetails: item.customizationDetails,
      selectedOptions: item.selectedOptions,
      product: item.product
    };
  });

  const subtotal = itemsWithPricing.reduce((sum, item) => sum + item.subtotal, 0);
  const itemCount = itemsWithPricing.reduce((sum, item) => sum + item.quantity, 0);

  return {
    id: cart.id,
    sessionId: cart.sessionId,
    isB2B: cart.isB2B,
    companyName: cart.companyName,
    items: itemsWithPricing,
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