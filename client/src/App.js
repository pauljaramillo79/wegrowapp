import "./App.css";
import React, { useReducer, createContext } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Login from "./components/Login";
import Home from "./components/Home";
import SalesGrid from "./components/SalesGrid";
import Header from "./components/Header";
import PositionsGrid from "./components/PositionsGrid";
import Register from "./components/Register";
import Nav from "./components/Nav";

export const AuthContext = createContext();

const initialState = {
  isAuthenticated: JSON.parse(localStorage.getItem("isAuthenticated")) || false,
  user: JSON.parse(localStorage.getItem("user")) || null,
  accesstoken: null,
  refreshtoken: JSON.parse(localStorage.getItem("refreshtoken")) || null,
};
const reducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      localStorage.setItem(
        "refreshtoken",
        JSON.stringify(action.payload.refreshtoken)
      );
      localStorage.setItem("isAuthenticated", true);
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        refreshtoken: action.payload.refreshtoken,
        accesstoken: action.payload.accesstoken,
      };
    case "LOGOUT":
      localStorage.removeItem("user");
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("refreshtoken");
      // localStorage.clear();
      return {
        ...state,
        isAuthenticated: false,
        user: null,
      };
    // case "REFRESHTOKEN":
    //   console.log(action.payload.accesstoken);
    //   return {
    //     ...state,
    //     accesstoken: action.payload.accesstoken,
    //   };
    default:
      return;
  }
};
function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      <div className="App">
        {!state.isAuthenticated ? (
          <Login />
        ) : (
          <>
            <Header />
            <Router>
              <Nav />
              <Switch>
                <Route exact path="/">
                  <PositionsGrid />
                </Route>
                <Route path="/sales">
                  <SalesGrid />
                </Route>
              </Switch>
            </Router>
          </>
        )}
      </div>
    </AuthContext.Provider>
  );
}

export default App;
