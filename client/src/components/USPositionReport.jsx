import React, { useEffect, useState } from "react";
import Axios from "axios";
import moment from "moment";
import "./USPositionReport.css";

const USPositionReport = () => {
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
      console.log(rep);
    });
  }, []);

  var group = "";
  var prod = {};
  var u = 0;

  return (
    <div className="uspositionreport">
      <table id="uspositionreporttable">
        <thead>
          <tr>
            <th>USWGP</th>
            <th className="fig">Quantity</th>
            <th className="fig">Inventory</th>
            <th className="fig">EW Price</th>
            <th>Supplier</th>
            <th>From</th>
            <th>To</th>
            <th className="fig">Value</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(gdata).map((i, key) => {
            group = Object.keys(gdata)[key];
            prod = gdata[group].groupBy("product");
            // eslint-disable-next-line no-sparse-arrays
            return [
              <tr>
                <td className="usprodgroup" colSpan={8}>
                  <p>{group}</p>
                </td>
              </tr>,
              Object.entries(prod).map((j, k) => {
                u = 0;
                return [
                  <tr>
                    <td className="usproduct" colSpan={8}>
                      <h4>{Object.keys(prod)[k]}</h4>
                    </td>
                  </tr>,
                  j[1].map((x) => {
                    u = u + Number(x.Inventory);
                    return (
                      <>
                        <tr>
                          <td>{x.USWGP}</td>
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
                          <td className="fig">
                            {x.EWPrice.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
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
                                x.quantity *
                                Number(x.EWPrice.replace(/[^0-9.-]+/g, ""))
                              )
                                .toFixed(0)
                                .toString()
                                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
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
                    <td colSpan={5}></td>
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
