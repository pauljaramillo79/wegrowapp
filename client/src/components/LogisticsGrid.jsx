import React from "react";
import "./LogisticsGrid.css";
import { NavLink, Route } from "react-router-dom";
import MatchingGrid from "./MatchingGrid";

const LogisticsGrid = () => {
  return (
    <div className="logcontainer">
      <div className="lognav">
        <NavLink activeClassName="navbaractive" to="/logistics/matching" exact>
          Matching Report
        </NavLink>
      </div>
      <div className="gridcontainer loggridcontainer">
        <Route path="/logistics/matching">
          <MatchingGrid />
        </Route>
      </div>
    </div>
  );
};

export default LogisticsGrid;
