//Development Local Connection

// module.exports = {
//   dbconnect: {
//     host: "localhost",
//     user: "admin",
//     password: "MateoPatricio@2015",
//     database: "weGrow",
//   },
// };

//AWS Connection

module.exports = {
  dbconnect: {
    host: process.env.RDS_HOSTNAME,
    user: process.env.RDS_USERNAME,
    password: process.env.RDS_PASSWORD,
    port: process.env.RDS_PORT,
    database: "ebdb",
  },
};
