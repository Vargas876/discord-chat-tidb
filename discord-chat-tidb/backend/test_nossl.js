const mysql = require('mysql2/promise');
const url = 'mysql://2LdZoyWhLHQtZn9.root:xyEkAnrwVNNZ1QFI@99.83.147.192:4000/test'; // No SSL param

async function test() {
    console.log('Testing connection WITHOUT SSL...');
    
    try {
        const connection = await mysql.createConnection(url);
        console.log('CONNECTED successfully!');
        await connection.end();
    } catch (err) {
        console.error('CONNECTION FAILED:');
        console.error('Message:', err.message);
    }
}

test();
