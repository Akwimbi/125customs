const request = require('supertest');
const app = require('../app');
const prisma = require('../services/prisma.service');

describe('Cart API', () => {
  const testSessionId = `test-session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const testProductId = 1; // We know product with id 1 exists

  beforeEach(async () => {
    // Clean up any cart items and carts for this session
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
  });

  afterAll(async () => {
    // Final cleanup
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
  });

  test('GET /api/cart returns empty cart for new session', async () => {
    const res = await request(app)
      .get('/api/cart')
      .set('X-Session-Id', testSessionId)
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.cart).toBeNull();
  });

  test('POST /api/cart/items adds item to cart', async () => {
    const res = await request(app)
      .post('/api/cart/items')
      .set('X-Session-Id', testSessionId)
      .send({
        productId: testProductId,
        quantity: 2,
        customizationDetails: { engraving: 'Test' },
        selectedOptions: ['Gold']
      })
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.cart).toBeDefined();
    expect(res.body.cart.itemCount).toBe(2);
    expect(res.body.cart.subtotal).toBe(300); // 2 * 150 (basePrice of product 1 is 150)
    expect(res.body.cart.items.length).toBe(1);

    const item = res.body.cart.items[0];
    expect(item.productId).toBe(testProductId);
    expect(item.quantity).toBe(2);
    expect(item.customizationDetails).toEqual({ engraving: 'Test' });
    expect(item.selectedOptions).toEqual(['Gold']);
  });

  test('POST /api/cart/items validates required fields', async () => {
    const res = await request(app)
      .post('/api/cart/items')
      .set('X-Session-Id', testSessionId)
      .send({ quantity: 1 }) // missing productId
      .expect(400);

    expect(res.body.success).toBe(false);
    expect(res.body.error).toContain('Validation failed');
  });

  test('PUT /api/cart/items/:itemId updates quantity', async () => {
    // First add an item
    const addRes = await request(app)
      .post('/api/cart/items')
      .set('X-Session-Id', testSessionId)
      .send({
        productId: testProductId,
        quantity: 1
      })
      .expect(200);

    const itemId = addRes.body.cart.items[0].id;

    // Update quantity
    const res = await request(app)
      .put(`/api/cart/items/${itemId}`)
      .set('X-Session-Id', testSessionId)
      .send({ quantity: 5 })
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.cart.itemCount).toBe(5);
    expect(res.body.cart.subtotal).toBe(750); // 5 * 150
  });

  test('DELETE /api/cart/items/:itemId removes item', async () => {
    // Add an item
    const addRes = await request(app)
      .post('/api/cart/items')
      .set('X-Session-Id', testSessionId)
      .send({
        productId: testProductId,
        quantity: 1
      })
      .expect(200);

    const itemId = addRes.body.cart.items[0].id;

    // Remove it
    const res = await request(app)
      .delete(`/api/cart/items/${itemId}`)
      .set('X-Session-Id', testSessionId)
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.cart.itemCount).toBe(0);
    expect(res.body.cart.subtotal).toBe(0);
  });

  test('POST /api/cart/clear empties the cart', async () => {
    // Add an item
    await request(app)
      .post('/api/cart/items')
      .set('X-Session-Id', testSessionId)
      .send({
        productId: testProductId,
        quantity: 3
      })
      .expect(200);

    // Clear cart
    const res = await request(app)
      .post('/api/cart/clear')
      .set('X-Session-Id', testSessionId)
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('Cart cleared successfully');
  });

  test('POST /api/cart/sync replaces cart items', async () => {
    // Add an item first
    await request(app)
      .post('/api/cart/items')
      .set('X-Session-Id', testSessionId)
      .send({
        productId: testProductId,
        quantity: 1
      })
      .expect(200);

    // Sync with new items
    const res = await request(app)
      .post('/api/cart/sync')
      .set('X-Session-Id', testSessionId)
      .send({
        items: [
          {
            productId: testProductId,
            quantity: 4,
            customizationDetails: null,
            selectedOptions: []
          }
        ]
      })
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.cart.itemCount).toBe(4);
    expect(res.body.cart.subtotal).toBe(600); // 4 * 150
    expect(res.body.cart.items.length).toBe(1);
  });
});