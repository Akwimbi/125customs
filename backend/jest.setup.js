// jest.setup.js
// Runs before each test case to ensure a clean database state
const prisma = require('./services/prisma.service');

beforeEach(async () => {
  // Delete in reverse order of foreign key dependencies
  await Promise.all([
    // Child tables first
    prisma.orderItem.deleteMany({}),
    prisma.cartItem.deleteMany({}),
    prisma.quoteItem.deleteMany({}),
    prisma.productOption.deleteMany({}),
    prisma.paystackTransaction.deleteMany({}), // child of Order
    // Then parents
    prisma.order.deleteMany({}),
    prisma.quote.deleteMany({}),
    prisma.cart.deleteMany({}),
    prisma.product.deleteMany({}),
    prisma.user.deleteMany({}),
    // Optional: other tables if any
  ]);
});
