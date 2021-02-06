import React, { useContext } from "react";
import { AuthContext } from "../App";

const Home = () => {
  const { state, dispatch } = useContext(AuthContext);
  const logoutHandler = (e) => {
    dispatch({
      type: "LOGOUT",
    });
  };
  return (
    <div>
      <h2>Welcome {state.user}</h2>
      {state.isAuthenticated ? (
        <button onClick={logoutHandler}>Log Out</button>
      ) : (
        ""
      )}
    </div>
  );
};

export default Home;
