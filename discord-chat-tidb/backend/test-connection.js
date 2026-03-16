const mysql = require('mysql2/promise');

async function test() {
  try {
    const connection = await mysql.createConnection({
      host: 'gateway01.us-east-1.prod.aws.tidbcloud.com',
      port: 4000,
      user: '2LdZoyWhLHQfZn9.root',
      password: 'pwUvye9Q9S7pZQGQ',
      database: 'test',
      ssl: { rejectUnauthorized: true }
    });
    
    const [rows] = await connection.execute('SELECT 1 as test');
    console.log('✅ Conexión exitosa:', rows);
    await connection.end();
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

test();
