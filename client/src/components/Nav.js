import React from "react";
import "./Nav.css";
import { NavLink } from "react-router-dom";
const Nav = () => {
  return (
    <div id="navbarcontainer">
      {/* <button>Management</button>
      <button>Positions</button>
      <button>Sales</button>
      <button>Logistics</button> */}
      <ul id="navbar">
        <li>
          <NavLink activeClassName="navbaractive" to="/management">
            Management
          </NavLink>
        </li>
        <li>
          <NavLink exact activeClassName="navbaractive" to="/">
            Positions
          </NavLink>
        </li>

        <li>
          <NavLink activeClassName="navbaractive" to="/sales">
            Sales
          </NavLink>
        </li>
        <li>
          <NavLink activeClassName="navbaractive" to="/logistics">
            Logistics
          </NavLink>
        </li>
        <li>
          <NavLink activeClassName="navbaractive" to="/admin">
            Admin
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Nav;
