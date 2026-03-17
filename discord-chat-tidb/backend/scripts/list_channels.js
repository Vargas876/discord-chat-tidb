const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  try {
    const convs = await prisma.conversation.findMany();
    console.log('Channels in DB:', convs.length);
    convs.forEach(c => console.log(`- ${c.title} (ID: ${c.id})`));
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}
check();
