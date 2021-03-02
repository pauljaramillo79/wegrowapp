import React, { useState, useEffect, useContext } from "react";
import Axios from "axios";
import { AuthContext } from "../App";
import "./PositionReport.css";
import { RefreshPositionsContext } from "../contexts/RefreshPositionsProvider";

const PositionReport = () => {
  const { state } = useContext(AuthContext);
  const { posrefresh } = useContext(RefreshPositionsContext);
  // Get token values from UseContext and Local Storage
  let accesstoken = state.accesstoken;
  let refreshtoken = JSON.parse(localStorage.getItem("refreshtoken"));
  // Declare custom axios calls for authorization and refreshing token
  const authAxios = Axios.create({
    headers: {
      Authorization: `Bearer ${accesstoken}`,
    },
  });
  const refreshAxios = Axios.create({
    headers: {
      Authorization: `Bearer ${refreshtoken}`,
    },
  });
  // Define interceptor to handle error and refresh access token when appropriate
  authAxios.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      if (refreshtoken && error.response.status === 403) {
        const res = await refreshAxios.post("/refreshtoken");
        accesstoken = res.data.accesstoken;
        return await authAxios.post(
          "/positionreport",
          {},
          {
            headers: {
              Authorization: `Bearer ${accesstoken}`,
            },
          }
        );
      }
      return Promise.reject(error.response);
    }
  );

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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    await authAxios
      .post("/positionreport")
      .then((result) => {
        const rep = result.data.groupBy("productGroup");
        setGdata(rep);
      })
      .catch((error) => console.log(error));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [posrefresh]);
  var u = 0;
  var group = "";
  var prod = {};

  return (
    <div className="positionreport">
      <h3 className="positionreporttitle">Position Report</h3>
      <table id="positionreporttable">
        <thead>
          <tr>
            <th>WGP</th>
            <th className="fig">Quantity</th>
            <th className="fig">Inventory</th>
            <th className="fig">FOB</th>
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
                <td className="prodgroup" colSpan={8}>
                  <p>{group}</p>
                </td>
              </tr>,
              Object.entries(prod).map((j, k) => {
                u = 0;
                return [
                  <tr>
                    <td className="product" colSpan={8}>
                      <h4>{Object.keys(prod)[k]}</h4>
                    </td>
                  </tr>,
                  j[1].map((x) => {
                    u = u + Number(x.Inventory);

                    return (
                      <>
                        <tr>
                          <td>{x.KTP}</td>
                          <td className="fig">
                            {x.quantity
                              .toFixed(2)
                              .toString()
                              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                          </td>
                          <td className="fig">
                            {x.Inventory.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                          </td>
                          <td className="fig">
                            {x.Price.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                          </td>
                          <td>{x.Supplier}</td>
                          <td>{x.Start}</td>
                          <td>{x.End}</td>
                          <td className="fig">
                            {"$" +
                              (
                                x.quantity *
                                Number(x.Price.replace(/[^0-9.-]+/g, ""))
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
                      {u
                        .toFixed(2)
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    </td>
                    <td colSpan={5}></td>
                  </tr>,
                ];
              }),
              ,
            ];
          })}
        </tbody>
      </table>
    </div>
  );
};

export default PositionReport;
