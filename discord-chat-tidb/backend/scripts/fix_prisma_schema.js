const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fix() {
  try {
    console.log('Using Prisma to fix schema...');
    // TiDB uses MySQL syntax
    await prisma.$executeRawUnsafe('ALTER TABLE users ADD COLUMN password VARCHAR(255) DEFAULT "$2b$10$EpJSqhWp68.zP.6cEisSre8.B9NnQk/e6.c8Gf6oN1G6X6S6S6S6S"');
    console.log('Column "password" added to "users" table.');
  } catch (error) {
    if (error.message.includes('Duplicate column name')) {
      console.log('Column "password" already exists.');
    } else {
      console.error('Error fixing schema:', error.message);
    }
  } finally {
    await prisma.$disconnect();
  }
}

fix();
