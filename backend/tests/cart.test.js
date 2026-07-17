/**
 * Cart API tests
 * 
 * Run with: npm test
 */

const request = require('supertest');
const app = require('../app');
const prisma = require('../services/prisma.service');

console.log('Cart test file loaded');

describe('Cart API', () => {
  // Test session ID
  const testSessionId = `test-session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  console.log(`Test session ID: ${testSessionId}`);

  // Test product ID (we need to ensure a product exists in the test database)
  let testProductId = 1; // Assuming there's at least one product with ID 1

  console.log('Starting beforeAll');
  beforeAll(async () => {
    console.log('In beforeAll');
    // Optional: Ensure we have a test product
    const product = await prisma.product.findFirst();
    if (product) {
      testProductId = product.id;
      console.log(`Found existing product ID: ${testProductId}`);
    } else {
      // If no product exists, create one for testing
      const newProduct = await prisma.product.create({
        data: {
          name: 'Test Product',
          description: 'Test product for cart tests',
          basePrice: 1000, // 10.00 in cents
          category: 'Test',
          audienceType: 'both',
          isActive: true
        }
      });
      testProductId = newProduct.id;
      console.log(`Created new product ID: ${testProductId}`);
    }
  });

  afterAll(async () => {
    console.log('Starting afterAll');
    // Clean up: delete any test carts and items we created
    await prisma.cartItem.deleteMany({
      where: {
        cart: {
          sessionId: testSessionId
        }
      }
    });
    await prisma.cart.deleteMany({
      where: {
        sessionId: testSessionId
      }
    });
    // Note: We don't delete the test product as it might be used by other tests
    console.log('Finished afterAll');
  });

  beforeEach(async () => {
    console.log('Starting beforeEach');
    // Clear cart before each test
    await prisma.cartItem.deleteMany({
      where: {
        cart: {
          sessionId: testSessionId
        }
      }
    });
    await prisma.cart.deleteMany({
      where: {
        sessionId: testSessionId
      }
    });
    console.log('Finished beforeEach');
  });

  describe('GET /api/cart', () => {
    it('should return an empty cart for a new session', async () => {
      console.log('Running GET /api/cart test');
      const response = await request(app)
        .get('/api/cart')
        .set('X-Session-Id', testSessionId)
        .expect(200);
      console.log('GET /api/cart response received');
      expect(response.body.success).toBe(true);
      expect(response.body.cart).toBeNull();
    });
  });

  describe('POST /api/cart/items', () => {
    it('should add an item to the cart', async () => {
      console.log('Running POST /api/cart/items add item test');
      const response = await request(app)
        .post('/api/cart/items')
        .set('X-Session-Id', testSessionId)
        .send({
          productId: testProductId,
          quantity: 2,
          customizationDetails: { engraving: 'Test Engraving' },
          selectedOptions: ['Gold', 'Silver']
        })
        .expect(200);
      console.log('POST /api/cart/items add item response received');
      expect(response.body.success).toBe(true);
      expect(response.body.cart).toBeDefined();
      expect(response.body.cart.itemCount).toBe(2);
      expect(response.body.cart.subtotal).toBe(2000); // 2 * 1000
      expect(response.body.cart.items.length).toBe(1);

      const item = response.body.cart.items[0];
      expect(item.productId).toBe(testProductId);
      expect(item.quantity).toBe(2);
      expect(item.customizationDetails).toEqual({ engraving: 'Test Engraving' });
      expect(item.selectedOptions).toEqual(['Gold', 'Silver']);
    });

    it('should return 400 when productId is missing', async () => {
      console.log('Running POST /api/cart/items missing productId test');
      const response = await request(app)
        .post('/api/cart/items')
        .set('X-Session-Id', testSessionId)
        .send({
          quantity: 1
        })
        .expect(400);
      console.log('POST /api/cart/items missing productId response received');
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Validation failed');
    });

    it('should return 404 when product does not exist', async () => {
      console.log('Running POST /api/cart/items non-existent product test');
      const response = await request(app)
        .post('/api/cart/items')
        .set('X-Session-Id', testSessionId)
        .send({
          productId: 999999, // Non-existent product ID
          quantity: 1
        })
        .expect(404);
      console.log('POST /api/cart/items non-existent product response received');
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Product not found');
    });
  });

  describe('PUT /cart/items/:itemId', () => {
    let itemId;

    beforeEach(async () => {
      console.log('Starting PUT beforeEach');
      // Add an item to the cart first
      const addResponse = await request(app)
        .post('/api/cart/items')
        .set('X-Session-Id', testSessionId)
        .send({
          productId: testProductId,
          quantity: 1
        });
      console.log('Add response received in PUT beforeEach');
      itemId = addResponse.body.cart.items[0].id;
      console.log(`Item ID for PUT tests: ${itemId}`);
    });

    it('should update the quantity of an item', async () => {
      console.log('Running PUT /api/cart/items/:itemId update quantity test');
      const response = await request(app)
        .put(`/api/cart/items/${itemId}`)
        .set('X-Session-Id', testSessionId)
        .send({ quantity: 5 })
        .expect(200);
      console.log('PUT update quantity response received');
      expect(response.body.success).toBe(true);
      expect(response.body.cart.itemCount).toBe(5);
      expect(response.body.cart.subtotal).toBe(5000);
      const item = response.body.cart.items[0];
      expect(item.quantity).toBe(5);
    });

    it('should return 400 when quantity is invalid', async () => {
      console.log('Running PUT /api/cart/items/:itemId invalid quantity test');
      const response = await request(app)
        .put(`/api/cart/items/${itemId}`)
        .set('X-Session-Id', testSessionId)
        .send({ quantity: 0 })
        .expect(400);
      console.log('PUT invalid quantity response received');
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Validation failed');
    });

    it('should return 404 when item does not exist', async () => {
      console.log('Running PUT /api/cart/items/:itemId non-existent item test');
      const response = await request(app)
        .put('/api/cart/items/999999')
        .set('X-Session-Id', testSessionId)
        .send({ quantity: 1 })
        .expect(404);
      console.log('PUT non-existent item response received');
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Item not found in cart');
    });
  });

  describe('DELETE /api/cart/items/:itemId', () => {
    let itemId;

    beforeEach(async () => {
      console.log('Starting DELETE beforeEach');
      // Add an item to the cart first
      const addResponse = await request(app)
        .post('/api/cart/items')
        .set('X-Session-Id', testSessionId)
        .send({
          productId: testProductId,
          quantity: 1
        });
      console.log('Add response received in DELETE beforeEach');
      itemId = addResponse.body.cart.items[0].id;
      console.log(`Item ID for DELETE tests: ${itemId}`);
    });

    it('should remove an item from the cart', async () => {
      console.log('Running DELETE /api/cart/items/:itemId remove item test');
      const response = await request(app)
        .delete(`/api/cart/items/${itemId}`)
        .set('X-Session-Id', testSessionId)
        .expect(200);
      console.log('DELETE remove item response received');
      expect(response.body.success).toBe(true);
      expect(response.body.cart.itemCount).toBe(0);
      expect(response.body.cart.subtotal).toBe(0);
      expect(response.body.cart.items.length).toBe(0);
    });

    it('should return 404 when item does not exist', async () => {
      console.log('Running DELETE /api/cart/items/:itemId non-existent item test');
      const response = await request(app)
        .delete('/api/cart/items/999999')
        .set('X-Session-Id', testSessionId)
        .expect(404);
      console.log('DELETE non-existent item response received');
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Item not found in cart');
    });
  });

  describe('POST /api/cart/clear', () => {
    it('should clear the cart', async () => {
      console.log('Running POST /api/cart/clear test');
      // First add an item
      await request(app)
        .post('/api/cart/items')
        .set('X-Session-Id', testSessionId)
        .send({
          productId: testProductId,
          quantity: 1
        });
      console.log('Item added for clear test');

      // Then clear the cart
      const response = await request(app)
        .post('/api/cart/clear')
        .set('X-Session-Id', testSessionId)
        .expect(200);
      console.log('POST /api/cart/clear response received');
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Cart cleared successfully');
    });

    it('should return success even if cart is already empty', async () => {
      console.log('Running POST /api/cart/clear empty cart test');
      const response = await request(app)
        .post('/api/cart/clear')
        .set('X-Session-Id', testSessionId)
        .expect(200);
      console.log('POST /api/cart/clear empty cart response received');
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Cart already empty');
    });
  });

  describe('POST /api/cart/sync', () => {
    it('should replace the entire cart with new items', async () => {
      console.log('Running POST /api/cart/sync replace cart test');
      // Add an initial item
      await request(app)
        .post('/api/cart/items')
        .set('X-Session-Id', testSessionId)
        .send({
          productId: testProductId,
          quantity: 1
        });
      console.log('Initial item added for sync test');

      // Sync with new items
      const response = await request(app)
        .post('/api/cart/sync')
        .set('X-Session-Id', testSessionId)
        .send({
          items: [
            {
              productId: testProductId,
              quantity: 3,
              customizationDetails: null,
              selectedOptions: []
            },
            {
              productId: testProductId, // Same product for simplicity
              quantity: 2,
              customizationDetails: { engraving: 'New' },
              selectedOptions: ['Gold']
            }
          ]
        })
        .expect(200);
      console.log('POST /api/cart/sync response received');
      expect(response.body.success).toBe(true);
      expect(response.body.cart.itemCount).toBe(5); // 3 + 2
      expect(response.body.cart.subtotal).toBe(5000);
      expect(response.body.cart.items.length).toBe(2);
    });

    it('should return 400 when items array is missing', async () => {
      console.log('Running POST /api/cart/sync missing items test');
      const response = await request(app)
        .post('/api/cart/sync')
        .set('X-Session-Id', testSessionId)
        .send({})
        .expect(400);
      console.log('POST /api/cart/sync missing items response received');
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Validation failed');
    });
  });

  describe('GET /api/cart/summary', () => {
    it('should return summary for empty cart', async () => {
      console.log('Running GET /api/cart/summary empty cart test');
      const response = await request(app)
        .get('/api/cart/summary')
        .set('X-Session-Id', testSessionId)
        .expect(200);
      console.log('GET /api/cart/summary empty response received');
      expect(response.body.success).toBe(true);
      expect(response.body.itemCount).toBe(0);
      expect(response.body.subtotal).toBe(0);
      expect(response.body.isB2B).toBe(false);
    });

    it('should return correct summary after adding items', async () => {
      console.log('Running GET /api/cart/summary after adding items test');
      // Add two items
      await request(app)
        .post('/api/cart/items')
        .set('X-Session-Id', testSessionId)
        .send({
          productId: testProductId,
          quantity: 2
        });
      await request(app)
        .post('/api/cart/items')
        .set('X-Session-Id', testSessionId)
        .send({
          productId: testProductId,
          quantity: 3
        });
      console.log('Items added for summary test');

      const response = await request(app)
        .get('/api/cart/summary')
        .set('X-Session-Id', testSessionId)
        .expect(200);
      console.log('GET /api/cart/summary after items response received');
      expect(response.body.success).toBe(true);
      expect(response.body.itemCount).toBe(5);
      expect(response.body.subtotal).toBe(5000);
      expect(response.body.isB2B).toBe(false);
    });
  });
});

console.log('Cart test file defined');