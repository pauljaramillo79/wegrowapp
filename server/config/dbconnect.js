// To switch between local and test84, set the DB_TARGET environment variable to "test84" for test84 or leave it unset for local.

const path = require("path");

require("dotenv").config({
  path: path.join(__dirname, ".env"),
});

const awsHost = process.env.EXTERNAL_RDS_HOSTNAME || process.env.RDS_HOSTNAME;

const isAws = Boolean(awsHost);
const isTest84 = !isAws && process.env.DB_TARGET === "test84";
let dbconnect;

if (isAws) {
  dbconnect = {
    host: awsHost,
    user: process.env.EXTERNAL_RDS_USERNAME || process.env.RDS_USERNAME,
    password: process.env.EXTERNAL_RDS_PASSWORD || process.env.RDS_PASSWORD,
    port: Number(process.env.EXTERNAL_RDS_PORT || process.env.RDS_PORT || 3306),
    database: process.env.EXTERNAL_RDS_DB_NAME || process.env.RDS_DB_NAME || "ebdb",
    multipleStatements: true,
  };
} else if (isTest84) {
  dbconnect = {
    host: process.env.TEST84_DB_HOST,
    user: process.env.TEST84_DB_USER,
    password: process.env.TEST84_DB_PASSWORD,
    port: Number(process.env.TEST84_DB_PORT || 3306),
    database: process.env.TEST84_DB_NAME || "ebdb",
    multipleStatements: true,
  };
} else {
  dbconnect = {
    host: process.env.LOCAL_DB_HOST || "localhost",
    user: process.env.LOCAL_DB_USER || "admin",
    password: process.env.LOCAL_DB_PASSWORD,
    port: Number(process.env.LOCAL_DB_PORT || 3306),
    database: process.env.LOCAL_DB_NAME || "ebdb",
    multipleStatements: true,
  };
}

module.exports = {
  dbconnect,
};
