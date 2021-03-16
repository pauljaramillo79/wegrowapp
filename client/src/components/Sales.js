import React, { useEffect, useContext, useState } from "react";
import Axios from "axios";
import SalesTableSort from "./SalesTableSort";
import "./Sales.css";
import { ReactComponent as RefreshIcon } from "../assets/_images/refreshicon.svg";
import { RefreshPositionsContext } from "../contexts/RefreshPositionsProvider";

const Sales = (props) => {
  const { toggleQSrefresh } = useContext(RefreshPositionsContext);
  const [traders, setTraders] = useState();
  const [userID, setUserID] = useState(
    JSON.parse(localStorage.getItem("WGusercode"))
  );
  useEffect(() => {
    Axios.post("/traders").then((response) => {
      console.log(response.data);
      setTraders(response.data);
    });
  }, []);
  // useEffect(() => {
  //   Axios.post("/sales").then((response) => console.log(response.data));
  // }, []);
  var CONFIG = {
    sort: { column: "QSID", order: "desc" },
    columns: {
      QSDate: { name: "QSDate", filterText: "", defaultSortOrder: "asc" },
      QSID: { name: "QSID", filterText: "", defaultSortOrder: "asc" },
      saleType: { name: "SaleType", filterText: "", defaultSortOrder: "asc" },
      WGP: { name: "WGP", filterText: "", defaultSortOrder: "asc" },
      WGS: { name: "WGS", filterText: "", defaultSortOrder: "asc" },
      abbreviation: {
        name: "Product",
        filterText: "",
        defaultSortOrder: "asc",
      },
      supplier: { name: "Supplier", filterText: "", defaultSortOrder: "asc" },
      customer: { name: "Customer", filterText: "", defaultSortOrder: "asc" },
      beginning: { name: "From", filterText: "", defaultSortOrder: "asc" },
      finish: { name: "To", filterText: "", defaultSortOrder: "asc" },
      portOfLoad: { name: "POL", filterText: "", defaultSortOrder: "asc" },
      portOfDestination: {
        name: "POD",
        filterText: "",
        defaultSortOrder: "asc",
      },
      quantity: { name: "Quantity", filterText: "", defaultSortOrder: "asc" },
      materialCost: { name: "Cost", filterText: "", defaultSortOrder: "asc" },
      oFreight: { name: "Freight", filterText: "", defaultSortOrder: "asc" },
      priceBeforeInterest: {
        name: "SalesPrice",
        filterText: "",
        defaultSortOrder: "asc",
      },
      tradingProfit: {
        name: "Profit",
        filterText: "",
        defaultSortOrder: "asc",
      },
      tradingMargin: {
        name: "TotalProfit",
        filterText: "",
        defaultSortOrder: "asc",
      },
      percentageMargin: {
        name: "Margin",
        filterText: "",
        defaultSortOrder: "asc",
      },
      netback: { name: "Netback", filterText: "", defaultSortOrder: "asc" },
      saleComplete: { name: "Status", filterText: "", defaultSortOrder: "asc" },
    },
  };
  return (
    <div className="saleslist">
      <div className="salestitleline">
        <h3 className="saleslisttitle">Sales List</h3>
        <select onChange={(e) => setUserID(e.target.value)}>
          <option value="all">All</option>
          {traders
            ? traders.map((trader) => {
                if (trader.trader === userID) {
                  return (
                    <option selected value={trader.trader}>
                      {trader.trader}
                    </option>
                  );
                } else {
                  return <option value={trader.trader}>{trader.trader}</option>;
                }
              })
            : "reload"}
        </select>
        <RefreshIcon
          className="refreshicon"
          onClick={(e) => {
            toggleQSrefresh();
          }}
        />
      </div>
      <SalesTableSort
        config={CONFIG}
        userID={userID}
        showEditModal={props.showEditModal}
        hideEditModal={props.hideEditModal}
        QSmodalState={props.QSmodalState}
        QStoedit={props.QStoedit}
      />{" "}
    </div>
  );
};

export default Sales;
