// require("dotenv").config({ path: __dirname + "/../config/.env" });
const moment = require("moment");
const express = require("express");
const router = express();
const db = require("../config/pool");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) {
    res.status(401);
    return res.send("Status 401: Unauthorized");
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
};
const authenticateRefreshToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

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
        if (results[0].active === "y") {
          bcrypt.compare(password, results[0].password, (err1, response) => {
            if (err1) {
              console.log(err1);
            }
            if (!response) {
              res.json({
                success: false,
                message: "Wrong user/password combo",
              });
            } else {
              const user = results[0].tName;
              const usercode = results[0].tCode;
              const userID = results[0].traderID;
              const firstlogin = results[0].firstlogin;
              let accesstoken = jwt.sign(
                { username: username, user: user, usercode: usercode },
                process.env.ACCESS_TOKEN_SECRET,
                // "123",
                {
                  expiresIn: "10min",
                }
              );
              let refreshtoken = jwt.sign(
                { username: username, user: user, usercode: usercode },
                process.env.REFRESH_TOKEN_SECRET,
                // "123",
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
                usercode: usercode,
                userID: userID,
                firstlogin: firstlogin,
              });
            }
          });
        } else {
          return res.json({
            success: false,
            message: "This account is not active",
          });
        }
      } else {
        return res.json({
          success: false,
          message: "Username does not exist",
        });
      }
    }
  );
});

router.post("/test", authenticateToken, (req, res) => {
  res.json({
    post: "this is a protected route",
    user: req.user.usercode,
  });
});

router.post("/refreshtoken", authenticateRefreshToken, (req, res) => {
  console.log("refreshing token");
  username = req.user.username;
  user = req.user.user;
  usercode = req.user.usercode;
  console.log(req.user);
  let accesstoken = jwt.sign(
    { username: username, user: user, usercode: usercode },
    process.env.ACCESS_TOKEN_SECRET,
    // "123",
    {
      expiresIn: "10min",
    }
  );
  res.json({
    accesstoken: accesstoken,
  });
});

router.post("/changepassword", authenticateToken, async (req, res) => {
  oldpassword = req.body.oldpassword;
  newpassword = req.body.newpassword;
  username = req.body.username;
  let hashedNewPassword = await bcrypt.hash(newpassword, 8);
  db.query(
    "SELECT * FROM traderList WHERE username = ?",
    [username],
    async (err, results) => {
      if (err) {
        console.log(results);
      }
      if (results.length > 0) {
        bcrypt.compare(oldpassword, results[0].password, (err1, response) => {
          if (err1) {
            console.log(err1);
          }
          if (!response) {
            res.json({
              success: false,
              message: "Old password is incorrect",
            });
          } else {
            db.query(
              `UPDATE traderList SET password='${hashedNewPassword}', firstlogin='n' WHERE userName='${username}'`,

              (err1) => {
                if (err1) {
                  console.log(err1);
                }
              }
            );
            res.json({
              success: true,
              msg:
                "Password change was successful. Please log in again with your new password.",
            });
          }
        });
      }
    }
  );
});
router.post("/positionreport", authenticateToken, async (req, res) => {
  await db.query("SELECT * FROM positionreport", (err, results) => {
    if (err) {
      console.log(err);
    }
    if (results.length > 0) {
      return res.status(200).send(results);
    }
  });
});
router.post("/positions", authenticateToken, async (req, res) => {
  db.query(
    "SELECT KTP AS WGP,positionID AS id, abbreviation, companyCode, packaging, shipmentStart AS Start, shipmentEnd AS End, FOBCost AS FOB, quantityLow AS quantity, year FROM positionsview",
    (err, results) => {
      if (err) {
        console.log(err);
      }
      if (results.length > 0) {
        return res.status(200).send(results);
      }
    }
  );
});
router.post("/sales", authenticateToken, async (req, res) => {
  let userID = req.body.userID;
  db.query(
    `SELECT DATE_FORMAT(QSDate,'%m/%d/%Y') AS QSDate,  QSID, saleType, KTP AS WGP, KTS AS WGS, abbreviation, supplier, customer, packingSize, marks, trader, beginning, finish, portOfLoad, portOfDestination, quantity, incoterms, paymentTerm, materialCost, FreightTotal, freightCompany, oFreight, priceBeforeInterest, tradingProfit, tradingMargin, (percentageMargin*100) AS percentageMargin, netback, saleComplete FROM qsviewshort ${
      userID !== "all" ? `WHERE trader='${userID}'` : ""
    }  ORDER BY QSID Desc LIMIT 300 `,
    //WHERE DATE_FORMAT(QSDate,'%Y')>(YEAR(CURDATE())-2)
    (err, results) => {
      if (err) {
        console.log(err);
      }
      if (results.length > 0) {
        return res.status(200).send(results);
      }
    }
  );
});
router.post("/suppliers", (req, res) => {
  db.query(
    "SELECT supplierID, companyCode FROM supplierlist",
    (err, results) => {
      if (err) {
        console.log(err);
      }
      if (results.length > 0) {
        return res.status(200).send(results);
      }
    }
  );
});
router.post("/customers", (req, res) => {
  db.query(
    "SELECT customerID, companyCode AS customer FROM customerList",
    (err, results) => {
      if (err) {
        console.log(err);
      }
      if (results.length > 0) {
        return res.status(200).send(results);
      }
    }
  );
});
router.post("/POLS", (req, res) => {
  db.query("SELECT POLID, portOfLoad AS POL FROM POLList", (err, results) => {
    if (err) {
      console.log(err);
    }
    if (results.length > 0) {
      return res.status(200).send(results);
    }
  });
});
router.post("/PODS", (req, res) => {
  db.query(
    "SELECT PODID, portOfDestination AS POD FROM PODList",
    (err, results) => {
      if (err) {
        console.log(err);
      }
      if (results.length > 0) {
        return res.status(200).send(results);
      }
    }
  );
});
router.post("/traders", (req, res) => {
  db.query(
    "SELECT traderID, tCode AS trader FROM traderList WHERE active='y'",
    (err, results) => {
      if (err) {
        console.log(err);
      }
      if (results.length > 0) {
        return res.status(200).send(results);
      }
    }
  );
});
router.post("/trafficmgrs", (req, res) => {
  db.query(
    "SELECT trafficID, tCode AS traffic FROM trafficList WHERE active='y'",
    (err, results) => {
      if (err) {
        console.log(err);
      }
      if (results.length > 0) {
        return res.status(200).send(results);
      }
    }
  );
});
router.post("/paymentterms", (req, res) => {
  db.query(
    "SELECT paytermID, paymentTerm FROM paymentTerms",
    (err, results) => {
      if (err) {
        console.log(err);
      }
      if (results.length > 0) {
        return res.status(200).send(results);
      }
    }
  );
});
router.post("/productlist", (req, res) => {
  db.query(
    "SELECT productID, abbreviation, supplierlist.supplierID, companyCode AS supplier FROM productList INNER JOIN prodNames ON productList.productName = prodNames.prodNameID INNER JOIN supplierlist ON productList.supplierID = supplierlist.supplierID ORDER BY productID ASC",
    (err, results) => {
      if (err) {
        console.log(err);
      }
      if (results.length > 0) {
        return res.status(200).send(results);
      }
    }
  );
});
router.post("/checkposition", (req, res) => {
  WGP = req.body.WGP;
  db.query(`SELECT KTP from positions WHERE KTP='${WGP}'`, (err, results) => {
    if (err) {
      console.log(err);
    }
    if (results.length > 0) {
      return res.json({
        msg:
          "Position number must be unique. This position number already exists",
      });
    } else {
      return res.json({
        msg: "OK",
      });
    }
  });
});
router.post("/addposition", (req, res) => {
  let {
    WGP,
    supplier,
    product,
    quantitylow,
    quantityhigh,
    FOB,
    from,
    to,
  } = req.body.postoadd;
  from = moment(from).format("MMMM");
  to = moment(to).format("MMMM");
  positiondate = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
  db.query(
    "INSERT INTO positions (KTP, supplier, productID, quantityLow, quantityHigh, FOBCost, shipmentStart, shipmentEnd, positionDate) VALUES (?,?,?,?,?,?,?,?,?);",
    [
      WGP,
      supplier,
      product,
      quantitylow,
      quantityhigh,
      FOB,
      from,
      to,
      positiondate,
    ],
    (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Added position");
        return res.json({
          success: true,
          message: "Succesfully added position",
        });
      }
    }
  );
});
router.post("/saveQS", (req, res) => {
  console.log(req.body);
  let {
    saleType,
    QSDate,
    abbreviation,
    supplier,
    customer,
    packsize,
    marks,
    from,
    to,
    POL,
    POD,
    TIC,
    traffic,
    incoterms,
    CADintrate,
    CADdays,
    paymentTerm,
    quantity,
    materialcost,
    pcommission,
    pfinancecost,
    sfinancecost,
    freightpmt,
    insurance,
    inspectionpmt,
    scommission,
    interestcost,
    legal,
    pallets,
    other,
    totalcost,
    interestrate,
    interestdays,
    pricebeforeint,
    salesinterest,
    priceafterint,
    profit,
    margin,
    turnover,
    pctmargin,
    netback,
  } = req.body.QSData;
  db.query(
    "INSERT INTO quotationsheet (saleTypeID, QSDate, productID, supplierID, customerID, packingSize, marks, `from`, `to`, POLID, PODID, traderID, trafficID, incoterms, pTermID, quantity, materialCost, pAgentCommission, pFinancialCostP, sFinancialCost, oFreight, insuranceCost, inspectionCost, sAgentCommission, interestCost, interestRate, interestPeriod, legal, pallets, others, totalCost, saleInterestRate, salePaymentPeriod, priceBeforeInterest, saleInterest, priceAfterInterest, tradingProfit, tradingMargin, salesTurnover, percentageMargin, netback) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);",
    [
      saleType,
      QSDate,
      abbreviation,
      supplier,
      customer,
      packsize,
      marks,
      from,
      to,
      POL,
      POD,
      TIC,
      traffic,
      incoterms,
      paymentTerm,
      quantity,
      materialcost,
      pcommission,
      pfinancecost,
      sfinancecost,
      freightpmt,
      insurance,
      inspectionpmt,
      scommission,
      interestcost,
      CADintrate,
      CADdays,
      legal,
      pallets,
      other,
      totalcost,
      interestrate,
      interestdays,
      pricebeforeint,
      salesinterest,
      priceafterint,
      profit,
      margin,
      turnover,
      pctmargin,
      netback,
    ],
    (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Added QS");
        return res.json({
          success: true,
          message: "Succesfully added QS",
        });
      }
    }
  );
});
router.delete("/deleteQS", (req, res) => {
  let id = req.body.id;
  db.query(`DELETE FROM quotationsheet WHERE QSID=${id}`);
});
router.delete("/deletePosition", (req, res) => {
  let WGP = req.body.WGP;
  db.query(`DELETE FROM positions WHERE KTP=${WGP}`);
});

router.post("/keyfigures", (req, res) => {
  let currentyear = moment().format("YYYY");
  let lastyear = Number(currentyear) - 2;
  db.query(
    "SELECT DATE_FORMAT(QSDate, '%Y') AS Year, SUM(quantity) AS Sales, SUM(salesTurnover) AS Revenue,  SUM(tradingMargin) AS Margin, SUM(tradingMargin)/SUM(quantity) AS Profit, COUNT(salesTurnover) AS Operations FROM quotationsheet WHERE ? <= DATE_FORMAT(QSDate, '%Y') && saleComplete=-1 GROUP BY DATE_FORMAT(QSDate,'%Y')",
    [lastyear],
    (err, results) => {
      if (err) {
        console.log(err);
      }
      if (results.length > 0) {
        return res.status(200).send(results);
      }
    }
  );
});
router.post("/donut", (req, res) => {
  db.query(
    "SELECT trader AS id, trader AS label, TRUNCATE(SUM(tradingMargin),2) AS value FROM qsviewshort WHERE DATE_FORMAT(QSDate,'%Y')=2020 && saleComplete='sold' GROUP BY trader ORDER BY value ASC",
    (err, results) => {
      if (err) {
        console.log(err);
      }
      if (results.length > 0) {
        return res.status(200).send(results);
      }
    }
  );
});
router.post("/donutqty", (req, res) => {
  db.query(
    "SELECT trader AS id, trader AS label, TRUNCATE(SUM(quantity),2) AS value FROM qsviewshort WHERE 2020 <= DATE_FORMAT(QSDate,'%Y') && saleComplete='sold' GROUP BY trader ORDER BY value ASC",
    (err, results) => {
      if (err) {
        console.log(err);
      }
      if (results.length > 0) {
        return res.status(200).send(results);
      }
    }
  );
});
router.post("/barsalesperyear", (req, res) => {
  db.query(
    "SELECT DATE_FORMAT(QSDate,'%Y') AS year, TRUNCATE(SUM(quantity),2) AS quantity, TRUNCATE(SUM(tradingMargin),0) AS profit FROM qsviewshort WHERE saleComplete='sold' GROUP BY year ORDER BY year ASC",
    (err, results) => {
      if (err) {
        console.log(err);
      }
      if (results.length > 0) {
        return res.status(200).send(results);
      }
    }
  );
});
router.post("/pieprofitbycountry", (req, res) => {
  db.query(
    "SELECT country, country AS label, TRUNCATE(SUM(tradingMargin),0) AS profit FROM quotationsheet INNER JOIN PODList ON PODList.PODID = quotationsheet.PODID WHERE 2020 <= DATE_FORMAT(QSDate,'%Y') && saleComplete=-1 GROUP BY country ORDER BY profit ASC",
    (err, results) => {
      if (err) {
        console.log(err);
      }
      if (results.length > 0) {
        return res.status(200).send(results);
      }
    }
  );
});
router.post("/pievolumebycountry", (req, res) => {
  db.query(
    "SELECT country, country AS label, TRUNCATE(SUM(quantity),0) AS quantity FROM quotationsheet INNER JOIN PODList ON PODList.PODID = quotationsheet.PODID WHERE 2020 <= DATE_FORMAT(QSDate,'%Y') && saleComplete=-1 GROUP BY country ORDER BY quantity ASC",
    (err, results) => {
      if (err) {
        console.log(err);
      }
      if (results.length > 0) {
        return res.status(200).send(results);
      }
    }
  );
});

router.post("/waterfallprofit", (req, res) => {
  db.query(
    "SELECT DATE_FORMAT(QSDate, '%b') AS category, TRUNCATE(SUM(tradingMargin),0) AS amount FROM quotationsheet WHERE 2020 = DATE_FORMAT(QSDate,'%Y') && saleComplete=-1 GROUP BY category ORDER BY AVG(MONTH(QSDate)) ASC",
    (err, results) => {
      if (err) {
        console.log(err);
      }
      if (results.length > 0) {
        return res.status(200).send(results);
      }
    }
  );
});

module.exports = router;
