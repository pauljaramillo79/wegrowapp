import React, { useEffect } from "react";
import PositionsTablesort from "./PositionsTableSort";
import "./Positions.css";
import Axios from "axios";

const Positions = () => {
  useEffect(() => {
    Axios.post("/positions").then((result) => console.log(result.data));
  }, []);
  // CONFIG is passed as a prop to TableSort component. Columns: in CONFIG must match the SQL query in /positions route in routes.js
  var CONFIG = {
    sort: { column: "year", order: "desc" },
    columns: {
      WGP: { name: "WGP", filterText: "", defaultSortOrder: "asc" },
      abbreviation: {
        name: "Product",
        filterText: "",
        defaultSortOrder: "desc",
      },
      companyCode: {
        name: "Supplier",
        filterText: "",
        defaultSortOrder: "desc",
      },
      packaging: { name: "Packaging", filterText: "", defaultSortOrder: "asc" },
      Start: { name: "Start", filterText: "", defaultSortOrder: "asc" },
      End: { name: "End", filterText: "", defaultSortOrder: "asc" },
      FOB: { name: "FOB", filterText: "", defaultSortOrder: "asc" },
      quantity: { name: "Quantity", filterText: "", defaultSortOrder: "asc" },
      year: { name: "Year", filterText: ">=2020", defaultSortOrder: "asc" },
    },
  };
  return (
    <div className="positionslist">
      <h3 className="positionslisttitle">Positions List</h3>
      {/* <PositionsTablesort config={CONFIG} /> */}
    </div>
  );
};

export default Positions;
