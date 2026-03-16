const mysql = require('mysql2/promise');

async function test() {
  const url = "mysql://2LdZoyWhLHQtZn9.root:xyEkAnrwVNNZ1QFI@gateway01.us-east-1.prod.aws.tidbcloud.com:4000/test?ssl={\"rejectUnauthorized\":true}";
  
  console.log('Testing direct MySQL connection...');
  try {
    const connection = await mysql.createConnection(url);
    console.log('Successfully connected!');
    const [rows] = await connection.execute('SELECT 1 as result');
    console.log('Query result:', rows);
    await connection.end();
  } catch (err) {
    console.error('Connection failed:', err.message);
  }
}

test();
