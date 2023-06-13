import React, { useEffect, useContext, useState } from "react";
import Axios from "axios";
import SalesTableSort from "./SalesTableSort";
import "./Sales.css";
import { ReactComponent as RefreshIcon } from "../assets/_images/refreshicon.svg";
import { RefreshPositionsContext } from "../contexts/RefreshPositionsProvider";
import { LoadQSContext } from "../contexts/LoadQSProvider";

const Sales = (props) => {
  const role = JSON.parse(localStorage.getItem("role"));

  const { toggleQSrefresh } = useContext(RefreshPositionsContext);
  const { loaduser, setLoaduser, QStoload, setFromdropdown } = useContext(
    LoadQSContext
  );
  const [traders, setTraders] = useState();
  const [userID, setUserID] = useState(
    // QStoload && loaduser
    //   ? loaduser
    //   : JSON.parse(localStorage.getItem("WGusercode"))
    loaduser
  );
  const [limit, setLimit] = useState(300);
  const [columns, setColumns] = useState();

  useEffect(() => {
    Axios.post("/traders").then((response) => {
      // console.log(response.data);
      setTraders(response.data);
    });
  }, []);

  // useEffect(() => {
  //   if (QStoload) {
  //     setUserID(loaduser);
  //   }
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
  const clearFilters = (e) => {
    setColumns({
      ...columns,
      QSDate: { ...columns.QSDate, filterText: "" },
      QSID: { ...columns.QSID, filterText: "" },
      saleType: { ...columns.saleType, filterText: "" },
      WGP: { ...columns.WGP, filterText: "" },
      WGS: { ...columns.WGS, filterText: "" },
      abbreviation: { ...columns.abbreviation, filterText: "" },
      supplier: { ...columns.supplie, filterText: "" },
      customer: { ...columns.customer, filterText: "" },
      beginning: { ...columns.beginning, filterText: "" },
      finish: { ...columns.finish, filterText: "" },
      portOfLoad: { ...columns.portOfLoad, filterText: "" },
      portOfDestination: { ...columns.portOfDestination, filterText: "" },
      quantity: { ...columns.quantity, filterText: "" },
      materialCost: { ...columns.materialCost, filterText: "" },
      oFreight: { ...columns.oFreight, filterText: "" },
      priceBeforeInterest: { ...columns.priceBeforeInterest, filterText: "" },
      tradingProfit: { ...columns.tradingProfit, filterText: "" },
      tradingMargin: { ...columns.tradingMargin, filterText: "" },
      percentageMargin: { ...columns.percentageMargin, filterText: "" },
      netback: { ...columns.netback, filterText: "" },
      saleComplete: { ...columns.saleComplete, filterText: "" },
    });
  };
  return (
    <div className="saleslist">
      <div className="salestitleline">
        <h3 className="saleslisttitle">Sales List</h3>
        <button className="clearfilterbutton" onClick={clearFilters}>
          Clear Filters
        </button>
        <select onChange={(e) => setLimit(e.target.value)}>
          <option value={300}>300</option>
          <option value={1000}>1000</option>
          <option value={"no limit"}>no limit</option>
        </select>
        {role === 1 || role === 2 || role === 3 ? (
          <select
            // onClick={(e) => {
            //   console.log("hiya");

            // }}
            onChange={(e) => {
              setFromdropdown(true);
              setLoaduser(e.target.value);
            }}
          >
            <option value="all">All</option>
            {traders
              ? traders.map((trader) => {
                  if (trader.trader === loaduser) {
                    return (
                      <option selected value={trader.trader}>
                        {trader.trader}
                      </option>
                    );
                  } else {
                    return (
                      <option value={trader.trader}>{trader.trader}</option>
                    );
                  }
                })
              : "reload"}
          </select>
        ) : (
          ""
        )}
        <RefreshIcon
          className="refreshicon"
          onClick={(e) => {
            toggleQSrefresh();
          }}
        />
      </div>
      <SalesTableSort
        config={CONFIG}
        userID={loaduser}
        limit={limit}
        showEditModal={props.showEditModal}
        hideEditModal={props.hideEditModal}
        QSmodalState={props.QSmodalState}
        QStoedit={props.QStoedit}
        columns={columns}
        setColumns={setColumns}
      />
    </div>
  );
};

export default Sales;
