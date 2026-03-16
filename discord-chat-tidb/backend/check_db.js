require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  try {
    const users = await prisma.user.count();
    const convs = await prisma.conversation.count();
    const msgs = await prisma.message.count();
    console.log(`Users: ${users}, Convs: ${convs}, Msgs: ${msgs}`);
  } catch (err) {
    console.error(err.message);
  } finally {
    await prisma.$disconnect();
  }
}

check();
