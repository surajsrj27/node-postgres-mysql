const Pool = require("pg").Pool;

const pool = new Pool({
    user: "postgres",
    password: "srjsuraj27",
    host: "localhost",
    port: 5432,
    database: "hirewandtest"
});

module.exports = pool;