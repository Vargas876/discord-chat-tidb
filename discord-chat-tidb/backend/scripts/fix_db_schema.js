const mysql = require('mysql2/promise');

async function fix() {
  const url = "mysql://2LdZoyWhLHQtZn9.root:xyEkAnrwVNNZ1QFI@gateway01.us-east-1.prod.aws.tidbcloud.com:4000/test?ssl={\"rejectUnauthorized\":true}";
  
  console.log('Fixing database schema...');
  try {
    const connection = await mysql.createConnection(url);
    console.log('Connected!');
    
    // Add password column if missing
    console.log('Adding password column to users table...');
    try {
      await connection.execute('ALTER TABLE users ADD COLUMN password VARCHAR(255) DEFAULT "$2b$10$EpJSqhWp68.zP.6cEisSre8.B9NnQk/e6.c8Gf6oN1G6X6S6S6S6S"');
      console.log('Column added successfully!');
    } catch (err) {
      if (err.message.includes('Duplicate column name')) {
        console.log('Column already exists.');
      } else {
        throw err;
      }
    }
    
    await connection.end();
    console.log('Done!');
  } catch (err) {
    console.error('Fix failed:', err.message);
  }
}

fix();
