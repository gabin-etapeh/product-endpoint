const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
PORT=5000,
DB_USER=postgres,
DB_PASSWORD=gabinotss1902,
DB_HOST=localhost,
DB_PORT=5432,
DB_NAME=product_db,
});

module.exports = pool;