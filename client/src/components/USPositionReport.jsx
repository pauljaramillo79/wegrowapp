import React, { useContext, useEffect, useState } from "react";
import Axios from "axios";
import moment from "moment";
import "./USPositionReport.css";
import { NavLink } from "react-router-dom";
import { LoadQSContext } from "../contexts/LoadQSProvider";
import USPosMatchingToolTip from "./USPosMatchingToolTip";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import USMktPriceTooltip from "./USMktPriceTooltip";
import { ProfRepContext } from "../contexts/ProfRepProvider";

const USPositionReport = () => {
  const { setQStoload, setLoaduser, setFromdropdown } =
    useContext(LoadQSContext);
  const { mktpricedata } = useContext(ProfRepContext);
  // eslint-disable-next-line no-extend-native
  Array.prototype.groupBy = function (key) {
    return this.reduce(function (groups, item) {
      const val = item[key];
      groups[val] = groups[val] || [];
      groups[val].push(item);
      return groups;
    }, {});
  };

  const [gdata, setGdata] = useState({});

  useEffect(() => {
    Axios.post("/usapositionreport").then((result) => {
      const rep = result.data.groupBy("productGroup");
      setGdata(rep);
      // console.log(rep);
    });
  }, []);

  const storagepmtcalc = (
    whentry,
    stgfix,
    stgvar,
    stggrace,
    stgaccrual,
    qtypal,
    qty
  ) => {
    let daysinwh =
      moment().diff(moment(whentry), "days") > 0
        ? moment().diff(moment(whentry), "days")
        : 0;
    let daysinstg = daysinwh > stggrace ? (daysinwh = stggrace) : 0;
    return (
      stgfix / qty + (Math.ceil(daysinstg / stgaccrual) * stgvar * qtypal) / qty
    );
  };

  const [usposmatchnumber, setUSposmatchnumber] = useState(0);
  const [usqsidmatch, setUsqsidmatch] = useState(0);

  const getUSPosMatchingData = (x) => {
    setUSposmatchnumber(x);
  };

  const currencify = (val, symbol = "$", decim = 2) => {
    return (
      symbol + " " + val.toFixed(decim).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    );
  };

  const handleMktPriceValue = (id) => {
    // console.log(mktpricedata);
    if (mktpricedata) {
      let result = mktpricedata.filter((item) => {
        return item.QSID === id;
      });
      // console.log(result[0]["mktpriceupdate"]);
      if (result[0]) {
        return currencify(result[0]["mktpriceupdate"]);
      } else {
        return "N/A";
      }
    }
    // console.log(mktpricedata);
  };

  const handleMktValue = (id, inv) => {
    if (mktpricedata) {
      let result = mktpricedata.filter((item) => {
        return item.QSID === id;
      });
      // console.log(result[0]["mktpriceupdate"]);
      if (result[0]) {
        return currencify(result[0]["mktpriceupdate"] * inv, "$", 0);
      } else {
        return "N/A";
      }
    }
  };

  const handlePProfit = (id, inv, pr) => {
    if (mktpricedata) {
      let result = mktpricedata.filter((item) => {
        return item.QSID === id;
      });
      // console.log(result[0]["mktpriceupdate"]);
      if (result[0]) {
        return currencify(
          result[0]["mktpriceupdate"] * inv -
            inv * Number(pr.replace(/[^0-9.-]+/g, "")),
          "$",
          0
        );
      } else {
        return "N/A";
      }
    }
  };

  var group = "";
  var prod = {};
  var u = 0;
  var prof = 0;
  var currval = 0;

  return (
    <div className="uspositionreport">
      <table id="uspositionreporttable">
        <thead>
          <tr>
            <th>USWGP</th>
            <th className="fig">Quantity</th>
            <th className="fig">Inventory</th>
            <th>Warehouse</th>
            <th className="fig">EW Price</th>
            <th className="fig">Storage</th>
            <th>Supplier</th>
            <th>From</th>
            <th>To</th>
            <th className="fig">CostValue</th>
            <th className="fig">MktPrice</th>
            <th className="fig">MktValue</th>
            <th className="fig">PProfit</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(gdata).map((i, key) => {
            group = Object.keys(gdata)[key];
            prod = gdata[group].groupBy("product");
            // eslint-disable-next-line no-sparse-arrays
            return [
              <tr>
                <td className="usprodgroup" colSpan={13}>
                  <p>{group}</p>
                </td>
              </tr>,
              Object.entries(prod).map((j, k) => {
                u = 0;
                prof = 0;
                currval = 0;
                return [
                  <tr>
                    <td className="usproduct" colSpan={13}>
                      <h4>{Object.keys(prod)[k]}</h4>
                    </td>
                  </tr>,
                  j[1].map((x) => {
                    u = u + Number(x.Inventory);
                    var res = handlePProfit(x.QSID, x.Inventory, x.EWPrice);
                    prof = prof + Number(res.replace("$", "").replace(",", ""));
                    currval =
                      currval +
                      x.Inventory *
                        (Number(x.EWPrice.replace(/[^0-9.-]+/g, "")) +
                          storagepmtcalc(
                            x.whentry,
                            x.storagefixed,
                            x.storagevariable,
                            x.stggraceperiod,
                            x.stgaccrualperiod,
                            x.quantitypallets,
                            x.quantity
                          ));
                    return (
                      <>
                        <tr>
                          <td>
                            {
                              <div
                                className="postooltipsource"
                                onMouseOver={(e) => {
                                  getUSPosMatchingData(x.USWGP);
                                }}
                                onMouseLeave={(e) => {
                                  setUSposmatchnumber(0);
                                }}
                              >
                                <NavLink
                                  onClick={(e) => {
                                    setFromdropdown(false);
                                    setQStoload(x.QSID);
                                    setLoaduser(x.tCode);
                                  }}
                                  to="/sales"
                                >
                                  {x.USWGP}
                                </NavLink>
                                <USPosMatchingToolTip
                                  usposnumber={x.USWGP}
                                  usposmatchnumber={usposmatchnumber}
                                />
                              </div>
                            }
                          </td>
                          <td className="fig">
                            {x.quantity
                              .toFixed(2)
                              .toString()
                              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                          </td>
                          <td className="fig">
                            {Number(x.Inventory)
                              .toFixed(2)
                              .toString()
                              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                          </td>
                          <td>{x.warehouseName}</td>
                          <td className="fig">
                            {x.EWPrice.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                          </td>
                          <td>
                            {"$" +
                              storagepmtcalc(
                                x.whentry,
                                x.storagefixed,
                                x.storagevariable,
                                x.stggraceperiod,
                                x.stgaccrualperiod,
                                x.quantitypallets,
                                x.quantity
                              ).toFixed(2)}
                          </td>
                          <td>{x.supplier}</td>
                          <td>
                            {moment(x.shipmentStart)
                              .format("DD-MMM-YYYY")
                              .toString()}
                          </td>
                          <td>
                            {moment(x.shipmentEnd)
                              .format("DD-MMM-YYYY")
                              .toString()}
                          </td>
                          <td className="fig">
                            {"$" +
                              (
                                x.Inventory *
                                (Number(x.EWPrice.replace(/[^0-9.-]+/g, "")) +
                                  storagepmtcalc(
                                    x.whentry,
                                    x.storagefixed,
                                    x.storagevariable,
                                    x.stggraceperiod,
                                    x.stgaccrualperiod,
                                    x.quantitypallets,
                                    x.quantity
                                  ))
                              )
                                .toFixed(0)
                                .toString()
                                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                          </td>
                          <td className="mktpriceupdate fig">
                            <FontAwesomeIcon
                              style={{ marginRight: "5px" }}
                              onClick={(e) => {
                                if (x.QSID === usqsidmatch) {
                                  setUsqsidmatch(0);
                                } else {
                                  setUsqsidmatch(x.QSID);
                                }
                              }}
                              name="hi"
                              icon={faPlusCircle}
                            />
                            <USMktPriceTooltip
                              usqsid={x.QSID}
                              usqsidmatch={usqsidmatch}
                              setUsqsidmatch={setUsqsidmatch}
                            />
                            <p>{handleMktPriceValue(x.QSID)} </p>
                          </td>
                          <td className="fig">
                            {handleMktValue(x.QSID, x.Inventory)}
                          </td>
                          <td className="fig">
                            {handlePProfit(x.QSID, x.Inventory, x.EWPrice)}
                          </td>
                        </tr>
                      </>
                    );
                  }),
                  <tr className="totals">
                    <td colSpan={2}>
                      <h4>Total</h4>
                    </td>
                    <td className="fig">
                      <h4>
                        {u
                          .toFixed(2)
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                      </h4>
                    </td>
                    <td colSpan={6}></td>
                    <td className="fig">
                      <h4>{currencify(currval, "$", 0)}</h4>
                    </td>
                    <td colSpan={2}></td>
                    <td className="fig">
                      <h4>{currencify(prof, "$", 0)}</h4>
                    </td>
                  </tr>,
                ];
              }),
            ];
          })}
        </tbody>
      </table>
    </div>
  );
};

export default USPositionReport;
