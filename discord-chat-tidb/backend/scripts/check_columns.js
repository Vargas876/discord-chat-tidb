const mysql = require('mysql2/promise');

async function check() {
  const url = "mysql://2LdZoyWhLHQtZn9.root:xyEkAnrwVNNZ1QFI@gateway01.us-east-1.prod.aws.tidbcloud.com:4000/test?ssl={\"rejectUnauthorized\":true}";
  try {
    const connection = await mysql.createConnection(url);
    const [rows] = await connection.execute('DESCRIBE users');
    console.log('Columns in users table:');
    console.log(rows.map(r => r.Field));
    await connection.end();
  } catch (err) {
    console.error(err.message);
  }
}
check();
