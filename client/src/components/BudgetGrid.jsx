import React from "react";
import { NavLink, Route } from "react-router-dom";
import "./BudgetGrid.css";
import Budget2023a from "./Budget2023a";
import Budget2024a from "./Budget2024a";
import Budget2025a from "./Budget2025a";

const BudgetGrid = () => {
  const role = JSON.parse(localStorage.getItem("role"));

  return (
    <div className="budgetcontainer">
      <div className="budgetnav">
        {role === 2 || role === 1 ? (
          <NavLink activeClassName="navbaractive" to="/budget/budget2023" exact>
            2023
          </NavLink>
        ) : (
          ""
        )}
        <NavLink activeClassName="navbaractive" to="/budget/budget2024" exact>
          2024
        </NavLink>
        <NavLink activeClassName="navbaractive" to="/budget/budget2025" exact>
          2025
        </NavLink>
      </div>
      <div className="gridcontainer budgetgridcontainer">
        {role === 2 || role === 1 ? (
          <>
            <Route path="/budget/budget2023">
              <Budget2023a />
            </Route>
            <Route path="/budget/budget2024">
              <Budget2024a />
            </Route>
          </>
        ) : (
          ""
        )}
        <Route path="/budget/budget2025">
          <Budget2025a />
        </Route>
      </div>
    </div>
  );
};

export default BudgetGrid;
