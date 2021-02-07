const express = require("express");
const router = express();
const db = require("../config/pool");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.get("/", (req, res) => {
  res.send("flowers smell nice");
});

router.get("/flower", (req, res) => {
  db.query("SELECT * FROM flowers", (err, results) => {
    if (err) {
      console.log(err);
    }
    if (results.length > 0) {
      res.json({
        name: results[0].name,
        colour: results[0].colour,
      });
    }
  });
  //   res.json({
  //     name: "Dandelion",
  //     colour: "Blue-ish",
  //   });
});

router.post("/register", async (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  let code = req.body.code;
  let tname = req.body.tname;
  let tlastname = req.body.tlastname;
  let active = "y";
  let firstlogin = "y";
  let hashedPassword = await bcrypt.hash(password, 8);
  await db.query(
    "INSERT INTO traderList (tCode, tName, tLastName, userName, password, active, firstlogin) VALUES (?,?,?,?,?,?,?);",
    [code, tname, tlastname, username, hashedPassword, active, firstlogin],
    (err) => {
      if (err) {
        console.log(err);
      } else {
        return res.json({
          success: true,
          message: "Succesfully registered",
          username: username,
        });
      }
    }
  );
});

router.post("/login", async (req, res) => {
  username = req.body.username;
  password = req.body.password;
  await db.query(
    "SELECT * FROM traderList WHERE username = ?",
    [username, password],
    (err, results) => {
      if (err) {
        console.log(err);
      }
      if (results.length > 0) {
        bcrypt.compare(password, results[0].password, (err1, response) => {
          if (err1) {
            console.log(err);
          }
          if (!response) {
            res.json({
              success: false,
              message: "Wrong user/password combo",
            });
          } else {
            const user = results[0].tName;
            let accesstoken = jwt.sign(
              { username: username },
              // process.env.ACCESS_TOKEN_SECRET,
              "123",
              {
                expiresIn: "15min",
              }
            );
            let refreshtoken = jwt.sign(
              { username: username },
              // process.env.REFRESH_TOKEN_SECRET,
              "123",
              {
                expiresIn: "24hrs",
              }
            );
            return res.json({
              success: true,
              message: "Succesfully logged in",
              accesstoken: accesstoken,
              refreshtoken: refreshtoken,
              user: user,
            });
          }
        });
      } else {
        return res.json({
          success: false,
          message: "Username does not exist",
        });
      }
    }
  );
});

module.exports = router;
