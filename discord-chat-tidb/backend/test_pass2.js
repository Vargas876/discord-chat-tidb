const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "mysql://2LdZoyWhLHQfZn9.root:5cRqslZU2ooLjgxo@gateway01.us-east-1.prod.aws.tidbcloud.com:4000/test?sslaccept=strict"
    }
  }
});

async function test() {
  try {
    console.log('Testing connection with 5cRqslZU2ooLjgxo...');
    await prisma.$connect();
    console.log('SUCCESS!');
  } catch (e) {
    console.log('FAILED:', e.message);
  } finally {
    await prisma.$disconnect();
  }
}

test();
