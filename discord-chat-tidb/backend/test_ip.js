const mysql = require('mysql2/promise');
// Using the IP that curl successfully connected to
const url = 'mysql://2LdZoyWhLHQtZn9.root:xyEkAnrwVNNZ1QFI@99.83.147.192:4000/test?sslaccept=strict';

async function test() {
    console.log('Testing connection to TiDB Cloud using IP...');
    
    try {
        const connection = await mysql.createConnection(url);
        console.log('CONNECTED successfully!');
        const [rows] = await connection.execute('SELECT 1 as result');
        console.log('Query result:', rows);
        await connection.end();
    } catch (err) {
        console.error('CONNECTION FAILED:');
        console.error('Message:', err.message);
    }
}

test();
