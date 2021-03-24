import React, { useEffect, useContext } from "react";
import PositionsTableSort from "./PositionsTableSort";
import "./Positions.css";
import Axios from "axios";
import { ReactComponent as RefreshIcon } from "../assets/_images/refreshicon.svg";
import { RefreshPositionsContext } from "../contexts/RefreshPositionsProvider";

const Positions = (props) => {
  const { togglePosrefresh } = useContext(RefreshPositionsContext);
  //   useEffect(() => {
  //     Axios.post("/positions").then((result) => console.log(result.data));
  //   }, []);
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
      <div className="positionstitleline">
        <h3 className="positionslisttitle">Positions List</h3>
        <RefreshIcon
          className="refreshicon"
          onClick={(e) => {
            togglePosrefresh();
          }}
        />
      </div>
      <PositionsTableSort
        config={CONFIG}
        showEditModal={props.showEditModal}
        hideEditModal={props.hideEditModal}
        modalState={props.modalState}
        postoedit={props.postoedit}
        key="positionstablesort"
      />
    </div>
  );
};

export default Positions;
