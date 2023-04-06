import React, { useState, useEffect } from "react";
import Axios from "axios";
import moment from "moment";

const AnalysisLastYSales = ({ userID }) => {
  const [lysales, setLysales] = useState();
  const [groupeddata, setGroupeddata] = useState();

  Array.prototype.groupBy = function (key) {
    return this.reduce(function (groups, item) {
      const val = item[key];
      groups[val] = groups[val] || [];
      groups[val].push(item);
      return groups;
    }, {});
  };
  useEffect(() => {
    let curryear = Number(moment().format("YY")) - 1;
    let currday = moment().format("DD");
    let prevmonth = Number(moment().format("MM")) - 1;
    let nextmonth = Number(moment().format("MM")) + 1;

    let fromdate = moment(prevmonth + "-" + currday + "-" + curryear).format(
      "YYYY-MM"
    );
    let todate = moment(nextmonth + "-" + currday + "-" + curryear).format(
      "YYYY-MM"
    );
    console.log(fromdate);
    console.log(todate);
    Axios.post("/lysales", {
      fromdate: fromdate,
      todate: todate,
      userID: userID,
    }).then((response) => {
      setLysales(response.data);
      const rep = response.data.groupBy("month");
      setGroupeddata(rep);
    });
  }, [userID]);
  var group = "";
  return (
    <div className="lysaleslist">
      <ul className="lysalesdata">
        <li className="lysalesline lysalesheader">
          <p className="lysalescolumn">QSDate</p>
          <p className="lysalescolumn">QSID</p>
          <p className="lysalescolumn">Customer</p>
          <p className="lysalescolumn">Product</p>
          <p className="lysalescolumn lysfig">Quantity</p>
          <p className="lysalescolumn lysfig">Price</p>
          <p className="lysalescolumn lysfig">Profit</p>
          <p className="lysalescolumn">Status</p>
        </li>
        {groupeddata
          ? Object.entries(groupeddata).map((i, key) => {
              group = Object.keys(groupeddata)[key];
              return [
                <h3 className="lysalesmonth">{group}</h3>,

                i[1].map((x) => {
                  return (
                    <li className="lysalesline">
                      <p className="lysalescolumn">{x.QSDate}</p>
                      <p className="lysalescolumn">{x.QSID}</p>
                      <p className="lysalescolumn">{x.customer}</p>
                      <p className="lysalescolumn">{x.abbreviation}</p>
                      <p className="lysalescolumn lysfig">
                        {x.quantity.toFixed(2)}
                      </p>
                      <p className="lysalescolumn lysfig">
                        {"$ " + x.priceBeforeInterest.toFixed(2)}
                      </p>
                      <p className="lysalescolumn lysfig">
                        {"$ " + x.tradingProfit.toFixed(2)}
                      </p>
                      <p className="lysalescolumn">
                        {x.saleComplete == -1 ? "Sale" : "Indication"}
                      </p>
                    </li>
                  );
                }),
              ];
            })
          : ""}
      </ul>
    </div>
  );
};

export default AnalysisLastYSales;
