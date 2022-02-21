import React, { useState, useEffect, useRef, useContext } from "react";
import Axios from "axios";
import "./ProfitabilityReport.css";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisH } from "@fortawesome/free-solid-svg-icons";
import { ProfitabilityContext } from "../contexts/ProfitabilityProvider";

const ProfitabilityReport = ({
  reportstartdate,
  reportenddate,
  refreshreport,
  profitreportgroupby,
}) => {
  const {
    prdata,
    prcustomers,
    setPrcustomerfilter,
    prcustomerfilter,
    setPrcustomerchecks,
    prcustomerchecks,
  } = useContext(ProfitabilityContext);

  const [productlist, setProductlist] = useState();
  const [prodFilter, setProdFilter] = useState([]);
  const [prodchecks, setProdchecks] = useState();
  const [showcustomfiltmenu, setShowcustomfiltmenu] = useState(false);
  const [showprodfiltmenu, setShowprodfiltmenu] = useState(false);

  Array.prototype.groupBy = function (key) {
    return this.reduce(function (groups, item) {
      const val = item[key];
      groups[val] = groups[val] || [];
      groups[val].push(item);
      return groups;
    }, {});
  };

  useEffect(() => {
    // console.log(reportdate);
    Axios.post("/profitabilityreport", { reportstartdate, reportenddate }).then(
      (response) => {
        const products = [
          ...new Set(response.data.map((item) => item.product)),
        ];
        setProductlist(products);
        setProdFilter(products);
        setProdchecks(new Array(products.length).fill(true));
      }
    );
  }, [refreshreport]);

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

  const handleProdchange = (e, ind = null, all = false) => {
    let updatedprodchecks;
    if (ind !== null && all === false) {
      updatedprodchecks = prodchecks.map((item, index) =>
        index === ind ? !item : item
      );
      setProdchecks(updatedprodchecks);
    }
    if (all === true) {
      updatedprodchecks = prodchecks.map(() => true);
      setProdchecks(updatedprodchecks);
    }
    if (ind === null && all === false) {
      updatedprodchecks = prodchecks.map(() => false);
      setProdchecks(updatedprodchecks);
    }
    const updatedprodfilter = updatedprodchecks.map((item, index) =>
      item === true ? productlist[index] : ""
    );
    const updatedprodfilterclean = updatedprodfilter.filter((el) => {
      return el !== "";
    });
    setProdFilter(updatedprodfilterclean);
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
      if (prcustomerfilter && prcustomerfilter.includes(x["customer"])) {
        totalval += x[param];
      }
    }
    return totalval;
    // console.log(data[0]);
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
            }}
          >
            QSDate
            <FontAwesomeIcon
              key="icon1"
              style={{ color: "gray", marginLeft: 0 }}
              icon={faEllipsisH}
            />
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
            <FontAwesomeIcon
              key="icon2"
              style={{ color: "gray", marginLeft: 0 }}
              icon={faEllipsisH}
            />
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
            Customer{" "}
            <FontAwesomeIcon
              className="ellipsis"
              key="icon3"
              style={{ color: "gray", marginLeft: 0 }}
              icon={faEllipsisH}
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
          <p className="profitabilityreportcolumn prfig">Product Group</p>
          <p className="profitabilityreportcolumn prfig">Prod Category</p>
          <p className="profitabilityreportcolumn ">
            Product
            <FontAwesomeIcon
              className="ellipsis"
              key="icon3"
              style={{ color: "gray", marginLeft: 0 }}
              icon={faEllipsisH}
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
                {productlist
                  ? productlist.map((product, index) => (
                      <div className="prcheckgroup">
                        <input
                          type="checkbox"
                          id={product}
                          name={product}
                          value={product}
                          checked={prodchecks ? prodchecks[index] : true}
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

          <p className="profitabilityreportcolumn prfig">Quantity</p>
          <p className="profitabilityreportcolumn prfig">Price</p>
          <p className="profitabilityreportcolumn prfig">Profit(pmt)</p>
          <p className="profitabilityreportcolumn prfig">Profit</p>
        </li>
        {prdata
          ? Object.entries(prdata.groupBy(profitreportgroupby)).map(
              (i, key) => {
                // console.log(i[1]);

                group = Object.keys(prdata.groupBy(profitreportgroupby))[key];
                u = 0;
                v = 0;

                // console.log(profitabilitydata);
                return [
                  <h3 className="prmonth">
                    {group}
                    {/* {sumtotal(i[1], "quantity")} */}
                  </h3>,
                  i[1].map((x) => {
                    if (
                      prcustomerfilter &&
                      prcustomerfilter.includes(x.customer) &&
                      prodFilter.includes(x.product)
                    ) {
                      u = u + Number(x.profit);
                      v = v + Number(x.quantity);
                    }
                    return (
                      <li key={x.QSID} className="profitabilityreportline">
                        {prcustomerfilter &&
                        prcustomerfilter.includes(x.customer) &&
                        prodFilter.includes(x.product)
                          ? [
                              <p className="profitabilityreportcolumn">
                                {x.date}
                              </p>,

                              <p className="profitabilityreportcolumn">
                                {x.startship} - {x.endship}
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
                  <li className="profitabilityreportline">
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
                ];
              }
            )
          : ""}
      </ul>
    </div>
  );
};

export default ProfitabilityReport;
