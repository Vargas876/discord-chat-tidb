const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "mysql://2LdZoyWhLHQtZn9.root:xyEkAnrwVNNZ1QFI@gateway01.us-east-1.prod.aws.tidbcloud.com:4000/test?sslaccept=strict"
    }
  }
});

async function main() {
  try {
    console.log('Testing connection with LHQtZn9...');
    const result = await prisma.$queryRaw`SELECT 1 as result`;
    console.log('Success:', result);
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
