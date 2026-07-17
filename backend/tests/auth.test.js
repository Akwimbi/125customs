console.log('auth.test.js loaded');
const request = require('supertest');
const { PrismaClient } = require('@prisma/client');
const app = require('../app');

const prisma = new PrismaClient();

describe('Auth Endpoints', () => {
  const randomSuffix = () => Math.random().toString(36).substring(2, 10);

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const email = `testuser_${randomSuffix()}@example.com`;
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email,
          password: 'SecurePass123',
          name: 'Test User'
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.user).toHaveProperty('id');
      expect(res.body.user.email).toBe(email);
      expect(res.body.user.name).toBe('Test User');
      // password should not be returned
      expect(res.body.user).not.toHaveProperty('passwordHash');
    });

    it('should return 400 if email already exists', async () => {
      const email = `duplicate_${randomSuffix()}@example.com`;
      // First registration
      await request(app)
        .post('/api/auth/register')
        .send({
          email,
          password: 'Password1',
          name: 'User One'
        });

      // Second registration with same email
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email,
          password: 'Password2',
          name: 'User Two'
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should return 400 if missing required fields', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          // missing email
          password: 'Password123',
          name: 'Test User'
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/login', () => {
    let testUser;

    beforeEach(async () => {
      // Create a user via register
      const email = `logintest_${randomSuffix()}@example.com`;
      const regRes = await request(app)
        .post('/api/auth/register')
        .send({
          email,
          password: 'password123',
          name: 'Login Test'
        });
      testUser = regRes.body.user;
    });

    afterEach(async () => {
      await prisma.user.delete({ where: { id: testUser.id } });
    });

    it('should login with correct credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: 'password123'
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.user).toHaveProperty('id');
      expect(res.body.user.email).toBe(testUser.email);
      expect(res.body.token).toMatch(/^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/);
    });

    it('should return 401 with invalid password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: 'wrongpassword'
        });

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should return 401 with non-existent email', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123'
        });

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should return 400 if missing fields', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com'
          // missing password
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  // Optional: test protected route middleware
  describe('Protected Route Middleware', () => {
    it('should allow access with valid token', async () => {
      // Create a user and get token
      const email = `authtest_${randomSuffix()}@example.com`;
      const regRes = await request(app)
        .post('/api/auth/register')
        .send({
          email,
          password: 'password123',
          name: 'Auth Test'
        });

      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({
          email,
          password: 'password123'
        });

      const token = loginRes.body.token;

      // Try accessing a protected endpoint (orders)
      const res = await request(app)
        .get('/api/orders')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.orders).toEqual([]);

      // Cleanup
      await prisma.user.deleteMany({ where: { email } });
    });

    it('should deny access with invalid token', async () => {
      const res = await request(app)
        .get('/api/orders')
        .set('Authorization', 'Bearer invalidtoken');

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should deny access without token', async () => {
      const res = await request(app)
        .get('/api/orders');

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });
});