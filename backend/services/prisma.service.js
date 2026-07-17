// backend/services/prisma.service.js
// Prisma client singleton (prevents multiple connections)
const { PrismaClient } = require('@prisma/client');

const prisma = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV === 'development') {
  globalThis.prisma = prisma;
}

module.exports = prisma;
