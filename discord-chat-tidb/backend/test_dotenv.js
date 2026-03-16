require('dotenv').config();
console.log('JSON_START');
console.log(JSON.stringify(process.env.DATABASE_URL));
console.log('JSON_END');
