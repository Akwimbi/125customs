// backend/services/db-test.service.js
// Test PostgreSQL connection
const prisma = require('./prisma.service');

async function testConnection() {
  try {
    await prisma.$connect();
    console.log('✅ Database connected successfully');
    
    // Test query
    const userCount = await prisma.user.count();
    console.log(`📊 Total users: ${userCount}`);
    
    return { status: 'connected', userCount };
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return { status: 'error', error: error.message };
  } finally {
    await prisma.$disconnect();
  }
}

// Run test if called directly
if (require.main === module) {
  testConnection()
    .then(result => {
      console.log('Result:', result);
      process.exit(0);
    })
    .catch(error => {
      console.error('Test failed:', error);
      process.exit(1);
    });
}

module.exports = { testConnection };
