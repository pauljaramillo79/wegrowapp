import React from "react";
import "./Header.css";
import { AuthContext } from "../App";
import { ReactComponent as Logo } from "../assets/_images/logo-simple.svg";

const Header = () => {
  const { state, dispatch } = React.useContext(AuthContext);
  const logoutHandler = (e) => {
    dispatch({
      type: "LOGOUT",
    });
  };
  return (
    <div id="navigation">
      <h2>Dashboard</h2>
      {state.isAuthenticated ? (
        <>
          {" "}
          <div className="welcomemsg">
            <Logo className="Logoheader" />
            <p className="userwelcome">Welcome {state.user}</p>
          </div>
          <button className="logoutButton" onClick={logoutHandler}>
            Logout
          </button>
        </>
      ) : (
        ""
      )}
    </div>
  );
};

export default Header;
