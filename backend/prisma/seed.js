// prisma/seed.js
// Seed script for 125customs database
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // 1. Create Admin User
  console.log('📝 Creating admin user...');
  const adminPasswordHash = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.create({
    data: {
      email: 'admin@125customs.co.ke',
      passwordHash: adminPasswordHash,
      name: 'Admin User',
      role: 'admin',
      audienceType: 'both'
    }
  });
  console.log(`✅ Admin created: ${admin.email}`);

  // 2. Create Test Customer
  console.log('📝 Creating test customer...');
  const customerPasswordHash = await bcrypt.hash('Test123!', 10);
  const customer = await prisma.user.create({
    data: {
      email: 'customer@test.com',
      passwordHash: customerPasswordHash,
      name: 'Test Customer',
      role: 'customer',
      audienceType: 'b2c'
    }
  });
  console.log(`✅ Customer created: ${customer.email}`);

  // 3. Create Sample Products
  console.log('📝 Creating sample products...');
  
  const products = [
    {
      name: 'Industrial Asset Tag - Stainless Steel',
      description: 'Durable stainless steel asset tags for industrial equipment. Laser engraved for permanence.',
      basePrice: 350,
      audienceType: 'b2b',
      category: 'asset-tags',
      imageUrl: 'https://via.placeholder.com/400x400?text=Asset+Tag',
      customizable: true,
      isActive: true,
      stockQuantity: 100
    },
    {
      name: 'Pet ID Tag - Brass (Custom Engraved)',
      description: 'Beautiful brass pet ID tags with custom engraving. Includes pet name and owner contact.',
      basePrice: 800,
      audienceType: 'b2c',
      category: 'pet-tags',
      imageUrl: 'https://via.placeholder.com/400x400?text=Pet+Tag',
      customizable: true,
      isActive: true,
      stockQuantity: 50
    },
    {
      name: 'Trophy - Custom Engraved (Gold/Silver)',
      description: 'Premium trophies with custom engraving for sports, corporate awards, and achievements.',
      basePrice: 2500,
      audienceType: 'b2c',
      category: 'trophies',
      imageUrl: 'https://via.placeholder.com/400x400?text=Trophy',
      customizable: true,
      isActive: true,
      stockQuantity: 25
    },
    {
      name: 'Industrial Equipment Label - Anodized Aluminum',
      description: 'Anodized aluminum labels for industrial equipment. Weather and chemical resistant.',
      basePrice: 450,
      audienceType: 'b2b',
      category: 'equipment-labels',
      imageUrl: 'https://via.placeholder.com/400x400?text=Equipment+Label',
      customizable: true,
      isActive: true,
      stockQuantity: 200
    },
    {
      name: 'Keychain - Personalized (Stainless Steel)',
      description: 'Custom engraved stainless steel keychains. Perfect for gifts or promotional items.',
      basePrice: 600,
      audienceType: 'b2c',
      category: 'keychains',
      imageUrl: 'https://via.placeholder.com/400x400?text=Keychain',
      customizable: true,
      isActive: true,
      stockQuantity: 75
    },
    {
      name: 'Safety Sign - Custom Text (Reflective)',
      description: 'Custom safety signs with reflective material. OSHA compliant designs available.',
      basePrice: 1200,
      audienceType: 'b2b',
      category: 'signs',
      imageUrl: 'https://via.placeholder.com/400x400?text=Safety+Sign',
      customizable: true,
      isActive: true,
      stockQuantity: 30
    }
  ];

  for (const productData of products) {
    const product = await prisma.product.create({
      data: productData
    });
    console.log(`✅ Product created: ${product.name}`);
  }

  console.log('🎉 Database seed completed successfully!');
}

main()
  .catch(async (e) => {
    console.error('❌ Seed error:', e);
    await prisma.$disconnect();
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });