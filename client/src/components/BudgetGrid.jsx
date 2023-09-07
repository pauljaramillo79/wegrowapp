import React from "react";
import { NavLink, Route } from "react-router-dom";
import "./BudgetGrid.css";
import Budget2023a from "./Budget2023a";
import Budget2024a from "./Budget2024a";

const BudgetGrid = () => {
  return (
    <div className="budgetcontainer">
      <div className="budgetnav">
        <NavLink activeClassName="navbaractive" to="/budget/budget2023" exact>
          2023
        </NavLink>
        <NavLink activeClassName="navbaractive" to="/budget/budget2024" exact>
          2024
        </NavLink>
      </div>
      <div className="gridcontainer budgetgridcontainer">
        <Route path="/budget/budget2023">
          <Budget2023a />
        </Route>
        <Route path="/budget/budget2024">
          <Budget2024a />
        </Route>
      </div>
    </div>
  );
};

export default BudgetGrid;
