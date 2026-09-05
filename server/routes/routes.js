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

const requireEditableBudgetEntry = (req, res, next) => {
  const budgetEntryID = String(
    req.body.budgetEntryID || req.body.entryID || "",
  ).trim();

  if (!/^\d+$/.test(budgetEntryID)) {
    return res.status(400).json({
      error: "A valid budgetEntryID is required",
    });
  }

  const query = `
    SELECT
      budgets.budgetentryID,

      EXISTS(
        SELECT 1
        FROM budgetCategorySubmissions
        WHERE budgetCategorySubmissions.budgetYear =
              YEAR(budgets.date)
          AND budgetCategorySubmissions.prodCatNameID =
              budgets.prodCatNameID
          AND budgetCategorySubmissions.status =
              'submitted'
      ) AS categorySubmitted

    FROM budgets
    WHERE budgets.budgetentryID = ?
  `;

  db.query(query, [budgetEntryID], (err, results) => {
    if (err) {
      console.log(err);

      return res.status(500).json({
        error: "Unable to verify budget category status",
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        error: "Budget entry not found",
      });
    }

    if (results[0].categorySubmitted) {
      return res.status(423).json({
        error: "This product category has been submitted and is read-only",
        status: "submitted",
      });
    }

    next();
  });
};

const requireEditableBudgetAllocation = (req, res, next) => {
  const allocationID = Number(req.body.allocationID);

  if (!Number.isInteger(allocationID) || allocationID <= 0) {
    return res.status(400).json({
      error: "A valid allocationID is required",
    });
  }

  const query = `
    SELECT
      budgetAllocations.allocationID,

      EXISTS(
        SELECT 1
        FROM budgetCategorySubmissions
        WHERE budgetCategorySubmissions.budgetYear =
              YEAR(budgets.date)
          AND budgetCategorySubmissions.prodCatNameID =
              budgets.prodCatNameID
          AND budgetCategorySubmissions.status =
              'submitted'
      ) AS categorySubmitted

    FROM budgetAllocations

    INNER JOIN budgets
      ON budgetAllocations.budgetEntryID =
         budgets.budgetentryID

    WHERE budgetAllocations.allocationID = ?
  `;

  db.query(query, [allocationID], (err, results) => {
    if (err) {
      console.log(err);

      return res.status(500).json({
        error: "Unable to verify budget category status",
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        error: "Allocation not found",
      });
    }

    if (results[0].categorySubmitted) {
      return res.status(423).json({
        error: "This product category has been submitted and is read-only",
        status: "submitted",
      });
    }

    next();
  });
};

const requireEditableBudgetProduct = (req, res, next) => {
  const year = Number(req.body.year);

  const prodNameID = Number(req.body.prod || req.body.pname);

  if (
    !Number.isInteger(year) ||
    !Number.isInteger(prodNameID) ||
    prodNameID <= 0
  ) {
    return res.status(400).json({
      error: "A valid year and product are required",
    });
  }

  const query = `
    SELECT
      prodNames.prodCatNameID,
      COALESCE(
        budgetCategorySubmissions.status,
        'draft'
      ) AS categoryStatus

    FROM prodNames

    LEFT JOIN budgetCategorySubmissions
      ON budgetCategorySubmissions.prodCatNameID =
         prodNames.prodCatNameID
      AND budgetCategorySubmissions.budgetYear = ?

    WHERE prodNames.prodNameID = ?
  `;

  db.query(query, [year, prodNameID], (err, results) => {
    if (err) {
      console.log(err);

      return res.status(500).json({
        error: "Unable to verify budget category status",
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        error: "Product not found",
      });
    }

    if (results[0].categoryStatus === "submitted") {
      return res.status(423).json({
        error: "This product category has been submitted and is read-only",
        status: "submitted",
      });
    }

    next();
  });
};

const requireEditableBudgetProducts = (req, res, next) => {
  const year = Number(req.body.year);
  const products = req.body.prodstoadd;

  if (
    !Number.isInteger(year) ||
    !Array.isArray(products) ||
    products.length === 0
  ) {
    return res.status(400).json({
      error: "A valid year and product list are required",
    });
  }

  const productIDs = products
    .map((product) => Number(product))
    .filter((product) => {
      return Number.isInteger(product) && product > 0;
    });

  if (productIDs.length !== products.length) {
    return res.status(400).json({
      error: "The product list contains invalid IDs",
    });
  }

  const placeholders = productIDs.map(() => "?").join(",");

  const query = `
    SELECT DISTINCT
      prodNames.prodCatNameID,
      prodCatNames.prodCatName

    FROM prodNames

    INNER JOIN prodCatNames
      ON prodNames.prodCatNameID =
         prodCatNames.prodCatNameID

    INNER JOIN budgetCategorySubmissions
      ON budgetCategorySubmissions.prodCatNameID =
         prodNames.prodCatNameID
      AND budgetCategorySubmissions.budgetYear = ?
      AND budgetCategorySubmissions.status =
          'submitted'

    WHERE prodNames.prodNameID IN (
      ${placeholders}
    )
  `;

  const values = [year].concat(productIDs);

  db.query(query, values, (err, results) => {
    if (err) {
      console.log(err);

      return res.status(500).json({
        error: "Unable to verify budget category status",
      });
    }

    if (results.length > 0) {
      return res.status(423).json({
        error: "One or more selected product categories have been submitted",
        status: "submitted",
        lockedCategories: results,
      });
    }

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
    },
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
                },
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
                },
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
    },
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
    },
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
              },
            );
            res.json({
              success: true,
              msg: "Password change was successful. Please log in again with your new password.",
            });
          }
        });
      }
    },
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
    },
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
    },
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
    },
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
    },
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
    },
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
    },
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
    },
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
    },
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
    },
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
    },
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
    },
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
    },
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
    },
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
    },
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
    },
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
    },
  );
});
router.post("/duplicateQS", (req, res) => {
  QSID = req.body.QSID;
  QSDate = req.body.QSDate;
  db.query(
    `CREATE TEMPORARY TABLE tmptable SELECT * FROM quotationsheet WHERE (QSID='${QSID}'); ALTER TABLE tmptable CHANGE QSID QSID bigint; UPDATE tmptable SET QSID = NULL, QSDate='${QSDate}', SCComplete=0, PCComplete=0, KTS=null, KTP=null, saleComplete=0, bookingComplete=0, pincoterms=null, bookingnumber=null, vesselName=null; INSERT INTO quotationsheet SELECT * FROM tmptable; DROP TABLE tmptable;`,
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
    },
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
    },
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
    shipmentType,
  } = req.body.QSData;
  db.query(
    "INSERT INTO quotationsheet (KTS, KTP, saleTypeID, QSDate, productID, supplierID, customerID, packingSize, marks, `from`, `to`, POLID, PODID, traderID, trafficID, incoterms, pTermID, FreightTotal, freightCompany, containerCapacity, inspectionCostPer250, quantity, materialCost, pAgentCommission, pFinancialCostP, sFinancialCost, oFreight, insuranceCost, inspectionCost, sAgentCommission, interestCost, interestRate, interestPeriod, legal, pallets, others, totalCost, saleInterestRate, salePaymentPeriod, priceBeforeInterest, saleInterest, priceAfterInterest, tradingProfit, tradingMargin, salesTurnover, percentageMargin, netback, saleComplete, finalComplete, generalduty, additionalduty, harborpct, merchprocpct, flatfee, tsca, isf, drayage, unloading, collectcharges, inboundothers, warehouseID, whentry, storagefixed, storagevariable, stggraceperiod, stgaccrualperiod, quantitypallets, loading, bolcharges, outboundothers, storagepmt, whexit, insurancerate, insurancefactor, shipmentTypeID) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);",
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
      shipmentType,
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
    },
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
    },
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
    },
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
  var index = keys.indexOf("shipmentType");
  if (index !== -1) {
    keys[index] = "shipmentTypeID";
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
    },
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
    },
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
    },
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
    },
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
    },
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
    },
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
    },
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
    },
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
    },
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
    },
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
    },
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
    },
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
    },
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
    },
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
    },
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
    },
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
    },
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
    },
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
    },
  );
});

// PRODNAMES LIST

router.post("/prodnameslist", (req, res) => {
  db.query(
    "SELECT productGroups.prodGroupID, productGroup, abbreviation, prodCatName, prodNames.prodCatNameID, prodNames.prodNameID FROM prodNames INNER JOIN productGroups ON prodNames.prodGroupID = productGroups.prodGroupID INNER JOIN prodCatNames ON prodNames.prodCatNameID=prodCatNames.prodCatNameID ORDER BY productGroups.prodGroupID ASC, prodCatName ASC",
    (err, results) => {
      if (err) {
        console.log(err);
      }
      if (results.length > 0) {
        return res.status(200).send(results);
      }
    },
  );
});

router.post("/selectgroupedprods", (req, res) => {
  let selectedprod = req.body.selectedprod;
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
    },
  );
});
router.post("/forceselectgroup", (req, res) => {
  let group = req.body.group;
  db.query(
    "SELECT prodgroupID FROM productGroups WHERE productGroup=?",
    [group],
    (err, results) => {
      if (err) {
        console.log(err);
      }
      if (results.length > 0) {
        return res.status(200).send(results);
      }
    },
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
    },
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
    },
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
    },
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
    },
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
    },
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
    },
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
    },
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
    },
  );
});
router.post("/bunitlist", (req, res) => {
  db.query(
    "SELECT BUID, businessUnit FROM businessUnits ORDER BY BUID ASC",
    (err, results) => {
      if (err) {
        console.log(err);
      }
      if (results.length > 0) {
        return res.status(200).send(results);
      }
    },
  );
});
router.post("/IMOlist", (req, res) => {
  db.query(
    "SELECT IMOID, IMO FROM IMOGroups ORDER BY IMOID ASC",
    (err, results) => {
      if (err) {
        console.log(err);
      }
      if (results.length > 0) {
        return res.status(200).send(results);
      }
    },
  );
});

router.post("/addNewProdName", (req, res) => {
  let prodCatNameID = req.body.newprodname.prodCatNameID;
  let abbreviation = req.body.newprodname.abbreviation;
  let prodName = req.body.newprodname.prodName;
  let BUID = req.body.newprodname.BUID;
  let IMOID = req.body.newprodname.IMOID;
  let prodgroupID = req.body.newprodname.prodgroupID;
  db.query(
    "INSERT IGNORE INTO prodNames (prodCatNameID, abbreviation, prodName, BUID, IMOID, prodGroupID) VALUES (?,?,?,?,?,?)",
    [prodCatNameID, abbreviation, prodName, BUID, IMOID, prodgroupID],
    (err, results) => {
      if (err) {
        console.log(err);
      } else if (results.affectedRows == "0") {
        console.log("ProdName Already Exists");
        return res.json({
          success: false,
          message: "Product Name Already Exists",
        });
      } else {
        console.log("Added Product  Name");
        return res.json({
          success: true,
          message: "Successfully added New Product  Name",
        });
      }
    },
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
    },
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
    },
  );
});

// PRODLIST

router.post("/addnewProduct", (req, res) => {
  let prodnameID = req.body.newproddetail.prodnameID;
  let supplierID = req.body.newproddetail.supplierID;
  db.query(
    "INSERT INTO productList (productName, supplierID) VALUES (?,?)",
    [prodnameID, supplierID],
    (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Added Product");
        return res.json({
          success: true,
          message: "Successfully added New Product",
        });
      }
    },
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
    },
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
    },
  );
});

router.post("/usposmatching", (req, res) => {
  let usposnumber = req.body.usposnumber;
  db.query(
    "SELECT tCode, KTS, quantity, quantitypallets, companyCode, saleComplete, saleTypeID, FORMAT(tradingProfit,2) AS tradingProfit, FORMAT(priceAfterInterest,2) AS priceAfterInterest, DATE_FORMAT(whexit,'%Y-%m-%d') AS whexit FROM quotationsheet INNER JOIN customerList ON quotationsheet.customerID = customerList.customerID INNER JOIN traderList ON quotationsheet.traderID = traderList.traderID WHERE KTP = ? AND saleComplete=-1 AND saleTypeID=3 ORDER BY tradingProfit DESC",
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
    },
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
    },
  );
});
router.post("/profitabilityreport", (req, res) => {
  let reportstartdate = req.body.reportstartdate;
  let reportenddate = req.body.reportenddate;
  console.log(reportstartdate);
  db.query(
    "SELECT QSID, KTS, KTP, tCode, DATE_FORMAT(`from`, '%M-%Y') AS month, DATE_FORMAT(QSDate, '%d/%m/%Y') AS date, DATE_FORMAT(`from`, '%d %b') AS startship, DATE_FORMAT(`to`, '%d %b') AS endship, YEAR(`from`) AS year, MONTH(`from`) AS monthnum, quantity, customerList.companyCode AS customer, abbreviation AS product, prodCatName, productGroup,tradingProfit AS profitpmt, tradingMargin AS profit, priceBeforeInterest AS price, QSID, PODList.country, materialCost FROM quotationsheet INNER JOIN customerList ON quotationsheet.customerID = customerList.customerID INNER JOIN productList ON quotationsheet.productID = productList.productID INNER JOIN (prodNames INNER JOIN prodCatNames ON prodNames.prodCatNameID = prodCatNames.prodCatNameID) ON productList.productName =  prodNames.prodNameID  INNER JOIN productGroups ON prodNames.prodGroupID = productGroups.prodGroupID INNER JOIN traderList on quotationsheet.traderID = traderList.traderID INNER JOIN PODList ON quotationsheet.PODID = PODList.PODID WHERE DATE(`from`) BETWEEN ? AND ? AND saleComplete=-1 ORDER BY `from` DESC",
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
    },
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
    },
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
    },
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
    },
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
    },
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
    },
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
    },
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
    },
  );
});

router.post("/budgetprodNames", (req, res) => {
  const year = Number(req.body.year);

  db.query(
    `
      SELECT
        prodNames.abbreviation,
        prodNames.prodNameID,
        prodNames.prodCatNameID,
        prodCatNames.prodCatName,
        productGroups.productGroup
      FROM prodNames
      INNER JOIN prodCatNames
        ON prodNames.prodCatNameID = prodCatNames.prodCatNameID
      INNER JOIN productGroups
        ON prodNames.prodGroupID = productGroups.prodGroupID
      WHERE NOT EXISTS (
        SELECT 1
        FROM budgets
        WHERE budgets.prodNameID = prodNames.prodNameID
          AND YEAR(budgets.date) = ?
      )
      ORDER BY prodNames.abbreviation ASC
    `,
    [year],
    (err, results) => {
      if (err) {
        console.error("Error loading products for budget:", err);

        return res.status(500).json({
          error: "Products could not be loaded",
        });
      }

      return res.status(200).send(results);
    },
  );
});

function pad(num, size) {
  num = num.toString();
  while (num.length < size) num = "0" + num;
  return num;
}

router.post(
  "/addprodbudget",
  requireEditableBudgetProducts,
  async (req, res) => {
    const year = Number(req.body.year);
    const productIDs = [
      ...new Set(req.body.prodstoadd.map((productID) => Number(productID))),
    ];

    const yearshort = year - 2000;
    const lastyear = year - 1 + "-12-31";
    const twolastyear = year - 2 + "-01-01";
    const quarterMonths = [1, 4, 7, 10];

    const queryAsync = (sql, values) => {
      return new Promise((resolve, reject) => {
        db.query(sql, values, (err, results) => {
          if (err) {
            reject(err);
          } else {
            resolve(results);
          }
        });
      });
    };

    const historyQuery = `
      SELECT DISTINCT
        prodNames.prodCatNameID,
        PODList.countryID
      FROM prodNames
      LEFT JOIN productList
        ON productList.productName = prodNames.prodNameID
      LEFT JOIN quotationsheet
        ON quotationsheet.productID = productList.productID
        AND DATE(quotationsheet.\`from\`) BETWEEN ? AND ?
        AND quotationsheet.saleComplete = -1
      LEFT JOIN PODList
        ON quotationsheet.PODID = PODList.PODID
      WHERE prodNames.prodNameID = ?
    `;

    try {
      const productResults = await Promise.all(
        productIDs.map((productID) => {
          return queryAsync(historyQuery, [
            twolastyear,
            lastyear,
            productID,
          ]).then((results) => {
            return {
              productID,
              results,
            };
          });
        }),
      );

      const rows = [];

      productResults.forEach((productResult) => {
        if (productResult.results.length === 0) {
          return;
        }

        const prodCatNameID = Number(productResult.results[0].prodCatNameID);

        const historicalCountries = productResult.results
          .map((item) => Number(item.countryID))
          .filter((countryID) => {
            return Number.isInteger(countryID) && countryID > 0;
          });

        const countryIDs =
          historicalCountries.length > 0
            ? [...new Set(historicalCountries)]
            : [32];

        countryIDs.forEach((countryID) => {
          quarterMonths.forEach((month) => {
            const entryID = Number(
              yearshort.toString() +
                month.toString() +
                pad(productResult.productID, 3) +
                pad(countryID, 3),
            );

            rows.push([
              entryID,
              year + "-" + month + "-01",
              productResult.productID,
              0,
              9999,
              countryID,
              prodCatNameID,
              0,
              0,
            ]);
          });
        });
      });

      if (rows.length === 0) {
        return res.status(400).json({
          error: "None of the selected products could be found",
        });
      }

      const insertQuery = `
        INSERT IGNORE INTO budgets (
          budgetentryID,
          date,
          prodNameID,
          quantity,
          customerID,
          countryID,
          prodCatNameID,
          price,
          profit
        )
        VALUES ?
      `;

      const insertResults = await queryAsync(insertQuery, [rows]);

      const productGroups = await queryAsync(
        `
          SELECT
            productGroups.productGroup,
            SUM(budgets.quantity) AS quantity,
            SUM(budgets.quantity * budgets.profit) AS profit
          FROM budgets
          INNER JOIN prodNames
            ON prodNames.prodNameID = budgets.prodNameID
          INNER JOIN productGroups
            ON productGroups.prodGroupID = prodNames.prodGroupID
          WHERE YEAR(budgets.date) = ?
          GROUP BY productGroups.productGroup
          ORDER BY profit DESC
        `,
        [year],
      );

      const productCategories = await queryAsync(
        `
          SELECT
            prodCatNames.prodCatName,
            productGroups.productGroup,
            budgets.prodCatNameID,
            SUM(budgets.quantity) AS quantity,
            SUM(budgets.quantity * budgets.profit) AS profit
          FROM budgets
          INNER JOIN prodNames
            ON prodNames.prodNameID = budgets.prodNameID
          INNER JOIN productGroups
            ON productGroups.prodGroupID = prodNames.prodGroupID
          INNER JOIN prodCatNames
            ON prodCatNames.prodCatNameID = budgets.prodCatNameID
          WHERE YEAR(budgets.date) = ?
          GROUP BY
            prodCatNames.prodCatName,
            productGroups.productGroup,
            budgets.prodCatNameID
          ORDER BY profit DESC
        `,
        [year],
      );

      return res.status(200).json({
        success: true,
        msg: "Products added",
        productsProcessed: productIDs.length,
        rowsAdded: insertResults.affectedRows,
        productGroups,
        productCategories,
      });
    } catch (err) {
      console.error("Error adding products to budget:", err);

      return res.status(500).json({
        error: "The selected products could not be added",
      });
    }
  },
);

router.post("/budgetfilterbtns", (req, res) => {
  let year = req.body.year;
  db.query(
    // `SELECT DISTINCT prodCatName, productGroups.productGroup, budgets.prodCatNameID FROM budgets LEFT JOIN ((prodNames INNER JOIN productGroups ON prodNames.prodGroupID=productGroups.prodGroupID) INNER JOIN prodCatNames ON prodNames.prodCatNameID=prodCatNames.prodCatNameID) ON prodNames.prodNameID=budgets.prodNameID WHERE YEAR(date)=${year}`,
    `SELECT DISTINCT prodCatName, productGroups.productGroup, budgets.prodCatNameID, sum(quantity) AS quantity, sum(quantity*profit) AS profit FROM budgets LEFT JOIN ((prodNames INNER JOIN productGroups ON prodNames.prodGroupID=productGroups.prodGroupID) INNER JOIN prodCatNames ON prodNames.prodCatNameID=prodCatNames.prodCatNameID) ON prodNames.prodNameID=budgets.prodNameID WHERE YEAR(date)=${year} GROUP BY prodCatName, productGroups.productGroup, budgets.prodCatNameID ORDER BY profit DESC`,
    (err, results) => {
      if (err) {
        console.log(err);
      }
      if (results.length > 0) {
        return res.status(200).send(results);
      }
    },
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
    },
  );
});

router.post("/getbudgetdata", (req, res) => {
  const pcat = Number(req.body.prodcat);
  const year = Number(req.body.year);

  db.query(
    `SELECT
       budgets.*,
       abbreviation,
       country,
       region,
       price,
       profit
     FROM budgets
     INNER JOIN prodNames
       ON budgets.prodNameID = prodNames.prodNameID
     INNER JOIN countryList
       ON budgets.countryID = countryList.countryID
     WHERE budgets.prodCatNameID = ?
       AND YEAR(date) = ?
     ORDER BY
       abbreviation,
       region,
       country ASC,
       date ASC`,
    [pcat, year],
    (err, results) => {
      if (err) {
        console.error("Error loading budget data:", err);

        return res.status(500).json({
          error: "Budget data could not be loaded",
        });
      }

      // Returning [] is required when the category has no remaining rows.
      return res.status(200).send(results);
    },
  );
});

router.post("/bdgtregiondata", (req, res) => {
  let year = req.body.year;
  db.query(
    `SELECT QUARTER(date) as quarter, countryList.country, region, quantity, profit*quantity AS profit, abbreviation, productGroup, prodCatName, budgets.price*budgets.quantity AS revenue, budgetentryID, budgets.prodNameID, budgets.customerID, budgets.countryID, budgets.prodCatNameID, budgets.profit AS unitprofit, budgets.date, budgets.price FROM budgets LEFT JOIN ((prodNames INNER JOIN productGroups ON prodNames.prodGroupID=productGroups.prodGroupID) INNER JOIN prodCatNames ON prodNames.prodCatNameID=prodCatNames.prodCatNameID) ON prodNames.prodNameID=budgets.prodNameID INNER JOIN countryList ON countryList.countryID = budgets.countryID WHERE YEAR(date)=${year}`,
    (err, results) => {
      if (err) {
        console.log(err);
      }
      if (results.length > 0) {
        res.status(200).send(results);
      }
    },
  );
});

router.post("/savebdgtqty", requireEditableBudgetEntry, (req, res) => {
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
    },
  );
});

router.post("/savebdgteconfig", requireEditableBudgetProduct, (req, res) => {
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
      },
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
    },
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

router.post("/addbdgtcty", requireEditableBudgetProduct, (req, res) => {
  const year = Number(req.body.year);

  const rawProductID =
    req.body.prodNameID !== undefined ? req.body.prodNameID : req.body.pname;

  const prodNameID = Number(rawProductID);
  const prodCatNameID = Number(req.body.pcatname);

  const countries = Array.isArray(req.body.countries)
    ? [...new Set(req.body.countries.map(Number))]
    : [];

  if (
    !Number.isInteger(year) ||
    year < 2000 ||
    year > 9999 ||
    !Number.isInteger(prodNameID) ||
    prodNameID <= 0 ||
    !Number.isInteger(prodCatNameID) ||
    prodCatNameID <= 0 ||
    countries.length === 0 ||
    countries.some(
      (countryID) => !Number.isInteger(countryID) || countryID <= 0,
    )
  ) {
    return res.status(400).json({
      error: "Valid year, prodNameID, pcatname and countries are required",
    });
  }

  const yearshort = year - 2000;
  const quarterMonths = [1, 4, 7, 10];
  const rows = [];

  countries.forEach((countryID) => {
    quarterMonths.forEach((month) => {
      const paddedProduct = pad(prodNameID, 3);
      const paddedCountry = pad(countryID, 3);

      const budgetEntryID = Number(
        yearshort.toString() + month.toString() + paddedProduct + paddedCountry,
      );

      rows.push([
        budgetEntryID,
        `${year}-${month}-01`,
        prodNameID,
        0,
        9999,
        countryID,
        prodCatNameID,
      ]);
    });
  });

  const sql = `
      INSERT IGNORE INTO budgets (
        budgetentryID,
        date,
        prodNameID,
        quantity,
        customerID,
        countryID,
        prodCatNameID
      )
      VALUES ?
    `;

  db.query(sql, [rows], (err, results) => {
    if (err) {
      console.error("Error adding budget countries:", err);

      return res.status(500).json({
        error: "The selected countries could not be added",
      });
    }

    return res.status(200).json({
      success: true,
      msg: "New Countries Added",
      rowsAdded: results.affectedRows,
    });
  });
});

router.post(
  "/bdgtdelctyrow",
  requireEditableBudgetProduct,
  async (req, res) => {
    const year = Number(req.body.year);
    const productNameID = Number(req.body.pname);
    const countryID = Number(req.body.countryid);
    const prodCatNameID = Number(req.body.prodcat);

    const queryAsync = (sql, values) => {
      return new Promise((resolve, reject) => {
        db.query(sql, values, (err, results) => {
          if (err) {
            reject(err);
          } else {
            resolve(results);
          }
        });
      });
    };

    try {
      const deleteResult = await queryAsync(
        `DELETE FROM budgets
         WHERE prodNameID = ?
           AND countryID = ?
           AND YEAR(date) = ?`,
        [productNameID, countryID, year],
      );

      const categoryCount = await queryAsync(
        `SELECT COUNT(*) AS remainingRows
         FROM budgets
         WHERE prodCatNameID = ?
           AND YEAR(date) = ?`,
        [prodCatNameID, year],
      );

      const productGroups = await queryAsync(
        `SELECT
           productGroups.productGroup,
           SUM(budgets.quantity) AS quantity,
           SUM(budgets.quantity * budgets.profit) AS profit
         FROM budgets
         INNER JOIN prodNames
           ON prodNames.prodNameID = budgets.prodNameID
         INNER JOIN productGroups
           ON productGroups.prodGroupID = prodNames.prodGroupID
         WHERE YEAR(budgets.date) = ?
         GROUP BY productGroups.productGroup
         ORDER BY profit DESC`,
        [year],
      );

      const productCategories = await queryAsync(
        `SELECT
           prodCatNames.prodCatName,
           productGroups.productGroup,
           budgets.prodCatNameID,
           SUM(budgets.quantity) AS quantity,
           SUM(budgets.quantity * budgets.profit) AS profit
         FROM budgets
         INNER JOIN prodNames
           ON prodNames.prodNameID = budgets.prodNameID
         INNER JOIN productGroups
           ON productGroups.prodGroupID = prodNames.prodGroupID
         INNER JOIN prodCatNames
           ON prodCatNames.prodCatNameID = budgets.prodCatNameID
         WHERE YEAR(budgets.date) = ?
         GROUP BY
           prodCatNames.prodCatName,
           productGroups.productGroup,
           budgets.prodCatNameID
         ORDER BY profit DESC`,
        [year],
      );

      return res.status(200).json({
        success: true,
        msg: "Country Deleted",
        rowsDeleted: deleteResult.affectedRows,
        categoryHasRows: Number(categoryCount[0].remainingRows) > 0,
        productGroups,
        productCategories,
      });
    } catch (err) {
      console.error("Error deleting budget country:", err);

      return res.status(500).json({
        error: "The country could not be deleted",
      });
    }
  },
);

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
    },
  );
});

router.post("/bdgtlyearsalestotals", (req, res) => {
  let year = req.body.year;
  let lastyear = year - 1;
  db.query(
    "SELECT SUM(quantity) AS quantity, SUM(priceAfterInterest*quantity) AS revenue, SUM(tradingProfit*quantity) as profit FROM quotationsheet WHERE YEAR(`from`)=? AND saleComplete=-1",
    [lastyear],
    (err, results) => {
      if (err) {
        console.log(err);
      }
      if (results.length > 0) {
        res.status(200).send(results);
      }
      if (results.length === 0) {
        res.json({
          success: true,
          msg: "No last year sales",
        });
      }
    },
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
      if (results.length === 0) {
        res.json({
          success: true,
          msg: "No last year sales",
        });
      }
    },
  );
});

router.post("/bdgtlyearbdgt", (req, res) => {
  let year = req.body.year;
  let lastyear = year - 1;
  let prodcat = req.body.prodcat;
  db.query(
    "SELECT abbreviation, countryList.country, countryList.region, SUM(quantity) AS quantity, format(SUM(price*quantity)/SUM(quantity),0) AS avgprice, format(SUM(profit*quantity)/SUM(quantity),0) AS avgprofit FROM budgets INNER JOIN prodNames ON prodNames.prodNameID = budgets.prodNameID INNER JOIN prodCatNames ON prodCatNames.prodCatNameID = budgets.prodCatNameID INNER JOIN countryList on countryList.countryID = budgets.countryID WHERE YEAR(budgets.date)=? AND budgets.prodCatNameID=? GROUP BY abbreviation, countryList.country, countryList.region",
    [lastyear, prodcat],
    (err, results) => {
      // console.log(results);

      if (err) {
        console.log(err);
      }
      if (results.length > 0) {
        res.status(200).send(results);
      }
      if (results.length === 0) {
        res.json({
          success: true,
          msg: "No last year budget",
        });
      }
    },
  );
});

router.post("/loadbudgetfile", (req, res) => {
  let data = req.body.data;
  let values = "";

  data.forEach((i, ind1) => {
    let val = "(";
    Object.keys(i).forEach((x, ind) => {
      if (
        x === "budgetentryID" ||
        x === "date" ||
        x === "prodNameID" ||
        x === "customerID" ||
        x === "countryID" ||
        x === "prodCatNameID" ||
        x === "price" ||
        x === "quantity" ||
        x === "unitprofit"
      ) {
        if (ind + 1 === Object.keys(i).length) {
          val += i[x] + ")";
        } else {
          if (x === "date") {
            val +=
              "'" +
              i[x].toString().slice(0, i[x].toString().indexOf("T")) +
              "',";
          } else {
            val += i[x] + ", ";
          }
        }
      }
    });
    if (ind1 + 1 === data.length) {
      values += val;
    } else {
      values += val + ", ";
    }
    val = "";
  });

  // console.log(values);
  // quantity, budgetentryID, prodNameID, customerID, countryID, prodCatNameID, profit, date

  db.query("TRUNCATE TABLE budgets", (err, results) => {
    if (err) {
      console.log(err);
    } else {
      db.query(
        `INSERT INTO budgets (quantity, budgetentryID, prodNameID, customerID, countryID, prodCatNameID, profit, date, price) VALUES ${values}`,
        (err, results) => {
          if (err) {
            console.log(err);
          } else {
            res.json({
              success: true,
              msg: "File Uploaded",
            });
          }
        },
      );
    }
  });
});

router.post("/loadcurrentbudget", (req, res) => {
  let currentyear = req.body.currentyear;
  db.query(
    // "SELECT budgetentryID, date, quantity, price, profit, countryList.country, countryList.wgregions abbreviation, companyCode, prodCatName FROM budgets INNER JOIN countryList ON budgets.countryID = countryList.countryID INNER JOIN prodNames on prodNames.prodNameID = budgets.prodNameID INNER JOIN customerList ON customerList.customerID = budgets.customerID INNER JOIN prodCatNames ON prodCatNames.prodCatNameID = budgets.prodCatNameID WHERE YEAR(date)=?",
    "SELECT YEAR(budgets.date) AS yy, QUARTER(budgets.date) AS qq, countryList.country, countryList.wgregions AS region, prodCatNames.prodCatName as productCategory, prodNames.abbreviation as product, productGroups.productGroup, budgets.quantity AS budget, IFNULL(quarterlysales.quantity,0) AS sold, budgets.profit*budgets.quantity AS budgetprofit, IFNULL(quarterlysales.profit,0) AS soldprofit FROM (budgets INNER JOIN countryList ON budgets.countryID = countryList.countryID INNER JOIN (prodNames INNER JOIN productGroups ON prodNames.prodGroupID = productGroups.prodGroupID) ON budgets.prodNameID = prodNames.prodNameID INNER JOIN prodCatNames ON budgets.prodCatNameID = prodCatNames.prodCatNameID) LEFT JOIN quarterlysales ON CONCAT(DATE_FORMAT(date,'%Y'), QUARTER(date),budgets.prodNameID, budgets.countryID) = CONCAT(y,Q,productName, quarterlysales.countryID) WHERE YEAR(budgets.date) = ? UNION SELECT y AS yy, Q AS qq, country, region, prodCatName, abbreviation, prodGroup, IFNULL(budgets.quantity,0), quarterlysales.quantity AS sold, IFNULL(budgets.profit*budgets.quantity,0), IFNULL(quarterlysales.profit,0) AS soldprofit from quarterlysales LEFT JOIN budgets ON CONCAT(DATE_FORMAT(date,'%Y'), QUARTER(date),budgets.prodNameID, budgets.countryID) = CONCAT(y,Q,productName, quarterlysales.countryID) WHERE y = ?;",
    [currentyear, currentyear],
    (err, results) => {
      if (err) {
        console.log(err);
      }
      if (results.length > 0) {
        res.status(200).send(results);
      }
    },
  );
});

router.post("/savenewbudgetcomment", (req, res) => {
  let budgetentryID = req.body.id;
  let bdgtcommentdate = req.body.commentdate;
  let bdgtcomment = req.body.newcomment;
  let user = req.body.user;
  let prodCatNameID = req.body.prodCatNameID;
  let bdgtyear = req.body.bdgtyear;
  db.query(
    "INSERT INTO budgetnotes (budgetEntryID, bdgtCommentDate, bdgtcomment, user, prodCatNameID, bdgtyear) VALUES (?,?,?,?,?,?)",
    [
      budgetentryID,
      bdgtcommentdate,
      bdgtcomment,
      user,
      prodCatNameID,
      bdgtyear,
    ],
    (err, results) => {
      if (err) {
        console.log(err);
      } else {
        res.json({
          success: true,
          msg: "Comment succesfully saved",
        });
      }
    },
  );
});
router.post("/deletebudgetcomment", (req, res) => {
  let id = req.body.id;
  db.query(
    `DELETE FROM budgetnotes WHERE bdgtcommentID=${id}`,
    (err, results) => {
      if (err) {
        console.log(err);
      }
      if (results) {
        res.sendStatus(200);
      }
    },
  );
});

router.post("/getbdgtcomments", (req, res) => {
  let prodCatNameID = req.body.prodcat;
  let date = req.body.year;
  db.query(
    "SELECT * FROM budgetnotes WHERE prodCatNameID=? AND bdgtyear=?",
    [prodCatNameID, date],
    (err, results) => {
      if (err) {
        console.log(err);
      }
      if (results.length > 0) {
        res.status(200).send(results);
      }
      if (results.length === 0) {
        res.json({
          success: true,
          msg: "No comments yet",
        });
      }
    },
  );
});

router.post("/getmyoperations", (req, res) => {
  let trafficid = req.body.selectedTrafficID;
  db.query(
    "SELECT customerList.companyCode AS customer, abbreviation, quantity, supplierlist.companyCode AS supplier, KTP, KTS, QSID,DATE_FORMAT(`from`,'%Y-%m-%d') AS start, DATE_FORMAT(`to`,'%Y-%m-%d') AS end, portOfDestination, portOfLoad, SCComplete, PCComplete, bookingComplete, traderList.tCode AS trader, trafficList.tCode AS traffic, bookingComplete, freightCompany, vesselName, bookingnumber, ETS, ETA, incoterms, pincoterms, quotationsheet.shipmentTypeID, shipmentTypes.shipmentType AS shipmentType,InsComplete, InsNumber, inspection, inspectionCompany  FROM quotationsheet INNER JOIN customerList ON quotationsheet.customerID = customerList.customerID INNER JOIN (productList INNER JOIN prodNames ON productList.productName = prodNames.prodNameID) ON quotationsheet.productID = productList.productID INNER JOIN supplierlist ON quotationsheet.supplierID = supplierlist.supplierID INNER JOIN POLList ON quotationsheet.POLID = POLList.POLID INNER JOIN PODList ON quotationsheet.PODID = PODList.PODID INNER JOIN traderList ON quotationsheet.traderID = traderList.traderID INNER JOIN shipmentTypes ON quotationsheet.shipmentTypeID = shipmentTypes.shipmentTypeID INNER JOIN trafficList ON trafficList.trafficID = quotationsheet.trafficID WHERE saleComplete IN (1, -1) AND finalComplete=0 AND quotationsheet.trafficID=?",
    [trafficid],
    (err, results) => {
      if (err) {
        console.log(err);
      }
      if (results.length > 0) {
        res.status(200).send(results);
        // } else if (results.length === 0) {
        //   res.json({
        //     success: true,
        //     msg: "No files assigned to this traffic manager",
        //   });
      }
      if (results.length === 0) {
        res.json({
          success: true,
          msg: "No files assigned to this traffic manager",
        });
      }
    },
  );
});

router.post("/gettraderoperations", (req, res) => {
  let traderid = req.body.userID;
  db.query(
    "SELECT customerList.companyCode AS customer, abbreviation, quantity, supplierlist.companyCode AS supplier, KTP, KTS, QSID,DATE_FORMAT(`from`,'%Y-%m-%d') AS start, DATE_FORMAT(`to`,'%Y-%m-%d') AS end, portOfDestination, portOfLoad, SCComplete, PCComplete, bookingComplete, traderList.tCode AS trader, trafficList.tCode AS traffic, bookingComplete, freightCompany, vesselName, bookingnumber, ETS, ETA, incoterms, pincoterms, quotationsheet.shipmentTypeID, shipmentTypes.shipmentType AS shipmentType, InsComplete, InsNumber , inspection, inspectionCompany FROM quotationsheet INNER JOIN customerList ON quotationsheet.customerID = customerList.customerID INNER JOIN (productList INNER JOIN prodNames ON productList.productName = prodNames.prodNameID) ON quotationsheet.productID = productList.productID INNER JOIN supplierlist ON quotationsheet.supplierID = supplierlist.supplierID INNER JOIN POLList ON quotationsheet.POLID = POLList.POLID INNER JOIN PODList ON quotationsheet.PODID = PODList.PODID INNER JOIN traderList ON quotationsheet.traderID = traderList.traderID INNER JOIN shipmentTypes ON quotationsheet.shipmentTypeID = shipmentTypes.shipmentTypeID INNER JOIN trafficList ON trafficList.trafficID = quotationsheet.trafficID WHERE saleComplete IN (1, -1) AND finalComplete=0 AND quotationsheet.traderID=?",
    [traderid],
    (err, results) => {
      if (err) {
        console.log(err);
      }
      if (results.length > 0) {
        res.status(200).send(results);
        // } else if (results.length === 0) {
        //   res.json({
        //     success: true,
        //     msg: "No files assigned to this traffic manager",
        //   });
      }
      if (results.length === 0) {
        res.json({
          success: true,
          msg: "No files assigned to this traffic manager",
        });
      }
    },
  );
});

router.post("/saveopedits", (req, res) => {
  let id = req.body.id;
  let SCComplete = req.body.opedits.SCCompleteBool;
  let PCComplete = req.body.opedits.PCCompleteBool;
  let InsComplete = req.body.opedits.InsCompleteBool;
  let InsNumber = req.body.opedits.InsNumber;
  let bookingComplete = req.body.opedits.bookingCompleteBool;
  let bookingnumber = req.body.opedits.bookingnumber;
  let inspection = req.body.opedits.inspection;
  let inspectionCompany = req.body.opedits.inspectionCompany;
  let vesselName = req.body.opedits.vesselName;
  let freightCompany = req.body.opedits.freightCompany;
  let pincoterms = req.body.opedits.pincoterms;
  let incoterms = req.body.opedits.incoterms;
  let ETS = req.body.opedits.ETS === "" ? null : req.body.opedits.ETS;
  let ETA = req.body.opedits.ETA === "" ? null : req.body.opedits.ETA;

  db.query(
    "UPDATE quotationsheet SET SCComplete = ?, PCComplete=?, bookingComplete=?, bookingnumber=?, vesselName=?, freightCompany=?, pincoterms=?, incoterms=?, ETS=?, ETA=?, InsComplete=?, InsNumber=? , inspection=?, inspectionCompany=? WHERE QSID=?",
    [
      SCComplete,
      PCComplete,
      bookingComplete,
      bookingnumber,
      vesselName,
      freightCompany,
      pincoterms,
      incoterms,
      ETS,
      ETA,
      InsComplete,
      InsNumber,
      inspection,
      inspectionCompany,
      id,
    ],
    (err, results) => {
      if (err) {
        console.log(err);
      } else {
        res.json({
          success: true,
          msg: "Changes Saved",
        });
      }
    },
  );
});
router.post("/savenewnote", (req, res) => {
  let QSID = req.body.QSID;
  let opNote = req.body.opNote;
  let opNoteDate = req.body.opNoteDate;
  let userCode = req.body.userCode;
  // console.log(QSID, opNote, opNoteDate, userCode);
  db.query(
    "INSERT INTO operationNotes (QSID, opNote, opNoteDate, userCode) VALUES (?,?,?,?);",
    [QSID, opNote, opNoteDate, userCode],
    (err) => {
      if (err) {
        console.log(err);
      } else {
        return res.json({
          success: true,
          message: "New Note Posted",
        });
      }
    },
  );
});

router.post("/getopnotes", (req, res) => {
  let QSID = req.body.QSID;
  db.query(
    "SELECT * FROM operationNotes WHERE QSID=?",
    [QSID],
    (err, results) => {
      if (err) {
        console.log(err);
      }
      if (results.length > 0) {
        res.status(200).send(results);
      }
      if (results.length === 0) {
        return res.json({
          success: true,
          message: "New Notes Yet",
        });
      }
    },
  );
});

router.post("/getfulloptoedit", (req, res) => {
  let QSID = req.body.QSID;
  db.query(
    "SELECT QSID, abbreviation, quantity, KTS, KTP, supplierlist.companyCode as supplier, customerList.companyCode as customer FROM quotationsheet INNER JOIN (productList INNER JOIN prodNames ON productList.productName = prodNames.prodNameID ) ON quotationsheet.productID = productList.productID INNER JOIN supplierlist ON quotationsheet.supplierID = supplierlist.supplierID INNER JOIN customerList ON quotationsheet.customerID=customerList.customerID WHERE QSID=?",
    [QSID],
    (err, results) => {
      if (err) {
        console.log(err);
      }
      if (results.length > 0) {
        res.status(200).send(results);
      }
    },
  );
});

router.post("/addQStonewmsglist", (req, res) => {
  let QSID = req.body.QSID;
  let user = req.body.user;
  let unreadusers = req.body.activeusers;
  db.query(
    "INSERT INTO newMsgList (QSID, user, unreadusers) VALUES (?,?,?)",
    [QSID, user, unreadusers],
    (err, results) => {
      if (err) {
        console.log(err);
      } else {
        return res.json({
          success: true,
          message: "New QSID added to List",
        });
      }
    },
  );
});

router.post("/resetunreadusers", (req, res) => {
  let QSID = req.body.QSID;
  let unreadusers = req.body.unreadusers;
  db.query(
    "UPDATE newMsgList SET unreadusers = ? WHERE QSID=?",
    [unreadusers, QSID],
    (err, results) => {
      if (err) {
        console.log(err);
      }
      if (results) {
        res.sendStatus(200);
      }
    },
  );
});

router.post("/getQSListwithNewMsg", (req, res) => {
  // let user = req.body.user;
  db.query("SELECT * FROM newMsgList", (err, results) => {
    if (err) {
      console.log(err);
    }
    if (results.length > 0) {
      res.status(200).send(results);
    }
    if (results.length === 0) {
      return res.json({
        success: true,
        message: "No QS with new msgs",
      });
    }
  });
});

router.post("/removeQSfromNewmsglist", (req, res) => {
  let QSID = req.body.QSID;
  db.query(`DELETE FROM newMsgList WHERE QSID=${QSID}`, (err, results) => {
    if (err) {
      console.log(err);
    }
    if (results) {
      res.sendStatus(200);
    }
  });
});

router.post("/removeUnreaduser", (req, res) => {
  let QSID = req.body.QSID;
  let unreadusers = req.body.unreadusers;
  db.query(
    "UPDATE newMsgList SET unreadusers = ? WHERE QSID=?",
    [unreadusers, QSID],
    (err, results) => {
      if (err) {
        console.log(err);
      }
      if (results) {
        res.sendStatus(200);
      }
    },
  );
});

router.post("/getActiveUsers", (req, res) => {
  db.query(
    "SELECT traderID, tCode FROM traderList WHERE active='y'",

    (err, results) => {
      if (err) {
        console.log(err);
      }
      if (results.length > 0) {
        res.status(200).send(results);
      }
    },
  );
});

router.post("/budgetrowhistory", (req, res) => {
  const budgetYear = Number(req.body.year);
  const prodcat = Number(req.body.prodcat);
  const product = req.body.product;
  const region = req.body.region;
  const country = req.body.country;
  const requestedYears = Number(req.body.years) || 3;
  const numberOfYears = Math.min(Math.max(requestedYears, 1), 5);

  if (
    !Number.isInteger(budgetYear) ||
    !Number.isInteger(prodcat) ||
    !product ||
    !region ||
    !country
  ) {
    return res.status(400).json({
      error: "year, prodcat, product, region and country are required",
    });
  }

  const endYear = budgetYear - 1;
  const startYear = budgetYear - numberOfYears;

  const budgetQuery = `
    SELECT
      YEAR(budgets.date) AS year,
      QUARTER(budgets.date) AS quarter,
      SUM(budgets.quantity) AS quantity
    FROM budgets
    INNER JOIN prodNames
      ON budgets.prodNameID = prodNames.prodNameID
    INNER JOIN countryList
      ON budgets.countryID = countryList.countryID
    WHERE YEAR(budgets.date) BETWEEN ? AND ?
      AND budgets.prodCatNameID = ?
      AND prodNames.abbreviation = ?
      AND countryList.region = ?
      AND countryList.country = ?
    GROUP BY
      YEAR(budgets.date),
      QUARTER(budgets.date)
    ORDER BY
      YEAR(budgets.date) ASC,
      QUARTER(budgets.date) ASC
  `;

  const salesQuery = `
    SELECT
      quarterlysales.y AS year,
      quarterlysales.Q AS quarter,
      SUM(quarterlysales.quantity) AS quantity
    FROM quarterlysales
    INNER JOIN prodNames
      ON quarterlysales.productName = prodNames.prodNameID
    INNER JOIN countryList
      ON quarterlysales.countryID = countryList.countryID
    WHERE quarterlysales.y BETWEEN ? AND ?
      AND prodNames.prodCatNameID = ?
      AND prodNames.abbreviation = ?
      AND countryList.region = ?
      AND countryList.country = ?
    GROUP BY
      quarterlysales.y,
      quarterlysales.Q
    ORDER BY
      quarterlysales.y ASC,
      quarterlysales.Q ASC
  `;

  const customerQuery = `
    SELECT
      YEAR(quotationsheet.\`from\`) AS year,
      customerList.companyCode AS customer,
      SUM(quotationsheet.quantity) AS quantity
    FROM quotationsheet
    INNER JOIN productList
      ON quotationsheet.productID = productList.productID
    INNER JOIN prodNames
      ON productList.productName = prodNames.prodNameID
    INNER JOIN PODList
      ON quotationsheet.PODID = PODList.PODID
    INNER JOIN countryList
      ON PODList.countryID = countryList.countryID
    INNER JOIN customerList
      ON quotationsheet.customerID = customerList.customerID
    WHERE YEAR(quotationsheet.\`from\`) BETWEEN ? AND ?
      AND quotationsheet.saleComplete = -1
      AND prodNames.prodCatNameID = ?
      AND prodNames.abbreviation = ?
      AND countryList.region = ?
      AND countryList.country = ?
    GROUP BY
      YEAR(quotationsheet.\`from\`),
      customerList.customerID,
      customerList.companyCode
    ORDER BY
      customerList.companyCode ASC,
      year ASC
  `;

  const queryValues = [startYear, endYear, prodcat, product, region, country];

  const buildQuarterSeries = (rows) => {
    const rowsByYear = {};

    rows.forEach((row) => {
      if (!rowsByYear[row.year]) {
        rowsByYear[row.year] = {
          Q1: 0,
          Q2: 0,
          Q3: 0,
          Q4: 0,
        };
      }

      const quarter = Number(row.quarter);

      if (quarter >= 1 && quarter <= 4) {
        rowsByYear[row.year]["Q" + quarter] = Number(row.quantity) || 0;
      }
    });

    const series = [];

    for (let year = endYear; year >= startYear; year -= 1) {
      series.push({
        year: year,
        quarters: rowsByYear[year] || {
          Q1: 0,
          Q2: 0,
          Q3: 0,
          Q4: 0,
        },
      });
    }

    return series;
  };

  const buildCustomerSeries = (rows) => {
    const customersByName = {};

    rows.forEach((row) => {
      if (!customersByName[row.customer]) {
        customersByName[row.customer] = {
          customer: row.customer,
          quantity: 0,
          quantitiesByYear: {},
        };
      }

      const quantity = Number(row.quantity) || 0;

      customersByName[row.customer].quantity += quantity;
      customersByName[row.customer].quantitiesByYear[Number(row.year)] =
        quantity;
    });

    return Object.keys(customersByName)
      .map((customerName) => {
        const customer = customersByName[customerName];
        const years = [];

        for (let year = startYear; year <= endYear; year += 1) {
          years.push({
            year: year,
            quantity: customer.quantitiesByYear[year] || 0,
          });
        }

        return {
          customer: customer.customer,
          quantity: customer.quantity,
          years: years,
        };
      })
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 10);
  };

  db.query(budgetQuery, queryValues, (budgetError, budgetResults) => {
    if (budgetError) {
      console.log(budgetError);

      return res.status(500).json({
        error: "Unable to load budget history",
      });
    }

    db.query(salesQuery, queryValues, (salesError, salesResults) => {
      if (salesError) {
        console.log(salesError);

        return res.status(500).json({
          error: "Unable to load sales history",
        });
      }

      db.query(customerQuery, queryValues, (customerError, customerResults) => {
        if (customerError) {
          console.log(customerError);

          return res.status(500).json({
            error: "Unable to load customer sales history",
          });
        }

        return res.status(200).json({
          budget: buildQuarterSeries(budgetResults),
          sales: buildQuarterSeries(salesResults),
          customers: buildCustomerSeries(customerResults),
        });
      });
    });
  });
});

router.post("/budgeteligibleorigins", (req, res) => {
  const prodNameID = Number(req.body.prodNameID);

  if (!Number.isInteger(prodNameID) || prodNameID <= 0) {
    return res.status(400).json({
      error: "A valid prodNameID is required",
    });
  }

  const query = `
    SELECT DISTINCT
      countryList.countryID,
      countryList.country
    FROM productList
    INNER JOIN supplierlist
      ON productList.supplierID = supplierlist.supplierID
    INNER JOIN countryList
      ON supplierlist.countryID = countryList.countryID
    WHERE productList.productName = ?
    ORDER BY countryList.country ASC
  `;

  db.query(query, [prodNameID], (err, results) => {
    if (err) {
      console.log(err);

      return res.status(500).json({
        error: "Unable to load eligible origins",
      });
    }

    return res.status(200).json(results);
  });
});

router.post("/budgetallocationcustomers", (req, res) => {
  const query = `
    SELECT
      customerID,
      companyCode,
      companyName,
      country
    FROM customerList
    WHERE customerID <> 9999
    ORDER BY companyCode ASC
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.log(err);

      return res.status(500).json({
        error: "Unable to load customers",
      });
    }

    return res.status(200).json(results);
  });
});

router.post("/budgetallocationdetails", (req, res) => {
  const budgetEntryID = String(req.body.budgetEntryID || "").trim();

  if (!/^\d+$/.test(budgetEntryID)) {
    return res.status(400).json({
      error: "A valid budgetEntryID is required",
    });
  }

  const budgetQuery = `
    SELECT
      budgets.budgetentryID AS budgetEntryID,
      budgets.prodNameID,
      budgets.countryID,
      budgets.quantity AS budgetQuantity,
      YEAR(budgets.date) AS year,
      QUARTER(budgets.date) AS quarter,
      prodNames.abbreviation AS product,
      countryList.country
    FROM budgets
    INNER JOIN prodNames
      ON budgets.prodNameID = prodNames.prodNameID
    INNER JOIN countryList
      ON budgets.countryID = countryList.countryID
    WHERE budgets.budgetentryID = ?
  `;

  const allocationsQuery = `
    SELECT
      budgetAllocations.allocationID,
      budgetAllocations.customerID,
      customerList.companyCode AS customer,
      customerList.companyName,
      budgetAllocations.originCountryID,
      countryList.country AS origin,
      budgetAllocations.quantity
    FROM budgetAllocations
    INNER JOIN customerList
      ON budgetAllocations.customerID = customerList.customerID
    INNER JOIN countryList
      ON budgetAllocations.originCountryID = countryList.countryID
    WHERE budgetAllocations.budgetEntryID = ?
    ORDER BY customerList.companyCode, countryList.country
  `;

  db.query(budgetQuery, [budgetEntryID], (budgetErr, budgetResults) => {
    if (budgetErr) {
      console.log(budgetErr);

      return res.status(500).json({
        error: "Unable to load budget entry",
      });
    }

    if (budgetResults.length === 0) {
      return res.status(404).json({
        error: "Budget entry not found",
      });
    }

    db.query(
      allocationsQuery,
      [budgetEntryID],
      (allocationErr, allocationResults) => {
        if (allocationErr) {
          console.log(allocationErr);

          return res.status(500).json({
            error: "Unable to load allocations",
          });
        }

        const budgetQuantity = Number(budgetResults[0].budgetQuantity) || 0;

        const allocatedQuantity = allocationResults.reduce(
          (total, allocation) => {
            return total + (Number(allocation.quantity) || 0);
          },
          0,
        );

        return res.status(200).json({
          budget: budgetResults[0],
          allocations: allocationResults,
          summary: {
            budgetQuantity: budgetQuantity,
            allocatedQuantity: allocatedQuantity,
            remainingQuantity: budgetQuantity - allocatedQuantity,
            complete:
              budgetQuantity > 0 && allocatedQuantity === budgetQuantity,
          },
        });
      },
    );
  });
});

router.post("/savebudgetallocation", requireEditableBudgetEntry, (req, res) => {
  const budgetEntryID = String(req.body.budgetEntryID || "").trim();
  const customerID = Number(req.body.customerID);
  const originCountryID = Number(req.body.originCountryID);
  const quantity = Number(req.body.quantity);

  if (
    !/^\d+$/.test(budgetEntryID) ||
    !Number.isInteger(customerID) ||
    customerID <= 0 ||
    !Number.isInteger(originCountryID) ||
    originCountryID <= 0 ||
    !Number.isFinite(quantity) ||
    quantity <= 0
  ) {
    return res.status(400).json({
      error:
        "Valid budgetEntryID, customerID, originCountryID and quantity are required",
    });
  }

  const validationQuery = `
    SELECT
      budgets.quantity AS budgetQuantity,

      EXISTS(
        SELECT 1
        FROM customerList
        WHERE customerList.customerID = ?
      ) AS validCustomer,

      EXISTS(
        SELECT 1
        FROM productList
        INNER JOIN supplierlist
          ON productList.supplierID = supplierlist.supplierID
        WHERE productList.productName = budgets.prodNameID
          AND supplierlist.countryID = ?
      ) AS validOrigin,

      COALESCE(
        (
          SELECT SUM(budgetAllocations.quantity)
          FROM budgetAllocations
          WHERE budgetAllocations.budgetEntryID =
                budgets.budgetentryID
            AND NOT (
              budgetAllocations.customerID = ?
              AND budgetAllocations.originCountryID = ?
            )
        ),
        0
      ) AS allocatedOther

    FROM budgets
    WHERE budgets.budgetentryID = ?
  `;

  const validationValues = [
    customerID,
    originCountryID,
    customerID,
    originCountryID,
    budgetEntryID,
  ];

  db.query(
    validationQuery,
    validationValues,
    (validationErr, validationResults) => {
      if (validationErr) {
        console.log(validationErr);

        return res.status(500).json({
          error: "Unable to validate allocation",
        });
      }

      if (validationResults.length === 0) {
        return res.status(404).json({
          error: "Budget entry not found",
        });
      }

      const validation = validationResults[0];
      const budgetQuantity = Number(validation.budgetQuantity) || 0;
      const allocatedOther = Number(validation.allocatedOther) || 0;
      const proposedTotal = allocatedOther + quantity;

      if (!validation.validCustomer) {
        return res.status(400).json({
          error: "Selected customer does not exist",
        });
      }

      if (!validation.validOrigin) {
        return res.status(400).json({
          error: "Selected origin is not available for this product",
        });
      }

      if (proposedTotal > budgetQuantity) {
        return res.status(400).json({
          error: "Allocation exceeds the available budget quantity",
          budgetQuantity: budgetQuantity,
          currentlyAllocated: allocatedOther,
          requestedQuantity: quantity,
          proposedTotal: proposedTotal,
          remainingQuantity: budgetQuantity - allocatedOther,
        });
      }

      const saveQuery = `
        INSERT INTO budgetAllocations (
          budgetEntryID,
          customerID,
          originCountryID,
          quantity
        )
        VALUES (?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          quantity = VALUES(quantity)
      `;

      db.query(
        saveQuery,
        [budgetEntryID, customerID, originCountryID, quantity],
        (saveErr) => {
          if (saveErr) {
            console.log(saveErr);

            return res.status(500).json({
              error: "Unable to save allocation",
            });
          }

          return res.status(200).json({
            success: true,
            message: "Budget allocation saved",
            budgetQuantity: budgetQuantity,
            allocatedQuantity: proposedTotal,
            remainingQuantity: budgetQuantity - proposedTotal,
            complete: proposedTotal === budgetQuantity,
          });
        },
      );
    },
  );
});

router.post(
  "/deletebudgetallocation",
  requireEditableBudgetAllocation,
  (req, res) => {
    const allocationID = Number(req.body.allocationID);

    if (!Number.isInteger(allocationID) || allocationID <= 0) {
      return res.status(400).json({
        error: "A valid allocationID is required",
      });
    }

    db.query(
      "DELETE FROM budgetAllocations WHERE allocationID = ?",
      [allocationID],
      (err, results) => {
        if (err) {
          console.log(err);

          return res.status(500).json({
            error: "Unable to delete allocation",
          });
        }

        if (results.affectedRows === 0) {
          return res.status(404).json({
            error: "Allocation not found",
          });
        }

        return res.status(200).json({
          success: true,
          message: "Budget allocation deleted",
        });
      },
    );
  },
);

router.post("/budgetallocationstatuses", (req, res) => {
  const year = Number(req.body.year);
  const prodcat = Number(req.body.prodcat);

  if (!Number.isInteger(year) || !Number.isInteger(prodcat)) {
    return res.status(400).json({
      error: "A valid year and prodcat are required",
    });
  }

  const query = `
    SELECT
      allocationTotals.budgetEntryID,
      allocationTotals.budgetQuantity,
      allocationTotals.allocatedQuantity,
      allocationTotals.budgetQuantity -
        allocationTotals.allocatedQuantity AS remainingQuantity,

      CASE
        WHEN allocationTotals.budgetQuantity <= 0
          THEN 'not-required'

        WHEN allocationTotals.allocatedQuantity =
             allocationTotals.budgetQuantity
          THEN 'complete'

        WHEN allocationTotals.allocatedQuantity >
             allocationTotals.budgetQuantity
          THEN 'over'

        ELSE 'incomplete'
      END AS status

    FROM (
      SELECT
        budgets.budgetentryID AS budgetEntryID,
        COALESCE(budgets.quantity, 0) AS budgetQuantity,
        COALESCE(
          (
            SELECT SUM(budgetAllocations.quantity)
            FROM budgetAllocations
            WHERE budgetAllocations.budgetEntryID =
                  budgets.budgetentryID
          ),
          0
        ) AS allocatedQuantity

      FROM budgets
      WHERE YEAR(budgets.date) = ?
        AND budgets.prodCatNameID = ?
    ) AS allocationTotals
  `;

  db.query(query, [year, prodcat], (err, results) => {
    if (err) {
      console.log(err);

      return res.status(500).json({
        error: "Unable to load allocation statuses",
      });
    }

    return res.status(200).json(results);
  });
});

router.post("/budgetcategoryreadiness", (req, res) => {
  const year = Number(req.body.year);
  const prodCatNameID = Number(req.body.prodCatNameID);

  if (
    !Number.isInteger(year) ||
    !Number.isInteger(prodCatNameID) ||
    prodCatNameID <= 0
  ) {
    return res.status(400).json({
      error: "A valid year and prodCatNameID are required",
    });
  }

  const query = `
    SELECT
      budgets.budgetentryID AS budgetEntryID,
      budgets.prodNameID,
      prodNames.abbreviation AS product,
      budgets.countryID,
      countryList.country,
      QUARTER(budgets.date) AS quarter,
      budgets.quantity AS budgetQuantity,
      COALESCE(SUM(budgetAllocations.quantity), 0)
        AS allocatedQuantity

    FROM budgets

    INNER JOIN prodNames
      ON budgets.prodNameID = prodNames.prodNameID

    INNER JOIN countryList
      ON budgets.countryID = countryList.countryID

    LEFT JOIN budgetAllocations
      ON budgets.budgetentryID =
         budgetAllocations.budgetEntryID

    WHERE YEAR(budgets.date) = ?
      AND budgets.prodCatNameID = ?
      AND budgets.quantity > 0

    GROUP BY
      budgets.budgetentryID,
      budgets.prodNameID,
      prodNames.abbreviation,
      budgets.countryID,
      countryList.country,
      QUARTER(budgets.date),
      budgets.quantity

    ORDER BY
      prodNames.abbreviation,
      countryList.country,
      quarter
  `;

  db.query(query, [year, prodCatNameID], (err, results) => {
    if (err) {
      console.log(err);

      return res.status(500).json({
        error: "Unable to validate the budget category",
      });
    }

    const cells = results.map((cell) => {
      const budgetQuantity = Number(cell.budgetQuantity) || 0;

      const allocatedQuantity = Number(cell.allocatedQuantity) || 0;

      let status = "incomplete";

      if (allocatedQuantity === budgetQuantity) {
        status = "complete";
      } else if (allocatedQuantity > budgetQuantity) {
        status = "over";
      }

      return {
        budgetEntryID: cell.budgetEntryID,
        prodNameID: cell.prodNameID,
        product: cell.product,
        countryID: cell.countryID,
        country: cell.country,
        quarter: Number(cell.quarter),
        budgetQuantity: budgetQuantity,
        allocatedQuantity: allocatedQuantity,
        remainingQuantity: budgetQuantity - allocatedQuantity,
        status: status,
      };
    });

    const incompleteCells = cells.filter((cell) => {
      return cell.status !== "complete";
    });

    return res.status(200).json({
      year: year,
      prodCatNameID: prodCatNameID,

      summary: {
        totalRequiredCells: cells.length,
        completeCells: cells.length - incompleteCells.length,
        incompleteCells: incompleteCells.length,

        ready: cells.length > 0 && incompleteCells.length === 0,
      },

      incompleteCells: incompleteCells,
    });
  });
});

const getAuthenticatedTraderID = (req, res, callback) => {
  const usercode = req.user && req.user.usercode ? req.user.usercode : "";

  if (!usercode) {
    return res.status(401).json({
      error: "Unable to identify the authenticated user",
    });
  }

  db.query(
    `
      SELECT traderID
      FROM traderList
      WHERE tCode = ?
        AND active = 'y'
      LIMIT 1
    `,
    [usercode],
    (err, results) => {
      if (err) {
        console.log(err);

        return res.status(500).json({
          error: "Unable to identify the authenticated user",
        });
      }

      if (results.length === 0) {
        return res.status(403).json({
          error: "The authenticated user is not active",
        });
      }

      callback(results[0].traderID);
    },
  );
};

router.post("/budgetcategorystatus", (req, res) => {
  const year = Number(req.body.year);
  const prodCatNameID = Number(req.body.prodCatNameID);

  if (
    !Number.isInteger(year) ||
    !Number.isInteger(prodCatNameID) ||
    prodCatNameID <= 0
  ) {
    return res.status(400).json({
      error: "A valid year and prodCatNameID are required",
    });
  }

  const query = `
    SELECT
      budgetCategorySubmissions.submissionID,
      budgetCategorySubmissions.budgetYear,
      budgetCategorySubmissions.prodCatNameID,
      prodCatNames.prodCatName,
      budgetCategorySubmissions.status,
      budgetCategorySubmissions.submittedByTraderID,
      CONCAT(
        submittedBy.tName,
        ' ',
        submittedBy.tLastName
      ) AS submittedBy,
      budgetCategorySubmissions.submittedAt,
      budgetCategorySubmissions.reopenedByTraderID,
      CONCAT(
        reopenedBy.tName,
        ' ',
        reopenedBy.tLastName
      ) AS reopenedBy,
      budgetCategorySubmissions.reopenedAt,
      budgetCategorySubmissions.updatedAt

    FROM budgetCategorySubmissions

    INNER JOIN prodCatNames
      ON budgetCategorySubmissions.prodCatNameID =
         prodCatNames.prodCatNameID

    INNER JOIN traderList AS submittedBy
      ON budgetCategorySubmissions.submittedByTraderID =
         submittedBy.traderID

    LEFT JOIN traderList AS reopenedBy
      ON budgetCategorySubmissions.reopenedByTraderID =
         reopenedBy.traderID

    WHERE budgetCategorySubmissions.budgetYear = ?
      AND budgetCategorySubmissions.prodCatNameID = ?
  `;

  db.query(query, [year, prodCatNameID], (err, results) => {
    if (err) {
      console.log(err);

      return res.status(500).json({
        error: "Unable to load category submission status",
      });
    }

    if (results.length === 0) {
      return res.status(200).json({
        budgetYear: year,
        prodCatNameID: prodCatNameID,
        status: "draft",
      });
    }

    return res.status(200).json(results[0]);
  });
});

router.post("/submitbudgetcategory", authenticateToken, (req, res) => {
  const year = Number(req.body.year);
  const prodCatNameID = Number(req.body.prodCatNameID);

  if (
    !Number.isInteger(year) ||
    !Number.isInteger(prodCatNameID) ||
    prodCatNameID <= 0
  ) {
    return res.status(400).json({
      error: "A valid year and prodCatNameID are required",
    });
  }

  const validationQuery = `
      SELECT
        COUNT(*) AS totalRequiredCells,

        COALESCE(
          SUM(
            CASE
              WHEN validationCells.allocatedQuantity =
                   validationCells.budgetQuantity
              THEN 1
              ELSE 0
            END
          ),
          0
        ) AS completeCells

      FROM (
        SELECT
          budgets.budgetentryID,
          budgets.quantity AS budgetQuantity,
          COALESCE(
            SUM(budgetAllocations.quantity),
            0
          ) AS allocatedQuantity

        FROM budgets

        LEFT JOIN budgetAllocations
          ON budgets.budgetentryID =
             budgetAllocations.budgetEntryID

        WHERE YEAR(budgets.date) = ?
          AND budgets.prodCatNameID = ?
          AND budgets.quantity > 0

        GROUP BY
          budgets.budgetentryID,
          budgets.quantity
      ) AS validationCells
    `;

  db.query(
    validationQuery,
    [year, prodCatNameID],
    (validationErr, validationResults) => {
      if (validationErr) {
        console.log(validationErr);

        return res.status(500).json({
          error: "Unable to validate the budget category",
        });
      }

      const totalRequiredCells =
        Number(validationResults[0].totalRequiredCells) || 0;

      const completeCells = Number(validationResults[0].completeCells) || 0;

      const incompleteCells = totalRequiredCells - completeCells;

      if (totalRequiredCells === 0) {
        return res.status(400).json({
          error: "This category has no positive budget quantities to submit",
        });
      }

      if (incompleteCells > 0) {
        return res.status(409).json({
          error: "The category contains incomplete allocations",
          summary: {
            totalRequiredCells: totalRequiredCells,
            completeCells: completeCells,
            incompleteCells: incompleteCells,
            ready: false,
          },
        });
      }

      getAuthenticatedTraderID(req, res, (traderID) => {
        const submissionQuery = `
              INSERT INTO budgetCategorySubmissions (
                budgetYear,
                prodCatNameID,
                status,
                submittedByTraderID,
                submittedAt
              )
              VALUES (?, ?, 'submitted', ?, CURRENT_TIMESTAMP)

              ON DUPLICATE KEY UPDATE
                submittedByTraderID =
                  IF(
                    status = 'reopened',
                    VALUES(submittedByTraderID),
                    submittedByTraderID
                  ),

                submittedAt =
                  IF(
                    status = 'reopened',
                    CURRENT_TIMESTAMP,
                    submittedAt
                  ),

                status = 'submitted'
            `;

        db.query(
          submissionQuery,
          [year, prodCatNameID, traderID],
          (submissionErr) => {
            if (submissionErr) {
              console.log(submissionErr);

              return res.status(500).json({
                error: "Unable to submit the budget category",
              });
            }

            return res.status(200).json({
              success: true,
              message: "Budget category submitted",
              budgetYear: year,
              prodCatNameID: prodCatNameID,
              status: "submitted",
              submittedByTraderID: traderID,
            });
          },
        );
      });
    },
  );
});

router.post("/reopenbudgetcategory", authenticateToken, (req, res) => {
  const year = Number(req.body.year);
  const prodCatNameID = Number(req.body.prodCatNameID);

  if (
    !Number.isInteger(year) ||
    !Number.isInteger(prodCatNameID) ||
    prodCatNameID <= 0
  ) {
    return res.status(400).json({
      error: "A valid year and prodCatNameID are required",
    });
  }

  getAuthenticatedTraderID(req, res, (traderID) => {
    const query = `
          UPDATE budgetCategorySubmissions
          SET
            status = 'reopened',
            reopenedByTraderID = ?,
            reopenedAt = CURRENT_TIMESTAMP
          WHERE budgetYear = ?
            AND prodCatNameID = ?
            AND status = 'submitted'
        `;

    db.query(query, [traderID, year, prodCatNameID], (err, results) => {
      if (err) {
        console.log(err);

        return res.status(500).json({
          error: "Unable to reopen the budget category",
        });
      }

      if (results.affectedRows === 0) {
        return res.status(409).json({
          error: "The category is not currently submitted",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Budget category reopened",
        budgetYear: year,
        prodCatNameID: prodCatNameID,
        status: "reopened",
        reopenedByTraderID: traderID,
      });
    });
  });
});

router.post("/reopenbudgetcategory", authenticateToken, (req, res) => {
  const year = Number(req.body.year);
  const prodCatNameID = Number(req.body.prodCatNameID);

  if (
    !Number.isInteger(year) ||
    !Number.isInteger(prodCatNameID) ||
    prodCatNameID <= 0
  ) {
    return res.status(400).json({
      error: "A valid year and prodCatNameID are required",
    });
  }

  getAuthenticatedTraderID(req, res, (traderID) => {
    const query = `
          UPDATE budgetCategorySubmissions
          SET
            status = 'reopened',
            reopenedByTraderID = ?,
            reopenedAt = CURRENT_TIMESTAMP
          WHERE budgetYear = ?
            AND prodCatNameID = ?
            AND status = 'submitted'
        `;

    db.query(query, [traderID, year, prodCatNameID], (err, results) => {
      if (err) {
        console.log(err);

        return res.status(500).json({
          error: "Unable to reopen the budget category",
        });
      }

      if (results.affectedRows === 0) {
        return res.status(409).json({
          error: "The category is not currently submitted",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Budget category reopened",
        budgetYear: year,
        prodCatNameID: prodCatNameID,
        status: "reopened",
        reopenedByTraderID: traderID,
      });
    });
  });
});

module.exports = router;
