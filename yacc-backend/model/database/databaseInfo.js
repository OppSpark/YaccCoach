const mysql = require('mysql');
require('dotenv').config();

const conn = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PW,
    database: process.env.DB_NAME
});

conn.connect((err) => {
    if (err) console.log(err);
    else console.log('Connected to the database : ' + conn.config.database);
});

module.exports = conn;