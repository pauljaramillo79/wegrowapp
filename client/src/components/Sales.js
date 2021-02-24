import React, { useEffect } from "react";
import Axios from "axios";
import SalesTableSort from "./SalesTableSort";
import "./Sales.css";

const Sales = () => {
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
      <h3 className="saleslisttitle">Sales List</h3>
      <SalesTableSort config={CONFIG} />{" "}
    </div>
  );
};

export default Sales;
