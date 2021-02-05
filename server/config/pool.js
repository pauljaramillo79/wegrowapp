const mysql = require("mysql");
const { dbconnect } = require("./dbconnect");
const { promisify } = require("util");

const pool = mysql.createPool(dbconnect);

pool.getConnection((err, connection) => {
  if (err) {
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
      console.error("DATABASE CONNECTION WAS CLOSED");
    }
    if (err.code === "ER_CON_COUNT.ERROR") {
      console.error("DATABASE HAS TOO MANY CONNECTIONS");
    }
    if (err.code === "ECONNREFUSED") {
      console.error("DATABASE CONNECTION WAS REFUSED");
    }
  }
  if (connection) connection.release();
  console.log("DB is connected");
  return;
});

// Promisify pool.query to be able to use async await
pool.query = promisify(pool.query);

module.exports = pool;
