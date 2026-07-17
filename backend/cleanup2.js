const prisma = require('./services/prisma.service');

async function main() {
  // Truncate all tables with CASCADE to ignore foreign key constraints
  await prisma.$executeRawUnsafe(`TRUNCATE TABLE "User", "Product", "Cart", "CartItem", "Order", "OrderItem", "Quote", "QuoteItem", "PaystackTransaction" RESTART IDENTITY CASCADE;`);
  console.log('All tables truncated');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    // prisma.$disconnect();
  });