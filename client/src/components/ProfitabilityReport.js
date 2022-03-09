import React, { useState, useEffect, useRef, useContext } from "react";
import Axios from "axios";
import "./ProfitabilityReport.css";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisH } from "@fortawesome/free-solid-svg-icons";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import { faSort } from "@fortawesome/free-solid-svg-icons";
import { faSortDown } from "@fortawesome/free-solid-svg-icons";
import { faSortUp } from "@fortawesome/free-solid-svg-icons";
import { ProfitabilityContext } from "../contexts/ProfitabilityProvider";

const ProfitabilityReport = ({
  reportstartdate,
  reportenddate,
  refreshreport,
  profitreportgroupby,
  prshowdetail,
}) => {
  const {
    prdata,
    prcustomers,
    setPrcustomers,
    setPrcustomerfilter,
    prcustomerfilter,
    setPrcustomerchecks,
    prcustomerchecks,
    prproducts,
    setPrproducts,
    setPrproductfilter,
    prproductfilter,
    setPrproductchecks,
    prproductchecks,
    prpgroupchecks,
    setPrpgroupchecks,
    prpgroups,
    setPrpgroupfilter,
    prpgroupfilter,
  } = useContext(ProfitabilityContext);

  // const [groupsortdata, setGroupsortdata] = useState();

  // useEffect(() => {
  //   // if (prdata) {
  //   //   setGroupsortdata(prdata.groupBy(profitreportgroupby));
  //   // }
  //   console.log("didit");
  // }, [profitreportgroupby, reportstartdate, reportenddate, refreshreport]);

  // const [productlist, setProductlist] = useState();
  // const [prodFilter, setProdFilter] = useState([]);
  // const [prodchecks, setProdchecks] = useState();
  const [showcustomfiltmenu, setShowcustomfiltmenu] = useState(false);
  const [showprodfiltmenu, setShowprodfiltmenu] = useState(false);
  const [showpgroupfiltmenu, setShowpgroupfiltmenu] = useState(false);

  Array.prototype.groupBy = function (key) {
    return this.reduce(function (groups, item) {
      const val = item[key];
      groups[val] = groups[val] || [];
      groups[val].push(item);
      return groups;
    }, {});
  };

  // useEffect(() => {
  //   // console.log(reportdate);
  //   Axios.post("/profitabilityreport", { reportstartdate, reportenddate }).then(
  //     (response) => {
  //       const products = [
  //         ...new Set(response.data.map((item) => item.product)),
  //       ];
  //       setProductlist(products);
  //       setProdFilter(products);
  //       setProdchecks(new Array(products.length).fill(true));
  //     }
  //   );
  // }, [refreshreport]);

  const handleCustomerchange = (e, ind = null, all = false) => {
    let updatedcustomchecks;
    if (ind !== null && all === false) {
      updatedcustomchecks = prcustomerchecks.map((item, index) =>
        index === ind ? !item : item
      );
      setPrcustomerchecks(updatedcustomchecks);
    }
    if (all === true) {
      updatedcustomchecks = prcustomerchecks.map(() => true);
      setPrcustomerchecks(updatedcustomchecks);
    }
    if (ind === null && all === false) {
      updatedcustomchecks = prcustomerchecks.map(() => false);
      setPrcustomerchecks(updatedcustomchecks);
    }
    const updatedcustomfilter = updatedcustomchecks.map((item, index) =>
      item === true ? prcustomers[index] : ""
    );
    const updatedcustomfilterclean = updatedcustomfilter.filter((el) => {
      return el !== "";
    });
    setPrcustomerfilter(updatedcustomfilterclean);
  };

  // useEffect(() => {
  //   let prods;
  //   if (prcustomerfilter && prproductfilter) {
  //     prods = prdata.filter(
  //       (item) =>
  //         prcustomerfilter.includes(item["customer"]) &&
  //         prproductfilter.includes(item["product"])
  //     );
  //     if (prcustomerfilter.length > 0) {
  //       setPrproducts([...new Set(prods.map((item) => item.product))].sort());
  //     }
  //     // setPrcustomers([...new Set(prods.map((item) => item.customer))].sort());
  //     if (prcustomerfilter.length === 0) {
  //       setPrproducts([...new Set(prdata.map((item) => item.product))].sort());
  //       // setPrcustomers(
  //       //   [...new Set(prdata.map((item) => item.customer))].sort()
  //       // );
  //     }
  //   }
  //   console.log(prods);
  // }, [prcustomerfilter, prproductfilter]);

  const handleProdchange = (e, ind = null, all = false) => {
    let updatedprodchecks;
    if (ind !== null && all === false) {
      updatedprodchecks = prproductchecks.map((item, index) =>
        index === ind ? !item : item
      );
      setPrproductchecks(updatedprodchecks);
    }
    if (all === true) {
      updatedprodchecks = prproductchecks.map(() => true);
      setPrproductchecks(updatedprodchecks);
    }
    if (ind === null && all === false) {
      updatedprodchecks = prproductchecks.map(() => false);
      setPrproductchecks(updatedprodchecks);
    }
    const updatedprodfilter = updatedprodchecks.map((item, index) =>
      item === true ? prproducts[index] : ""
    );
    const updatedprodfilterclean = updatedprodfilter.filter((el) => {
      return el !== "";
    });
    setPrproductfilter(updatedprodfilterclean);
  };

  const handlePgroupchange = (e, ind = null, all = false) => {
    let updatedpgroupchecks;
    if (ind !== null && all === false) {
      updatedpgroupchecks = prpgroupchecks.map((item, index) =>
        index === ind ? !item : item
      );
      setPrpgroupchecks(updatedpgroupchecks);
    }
    if (all === true) {
      updatedpgroupchecks = prpgroupchecks.map(() => true);
      setPrpgroupchecks(updatedpgroupchecks);
    }
    if (ind === null && all === false) {
      updatedpgroupchecks = prpgroupchecks.map(() => false);
      setPrpgroupchecks(updatedpgroupchecks);
    }
    const updatedprpgroupfilter = updatedpgroupchecks.map((item, index) =>
      item === true ? prpgroups[index] : ""
    );
    const updatedprpgroupfilterclean = updatedprpgroupfilter.filter((el) => {
      return el !== "";
    });
    setPrpgroupfilter(updatedprpgroupfilterclean);
  };

  function useOutsideAlerter(ref) {
    useEffect(() => {
      /**
       * Alert if clicked on outside of element
       */
      function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          console.log("clicked outside");
          if (showcustomfiltmenu === true) {
            setShowcustomfiltmenu(false);
          }
        }
      }
      // Bind the event listener
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        // Unbind the event listener on clean up
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  }

  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef);

  var group = "";
  var u = 0;
  var v = 0;

  const sumtotal = (data, param) => {
    let totalval = 0;
    for (const x of data) {
      if (
        prcustomerfilter &&
        prcustomerfilter.includes(x["customer"]) &&
        prproductfilter &&
        prproductfilter.includes(x["product"]) &&
        prpgroupfilter &&
        prpgroupfilter.includes(x["productGroup"])
      ) {
        totalval += x[param];
      }
    }
    return totalval;
    // console.log(data[0]);
  };

  const [sortstring, setSortstring] = useState("");
  const [sortord, setSortord] = useState("");

  const handleSort = (e, str) => {
    setSortstring(str);
    if (sortord === "") {
      setSortord("DESC");
    }
    if (sortord === "DESC") {
      setSortord("ASC");
    }
    if (sortord === "ASC") {
      setSortord("");
    }
  };

  const sumvalues = (data, sstr) => {
    let total = 0;
    for (var x of data) {
      total += x[sstr];
    }
    return total;
  };

  return (
    <div className="profitabilityreport">
      <ul>
        <li
          key="profitabilityreportheader"
          className="profitabilityreportline prheader"
        >
          <p
            className="profitabilityreportcolumn"
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              flexBasis: "14%",
            }}
          >
            QSID
          </p>
          <p
            className="profitabilityreportcolumn"
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              flexBasis: "14%",
            }}
          >
            WGP
          </p>
          <p
            className="profitabilityreportcolumn"
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              flexBasis: "14%",
            }}
          >
            WGS
          </p>
          <p
            className="profitabilityreportcolumn "
            style={{
              // position: "relative",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            ShipmentDate
          </p>
          <p className="profitabilityreportcolumn ">Country</p>
          <p
            className="profitabilityreportcolumn "
            style={{
              // position: "relative",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            Customer{" "}
            <FontAwesomeIcon
              className="ellipsis"
              key="icon3"
              style={{ color: "gray", marginLeft: 0 }}
              icon={
                prcustomerchecks &&
                prcustomerchecks.filter(Boolean).length === prcustomers.length
                  ? faEllipsisH
                  : faFilter
              }
              onClick={(e) => {
                setShowcustomfiltmenu(!showcustomfiltmenu);
              }}
            />
            {showcustomfiltmenu ? (
              <div ref={wrapperRef} className="prfiltermenu">
                <p
                  className="prselect"
                  onClick={(e) => handleCustomerchange(e, null, true)}
                >
                  Select All
                </p>
                <p
                  className="prselect"
                  onClick={(e) => handleCustomerchange(e, null, false)}
                >
                  Clear All
                </p>
                {prcustomers
                  ? prcustomers.map((customer, index) => (
                      <div className="prcheckgroup">
                        <input
                          type="checkbox"
                          id={customer}
                          name={customer}
                          value={customer}
                          checked={
                            prcustomerchecks ? prcustomerchecks[index] : true
                          }
                          onChange={(e) => handleCustomerchange(e, index)}
                        />
                        <label for={customer}>{customer}</label>
                      </div>
                    ))
                  : ""}
              </div>
            ) : (
              ""
            )}
          </p>
          <p className="profitabilityreportcolumn">
            ProdGroup{" "}
            <FontAwesomeIcon
              className="ellipsis"
              key="icon3"
              style={{ color: "gray", marginLeft: 0 }}
              icon={
                prpgroupchecks &&
                prpgroupchecks.filter(Boolean).length === prpgroups.length
                  ? faEllipsisH
                  : faFilter
              }
              onClick={(e) => {
                setShowpgroupfiltmenu(!showpgroupfiltmenu);
              }}
            />
            {showpgroupfiltmenu ? (
              <div ref={wrapperRef} className="prfiltermenu">
                <p
                  className="prselect"
                  onClick={(e) => handlePgroupchange(e, null, true)}
                >
                  Select All
                </p>
                <p
                  className="prselect"
                  onClick={(e) => handlePgroupchange(e, null, false)}
                >
                  Clear All
                </p>
                {prpgroups
                  ? prpgroups.map((customer, index) => (
                      <div className="prcheckgroup">
                        <input
                          type="checkbox"
                          id={customer}
                          name={customer}
                          value={customer}
                          checked={
                            prpgroupchecks ? prpgroupchecks[index] : true
                          }
                          onChange={(e) => handlePgroupchange(e, index)}
                        />
                        <label for={customer}>{customer}</label>
                      </div>
                    ))
                  : ""}
              </div>
            ) : (
              ""
            )}
          </p>
          <p className="profitabilityreportcolumn">ProdCat</p>
          <p className="profitabilityreportcolumn ">
            Product
            <FontAwesomeIcon
              className="ellipsis"
              key="icon3"
              style={{ color: "gray", marginLeft: 0 }}
              icon={
                prproductchecks &&
                prproductchecks.filter(Boolean).length === prproducts.length
                  ? faEllipsisH
                  : faFilter
              }
              onClick={(e) => {
                setShowprodfiltmenu(!showprodfiltmenu);
              }}
            />
            {showprodfiltmenu ? (
              <div className="prfiltermenu">
                <p
                  className="prselect"
                  onClick={(e) => handleProdchange(e, null, true)}
                >
                  Select All
                </p>
                <p
                  className="prselect"
                  onClick={(e) => handleProdchange(e, null, false)}
                >
                  Clear All
                </p>
                {prproducts
                  ? prproducts.map((product, index) => (
                      <div className="prcheckgroup">
                        <input
                          type="checkbox"
                          id={product}
                          name={product}
                          value={product}
                          checked={
                            prproductchecks ? prproductchecks[index] : true
                          }
                          onChange={(e) => handleProdchange(e, index)}
                        />
                        <label for={product}>{product}</label>
                      </div>
                    ))
                  : ""}
              </div>
            ) : (
              ""
            )}
          </p>

          <p className="profitabilityreportcolumn prfig">
            Quantity{" "}
            <FontAwesomeIcon
              className="ellipsis"
              key="icon4"
              style={{ color: "gray", marginLeft: 0 }}
              icon={
                sortord === "DESC" && sortstring === "quantity"
                  ? faSortDown
                  : sortord === "ASC" && sortstring === "quantity"
                  ? faSortUp
                  : faSort
              }
              onClick={(e) => {
                handleSort(e, "quantity");
              }}
            />
          </p>
          <p className="profitabilityreportcolumn prfig">Price</p>
          <p className="profitabilityreportcolumn prfig">Profit(pmt)</p>
          <p className="profitabilityreportcolumn prfig">
            Profit{" "}
            <FontAwesomeIcon
              className="ellipsis"
              key="icon4"
              style={{ color: "gray", marginLeft: 0 }}
              icon={
                sortord === "DESC" && sortstring === "profit"
                  ? faSortDown
                  : sortord === "ASC" && sortstring === "profit"
                  ? faSortUp
                  : faSort
              }
              onClick={(e) => {
                handleSort(e, "profit");
              }}
            />
          </p>
        </li>
        {prdata
          ? Object.entries(prdata.groupBy(profitreportgroupby))
              .sort(([, a], [, b]) => {
                if (sortstring !== "" && sortord === "DESC") {
                  return sumvalues(b, sortstring) - sumvalues(a, sortstring);
                } else if (sortstring !== "" && sortord === "ASC") {
                  return sumvalues(a, sortstring) - sumvalues(b, sortstring);
                }
              })
              .map((i, key) => {
                group = Object.keys(
                  Object.fromEntries(
                    Object.entries(prdata.groupBy(profitreportgroupby)).sort(
                      ([, a], [, b]) => {
                        if (sortstring !== "" && sortord === "DESC") {
                          return (
                            sumvalues(b, sortstring) - sumvalues(a, sortstring)
                          );
                        } else if (sortstring !== "" && sortord === "ASC") {
                          return (
                            sumvalues(a, sortstring) - sumvalues(b, sortstring)
                          );
                        }
                      }
                    )
                  )
                )[key];
                // group = Object.keys(prdata.groupBy(profitreportgroupby))[key];
                u = 0;
                v = 0;
                // console.log(
                //   groupsortdata || prdata.groupBy(profitreportgroupby)
                // );
                // console.log(profitabilitydata);
                return [
                  <>
                    {sumtotal(i[1], "quantity") > 0
                      ? [<h3 className="prmonth">{group}</h3>]
                      : ""}
                  </>,
                  i[1].map((x) => {
                    if (
                      prcustomerfilter &&
                      prproductfilter &&
                      prpgroupfilter &&
                      prcustomerfilter.includes(x.customer) &&
                      prproductfilter.includes(x.product) &&
                      prpgroupfilter.includes(x.productGroup)
                    ) {
                      u = u + Number(x.profit);
                      v = v + Number(x.quantity);
                    }
                    return (
                      <li
                        key={x.QSID}
                        className={
                          prshowdetail
                            ? "profitabilityreportline"
                            : "profitabilityreportline prdisplay-none"
                        }
                      >
                        {prcustomerfilter &&
                        prproductfilter &&
                        prpgroupfilter &&
                        prcustomerfilter.includes(x.customer) &&
                        prproductfilter.includes(x.product) &&
                        prpgroupfilter.includes(x.productGroup)
                          ? [
                              <p
                                style={{ flexBasis: "14%" }}
                                className="profitabilityreportcolumn"
                              >
                                {x.QSID}
                              </p>,
                              <p
                                style={{ flexBasis: "14%" }}
                                className="profitabilityreportcolumn"
                              >
                                {x.KTP}
                              </p>,
                              <p
                                style={{ flexBasis: "14%" }}
                                className="profitabilityreportcolumn"
                              >
                                {x.KTS}
                              </p>,

                              <p className="profitabilityreportcolumn">
                                {x.startship} - {x.endship}
                              </p>,
                              <p className="profitabilityreportcolumn">
                                {x.country}
                              </p>,

                              <p className="profitabilityreportcolumn">
                                {x.customer}
                              </p>,
                              <p className="profitabilityreportcolumn">
                                {x.productGroup}
                              </p>,
                              <p className="profitabilityreportcolumn">
                                {x.prodCatName}
                              </p>,

                              <p className="profitabilityreportcolumn">
                                {x.product}
                              </p>,

                              <p className="profitabilityreportcolumn prfig">
                                {x.quantity.toFixed(2)}
                              </p>,
                              <p className="profitabilityreportcolumn prfig">
                                {x.price.toFixed(2)}
                              </p>,
                              <p className="profitabilityreportcolumn prfig">
                                {x ? x.profitpmt.toFixed(2) : ""}
                              </p>,
                              <p className="profitabilityreportcolumn prfig">
                                {x.profit
                                  ? "$" +
                                    x.profit
                                      .toFixed(2)
                                      .toString()
                                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                  : ""}
                              </p>,
                            ]
                          : ""}
                      </li>
                    );
                  }),
                  <div>
                    {sumtotal(i[1], "quantity") > 0
                      ? [
                          <li className="profitabilityreportline">
                            <p
                              style={{ display: "flex", flexBasis: "14%" }}
                              className="profitabilityreportcolumn"
                            ></p>
                            <p
                              style={{ flexBasis: "14%" }}
                              className="profitabilityreportcolumn"
                            ></p>
                            <p
                              style={{ flexBasis: "14%" }}
                              className="profitabilityreportcolumn"
                            ></p>
                            <p className="profitabilityreportcolumn"></p>
                            <p className="profitabilityreportcolumn"></p>
                            <p className="profitabilityreportcolumn"></p>
                            <p className="profitabilityreportcolumn"></p>
                            <p className="profitabilityreportcolumn"></p>
                            <p className="profitabilityreportcolumn"></p>
                            <p className="profitabilityreportcolumn prfig prtotal">
                              {v
                                .toFixed(2)
                                .toString()
                                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                            </p>
                            <p className="profitabilityreportcolumn prfig"></p>
                            <p className="profitabilityreportcolumn prfig"></p>
                            <p className="profitabilityreportcolumn prfig prtotal">
                              {"$" +
                                u
                                  .toFixed(2)
                                  .toString()
                                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                            </p>
                          </li>,
                        ]
                      : ""}
                  </div>,
                ];
              })
          : ""}
      </ul>
    </div>
  );
};

export default ProfitabilityReport;
