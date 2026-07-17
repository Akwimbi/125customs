const request = require('supertest');
const { PrismaClient } = require('@prisma/client');
const app = require('./app');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

console.log('Test script started');

const randomSuffix = () => Math.random().toString(36).substring(2, 10);

// Helper to create a customer user
async function createCustomer() {
  console.log('createCustomer called');
  const email = `cust_${randomSuffix()}@example.com`;
  const res = await request(app)
    .post('/api/auth/register')
    .send({
      email,
      password: 'customer123',
      name: 'Customer User'
    });
  console.log('createCustomer got response:', res.statusCode);
  return { id: res.body.user.id, token: res.body.token, email };
}

// Helper to create an admin user
async function createAdmin() {
  console.log('createAdmin called');
  const email = `admin_${randomSuffix()}@example.com`;
  const res = await request(app)
    .post('/api/auth/register')
    .send({
      email,
      password: 'admin123',
      name: 'Admin User',
      role: 'admin'
    });
  console.log('createAdmin got response:', res.statusCode);
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
      stockQuantity: 100,
      isActive: true
    }
  });
  console.log('createProduct got productId:', product.id);
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
  console.log('createOrder got response:', res.statusCode);
  if (!res.statusCode === 201) {
    console.log('Response body:', res.body);
  }
  return res.body.order;
}

async function runTest() {
  try {
    // Clean up
    console.log('Cleaning up...');
    await prisma.orderItem.deleteMany({});
    await prisma.order.deleteMany({});
    await prisma.product.deleteMany({});
    await prisma.user.deleteMany({});
    console.log('Cleanup done');

    // Create customer, admin, product
    console.log('Creating customer...');
    const customer = await createCustomer();
    const customerId = customer.id;
    const customerToken = customer.token;
    console.log(`Customer created: ${customerId}`);

    console.log('Creating admin...');
    const admin = await createAdmin();
    const adminId = admin.id;
    const adminToken = admin.token;
    console.log(`Admin created: ${adminId}`);

    console.log('Creating product...');
    const testProductId = await createProduct();
    console.log(`Product created: ${testProductId}`);

    console.log('Creating order...');
    const order = await createOrder(customerToken, testProductId);
    console.log('Order created:', order);
    console.log('Order ID:', order.id);
    console.log('Order totalAmount:', order.totalAmount);
    console.log('Order status:', order.status);
    console.log('Order items length:', order.items?.length);

    // Clean up
    await prisma.orderItem.deleteMany({});
    await prisma.order.deleteMany({});
    await prisma.product.deleteMany({});
    await prisma.user.deleteMany({});
    console.log('Test completed successfully');
  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

runTest();