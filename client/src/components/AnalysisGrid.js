import React, { useState, useEffect } from "react";

import "./AnalysisGrid.css";
import { NavLink, Route } from "react-router-dom";

import Lyqsales from "./Lyqsales";
import AVBGrid from "./AVBGrid";

const AnalysisGrid = () => {
  const role = JSON.parse(localStorage.getItem("role"));

  return (
    <div className="analysiscontainer">
      <div className="analysisnav">
        <NavLink activeClassName="navbaractive" to="/analysis/lyqsales" exact>
          Last Year Q Sales
        </NavLink>
        {role === 1 || role === 2 || role === 3 ? (
          <NavLink
            activeClassName="navbaractive"
            to="/analysis/actualvsbudget"
            exact
          >
            Actual vs. Budget
          </NavLink>
        ) : (
          ""
        )}
      </div>
      <div className="gridcontainer analysisgridcontainer">
        <Route path="/analysis/lyqsales">
          <Lyqsales />
        </Route>
        {role === 1 || role === 2 || role === 3 ? (
          <Route path="/analysis/actualvsbudget">
            <AVBGrid />
          </Route>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default AnalysisGrid;
