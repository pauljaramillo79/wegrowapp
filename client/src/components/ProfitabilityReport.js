import React, { useState, useEffect } from "react";
import Axios from "axios";
import "./ProfitabilityReport.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisH } from "@fortawesome/free-solid-svg-icons";

const ProfitabilityReport = () => {
  const [profitabilitydata, setProfitabilitydata] = useState();

  const [sortorderr, setSortorderr] = useState({ product: "" });

  Array.prototype.groupBy = function (key) {
    return this.reduce(function (groups, item) {
      const val = item[key];
      groups[val] = groups[val] || [];
      groups[val].push(item);
      return groups;
    }, {});
  };

  useEffect(() => {
    Axios.post("/profitabilityreport").then((response) => {
      const rep = response.data.groupBy("month");
      setProfitabilitydata(rep);
    });
  }, []);

  useEffect(() => {
    // console.log(Object.keys(profitabilitydata));
    if (profitabilitydata) {
      setProfitabilitydata({
        ...profitabilitydata,
        ["January-2021"]: profitabilitydata["January-2021"].sort(function (
          a,
          b
        ) {
          var nameA = a.product.toUpperCase();
          var nameB = b.product.toUpperCase();
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }
          return 0;
        }),
      });
    }
  }, [sortorderr.product]);

  var group = "";
  var u = 0;

  return (
    <div className="profitabilityreport">
      <ul>
        <li className="profitabilityreportline prheader">
          <p className="profitabilityreportcolumn ">
            Date
            <FontAwesomeIcon
              style={{ color: "gray", marginLeft: "1rem" }}
              icon={faEllipsisH}
            />
          </p>
          <p className="profitabilityreportcolumn ">
            Customer{" "}
            <FontAwesomeIcon
              style={{ color: "gray", marginLeft: "1rem" }}
              icon={faEllipsisH}
            />
          </p>
          <p
            className="profitabilityreportcolumn "
            onClick={(e) => {
              setSortorderr({
                ...sortorderr,
                product:
                  sortorderr.product === ""
                    ? "ASC"
                    : sortorderr.product === "ASC"
                    ? "DSC"
                    : "",
              });
              // setProfitabilitydata({
              //   ...profitabilitydata,
              //   January: profitabilitydata["January"].sort(function (a, b) {
              //     var nameA = a.product.toUpperCase();
              //     var nameB = b.product.toUpperCase();
              //     if (nameA < nameB) {
              //       return -1;
              //     }
              //     if (nameA > nameB) {
              //       return 1;
              //     }
              //     return 0;
              //   }),
              // });
            }}
          >
            Product
          </p>
          <p className="profitabilityreportcolumn prfig">Quantity</p>
          <p className="profitabilityreportcolumn prfig">Price</p>
          <p className="profitabilityreportcolumn prfig">Profit(pmt)</p>
          <p className="profitabilityreportcolumn prfig">Profit</p>
        </li>
        {profitabilitydata
          ? Object.entries(profitabilitydata).map((i, key) => {
              group = Object.keys(profitabilitydata)[key];
              u = 0;
              return [
                <h3 className="prmonth">{group}</h3>,
                i[1].map((x) => {
                  u = u + Number(x.profit);
                  return (
                    <li className="profitabilityreportline">
                      <p className="profitabilityreportcolumn">{x.date}</p>
                      <p className="profitabilityreportcolumn">{x.customer}</p>
                      <p className="profitabilityreportcolumn">{x.product}</p>

                      <p className="profitabilityreportcolumn prfig">
                        {x.quantity.toFixed(2)}
                      </p>
                      <p className="profitabilityreportcolumn prfig">
                        {x.price.toFixed(2)}
                      </p>
                      <p className="profitabilityreportcolumn prfig">
                        {x.profitpmt.toFixed(2)}
                      </p>
                      <p className="profitabilityreportcolumn prfig">
                        {"$" +
                          x.profit
                            .toFixed(2)
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                      </p>
                    </li>
                  );
                }),
                <li className="profitabilityreportline">
                  <p className="profitabilityreportcolumn"></p>
                  <p className="profitabilityreportcolumn"></p>
                  <p className="profitabilityreportcolumn"></p>
                  <p className="profitabilityreportcolumn"></p>
                  <p className="profitabilityreportcolumn prfig prtotal">
                    {"$" +
                      u
                        .toFixed(2)
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  </p>
                </li>,
              ];
            })
          : ""}
      </ul>
    </div>
  );
};

export default ProfitabilityReport;
