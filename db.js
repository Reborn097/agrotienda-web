const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'mysql',         // si estás en Docker
  user: 'root',
  password: 'root',
  database: 'agrotienda'
});

module.exports = pool;
