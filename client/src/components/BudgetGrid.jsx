import React from "react";
import { NavLink, Route } from "react-router-dom";
import "./BudgetGrid.css";
import Budget2023a from "./Budget2023a";

const BudgetGrid = () => {
  return (
    <div className="budgetcontainer">
      <div className="budgetnav">
        <NavLink activeClassName="navbaractive" to="/budget/budget2023" exact>
          2023
        </NavLink>
      </div>
      <div className="gridcontainer budgetgridcontainer">
        <Route path="/budget/budget2023">
          <Budget2023a />
        </Route>
      </div>
    </div>
  );
};

export default BudgetGrid;
