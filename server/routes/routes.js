require("dotenv").config({ path: __dirname + "/../config/.env" });
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
router.post("/usapositionreport", async (req, res) => {
  await db.query(
    // "SELECT KTP, prodName, productGroup, companyCode, saleComplete, priceAfterInterest FROM quotationsheet INNER JOIN ((prodNames INNER JOIN productGroups ON prodNames.prodGroupID = productGroups.prodGroupID) INNER JOIN productList ON prodNames.prodNameID = productList.productName) ON quotationsheet.productID = productList.productID INNER JOIN supplierlist ON quotationsheet.supplierID = supplierlist.supplierID WHERE saleComplete = 1",
    "SELECT USpositionreport.*, warehouseName, DATE_FORMAT(whentry, '%Y-%m-%d') AS whentry, storagefixed, storagevariable, stggraceperiod, stgaccrualperiod, quantitypallets, uspositionsview.QSID AS QSID, tCode FROM USpositionreport RIGHT JOIN uspositionsview ON USpositionreport.USWGP = uspositionsview.USWGP INNER JOIN traderList ON uspositionsview.traderID = traderList.traderID WHERE USpositionreport.quantity >0",
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
    "SELECT productID, abbreviation, supplierlist.supplierID, companyCode AS supplier, prodNames.prodGroupID, productGroup FROM productList INNER JOIN (prodNames INNER JOIN productGroups ON prodNames.prodGroupID = productGroups.prodGroupID) ON productList.productName = prodNames.prodNameID INNER JOIN supplierlist ON productList.supplierID = supplierlist.supplierID ORDER BY abbreviation ASC;",
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
  console.log(shipmentStart);

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
router.post("/uspositiondropdown", (req, res) => {
  db.query(
    "SELECT USpositionreport.USWGP, USpositionreport.product, USpositionreport.supplier, USpositionreport.EWPrice, USpositionreport.Inventory, productID, supplierID, packaging, marks, warehouseID, warehouseName, DATE_FORMAT(whentry, '%Y-%m-%d') AS whentry, storagefixed, storagevariable, stggraceperiod, stgaccrualperiod, quantitypallets, uspositionsview.quantity FROM USpositionreport RIGHT JOIN uspositionsview ON USpositionreport.USWGP = uspositionsview.USWGP WHERE USpositionreport.Inventory>0",
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
router.post("/loadusposition", (req, res) => {
  WGS = req.body.WGS;
  db.query(
    "SELECT storagefixed, storagevariable, stggraceperiod, stgaccrualperiod, quantitypallets, quantity FROM uspositionsview WHERE USWGP=?;",
    [WGS],
    (err, results) => {
      if (err) {
        console.log(err);
      }
      if (results.length > 0) {
        return res.status(200).send(results);
      }
      if (results.length == 0) {
        return res.json({
          success: true,
          message: "No US Allocation with that USWGS Number",
        });
      }
    }
  );
});
router.post("/duplicateQS", (req, res) => {
  QSID = req.body.QSID;
  QSDate = req.body.QSDate;
  db.query(
    `CREATE TEMPORARY TABLE tmptable SELECT * FROM quotationsheet WHERE (QSID='${QSID}'); ALTER TABLE tmptable CHANGE QSID QSID bigint; UPDATE tmptable SET QSID = NULL, QSDate='${QSDate}'; INSERT INTO quotationsheet SELECT * FROM tmptable; DROP TABLE tmptable;`,
    (err, results) => {
      if (err) {
        console.log(err);
      } else {
        console.log("QS successfully copied");
        return res.status(200).json({
          success: true,
          message: "Succesfully Copied QS",
        });
      }
    }
  );
});
router.post("/QSIDList", (req, res) => {
  user = req.body.user;
  db.query(
    `SELECT QSID FROM quotationsheet ${
      user !== "all"
        ? `INNER JOIN traderList on quotationsheet.traderID = traderList.traderID WHERE traderList.tCode ="${user}"`
        : ""
    } ORDER BY QSID ASC`,
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
    freightTotal,
    shippingline,
    payload,
    totalinspection,
    quantity,
    materialcost,
    pcommission,
    pfinancecost,
    sfinancecost,
    materialvalue,
    generalduty,
    additionalduty,
    totalduty,
    dutyfee,
    harborfeepct,
    harborfee,
    merchprocfeepct,
    merchprocfee,
    cflatfee,
    tsca,
    isf,
    totalcentryfee,
    centryfeepmt,
    drayage,
    unloading,
    collectcharges,
    inboundothers,
    loading,
    bolcharges,
    outboundothers,
    freightpmt,
    insurance,
    insurancerate,
    insurancefactor,
    inspectionpmt,
    scommission,
    interestcost,
    warehouse,
    whentry,
    whexit,
    storagepmt,
    storagefixed,
    storagevariable,
    stggraceperiod,
    stgaccrualperiod,
    quantitypallets,
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
    finalComplete,
  } = req.body.QSData;
  db.query(
    "INSERT INTO quotationsheet (KTS, KTP, saleTypeID, QSDate, productID, supplierID, customerID, packingSize, marks, `from`, `to`, POLID, PODID, traderID, trafficID, incoterms, pTermID, FreightTotal, freightCompany, containerCapacity, inspectionCostPer250, quantity, materialCost, pAgentCommission, pFinancialCostP, sFinancialCost, oFreight, insuranceCost, inspectionCost, sAgentCommission, interestCost, interestRate, interestPeriod, legal, pallets, others, totalCost, saleInterestRate, salePaymentPeriod, priceBeforeInterest, saleInterest, priceAfterInterest, tradingProfit, tradingMargin, salesTurnover, percentageMargin, netback, saleComplete, finalComplete, generalduty, additionalduty, harborpct, merchprocpct, flatfee, tsca, isf, drayage, unloading, collectcharges, inboundothers, warehouseID, whentry, storagefixed, storagevariable, stggraceperiod, stgaccrualperiod, quantitypallets, loading, bolcharges, outboundothers, storagepmt, whexit, insurancerate, insurancefactor) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);",
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
      freightTotal,
      shippingline,
      payload,
      totalinspection,
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
      finalComplete,
      generalduty,
      additionalduty,
      harborfeepct,
      merchprocfeepct,
      cflatfee,
      tsca,
      isf,
      drayage,
      unloading,
      collectcharges,
      inboundothers,
      warehouse === "" ? null : warehouse,
      whentry === "" ? null : whentry,
      storagefixed,
      storagevariable,
      stggraceperiod,
      stgaccrualperiod,
      quantitypallets === "" ? null : quantitypallets,
      loading,
      bolcharges,
      outboundothers,
      storagepmt,
      whexit === "" ? null : whexit,
      insurancerate,
      insurancefactor,
    ],
    (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Added QS");
        return res.json({
          success: true,
          message: "Succesfully saved QS",
        });
      }
    }
  );
});
router.post("/QStoedit", (req, res) => {
  let id = req.body.id;
  db.query(
    "SELECT QSID, saleTypeID, KTP, KTS, DATE_FORMAT(QSDate,'%Y-%m-%d') AS QSDate, abbreviation AS product, supplierlist.companyCode AS supplier, customerList.companyCode AS customer, quotationsheet.packingSize AS packsize, marks, DATE_FORMAT(`from`,'%Y-%m-%d') AS `from`, DATE_FORMAT(`to`,'%Y-%m-%d') AS `to`, portOfLoad AS POL, portOfDestination AS POD, traderList.tCode AS trader, trafficList.tCode AS traffic, incoterms, paymentTerm AS paymentterms, concat(format(interestrate*100,2),'%') AS includedrate, interestperiod AS includedperiod, concat('$', format(FreightTotal,2)) AS freightTotal, containerCapacity AS payload, freightCompany AS shippingline, concat('$', format(inspectionCostPer250,2)) AS totalinspection, format(quantity,2) AS quantity, concat('$',format(materialCost,2)) AS materialcost, concat('$',format(pAgentCommission,2)) AS pcommission, concat('$', format(pFinancialCostP,2)) AS pfinancecost, concat('$', format(sFinancialCost,2)) AS sfinancecost, concat('$', format(oFreight,2)) AS freightpmt, concat('$', format(insuranceCost,2)) AS insurancecost, concat('$', format(inspectionCost,2)) AS inspectioncost, concat('$', format(sAgentCommission,2)) AS scommission, concat('$', format(interestCost,2)) AS interestcost, concat('$', format(legal,2)) AS legal, concat('$', format(pallets,2)) AS pallets, concat('$', format(others,2)) AS other, concat('$', format(totalCost,2)) AS totalcost, concat(format(saleInterestRate*100,2),'%') AS interestrate, salePaymentPeriod AS interestdays, concat('$', format(priceBeforeInterest,2)) AS pricebeforeint, concat('$',format(saleInterest,2)) AS salesinterest, concat('$',format(priceAfterInterest,2)) AS priceafterint, concat('$',format(tradingProfit,2)) AS profit, concat('$',format(tradingMargin,2)) AS margin, concat('$',format(salesTurnover,2)) AS turnover, concat(format(percentageMargin*100,2),'%') AS pctmargin, concat('$',format(netback,2)) AS netback, saleComplete, finalComplete FROM quotationsheet INNER JOIN (productList INNER JOIN prodNames ON productList.productName = prodNames.prodNameID) ON quotationsheet.productID = productList.productID INNER JOIN supplierlist ON quotationsheet.supplierID = supplierlist.supplierID INNER JOIN customerList ON customerList.customerID=quotationsheet.customerID INNER JOIN POLList ON quotationsheet.POLID = POLList.POLID INNER JOIN PODList ON quotationsheet.PODID = PODList.PODID INNER JOIN traderList ON quotationsheet.traderID = traderList.traderID INNER JOIN trafficList ON quotationsheet.trafficID = trafficList.trafficID INNER JOIN paymentTerms ON quotationsheet.pTermID = paymentTerms.paytermID WHERE QSID=?",
    [id],
    (err, results) => {
      if (err) {
        console.log(err);
      }
      if (results.length > 0) {
        res.status(200).send(results);
      }
      if (results.length == 0) {
        res.status(204).send("Not found");
      }
    }
  );
});

router.post("/loadQStoedit", (req, res) => {
  let id = req.body.id;
  db.query(
    "SELECT QSID, quotationsheet.saleTypeID, saleTypes.saleType, KTP, KTS, DATE_FORMAT(QSDate,'%Y-%m-%d') AS QSDate, abbreviation, quotationsheet.productID, supplierlist.companyCode AS supplier, quotationsheet.supplierID, customerList.companyCode AS customer, quotationsheet.customerID, quotationsheet.packingSize AS packsize, marks, DATE_FORMAT(`from`,'%Y-%m-%d') AS `from`, DATE_FORMAT(`to`,'%Y-%m-%d') AS `to`, portOfLoad AS POL, quotationsheet.POLID, portOfDestination AS POD, quotationsheet.PODID, traderList.tCode AS trader, quotationsheet.traderID, trafficList.tCode AS traffic, quotationsheet.trafficID, incoterms, paymentTerm AS paymentTerm, quotationsheet.pTermID, concat(format(interestrate*100,2),'%') AS includedrate, interestperiod AS includedperiod, quotationsheet.shipmentTypeID, shipmentTypes.shipmentType, concat('$ ', format(FreightTotal,2)) AS freightTotal, containerCapacity AS payload, freightCompany AS shippingline, concat('$ ', format(inspectionCostPer250,2)) AS totalinspection, format(quantity,2) AS quantity, concat('$ ',format(materialCost,2)) AS materialcost, concat(format(generalduty*100,2),'%') AS generalduty, concat(format(additionalduty*100,2),'%') AS additionalduty, concat(format(harborpct*100,4),'%') AS harborfeepct, concat(format(insurancerate*100,2),'%') AS insurancerate, insurancefactor, concat('$ ',format(flatfee,2)) AS cflatfee, concat('$ ',format(tsca,2)) AS tsca, concat('$ ',format(isf,2)) AS isf, concat('$ ',format(drayage,2)) AS drayage, concat('$ ',format(unloading,2)) AS unloading, concat('$ ',format(collectcharges,2)) AS collectcharges, concat('$ ',format(inboundothers,2)) AS inboundothers, concat('$ ',format(pAgentCommission,2)) AS pcommission, concat('$ ', format(pFinancialCostP,2)) AS pfinancecost, concat('$ ', format(sFinancialCost,2)) AS sfinancecost, concat('$ ', format(oFreight,2)) AS freightpmt, concat('$ ', format(insuranceCost,2)) AS insurance, concat(format(merchprocpct*100,4),'%') AS merchprocfeepct, concat('$ ', format(inspectionCost,2)) AS inspectionpmt, concat('$ ', format(sAgentCommission,2)) AS scommission, concat('$ ', format(interestCost,2)) AS interestcost, concat('$ ', format(legal,2)) AS legal, concat('$ ', format(pallets,2)) AS pallets, concat('$ ', format(others,2)) AS other, concat('$ ', format(totalCost,2)) AS totalcost, concat(format(saleInterestRate*100,2),'%') AS interestrate, salePaymentPeriod AS interestdays, concat('$ ', format(priceBeforeInterest,2)) AS pricebeforeint, concat('$ ',format(saleInterest,2)) AS salesinterest, concat('$ ',format(priceAfterInterest,2)) AS priceafterint, concat('$ ',format(tradingProfit,2)) AS profit, concat('$ ',format(tradingMargin,2)) AS margin, concat('$ ',format(salesTurnover,2)) AS turnover, concat(format(percentageMargin*100,2),'%') AS pctmargin, concat('$ ',format(netback,2)) AS netback, saleComplete, finalComplete, exchRate, quotationsheet.warehouseID, warehouseName, DATE_FORMAT(whentry,'%Y-%m-%d') AS whentry, concat('$ ', format(storagefixed,2)) AS storagefixed,concat('$ ', format(storagevariable,2)) AS storagevariable, stggraceperiod, stgaccrualperiod, quantitypallets, concat('$ ', format(loading,2)) AS loading, concat('$ ', format(bolcharges,2)) AS bolcharges, concat('$ ', format(outboundothers,2)) AS outboundothers, DATE_FORMAT(whexit,'%Y-%m-%d') AS whexit, concat('$ ', format(storagepmt,2)) AS storagepmt FROM quotationsheet INNER JOIN (productList INNER JOIN prodNames ON productList.productName = prodNames.prodNameID) ON quotationsheet.productID = productList.productID INNER JOIN supplierlist ON quotationsheet.supplierID = supplierlist.supplierID INNER JOIN customerList ON customerList.customerID=quotationsheet.customerID INNER JOIN POLList ON quotationsheet.POLID = POLList.POLID INNER JOIN PODList ON quotationsheet.PODID = PODList.PODID INNER JOIN traderList ON quotationsheet.traderID = traderList.traderID INNER JOIN trafficList ON quotationsheet.trafficID = trafficList.trafficID INNER JOIN paymentTerms ON quotationsheet.pTermID = paymentTerms.paytermID INNER JOIN saleTypes ON quotationsheet.saleTypeID = saleTypes.saleTypeID INNER JOIN shipmentTypes ON quotationsheet.shipmentTypeID = shipmentTypes.shipmentTypeID LEFT JOIN warehouseList ON quotationsheet.warehouseID = warehouseList.warehouseID WHERE QSID=?",
    [id],
    (err, results) => {
      if (err) {
        console.log(err);
      }
      if (results.length > 0) {
        res.status(200).send(results);
      }
      if (results.length == 0) {
        res.status(204).send("Not found");
      }
    }
  );
});

router.post("/updateQS", (req, res) => {
  let keys = Object.keys(req.body.QSedits);
  let values = Object.values(req.body.QSedits);
  let exchrate = req.body.exchrate;

  var index = keys.indexOf("salesinterest");
  if (index !== -1) {
    keys[index] = "saleInterest";
  }
  var index = keys.indexOf("abbreviation");
  if (index !== -1) {
    keys[index] = "productID";
  }
  var index = keys.indexOf("supplier");
  if (index !== -1) {
    keys[index] = "supplierID";
  }
  var index = keys.indexOf("customer");
  if (index !== -1) {
    keys[index] = "customerID";
  }
  var index = keys.indexOf("POL");
  if (index !== -1) {
    keys[index] = "POLID";
  }
  var index = keys.indexOf("POD");
  if (index !== -1) {
    keys[index] = "PODID";
  }
  var index = keys.indexOf("traffic");
  if (index !== -1) {
    keys[index] = "trafficID";
  }
  var index = keys.indexOf("paymentTerm");
  if (index !== -1) {
    keys[index] = "pTermID";
  }
  var index = keys.indexOf("totalinspection");
  if (index !== -1) {
    keys[index] = "inspectionCostPer250";
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
  var index = keys.indexOf("CADintrate");
  if (index !== -1) {
    keys[index] = "interestRate";
  }
  var index = keys.indexOf("CADdays");
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
  var index = keys.indexOf("insurance");
  if (index !== -1) {
    keys[index] = "insuranceCost";
  }
  var index = keys.indexOf("inspectionpmt");
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
  var index = keys.indexOf("harborfeepct");
  if (index !== -1) {
    keys[index] = "harborpct";
  }
  var index = keys.indexOf("merchprocfeepct");
  if (index !== -1) {
    keys[index] = "merchprocpct";
  }
  var index = keys.indexOf("cflatfee");
  if (index !== -1) {
    keys[index] = "flatfee";
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
  var index = keys.indexOf("KTS");
  if (index !== -1) {
    values[index] = "'" + values[index] + "'";
  }
  var index = keys.indexOf("KTP");
  if (index !== -1) {
    values[index] = "'" + values[index] + "'";
  }
  var index = keys.indexOf("saleType");
  if (index !== -1) {
    keys[index] = "saleTypeID";
  }
  var index = keys.indexOf("warehouse");
  if (index !== -1) {
    keys[index] = "warehouseID";
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
  var index = keys.indexOf("whentry");
  if (index !== -1) {
    values[index] = "'" + values[index] + "'";
  }
  var index = keys.indexOf("payload");
  if (index !== -1) {
    keys[index] = "containerCapacity";
    values[index] = "'" + values[index] + "'";
  }
  var index = keys.indexOf("freightTotal");
  if (index !== -1) {
    keys[index] = "FreightTotal";
    values[index] = "'" + values[index] + "'";
  }
  var index = keys.indexOf("whexit");
  if (index !== -1) {
    values[index] = "'" + values[index] + "'";
  }
  var index = keys.indexOf("shippingline");
  if (index !== -1) {
    keys[index] = "freightCompany";
    values[index] = "'" + values[index] + "'";
  }
  let QSID = req.body.QSID;

  // console.log(keys);

  for (var el of [
    "materialvalue",
    "dutyfee",
    "harborfee",
    "merchprocfee",
    "totalcentryfee",
    "centryfeepmt",
    "totalduty",
    "totalinbound",
    "inboundpmt",
    // "storagepmt",
    "totaloutbound",
    "outboundpmt",
  ]) {
    ind = keys.indexOf(el);
    // keys.filter((arrayItem) => !keys.includes(el));
    if (ind !== -1) {
      // console.log(el);
      // console.log(keys.indexOf(el));
      keys.splice(ind, 1);
      // console.log(keys);
      values.splice(ind, 1);
      // console.log(values);
    }
  }
  // console.log(keys);
  let sql = "";

  if (values[0] === "") {
    sql += keys[0] + "=NULL";
  } else {
    sql += keys[0] + "=" + values[0];
  }

  for (let i = 1; i < keys.length; i++) {
    // if (
    //   ![
    //     "materialvalue",
    //     "dutyfee",
    //     "harborfee",
    //     "merchprocfee",
    //     "totalcentryfee",
    //     "centryfeepmt",
    //     "totalduty",
    //     "totalinbound",
    //     "inboundpmt",
    //   ].includes(keys[i])
    // ) {
    if (values[i] === "") {
      sql += ", " + keys[i] + "=NULL";
    } else {
      sql += ", " + keys[i] + "=" + values[i];
    }
    // }
  }
  sql += ", exchRate=" + exchrate;

  // console.log(sql);
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

router.post("/sunburstdata", (req, res) => {
  db.query(
    "SELECT SUM(quantity) AS quantity, SUM(tradingMargin) AS profit, productGroup, prodCatName, abbreviation FROM quotationsheet INNER JOIN (productList INNER JOIN (prodNames INNER JOIN prodCatNames ON prodNames.prodCatNameID=prodCatNames.prodCatNameID INNER JOIN productGroups ON prodNames.prodGroupID=productGroups.prodGroupID) ON productList.productName = prodNames.prodNameID ) ON quotationsheet.productID = productList.productID WHERE DATE_FORMAT(QSDate, '%Y')=2021 && saleComplete=-1 GROUP BY abbreviation, prodCatName, productGroup",
    (err, results) => {
      if (err) {
        console.log(err);
      }
      if (results.length > 0) {
        console.log(results);
        return res.status(200).send(results);
      }
    }
  );
});
router.post("/keyfigures", (req, res) => {
  let currentyear = moment().format("YYYY");
  let lastyear = Number(currentyear) - 1;
  let startdate = req.body.startdate;
  let enddate = req.body.enddate;
  console.log(startdate, enddate);
  db.query(
    "SELECT DATE_FORMAT(QSDate, '%Y') AS Year, SUM(quantity) AS Sales, SUM(salesTurnover) AS Revenue,  SUM(tradingMargin) AS Margin, SUM(tradingMargin)/SUM(quantity) AS Profit, COUNT(salesTurnover) AS Operations FROM quotationsheet WHERE DATE_FORMAT(date(QSDate), '%Y-%m-%d') BETWEEN date(?) AND date(?) && saleComplete=-1 GROUP BY DATE_FORMAT(QSDate,'%Y')",
    [startdate, enddate],
    (err, results) => {
      if (err) {
        console.log(err);
      }
      if (results.length > 0) {
        // console.log(lastyear);
        console.log(results);

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

router.post("/waterfallprofit", authenticateToken, (req, res) => {
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

// PRODUCER LIST

router.post("/producerlist", (req, res) => {
  db.query(
    "SELECT supplierID, companyCode, companyName, country, city, streetAddress, website FROM supplierlist ORDER BY companyCode ASC",
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

router.post("/updateproducer", (req, res) => {
  let {
    supplierID,
    companyCode,
    companyName,
    country,
    city,
    streetAddress,
    website,
  } = req.body.selectedproducer;
  db.query(
    "UPDATE supplierlist SET companyCode=?, companyName=?, country=?, city=?, streetAddress=?, website=? WHERE supplierID=?",
    [
      companyCode,
      companyName,
      country,
      city,
      streetAddress,
      website,
      supplierID,
    ],
    (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Supplier Updated");
        return res.json({
          success: true,
          message: "Succesfully edited Supplier",
        });
      }
    }
  );
});

router.post("/addNewProducer", async (req, res) => {
  let { companyCode, companyName, country, city, streetAddress, website } =
    req.body.newproducer;
  db.query(
    "INSERT INTO supplierlist (companyCode, companyName, country, city, streetAddress, website) VALUES (?,?,?,?,?,?)",
    [companyCode, companyName, country, city, streetAddress, website],
    (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Added Producer");
        return res.json({
          success: true,
          message: "Succesfully added New Producer",
        });
      }
    }
  );
});

router.post("/deleteProducer", async (req, res) => {
  supplierID = req.body.selectedproducer.supplierID;
  db.query(
    "DELETE FROM supplierlist WHERE (supplierID = ?)",
    [supplierID],
    (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Deleted Producer");
        return res.json({
          success: true,
          message: "Succesfully deleted Producer",
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

// SELECT PRODUCTS //

router.post("/selectproducts", (req, res) => {
  let prodnameID = req.body.prodnameID;
  db.query(
    "SELECT productID, productName, abbreviation, supplierlist.supplierID, companyCode from productList INNER JOIN prodNames ON productList.productName = prodNames.prodNameID INNER JOIN supplierlist ON productList.supplierID = supplierlist.supplierID WHERE productName=?",
    [prodnameID],
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

router.post("/posmatching", (req, res) => {
  let posnumber = req.body.posnumber;
  db.query(
    "SELECT tCode, KTS, quantity, companyCode, saleComplete, saleTypeID, FORMAT(tradingProfit,2) AS tradingProfit FROM quotationsheet INNER JOIN customerList ON quotationsheet.customerID = customerList.customerID INNER JOIN traderList ON quotationsheet.traderID = traderList.traderID WHERE KTP = ? AND (saleComplete=-1 OR saleComplete=1) AND (saleTypeID=1 OR saleTypeID=2) ORDER BY tradingProfit DESC",
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

router.post("/usposmatching", (req, res) => {
  let usposnumber = req.body.usposnumber;
  db.query(
    "SELECT tCode, KTS, quantity, companyCode, saleComplete, saleTypeID, FORMAT(tradingProfit,2) AS tradingProfit, FORMAT(priceAfterInterest,2) AS priceAfterInterest, DATE_FORMAT(whexit,'%Y-%m-%d') AS whexit FROM quotationsheet INNER JOIN customerList ON quotationsheet.customerID = customerList.customerID INNER JOIN traderList ON quotationsheet.traderID = traderList.traderID WHERE KTP = ? AND saleComplete=-1 AND saleTypeID=3 ORDER BY tradingProfit DESC",
    [usposnumber],
    (err, results) => {
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

router.post("/lysales", (req, res) => {
  let fromdate = req.body.fromdate;
  let todate = req.body.todate;
  let userID = req.body.userID;
  // console.log(fromdate),
  db.query(
    `SELECT QSID, DATE_FORMAT(QSDate, '%Y-%m-%d') AS QSDate, DATE_FORMAT(QSDate, '%M') AS month, quantity, abbreviation, customerList.companyCode AS customer, priceBeforeInterest, tradingProfit, saleComplete, tCode FROM quotationsheet INNER JOIN customerList ON quotationsheet.customerID=customerList.customerID INNER JOIN productList ON quotationsheet.productID = productList.productID INNER JOIN prodNames ON productList.productName =  prodNames.prodNameID INNER JOIN productGroups ON prodNames.prodGroupID = productGroups.prodGroupID INNER JOIN traderList ON quotationsheet.traderID = traderList.traderID WHERE DATE_FORMAT(QSDate, '%Y-%m')>? AND DATE_FORMAT(QSDate, '%Y-%m')<=? ${
      userID !== "all" ? `AND tCode=?` : ""
    } ORDER BY SaleComplete ASC, QSDate ASC, customer ASC`,
    [fromdate, todate, userID],
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
router.post("/profitabilityreport", (req, res) => {
  let reportstartdate = req.body.reportstartdate;
  let reportenddate = req.body.reportenddate;
  console.log(reportstartdate);
  db.query(
    "SELECT QSID, KTS, KTP, tCode, DATE_FORMAT(`from`, '%M-%Y') AS month, DATE_FORMAT(QSDate, '%d/%m/%Y') AS date, DATE_FORMAT(`from`, '%d %b') AS startship, DATE_FORMAT(`to`, '%d %b') AS endship, quantity, customerList.companyCode AS customer, abbreviation AS product, prodCatName, productGroup,tradingProfit AS profitpmt, tradingMargin AS profit, priceBeforeInterest AS price, QSID, PODList.country FROM quotationsheet INNER JOIN customerList ON quotationsheet.customerID = customerList.customerID INNER JOIN productList ON quotationsheet.productID = productList.productID INNER JOIN (prodNames INNER JOIN prodCatNames ON prodNames.prodCatNameID = prodCatNames.prodCatNameID) ON productList.productName =  prodNames.prodNameID  INNER JOIN productGroups ON prodNames.prodGroupID = productGroups.prodGroupID INNER JOIN traderList on quotationsheet.traderID = traderList.traderID INNER JOIN PODList ON quotationsheet.PODID = PODList.PODID WHERE DATE(`from`) BETWEEN ? AND ? AND saleComplete=-1 ORDER BY `from` DESC",
    [reportstartdate, reportenddate],
    (err, results) => {
      if (err) {
        console.log(err);
      }
      if (results.length > 0) {
        return res.status(200).send(results);
      } else {
        return res.status(200).send([]);
      }
    }
  );
});
router.post("/warehouses", (req, res) => {
  db.query("SELECT * FROM warehouseList", (err, results) => {
    if (err) {
      console.log(err);
    }
    if (results.length > 0) {
      return res.status(200).send(results);
    }
  });
});
router.post("/addusmktprice", (req, res) => {
  let QSID = req.body.usqsid;
  let mktpriceupdate = req.body.mktprice;
  db.query(
    "INSERT INTO mktpriceupdates (QSID, mktpriceupdate, salecomplete) VALUES (?,?,1)",
    [QSID, mktpriceupdate],
    (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Added Mkt Price");
        return res.json({
          success: true,
          message: "Succesfully added New Mkt Price",
        });
      }
    }
  );
});
router.post("/usmktpriceupdates", (req, res) => {
  db.query(
    "SELECT mktpriceupdates.mktpriceupdate, mktpriceupdates.QSID from mktpriceupdates,(SELECT QSID, max(createdat) as createdat from mktpriceupdates GROUP BY QSID) lastprices WHERE mktpriceupdates.salecomplete =1 AND mktpriceupdates.QSID=lastprices.QSID AND mktpriceupdates.createdat=lastprices.createdat;",
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

router.post("/matchingposreport", (req, res) => {
  db.query(
    "SELECT uspositionsview.USWGP, uspositionsview.USpositionID, uspositionsview.abbreviation, companyCode, quantity, IFNULL(TotalSold,0) AS totalSold, (quantity-IFNULL(TotalSold,0)) AS inventory FROM uspositionsview LEFT JOIN usinventoryupdates ON uspositionsview.USWGP = usinventoryupdates.USWGP ORDER BY USWGP",
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
router.post("/poslist", (req, res) => {
  db.query("SELECT USWGP FROM uspositionsview", (err, results) => {
    if (err) {
      console.log(err);
    }
    if (results.length > 0) {
      return res.status(200).send(results);
    }
  });
});
router.post("/matchingpossales", (req, res) => {
  let matchposlist = req.body.posl1;
  // console.log(matchposlist);
  db.query(
    `SELECT tCode, KTS, KTP, FORMAT(quantity,2) AS quantity, companyCode, saleComplete, saleTypeID, FORMAT(tradingProfit,2) AS tradingProfit, FORMAT(priceAfterInterest,2) AS priceAfterInterest, DATE_FORMAT(whexit,'%Y-%m-%d') AS whexit FROM quotationsheet INNER JOIN customerList ON quotationsheet.customerID = customerList.customerID INNER JOIN traderList ON quotationsheet.traderID = traderList.traderID WHERE KTP IN (${matchposlist}) AND saleComplete=-1 AND saleTypeID=3 ORDER BY tradingProfit DESC`,
    // [matchposlist],
    (err, results) => {
      console.log(results);
      if (err) {
        console.log(err);
      }
      if (results.length > 0) {
        return res.status(200).send(results);
      }
    }
  );
});
router.post("/salesinprogress", (req, res) => {
  db.query(
    "SELECT QSID, traderList.tCode AS trader,trafficList.tCode AS traffic, quotationsheet.trafficID, KTS, KTP, abbreviation, FORMAT(quantity,2) AS quantity, companyCode, hasInspection, hasPromisory, hasWH, pincoterms, incoterms, finalComplete  FROM quotationsheet INNER JOIN customerList ON quotationsheet.customerID = customerList.customerID INNER JOIN traderList ON quotationsheet.traderID = traderList.traderID INNER JOIN trafficList ON quotationsheet.trafficID=trafficList.trafficID INNER JOIN productList ON quotationsheet.productID = productList.productID INNER JOIN prodNames ON productList.productName =  prodNames.prodNameID WHERE saleComplete IN (1, -1) AND finalComplete=0 AND trafficList.tCode='na'",
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
router.post("/salesinprogressassigned", (req, res) => {
  db.query(
    "SELECT QSID, traderList.tCode AS trader,trafficList.tCode AS traffic, quotationsheet.trafficID, KTS, KTP, abbreviation, FORMAT(quantity,2) AS quantity, companyCode, hasInspection, hasPromisory, hasWH, pincoterms, incoterms FROM quotationsheet INNER JOIN customerList ON quotationsheet.customerID = customerList.customerID INNER JOIN traderList ON quotationsheet.traderID = traderList.traderID INNER JOIN trafficList ON quotationsheet.trafficID=trafficList.trafficID INNER JOIN productList ON quotationsheet.productID = productList.productID INNER JOIN prodNames ON productList.productName =  prodNames.prodNameID WHERE saleComplete IN (1, -1) AND finalComplete=0 AND trafficList.tCode<>'na' ORDER BY trafficList.tCode",
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
router.post("/saveassignment", (req, res) => {
  let QSID = req.body.qsid;
  // let KTS = req.body.datapacket.KTS;
  // let KTP = req.body.datapacket.KTP;
  // let pincoterms = req.body.datapacket.pincoterms;
  // let incoterms = req.body.datapacket.incoterms;
  // let hasInspection = req.body.datapacket.hasInspection;
  // let hasPromisory = req.body.datapacket.hasPromisory;
  // let hasWH = req.body.datapacket.hasWH;

  let data = req.body.datapacket;
  if ("hasInspectionBool" in data) {
    delete data.hasInspectionBool;
  }
  if ("hasPromisoryBool" in data) {
    delete data.hasPromisoryBool;
  }
  if ("hasWHBool" in data) {
    delete data.hasWHBool;
  }
  if ("finalCompleteBool" in data) {
    delete data.finalCompleteBool;
  }
  let sql = "";
  // console.log(Object.keys(req.body.datapacket));
  // console.log(Object.values(req.body.datapacket));
  for (const property in data) {
    // console.log(`${property}: ${data[property]}`);
    if (sql !== "") {
      sql += ", " + property + "='" + data[property] + "'";
    } else {
      sql += property + "='" + data[property] + "'";
    }
  }
  // console.log(sql);
  db.query(`UPDATE quotationsheet SET ${sql} WHERE QSID='${QSID}'`, (err) => {
    if (err) {
      console.log(err);
    } else {
      res.json({
        success: true,
        msg: "Saved",
      });
    }
  });
  // let qsid = req.body.qsid;
  // let tmc = req.body.tmc;
  // console.log(qsid);
  // console.log(tmc);
  // db.query(
  //   `UPDATE quotationsheet SET trafficID='${tmc}' WHERE QSID=${qsid}`,
  //   (err1) => {
  //     if (err1) {
  //       console.log(err1);
  //     } else {
  //       res.json({
  //         success: true,
  //         msg: "Password change was successful. Please log in again with your new password.",
  //       });
  //     }
  //   }
  // );
});

router.post("/tmcscores", (req, res) => {
  db.query(
    "SELECT tCode, SUM((CASE WHEN (hasInspection='yes') THEN 1 ELSE 0 END) + (CASE WHEN (hasPromisory='yes') THEN 1 ELSE 0 END) + (CASE WHEN (pincoterms='FOB') THEN 2 WHEN (pincoterms='CIP') THEN 2 WHEN (pincoterms='CIF') THEN 2 WHEN (pincoterms='CFR') THEN 1 WHEN (pincoterms='CPT') THEN 1 ELSE 0 END) +  (CASE WHEN (incoterms='DAP') THEN 1 ELSE 0 END) +  (CASE WHEN (hasWH='yes') THEN 1 ELSE 0 END)) AS totalscore FROM quotationsheet INNER JOIN trafficList ON quotationsheet.trafficID=trafficList.trafficID WHERE finalComplete=0 AND saleComplete IN (1,-1) AND tCode<>'na' GROUP BY tCode ORDER BY totalscore DESC;",
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

router.post("/budgetprodNames", (req, res) => {
  db.query(
    "SELECT abbreviation, prodNameID, prodCatNameID FROM prodNames ORDER BY abbreviation ASC;",
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

function pad(num, size) {
  num = num.toString();
  while (num.length < size) num = "0" + num;
  return num;
}

router.post("/addprodbudget", async (req, res) => {
  let prodstoadd = req.body.prodstoadd;
  let prodscattoadd = req.body.prodscattoadd;
  let year = req.body.year;
  let yearshort = year - 2000;
  let lastyear = year - 1 + "-12-31";
  let twolastyear = year - 2 + "-01-01";
  console.log(lastyear, twolastyear);

  prodstoadd.forEach((prod, j) => {
    db.query(
      "SELECT DISTINCT countryID, prodNames.prodCatNameID FROM quotationsheet INNER JOIN PODList ON quotationsheet.PODID = PODList.PODID INNER JOIN (productList INNER JOIN (prodNames INNER JOIN prodCatNames ON prodNames.prodCatNameID=prodCatNames.prodCatNameID)ON productList.productName = prodNames.prodNameID) ON quotationsheet.productID = productList.productID WHERE DATE(`from`) BETWEEN ? AND ? AND saleComplete=-1 AND prodNameID=?",
      [twolastyear, lastyear, prod],
      (err, results) => {
        if (err) {
          console.log(err);
        }
        if (results.length > 0) {
          results.forEach((el) => {
            // console.log(el["countryID"]);
            let prodcatname = el["prodCatNameID"];
            let country = el["countryID"];
            let quarter = [1, 4, 7, 10];
            quarter.forEach((q) => {
              let padprod = pad(prod, 3);
              let padcountry = pad(country, 3);
              let entryid = Number(
                yearshort + q.toString() + padprod + padcountry
              );
              db.query(
                `INSERT IGNORE INTO budgets (budgetentryID, date, prodNameID, quantity, customerID, countryID, prodCatNameID, price, profit) VALUES (${entryid},'${year}-${q}-01', ?, 0, 9999, ?, ${prodcatname}, 0,0)`,
                [prod, country],
                (err1, res1) => {
                  if (err1) {
                    console.log(err1);
                  }
                }
              );
            });
          });
          // db.query(
          //   "INSERT INTO budgets (date, ?, 0, )"
          // )
        } else if (results.length === 0) {
          let prodcatname = prodscattoadd[j];
          let country = "32";
          let quarter = [1, 4, 7, 10];
          quarter.forEach((q) => {
            let padprod = pad(prod, 3);
            let padcountry = pad(country, 3);
            let entryid = Number(
              yearshort + q.toString() + padprod + padcountry
            );
            db.query(
              `INSERT IGNORE INTO budgets (budgetentryID, date, prodNameID, quantity, customerID, countryID, prodCatNameID, price, profit) VALUES (${entryid},'${year}-${q}-01', ?, 0, 9999, ?, ${prodcatname},0,0)`,
              [prod, country],
              (err1, res1) => {
                if (err1) {
                  console.log(err1);
                }
              }
            );
          });
        }
      }
    );
    // j = j + 1;
  });
  // if (err) {
  //   console.log(err);
  // } else {
  res.json({
    success: true,
    msg: "Saved",
  });
  // }
});

router.post("/budgetfilterbtns", (req, res) => {
  let year = req.body.year;
  db.query(
    // `SELECT DISTINCT prodCatName, productGroups.productGroup, budgets.prodCatNameID FROM budgets LEFT JOIN ((prodNames INNER JOIN productGroups ON prodNames.prodGroupID=productGroups.prodGroupID) INNER JOIN prodCatNames ON prodNames.prodCatNameID=prodCatNames.prodCatNameID) ON prodNames.prodNameID=budgets.prodNameID WHERE YEAR(date)=${year}`,
    `SELECT DISTINCT prodCatName, productGroups.productGroup, budgets.prodCatNameID, sum(quantity) AS quantity, sum(quantity*profit) AS profit FROM budgets LEFT JOIN ((prodNames INNER JOIN productGroups ON prodNames.prodGroupID=productGroups.prodGroupID) INNER JOIN prodCatNames ON prodNames.prodCatNameID=prodCatNames.prodCatNameID) ON prodNames.prodNameID=budgets.prodNameID WHERE YEAR(date)=${year} GROUP BY prodCatName, productGroups.productGroup, budgets.prodCatNameID`,
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

router.post("/budgetgroupbtns", (req, res) => {
  let year = req.body.year;
  db.query(
    `SELECT DISTINCT productGroups.productGroup, sum(quantity) AS quantity, sum(quantity*profit) AS profit FROM budgets LEFT JOIN ((prodNames INNER JOIN productGroups ON prodNames.prodGroupID=productGroups.prodGroupID) INNER JOIN prodCatNames ON prodNames.prodCatNameID=prodCatNames.prodCatNameID) ON prodNames.prodNameID=budgets.prodNameID WHERE YEAR(date)=${year} GROUP BY productGroups.productGroup ORDER BY profit DESC`,
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

router.post("/getbudgetdata", (req, res) => {
  let pcat = req.body.prodcat;
  let year = req.body.year;
  db.query(
    `SELECT budgets.*, abbreviation, country, region, price, profit FROM budgets INNER JOIN prodNames ON budgets.prodNameID = prodNames.prodNameID INNER JOIN countryList ON budgets.countryID=countryList.countryID WHERE budgets.prodCatNameID=${pcat} AND YEAR(date)=${year} ORDER BY abbreviation, region, country ASC, date ASC`,
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

router.post("/savebdgtqty", (req, res) => {
  let newqty = req.body.newqty;
  let entryID = req.body.entryID;
  db.query(
    `UPDATE budgets SET quantity='${newqty}' WHERE budgetentryID='${entryID}'`,
    (err) => {
      if (err) {
        console.log(err);
      } else {
        res.json({
          success: true,
          msg: "New Quantity Saved",
        });
      }
    }
  );
});

router.post("/savebdgteconfig", (req, res) => {
  let year = req.body.year;
  yearshort = year - 2000;
  let item = req.body.item;
  let value = req.body.value;
  let prod = req.body.prod;
  let country = req.body.cty;
  let quarter = [1, 4, 7, 10];
  let okind = "";
  quarter.forEach((q) => {
    let padprod = pad(prod, 3);
    let padcountry = pad(country, 3);
    let entryid = Number(yearshort + q.toString() + padprod + padcountry);
    // let sql = `UPDATE budgets SET ${item}=${value} WHERE budgetentryID='${entryid}'`;
    // console.log(sql);
    db.query(
      `UPDATE budgets SET ${item}=${value} WHERE budgetentryID='${entryid}'`,
      (err, results) => {
        if (err) {
          console.log(err);
        } else {
          // okind = "OK";
          // console.log("OK");
        }
      }
    );
    // if (okind === "OK") {

    // }
  });
  res.json({
    success: true,
    msg: "New Quantity Saved",
  });
});

router.post("/bdgtloadregcty", (req, res) => {
  let reg = req.body.reg;
  db.query(
    `SELECT countryID, country FROM countryList WHERE region='${reg}'`,
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

router.post("/bdgtfullcountrylist", (req, res) => {
  db.query("SELECT countryID, country FROM countryList", (err, results) => {
    if (err) {
      console.log(err);
    }
    if (results.length > 0) {
      res.status(200).send(results);
    }
  });
});

router.post("/addbdgtcty", (req, res) => {
  let countries = req.body.countries;
  let pname = req.body.pname;
  let pcatname = req.body.pcatname;
  let year = req.body.year;
  let yearshort = year - 2000;

  countries.forEach((cty) => {
    let quarter = [1, 4, 7, 10];
    quarter.forEach((q) => {
      let padprod = pad(pname, 3);
      let padcountry = pad(Number(cty), 3);
      let entryid = Number(yearshort + q.toString() + padprod + padcountry);
      db.query(
        `INSERT IGNORE INTO budgets (budgetentryID, date, prodNameID, quantity, customerID, countryID, prodCatNameID) VALUES (${entryid}, '${year}-${q}-01', ${pname}, 0, 9999, ${cty},${pcatname})`,
        (err, results) => {
          if (err) {
            console.log(err);
          }
        }
      );
    });
  });
  res.json({
    success: true,
    msg: "New Countries Added",
  });
});

router.post("/bdgtdelctyrow", (req, res) => {
  let year = req.body.year;
  let yearshort = year - 2000;
  let pname = req.body.pname;
  let countryid = req.body.countryid;
  let quarter = [1, 4, 7, 10];
  quarter.forEach((q) => {
    let padprod = pad(pname, 3);
    let padcountry = pad(Number(countryid), 3);
    let entryid = Number(yearshort + q.toString() + padprod + padcountry);
    db.query(
      `DELETE FROM budgets WHERE budgetentryID=${entryid}`,
      (err, result) => {
        if (err) {
          console.log(err);
        }
      }
    );
  });
  res.json({
    success: true,
    msg: "Country Deleted",
  });
});

router.post("/yearbudgetdata", (req, res) => {
  let year = req.body.year;
  let lastyear = year - 1;
  db.query(
    `SELECT YEAR(date) AS year, abbreviation, prodCatName, sum(quantity) AS quantity, sum(quantity*price) AS revenue, SUM(quantity*profit) AS totalprofit FROM budgets INNER JOIN prodCatNames ON budgets.prodCatNameID=prodCatNames.prodCatNameID INNER JOIN prodNames ON budgets.prodNameID=prodNames.prodnameID WHERE YEAR(date)=${year} OR YEAR(date)=${lastyear} GROUP BY prodCatName, abbreviation, YEAR(date) `,
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

router.post("/budgetlyearsales", (req, res) => {
  let year = req.body.year;
  let lastyear = year - 1;
  let prodcat = req.body.prodcat;
  db.query(
    "SELECT abbreviation, countryList.country, countryList.region, SUM(quantity) AS quantity, format(SUM(priceAfterInterest*quantity)/SUM(quantity),0) AS avgprice, format(SUM(priceAfterInterest*quantity),0) AS revenue, format(SUM(tradingProfit*quantity)/SUM(quantity),0) AS avgprofit, format(SUM(tradingMargin),0) AS totalprofit FROM quotationsheet INNER JOIN (productList INNER JOIN prodNames ON productList.productName=prodNames.prodNameID) ON quotationsheet.productID=productList.productID INNER JOIN (PODList INNER JOIN countryList ON PODList.countryID = countryList.countryID) ON quotationsheet.PODID = PODList.PODID WHERE YEAR(`from`)=? AND saleComplete=-1 AND prodCatNameID=? GROUP BY abbreviation,countryList.country, countryList.region",
    [lastyear, prodcat],
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

module.exports = router;
