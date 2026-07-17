const request = require('supertest');
const { PrismaClient } = require('@prisma/client');
const app = require('../app');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

console.log('Order test file loaded');

describe('Order Endpoints', () => {
  console.log('Order test describe started');

  let customerToken;
  let customerId;
  let adminToken;
  let adminId;
  let testProductId;

  const randomSuffix = () => Math.random().toString(36).substring(2, 10);

  // Helper to create a customer user
  async function createCustomer() {
    console.log('createCustomer called');
    const email = `cust_${randomSuffix()}@example.com`;
    console.log(`Attempting to register customer with email: ${email}`);
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email,
        password: 'customer123',
        name: 'Customer User'
      });
    console.log(`Customer registration response status: ${res.statusCode}`);
    if (!res.statusCode === 201) {
      console.error('Customer registration failed:', res.body);
    }
    return { id: res.body.user.id, token: res.body.token, email };
  }

  // Helper to create an admin user
  async function createAdmin() {
    console.log('createAdmin called');
    const email = `admin_${randomSuffix()}@example.com`;
    console.log(`Attempting to register admin with email: ${email}`);
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email,
        password: 'admin123',
        name: 'Admin User',
        role: 'admin'
      });
    console.log(`Admin registration response status: ${res.statusCode}`);
    if (!res.statusCode === 201) {
      console.error('Admin registration failed:', res.body);
    }
    // Ensure role is admin (should already be set)
    await prisma.user.update({
      where: { id: res.body.user.id },
      data: { role: 'admin' }
    });
    return { id: res.body.user.id, token: res.body.token, email };
  }

  // Helper to create a product with sufficient stock
  async function createProduct() {
    console.log('createProduct called');
    const product = await prisma.product.create({
      data: {
        name: `Test Product ${randomSuffix()}`,
        description: 'Product for order tests',
        audienceType: 'both',
        category: 'Test',
        basePrice: 1500,
        stockQuantity: 100, // Ensure enough stock for tests
        isActive: true
      }
    });
    console.log(`Product created with id: ${product.id}`);
    return product.id;
  }

  // Helper to create an order for a given customer token and product id
  async function createOrder(customerToken, productId) {
    console.log('createOrder called');
    const res = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        items: [
          {
            productId,
            quantity: 2
          }
        ],
        shippingAddress: {
          line1: '123 Test Street',
          city: 'Nairobi',
          postalCode: '00100',
          country: 'Kenya'
        },
        paymentMethod: 'mpesa'
      });
    console.log(`Order creation response status: ${res.statusCode}`);
    return res.body.order;
  }

  beforeEach(async () => {
    console.log('beforeEach started');
    // Create fresh customer, admin, product for each test case
    console.log('Creating customer...');
    const customer = await createCustomer();
    customerId = customer.id;
    customerToken = customer.token;
    console.log(`Customer created: ${customerId}`);

    console.log('Creating admin...');
    const admin = await createAdmin();
    adminId = admin.id;
    adminToken = admin.token;
    console.log(`Admin created: ${adminId}`);

    console.log('Creating product...');
    testProductId = await createProduct();
    console.log(`Product created: ${testProductId}`);
    console.log('beforeEach completed');
  });

  // No afterEach needed because global truncate will clean up before next test case

  describe('POST /api/orders', () => {
    it('should create a new order', async () => {
      console.log('POST /api/orders test started');
      const order = await createOrder(customerToken, testProductId);
      console.log('Order created:', order.id);
      expect(order).toHaveProperty('id');
      const testOrderId = order.id;
      expect(order.userId).toBe(customerId);
      expect(order.totalAmount).toBe(3000); // 1500 * 2
      expect(order.status).toBe('pending');
      expect(order.items).toHaveLength(1);
      expect(order.items[0]).toHaveProperty('product');
      expect(order.items[0].product.id).toBe(testProductId);
      expect(order.items[0].quantity).toBe(2);
      console.log('POST /api/orders test passed');
    });
  });
});