const prisma = require('./services/prisma.service');

async function main() {
  // Order of deletion respecting foreign keys
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.quoteItem.deleteMany({});
  await prisma.quote.deleteMany({});
  await prisma.cartItem.deleteMany({});
  await prisma.cart.deleteMany({});
  await prisma.productOption.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.user.deleteMany({});
  // Optionally reset sequences? Not needed for PostgreSQL
  console.log('Cleaned up test data');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    // prisma.$disconnect();
  });