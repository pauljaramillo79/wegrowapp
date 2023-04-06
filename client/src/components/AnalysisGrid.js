import React, { useState, useEffect } from "react";

import "./AnalysisGrid.css";
import { NavLink, Route } from "react-router-dom";

import Lyqsales from "./Lyqsales";
import AVBGrid from "./AVBGrid";

const AnalysisGrid = () => {
  return (
    <div className="analysiscontainer">
      <div className="analysisnav">
        <NavLink activeClassName="navbaractive" to="/analysis/lyqsales" exact>
          Last Year Q Sales
        </NavLink>
        <NavLink
          activeClassName="navbaractive"
          to="/analysis/actualvsbudget"
          exact
        >
          Actual vs. Budget
        </NavLink>
      </div>
      <div className="gridcontainer analysisgridcontainer">
        <Route path="/analysis/lyqsales">
          <Lyqsales />
        </Route>
        <Route path="/analysis/actualvsbudget">
          <AVBGrid />
        </Route>
      </div>
    </div>
  );
};

export default AnalysisGrid;
