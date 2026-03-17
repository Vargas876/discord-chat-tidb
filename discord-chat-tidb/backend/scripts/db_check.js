const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  try {
    console.log('--- DB Check Starting ---');
    const userCount = await prisma.user.count();
    console.log('User count:', userCount);
    const users = await prisma.user.findMany({ take: 5 });
    console.log('Users found:', users.length);
    console.log(users);
  } catch (error) {
    console.error('DATABASE_ERROR:', error.message);
    if (error.code) console.error('Error Code:', error.code);
  } finally {
    await prisma.$disconnect();
  }
}

check();
