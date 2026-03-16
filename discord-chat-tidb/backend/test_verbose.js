const mysql = require('mysql2/promise');
const url = 'mysql://2LdZoyWhLHQtZn9.root:xyEkAnrwVNNZ1QFI@gateway01.us-east-1.prod.aws.tidbcloud.com:4000/test?sslaccept=strict';

async function test() {
    console.log('Testing connection to TiDB Cloud...');
    console.log('URL:', url.replace(/:[^:@/]+@/, ':****@')); // Hide password
    
    try {
        const connection = await mysql.createConnection(url);
        console.log('CONNECTED successfully!');
        const [rows] = await connection.execute('SELECT 1 as result');
        console.log('Query result:', rows);
        await connection.end();
    } catch (err) {
        console.error('CONNECTION FAILED:');
        console.error('Code:', err.code);
        console.error('Errno:', err.errno);
        console.error('SqlState:', err.sqlState);
        console.error('Message:', err.message);
        console.error('Stack:', err.stack);
    }
}

test();
