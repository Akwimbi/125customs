// backend/services/product.service.js
// Product service for 125Customs API - NOW USING PRISMA!

const prisma = require('./prisma.service');

// Get all products (with optional filters)
const getProducts = async (filters = {}) => {
  try {
    const where = {};

    // Filter by audience
    if (filters.audience) {
      where.audienceType = filters.audience;
    }

    // Filter by category
    if (filters.category) {
      where.category = filters.category;
    }

    // Search by name/description
    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } }
      ];
    }

    // Only active products
    where.isActive = true;

    const products = await prisma.product.findMany({
      where,
      include: {
        options: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return {
      success: true,
      count: products.length,
      products
    };
  } catch (error) {
    console.error('Error in getProducts:', error);
    return {
      success: false,
      error: 'Failed to fetch products'
    };
  }
};

// Get single product by ID
const getProductById = async (productId) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: parseInt(productId) },
      include: {
        options: true
      }
    });

    if (!product) {
      return {
        success: false,
        error: 'Product not found'
      };
    }

    return {
      success: true,
      product
    };
  } catch (error) {
    console.error('Error in getProductById:', error);
    return {
      success: false,
      error: 'Failed to fetch product'
    };
  }
};

// Create new product (Admin only)
const createProduct = async (productData) => {
  try {
    const product = await prisma.product.create({
      data: {
        name: productData.name,
        description: productData.description,
        basePrice: parseFloat(productData.basePrice),
        audienceType: productData.audienceType || 'both',
        category: productData.category,
        imageUrl: productData.imageUrl,
        customizable: productData.customizable !== undefined ? productData.customizable : true,
        isActive: true,
        stockQuantity: productData.stockQuantity || 0
      }
    });

    return {
      success: true,
      message: 'Product created successfully',
      product
    };
  } catch (error) {
    console.error('Error in createProduct:', error);
    return {
      success: false,
      error: 'Failed to create product'
    };
  }
};

// Update product (Admin only)
const updateProduct = async (productId, updates) => {
  try {
    const product = await prisma.product.update({
      where: { id: parseInt(productId) },
      data: {
        ...(updates.name && { name: updates.name }),
        ...(updates.description && { description: updates.description }),
        ...(updates.basePrice && { basePrice: parseFloat(updates.basePrice) }),
        ...(updates.audienceType && { audienceType: updates.audienceType }),
        ...(updates.category && { category: updates.category }),
        ...(updates.imageUrl && { imageUrl: updates.imageUrl }),
        ...(updates.customizable !== undefined && { customizable: updates.customizable }),
        ...(updates.isActive !== undefined && { isActive: updates.isActive }),
        ...(updates.stockQuantity !== undefined && { stockQuantity: updates.stockQuantity })
      }
    });

    return {
      success: true,
      message: 'Product updated successfully',
      product
    };
  } catch (error) {
    console.error('Error in updateProduct:', error);
    return {
      success: false,
      error: 'Failed to update product'
    };
  }
};

// Delete product (Admin only)
const deleteProduct = async (productId) => {
  try {
    await prisma.product.delete({
      where: { id: parseInt(productId) }
    });

    return {
      success: true,
      message: 'Product deleted successfully'
    };
  } catch (error) {
    console.error('Error in deleteProduct:', error);
    return {
      success: false,
      error: 'Failed to delete product'
    };
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
