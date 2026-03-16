const dotenv = require('dotenv');
const result = dotenv.config({ path: './backend/.env' });
console.log('Error:', result.error);
console.log('DATABASE_URL:', JSON.stringify(process.env.DATABASE_URL));
