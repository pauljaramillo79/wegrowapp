import React, { useState, useEffect } from "react";
import Axios from "axios";
import "./ProfitabilityReport.css";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisH } from "@fortawesome/free-solid-svg-icons";

const ProfitabilityReport = ({ reportstartdate, reportenddate }) => {
  // let currentyear = Number(moment().format("YYYY"));
  // let currentmonth = Number(moment().format("MM"));
  const [profitabilitydata, setProfitabilitydata] = useState();

  // const [reportdate, setReportdate] = useState(
  //   currentyear + "-0" + currentmonth
  // );
  // const [reportdate, setReportdate] = useState(currentyear - 1);

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
    // console.log(reportdate);
    Axios.post("/profitabilityreport", { reportstartdate, reportenddate }).then(
      (response) => {
        const rep = response.data.groupBy("month");
        setProfitabilitydata(rep);
      }
    );
  }, [reportstartdate, reportenddate]);

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
            QSDate
            <FontAwesomeIcon
              style={{ color: "gray", marginLeft: "1rem" }}
              icon={faEllipsisH}
            />
          </p>
          <p className="profitabilityreportcolumn ">
            ShipmentDate
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
              console.log(profitabilitydata);
              return [
                <h3 className="prmonth">{group}</h3>,
                i[1].map((x) => {
                  u = u + Number(x.profit);
                  return (
                    <li className="profitabilityreportline">
                      <p className="profitabilityreportcolumn">{x.date}</p>
                      <p className="profitabilityreportcolumn">
                        {x.startship} - {x.endship}
                      </p>
                      <p className="profitabilityreportcolumn">{x.customer}</p>
                      <p className="profitabilityreportcolumn">{x.product}</p>

                      <p className="profitabilityreportcolumn prfig">
                        {x.quantity.toFixed(2)}
                      </p>
                      <p className="profitabilityreportcolumn prfig">
                        {x.price.toFixed(2)}
                      </p>
                      <p className="profitabilityreportcolumn prfig">
                        {x ? x.profitpmt.toFixed(2) : ""}
                      </p>
                      <p className="profitabilityreportcolumn prfig">
                        {x.profit
                          ? "$" +
                            x.profit
                              .toFixed(2)
                              .toString()
                              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                          : ""}
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
