const mysql = require('mysql2/promise');
const fs = require('fs');

async function check() {
  const url = "mysql://2LdZoyWhLHQtZn9.root:xyEkAnrwVNNZ1QFI@gateway01.us-east-1.prod.aws.tidbcloud.com:4000/test?ssl={\"rejectUnauthorized\":true}";
  let output = 'Columns Check Result:\n';
  try {
    const connection = await mysql.createConnection(url);
    const [rows] = await connection.execute('DESCRIBE users');
    output += JSON.stringify(rows.map(r => r.Field), null, 2);
    await connection.end();
  } catch (err) {
    output += 'ERROR: ' + err.message;
  }
  fs.writeFileSync('columns_result.txt', output);
}
check();
