const mysql = require('mysql2');
require('dotenv').config();
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
}).promise();
db.connect().then(() => console.log('Connected to database')).catch(e => console.log('Connect to database failed', e));
module.exports = db;