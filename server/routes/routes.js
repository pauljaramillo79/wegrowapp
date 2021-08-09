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
              const role = results[0].roleID;
              let accesstoken = jwt.sign(
                {
                  username: username,
                  user: user,
                  usercode: usercode,
                  role: role,
                },
                process.env.ACCESS_TOKEN_SECRET,
                // "123",
                {
                  expiresIn: "10min",
                }
              );
              let refreshtoken = jwt.sign(
                {
                  username: username,
                  user: user,
                  usercode: usercode,
                  role: role,
                },
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
                role: role,
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
        console.log(err);
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
              msg: "Password change was successful. Please log in again with your new password.",
            });
          }
        });
      }
    }
  );
});
router.post("/positionreport", authenticateToken, async (req, res) => {
  await db.query(
    "SELECT KTP, product, Supplier, Price, DATE_FORMAT(Start,'%Y-%m-%d') AS Start, DATE_FORMAT(End,'%Y-%m-%d') AS End, quantity, Sold, Inventory, year, productGroup FROM positionreport",
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
router.post("/positions", authenticateToken, async (req, res) => {
  db.query(
    "SELECT KTP AS WGP,positionID AS id, abbreviation, companyCode, packaging, shipmentStart AS Start, DATE_FORMAT(shipmentEnd,'%Y-%m-%d') AS End, FOBCost AS FOB, quantityHigh AS quantity, year FROM positionsview",
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
  let limit = req.body.limit;
  db.query(
    `SELECT DATE_FORMAT(QSDate,'%m/%d/%Y') AS QSDate,  QSID, saleType, KTP AS WGP, KTS AS WGS, abbreviation, supplier, customer, packingSize, marks, trader, beginning, finish, portOfLoad, portOfDestination, quantity, incoterms, paymentTerm, materialCost, FreightTotal, freightCompany, oFreight, priceBeforeInterest, tradingProfit, tradingMargin, (percentageMargin*100) AS percentageMargin, netback, saleComplete FROM qsviewshort ${
      userID !== "all" ? `WHERE trader='${userID}'` : ""
    }  ORDER BY QSID Desc ${limit !== "no limit" ? `LIMIT ${limit}` : ""} `,
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
router.post("/prodnames", (req, res) => {
  db.query("SELECT prodNameID, abbreviation FROM prodNames", (err, results) => {
    if (err) {
      console.log(err);
    }
    if (results.length > 0) {
      return res.status(200).send(results);
    }
  });
});
router.post("/productlist", (req, res) => {
  db.query(
    // "SELECT productID, abbreviation, supplierlist.supplierID, companyCode AS supplier, prodGroupID FROM productList INNER JOIN prodNames ON productList.productName = prodNames.prodNameID INNER JOIN supplierlist ON productList.supplierID = supplierlist.supplierID ORDER BY productID ASC",
    "SELECT productID, abbreviation, supplierlist.supplierID, companyCode AS supplier, prodNames.prodGroupID, productGroup FROM productList INNER JOIN (prodNames INNER JOIN productGroups ON prodNames.prodGroupID = productGroups.prodGroupID) ON productList.productName = prodNames.prodNameID INNER JOIN supplierlist ON productList.supplierID = supplierlist.supplierID ORDER BY productID ASC;",
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
        msg: "Position number must be unique. This position number already exists",
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
    productgroup,
    quantitylow,
    quantityhigh,
    FOB,
    from,
    to,
    notes,
  } = req.body.posData;
  // from = moment(from).format("D-MMMM");
  from = moment(from).format("YYYY-MM-DD");
  // to = moment(to).format("D-MMMM");
  to = moment(to).format("YYYY-MM-DD");
  positiondate = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
  db.query(
    "INSERT INTO positions (KTP, supplier, productID, quantityLow, quantityHigh, FOBCost, shipmentStart, shipmentEnd, positionDate, prodGroupID, notes) VALUES (?,?,?,?,?,?,?,?,?,?,?);",
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
      productgroup,
      notes,
    ],
    (err, results) => {
      if (err) {
        console.log(err);
      }
      if (results) {
        // console.log("Added position");
        return res.json({
          success: true,
          message: "Succesfully added position",
        });
      }
    }
  );
});
router.post("/positiontoedit", (req, res) => {
  let id = req.body.id;
  db.query(
    `SELECT positionID, KTP AS WGP, positions.productID, abbreviation AS product, productList.supplierID, companyCode AS supplier, prodNames.prodGroupID, productGroup, quantityLow, quantityHigh, FOBCost, shipmentStart, shipmentEnd, positions.notes AS notes FROM positions INNER JOIN ((productList INNER JOIN (prodNames INNER JOIN productGroups ON prodNames.prodGroupID=productGroups.prodGroupID) ON productName = prodNameID) INNER JOIN supplierlist ON productList.supplierID=supplierlist.supplierID)ON positions.productID = productList.productID WHERE KTP = ${id}`,
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
router.post("/positionupdate", (req, res) => {
  let id = req.body.poschanges.id;
  let WGP = req.body.poschanges.WGP || "";
  let product = req.body.poschanges.productID || "";
  let supplier = req.body.poschanges.supplierID || "";
  let productGroupID = req.body.poschanges.productGroupID || "";
  let quantityLow = req.body.poschanges.quantityLow || "";
  let quantityHigh = req.body.poschanges.quantityHigh || "";
  let FOBCost = req.body.poschanges.FOBCost || "";
  let shipmentStart = req.body.poschanges.shipmentStart || "";
  let shipmentEnd = req.body.poschanges.shipmentEnd || "";
  let notes = req.body.poschanges.notes || "";

  let sqlquery = `UPDATE positions SET ${WGP !== "" ? `KTP='${WGP}'` : ""}${
    product !== "" ? `, productID='${product}'` : ""
  }${supplier !== "" ? `, supplier='${supplier}'` : ""}${
    productGroupID !== "" ? `, prodGroupID='${productGroupID}'` : ""
  }${quantityLow !== "" ? `, quantityLow='${quantityLow}'` : ""}${
    quantityHigh !== "" ? `, quantityHigh='${quantityHigh}'` : ""
  }${FOBCost !== "" ? `, FOBCost='${FOBCost}'` : ""}${
    shipmentStart !== "" ? `, shipmentStart='${shipmentStart}'` : ""
  }${shipmentEnd !== "" ? `, shipmentEnd='${shipmentEnd}'` : ""}${
    notes !== "" ? `, notes='${notes}'` : ""
  } WHERE positionID=${id}`;

  db.query(sqlquery, (err, results) => {
    if (err) {
      console.log(err);
    }
    if (results) {
      // console.log(results.affectedRows);
      res.sendStatus(200);
    }
    // if (results.length > 0) {
    //   console.log(results);
    // }
  });
  // console.log(sqlquery);
  // console.log(req.body.poschanges);
  // console.log(id);
  // `SELECT DATE_FORMAT(QSDate,'%m/%d/%Y') AS QSDate,  QSID, saleType, KTP AS WGP, KTS AS WGS, abbreviation, supplier, customer, packingSize, marks, trader, beginning, finish, portOfLoad, portOfDestination, quantity, incoterms, paymentTerm, materialCost, FreightTotal, freightCompany, oFreight, priceBeforeInterest, tradingProfit, tradingMargin, (percentageMargin*100) AS percentageMargin, netback, saleComplete FROM qsviewshort ${
  //   userID !== "all" ? `WHERE trader='${userID}'` : ""
  // }  ORDER BY QSID Desc LIMIT 300 `,
});
router.post("/positiondropdown", (req, res) => {
  db.query(
    "SELECT positionreport.KTP, positionreport.product, positionreport.Supplier, positionreport.Price, DATE_FORMAT(positionreport.Start,'%Y-%m-%d') AS start, DATE_FORMAT(positionreport.End,'%Y-%m-%d') AS end, positionreport.quantity, positionreport.inventory, productID, positions.supplier AS supplierID FROM positionreport INNER JOIN positions ON positions.KTP = positionreport.KTP ",
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
router.post("/saveQS", (req, res) => {
  // console.log(req.body);
  let {
    KTS,
    KTP,
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
    saleComplete,
  } = req.body.QSData;
  db.query(
    "INSERT INTO quotationsheet (KTS, KTP, saleTypeID, QSDate, productID, supplierID, customerID, packingSize, marks, `from`, `to`, POLID, PODID, traderID, trafficID, incoterms, pTermID, quantity, materialCost, pAgentCommission, pFinancialCostP, sFinancialCost, oFreight, insuranceCost, inspectionCost, sAgentCommission, interestCost, interestRate, interestPeriod, legal, pallets, others, totalCost, saleInterestRate, salePaymentPeriod, priceBeforeInterest, saleInterest, priceAfterInterest, tradingProfit, tradingMargin, salesTurnover, percentageMargin, netback, saleComplete) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);",
    [
      KTS,
      KTP,
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
      saleComplete,
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
router.post("/QStoedit", (req, res) => {
  let id = req.body.id;
  db.query(
    "SELECT QSID, saleTypeID, KTP, KTS, DATE_FORMAT(QSDate,'%Y-%m-%d') AS QSDate, abbreviation AS product, supplierlist.companyCode AS supplier, customerList.companyCode AS customer, quotationsheet.packingSize AS packsize, marks, DATE_FORMAT(`from`,'%Y-%m-%d') AS `from`, DATE_FORMAT(`to`,'%Y-%m-%d') AS `to`, portOfLoad AS POL, portOfDestination AS POD, traderList.tCode AS trader, trafficList.tCode AS traffic, incoterms, paymentTerm AS paymentterms, concat(format(interestrate*100,2),'%') AS includedrate, interestperiod AS includedperiod, format(quantity,2) AS quantity, concat('$',format(materialCost,2)) AS materialcost, concat('$',format(pAgentCommission,2)) AS pcommission, concat('$', format(pFinancialCostP,2)) AS pfinancecost, concat('$', format(sFinancialCost,2)) AS sfinancecost, concat('$', format(oFreight,2)) AS freightpmt, concat('$', format(insuranceCost,2)) AS insurancecost, concat('$', format(inspectionCost,2)) AS inspectioncost, concat('$', format(sAgentCommission,2)) AS scommission, concat('$', format(interestCost,2)) AS interestcost, concat('$', format(legal,2)) AS legal, concat('$', format(pallets,2)) AS pallets, concat('$', format(others,2)) AS other, concat('$', format(totalCost,2)) AS totalcost, concat(format(saleInterestRate*100,2),'%') AS interestrate, salePaymentPeriod AS interestdays, concat('$', format(priceBeforeInterest,2)) AS pricebeforeint, concat('$',format(saleInterest,2)) AS salesinterest, concat('$',format(priceAfterInterest,2)) AS priceafterint, concat('$',format(tradingProfit,2)) AS profit, concat('$',format(tradingMargin,2)) AS margin, concat('$',format(salesTurnover,2)) AS turnover, concat(format(percentageMargin*100,2),'%') AS pctmargin, concat('$',format(netback,2)) AS netback, saleComplete FROM quotationsheet INNER JOIN (productList INNER JOIN prodNames ON productList.productName = prodNames.prodNameID) ON quotationsheet.productID = productList.productID INNER JOIN supplierlist ON quotationsheet.supplierID = supplierlist.supplierID INNER JOIN customerList ON customerList.customerID=quotationsheet.customerID INNER JOIN POLList ON quotationsheet.POLID = POLList.POLID INNER JOIN PODList ON quotationsheet.PODID = PODList.PODID INNER JOIN traderList ON quotationsheet.traderID = traderList.traderID INNER JOIN trafficList ON quotationsheet.trafficID = trafficList.trafficID INNER JOIN paymentTerms ON quotationsheet.pTermID = paymentTerms.paytermID WHERE QSID=?",
    [id],
    (err, results) => {
      if (err) {
        console.log(err);
      }
      if (results.length > 0) {
        res.status(200).send(results);
      }
    }
  );
});

router.post("/updateQS", (req, res) => {
  let keys = Object.keys(req.body.QSedits);
  let values = Object.values(req.body.QSedits);

  var index = keys.indexOf("salesinterest");
  if (index !== -1) {
    keys[index] = "saleInterest";
  }
  var index = keys.indexOf("priceafterint");
  if (index !== -1) {
    keys[index] = "priceAfterInterest";
  }
  var index = keys.indexOf("profit");
  if (index !== -1) {
    keys[index] = "tradingProfit";
  }
  var index = keys.indexOf("margin");
  if (index !== -1) {
    keys[index] = "tradingMargin";
  }
  var index = keys.indexOf("includedrate");
  if (index !== -1) {
    keys[index] = "interestRate";
  }
  var index = keys.indexOf("includedperiod");
  if (index !== -1) {
    keys[index] = "interestPeriod";
  }
  var index = keys.indexOf("pcommission");
  if (index !== -1) {
    keys[index] = "pAgentCommission";
  }
  var index = keys.indexOf("pfinancecost");
  if (index !== -1) {
    keys[index] = "pFinancialCostP";
  }
  var index = keys.indexOf("sfinancecost");
  if (index !== -1) {
    keys[index] = "sFinancialCost";
  }
  var index = keys.indexOf("freightpmt");
  if (index !== -1) {
    keys[index] = "oFreight";
  }
  var index = keys.indexOf("insurancecost");
  if (index !== -1) {
    keys[index] = "insuranceCost";
  }
  var index = keys.indexOf("inspectioncost");
  if (index !== -1) {
    keys[index] = "inspectionCost";
  }
  var index = keys.indexOf("scommission");
  if (index !== -1) {
    keys[index] = "sAgentCommission";
  }
  var index = keys.indexOf("other");
  if (index !== -1) {
    keys[index] = "others";
  }
  var index = keys.indexOf("interestrate");
  if (index !== -1) {
    keys[index] = "saleInterestRate";
  }
  var index = keys.indexOf("interestdays");
  if (index !== -1) {
    keys[index] = "salePaymentPeriod";
  }
  var index = keys.indexOf("pricebeforeint");
  if (index !== -1) {
    keys[index] = "priceBeforeInterest";
  }
  var index = keys.indexOf("turnover");
  if (index !== -1) {
    keys[index] = "salesTurnover";
  }
  var index = keys.indexOf("pctmargin");
  if (index !== -1) {
    keys[index] = "percentageMargin";
  }
  var index = keys.indexOf("packsize");
  if (index !== -1) {
    keys[index] = "packingSize";
    values[index] = "'" + values[index] + "'";
  }
  var index = keys.indexOf("marks");
  if (index !== -1) {
    values[index] = "'" + values[index] + "'";
  }
  var index = keys.indexOf("incoterms");
  if (index !== -1) {
    values[index] = "'" + values[index] + "'";
  }
  var index = keys.indexOf("from");
  if (index !== -1) {
    keys[index] = "`from`";
    values[index] = "'" + values[index] + "'";
  }
  var index = keys.indexOf("to");
  if (index !== -1) {
    keys[index] = "`to`";
    values[index] = "'" + values[index] + "'";
  }
  let QSID = req.body.QSID;
  let sql = keys[0] + "=" + values[0];
  for (let i = 1; i < keys.length; i++) {
    sql += ", " + keys[i] + "=" + values[i];
  }
  sql = `UPDATE quotationsheet SET ${sql} WHERE QSID=${QSID}`;
  // console.log(sql);
  // console.log(QSID);
  db.query(sql, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("QS Updated");
      return res.json({
        success: true,
        message: "Succesfully edited QS",
      });
    }
  });
});

// ------- DELETE ---------
router.delete("/deleteQS", (req, res) => {
  let id = req.body.id;
  db.query(`DELETE FROM quotationsheet WHERE QSID=${id}`, (err, results) => {
    if (err) {
      console.log(err);
    }
    if (results) {
      res.sendStatus(200);
    }
  });
});
router.delete("/deletePosition", (req, res) => {
  let WGP = req.body.WGP;
  db.query(`DELETE FROM positions WHERE KTP=${WGP}`, (err, results) => {
    if (err) {
      console.log(err);
    }
    if (results) {
      res.sendStatus(200);
    }
  });
});

router.post("/keyfigures", (req, res) => {
  let currentyear = moment().format("YYYY");
  let lastyear = Number(currentyear) - 1;
  db.query(
    "SELECT DATE_FORMAT(QSDate, '%Y') AS Year, SUM(quantity) AS Sales, SUM(salesTurnover) AS Revenue,  SUM(tradingMargin) AS Margin, SUM(tradingMargin)/SUM(quantity) AS Profit, COUNT(salesTurnover) AS Operations FROM quotationsheet WHERE ? <= DATE_FORMAT(QSDate, '%Y') && saleComplete=-1 GROUP BY DATE_FORMAT(QSDate,'%Y')",
    [lastyear],
    (err, results) => {
      if (err) {
        console.log(err);
      }
      if (results.length > 0) {
        console.log(lastyear);

        return res.status(200).send(results);
      }
    }
  );
});
router.post("/donut", (req, res) => {
  db.query(
    "SELECT trader AS id, trader AS label, TRUNCATE(SUM(tradingMargin),2) AS value FROM qsviewshort WHERE DATE_FORMAT(QSDate,'%Y')=2021 && saleComplete='sold' GROUP BY trader ORDER BY value ASC",
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
    "SELECT trader AS id, trader AS label, TRUNCATE(SUM(quantity),2) AS value FROM qsviewshort WHERE 2021 <= DATE_FORMAT(QSDate,'%Y') && saleComplete='sold' GROUP BY trader ORDER BY value ASC",
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
    "SELECT country, country AS label, TRUNCATE(SUM(tradingMargin),0) AS profit FROM quotationsheet INNER JOIN PODList ON PODList.PODID = quotationsheet.PODID WHERE 2021 <= DATE_FORMAT(QSDate,'%Y') && saleComplete=-1 GROUP BY country ORDER BY profit ASC",
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
    "SELECT country, country AS label, TRUNCATE(SUM(quantity),0) AS quantity FROM quotationsheet INNER JOIN PODList ON PODList.PODID = quotationsheet.PODID WHERE 2021 <= DATE_FORMAT(QSDate,'%Y') && saleComplete=-1 GROUP BY country ORDER BY quantity ASC",
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
    "SELECT DATE_FORMAT(QSDate, '%b') AS category, TRUNCATE(SUM(tradingMargin),0) AS amount FROM quotationsheet WHERE 2021 = DATE_FORMAT(QSDate,'%Y') && saleComplete=-1 GROUP BY category ORDER BY AVG(MONTH(QSDate)) ASC",
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

// ADMIN ROUTES

// TRADER LIST
router.post("/traderslist", (req, res) => {
  db.query(
    "SELECT traderID, tCode, tName, tLastName, userName, active, role FROM traderList INNER JOIN roles ON traderList.roleID=roles.roleID ORDER BY active ASC, tLastName ASC",
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
router.post("/roles", (req, res) => {
  db.query("SELECT roleID, role FROM roles", (err, results) => {
    if (err) {
      console.log(err);
    }
    if (results.length > 0) {
      return res.status(200).send(results);
    }
  });
});
router.post("/updatetrader", (req, res) => {
  let { traderID, tCode, tName, tLastName, userName, active, role } =
    req.body.selectedtrader;

  db.query(
    "UPDATE traderList SET tCode=?, tName=?, tLastName=?, userName=?, active=?, roleID=? WHERE traderID=?",
    [tCode, tName, tLastName, userName, active, role, traderID],
    (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Trader Updated");
        return res.json({
          success: true,
          message: "Succesfully edited Trader",
        });
      }
    }
  );
});

router.post("/addNewTrader", async (req, res) => {
  let { tCode, tName, tLastName, userName, active, role } = req.body.newtrader;
  let hashedPassword = await bcrypt.hash("W3lc0m3@WG!", 8);
  db.query(
    "INSERT INTO traderList (tCode, tName, tLastName, userName, active, roleID, password) VALUES (?,?,?,?,?,?,?)",
    [tCode, tName, tLastName, userName, active, role, hashedPassword],
    (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Added Trader");
        return res.json({
          success: true,
          message: "Succesfully added New Trader",
        });
      }
    }
  );
});

// CUSTOMER LIST

router.post("/customerlist", (req, res) => {
  db.query(
    "SELECT customerID, companyCode, companyName, country, city, streetAddress, website FROM customerList ORDER BY companyCode ASC",
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

router.post("/updatecustomer", (req, res) => {
  let {
    customerID,
    companyCode,
    companyName,
    country,
    city,
    streetAddress,
    website,
  } = req.body.selectedcustomer;
  db.query(
    "UPDATE customerList SET companyCode=?, companyName=?, country=?, city=?, streetAddress=?, website=? WHERE customerID=?",
    [
      companyCode,
      companyName,
      country,
      city,
      streetAddress,
      website,
      customerID,
    ],
    (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Customer Updated");
        return res.json({
          success: true,
          message: "Succesfully edited Customer",
        });
      }
    }
  );
});

router.post("/addNewCustomer", async (req, res) => {
  let { companyCode, companyName, country, city, streetAddress, website } =
    req.body.newcustomer;
  db.query(
    "INSERT INTO customerList (companyCode, companyName, country, city, streetAddress, website) VALUES (?,?,?,?,?,?)",
    [companyCode, companyName, country, city, streetAddress, website],
    (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Added Customer");
        return res.json({
          success: true,
          message: "Succesfully added New Customer",
        });
      }
    }
  );
});

router.post("/deleteCustomer", async (req, res) => {
  customerID = req.body.selectedcustomer.customerID;
  db.query(
    "DELETE FROM customerList WHERE (customerID = ?)",
    [customerID],
    (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Deleted Customer");
        return res.json({
          success: true,
          message: "Succesfully deleted Customer",
        });
      }
    }
  );
});

// PRODNAMES LIST

router.post("/prodnameslist", (req, res) => {
  db.query(
    "SELECT productGroups.prodGroupID, productGroup, abbreviation, prodCatName, prodNames.prodCatNameID FROM prodNames INNER JOIN productGroups ON prodNames.prodGroupID = productGroups.prodGroupID INNER JOIN prodCatNames ON prodNames.prodCatNameID=prodCatNames.prodCatNameID ORDER BY productGroups.prodGroupID ASC, prodCatName ASC",
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

router.post("/selectgroupedprods", (req, res) => {
  let selectedprod = req.body.selectedprod;
  console.log(selectedprod);
  db.query(
    "SELECT abbreviation, prodNameID, prodGroupID FROM prodNames INNER JOIN prodCatNames ON prodNames.prodCatNameID = prodCatNames.prodCatNameID WHERE prodCatNames.prodCatName = ?",
    [selectedprod],
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
router.post("/addNewProdGroup", async (req, res) => {
  let { productGroup } = req.body.newprodgroup;
  db.query(
    "INSERT IGNORE INTO productGroups (productGroup) VALUES (?)",
    [productGroup],
    (err, results) => {
      if (err) {
        console.log(err);
      } else if (results.affectedRows == "0") {
        console.log("Group Already Exists");
        return res.json({
          success: false,
          message: "Product Group Already Exists",
        });
      } else {
        console.log(results.affectedRows);
        console.log("Added Product Group");
        return res.json({
          success: true,
          message: "Succesfully added New Product Group",
        });
      }
    }
  );
});
router.post("/selectprodgroup", (req, res) => {
  let productGroup = req.body.productGroup;
  // console.log(selectedprod);
  db.query(
    "SELECT prodGroupID, productGroup FROM productGroups WHERE productGroup = ?",
    [productGroup],
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
router.post("/updateprodgroup", (req, res) => {
  let { productGroup, prodGroupID } = req.body.selectedprodgroup1;
  db.query(
    "UPDATE productGroups SET productGroup=? WHERE prodGroupID=?",
    [productGroup, prodGroupID],
    (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Product Group Update");
        return res.json({
          success: true,
          message: "Succesfully edited Product Group",
        });
      }
    }
  );
});
router.post("/selectedprodcatname", (req, res) => {
  let prodCatName = req.body.prodcatname;
  db.query(
    "SELECT prodCatNameID, prodCatName FROM prodCatNames WHERE prodCatName=?",
    [prodCatName],
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
router.post("/updateprodcatname", (req, res) => {
  let { prodCatNameID, prodCatName } = req.body.selectedprodcatname;
  db.query(
    "UPDATE prodCatNames SET prodCatName=? WHERE prodCatNameID=?",
    [prodCatName, prodCatNameID],
    (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Product Cat Name Updated");
        return res.json({
          success: true,
          message: "Succesfully edited Product Category Name",
        });
      }
    }
  );
});
router.post("/addNewProdCatName", (req, res) => {
  let { prodCatName } = req.body.newprodcatname;
  db.query(
    "INSERT IGNORE INTO prodCatNames (prodCatName) VALUES (?)",
    [prodCatName],
    (err, results) => {
      if (err) {
        console.log(err);
      } else if (results.affectedRows == "0") {
        console.log("ProdCatName Already Exists");
        return res.json({
          success: false,
          message: "Product Category Already Exists",
        });
      } else {
        console.log("Added Product Category Name");
        return res.json({
          success: true,
          message: "Successfully added New Product Category Name",
        });
      }
    }
  );
});

//ProdNames

router.post("/selectprodname", (req, res) => {
  let prodNameID = req.body.prodnameID;
  console.log(prodNameID);
  db.query(
    "SELECT *, prodCatName, productGroup FROM prodNames INNER JOIN prodCatNames ON prodNames.prodCatNameID = prodCatNames.prodCatNameID INNER JOIN productGroups ON productGroups.prodGroupID = prodNames.prodGroupID WHERE prodNameID=?",
    [prodNameID],
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

router.post("/prodcatnameslist", (req, res) => {
  db.query(
    "SELECT prodCatNameID, prodCatName FROM prodCatNames ORDER BY prodCatNameID ASC",
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
router.post("/prodgroups", (req, res) => {
  db.query(
    "SELECT prodGroupID, productGroup FROM productGroups ORDER BY prodGroupID ASC",
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
router.post("/updateprodname", (req, res) => {
  let { abbreviation, prodName, prodCatNameID, prodGroupID, prodNameID } =
    req.body.selectedprodname;
  db.query(
    "UPDATE prodNames SET abbreviation=?, prodName=?, prodCatNameID=?, prodGroupID=? WHERE prodNameID=?",
    [abbreviation, prodName, prodCatNameID, prodGroupID, prodNameID],
    (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Product Name Info Updated");
        return res.json({
          success: true,
          message: "Succesfully edited Product Name Info",
        });
      }
    }
  );
});

router.post("/posmatching", (req, res) => {
  let posnumber = req.body.posnumber;
  db.query(
    "SELECT tCode, KTS, quantity, companyCode, saleComplete, tradingProfit  FROM quotationsheet INNER JOIN customerList ON quotationsheet.customerID = customerList.customerID INNER JOIN traderList ON quotationsheet.traderID = traderList.traderID WHERE KTP = ? AND saleComplete=-1 ORDER BY tradingProfit DESC",
    [posnumber],
    (err, results) => {
      console.log(results);
      if (err) {
        console.log(err);
      }
      if (results.length > 0) {
        return res.status(200).send(results);
      }
      if (results.length == 0) {
        return res.status(204).send("204 No Content");
      }
    }
  );
});

module.exports = router;
