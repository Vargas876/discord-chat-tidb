const mysql = require('mysql2/promise');

async function test() {
  console.log('Testing with individual params...');
  try {
    const connection = await mysql.createConnection({
      host: 'gateway01.us-east-1.prod.aws.tidbcloud.com',
      port: 4000,
      user: '2LdZoyWhLHQtZn9.root',
      password: 'xyEkAnrwVNNZ1QFI',
      database: 'test',
      ssl: {
        rejectUnauthorized: false
      }
    });
    console.log('SUCCESS: Connected to TiDB!');
    await connection.end();
  } catch (err) {
    console.error('FAILURE:', err.message);
  }
}

test();
