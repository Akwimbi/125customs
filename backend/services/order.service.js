// backend/services/order.service.js
// Order management service (B2B + B2C)
const prisma = require('./prisma.service');
const { sendOrderConfirmation } = require('./email.service');

// Helper to format address object to string
function formatAddress(address) {
  if (!address) return '';
  if (typeof address === 'string') return address;
  // Assume address is an object with line1, city, postalCode, country (optional)
  const parts = [
    address.line1,
    address.city,
    address.postalCode,
    address.country
  ].filter(Boolean);
  return parts.join(', ');
}

// Create new order
async function createOrder({ 
  userId, 
  audienceType, 
  customerInfo, 
  shippingAddress, 
  paymentMethod,
  items
}) {
  // Calculate total amount from items
  let totalAmount = 0;
  const enrichedItems = [];
  
  for (const item of items) {
    const product = await prisma.product.findUnique({
      where: { id: item.productId },
      select: { id: true, name: true, basePrice: true, stockQuantity: true }
    });
    
    if (!product) {
      throw new Error(`Product not found: ${item.productId}`);
    }
    
    // Optional: check stock availability
    if (product.stockQuantity < (item.quantity || 1)) {
      throw new Error(`Insufficient stock for product ${product.name}`);
    }
    
    const unitPrice = product.basePrice;
    const quantity = item.quantity || 1;
    const subtotal = unitPrice * quantity;
    totalAmount += subtotal;
    
    // Deduct stock
    await prisma.product.update({
      where: { id: product.id },
      data: { stockQuantity: { decrement: quantity } }
    });
    
    enrichedItems.push({
      productId: product.id,
      productName: product.name,
      quantity,
      unitPrice,
      subtotal,
      customizationDetails: item.customizationDetails || null,
      selectedOptions: item.selectedOptions || []
    });
  }
  
  // Generate order number
  const orderCount = await prisma.order.count();
  const orderNumber = `ORD-${new Date().getFullYear()}-${String(orderCount + 1).padStart(3, '0')}`;
  
  // Format pickup location from shipping address
  const pickupLocation = formatAddress(shippingAddress);
  
  // Create order
  const order = await prisma.order.create({
    data: {
      orderNumber,
      userId,
      audienceType,
      customerName: customerInfo.name,
      customerEmail: customerInfo.email,
      customerPhone: customerInfo.phone || '',
      companyName: customerInfo.companyName || '',
      poNumber: customerInfo.poNumber || '',
      giftMessage: customerInfo.giftMessage || '',
      occasion: customerInfo.occasion || '',
      shippingMethod: 'pickup_mtaani', // Default to Pickup Mtaani
      pickupLocation,
      pickupPhone: customerInfo.phone || '',
      totalAmount,
      status: 'pending'
    }
  });
  
  // Create order items
  for (const item of enrichedItems) {
    await prisma.orderItem.create({
      data: {
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        subtotal: item.subtotal,
        customizationDetails: item.customizationDetails,
        selectedOptions: item.selectedOptions || []
      }
    });
  }
  
  // Send confirmation email
  try {
    await sendOrderConfirmation({
      to: customerInfo.email,
      orderNumber: order.orderNumber,
      customerName: customerInfo.name,
      totalAmount: order.totalAmount,
      items: enrichedItems.map(item => ({
        product: { name: item.productName },
        quantity: item.quantity,
        subtotal: item.subtotal
      }))
    });
  } catch (emailError) {
    console.error('Failed to send order confirmation email:', emailError);
    // Don't fail the order creation if email fails
  }
  
  // Return the complete order with items
  return getOrderById(order.id);
}

// Get order by ID
async function getOrderById(orderId) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: {
        include: {
          product: true
        }
      }
    }
  });
  
  if (!order) {
    throw new Error('Order not found');
  }
  
  return order;
}

// Update order status
async function updateOrderStatus(orderId, status) {
  const order = await prisma.order.update({
    where: { id: orderId },
    data: { status },
    include: {
      items: {
        include: {
          product: true
        }
      }
    }
  });
  
  return order;
}

// Get orders by user
async function getOrdersByUser(userId, { audienceType = null, status = null, limit = 20, offset = 0 } = {}) {
  const where = { userId };
  
  if (audienceType) {
    where.audienceType = audienceType;
  }
  
  if (status) {
    where.status = status;
  }
  
  const orders = await prisma.order.findMany({
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
  
  return orders;
}

// Get all orders (admin only)
async function getAllOrders({ audienceType = null, status = null, limit = 50, offset = 0 } = {}) {
  const where = {};
  
  if (audienceType) {
    where.audienceType = audienceType;
  }
  
  if (status) {
    where.status = status;
  }
  
  const orders = await prisma.order.findMany({
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
          email: true,
          name: true,
          role: true
        }
      }
    },
    take: limit,
    skip: offset,
    orderBy: {
      createdAt: 'desc'
    }
  });
  
  return orders;
}

module.exports = {
  createOrder,
  getOrderById,
  updateOrderStatus,
  getOrdersByUser,
  getAllOrders
};
