const mysql = require('mysql2/promise')

mysqlPool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '123',
    database: 'travelwebsite',
})

module.exports = mysqlPool;