const request = require('supertest');
const app = require('./app');

test('app loads', async () => {
  const res = await request(app).get('/api').expect(200);
  expect(res.body).toBeDefined();
});