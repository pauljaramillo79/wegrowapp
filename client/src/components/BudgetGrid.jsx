import React, { useState } from "react";
import { NavLink, Route } from "react-router-dom";
import "./BudgetGrid.css";
import Budget from "./Budget";

const BudgetGrid = () => {
  const role = JSON.parse(localStorage.getItem("role"));
  const [showBudgetNav, setShowBudgetNav] = useState(false);

  const availableYears =
    role === 1 || role === 2 ? [2023, 2024, 2025, 2026, 2027] : [2026, 2027];

  const toggleBudgetNav = () => {
    setShowBudgetNav((current) => !current);
  };

  return (
    <div
      className={
        showBudgetNav
          ? "budgetcontainer budgetcontainer--nav-open"
          : "budgetcontainer"
      }
    >
      <aside
        id="budget-year-navigation"
        className={showBudgetNav ? "budgetnav budgetnav--open" : "budgetnav"}
        aria-label="Budget years"
      >
        <button
          className="budgetnav-toggle"
          type="button"
          aria-controls="budget-year-navigation"
          aria-expanded={showBudgetNav}
          aria-label={showBudgetNav ? "Hide budget years" : "Show budget years"}
          onClick={toggleBudgetNav}
        >
          <span aria-hidden="true">{showBudgetNav ? "‹" : "›"}</span>

          <span className="budgetnav-toggle__text">Years</span>
        </button>

        {availableYears.map((year) => {
          return (
            <NavLink
              key={year}
              activeClassName="navbaractive"
              to={"/budget/budget" + year}
              exact
              tabIndex={showBudgetNav ? 0 : -1}
            >
              {year}
            </NavLink>
          );
        })}
      </aside>

      <div className="gridcontainer budgetgridcontainer">
        <Route
          exact
          path="/budget/budget:year"
          render={({ match }) => {
            const selectedYear = Number(match.params.year);

            if (availableYears.indexOf(selectedYear) === -1) {
              return null;
            }

            return <Budget key={selectedYear} year={selectedYear} />;
          }}
        />
      </div>
    </div>
  );
};

export default BudgetGrid;
