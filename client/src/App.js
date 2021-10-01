import "./App.css";
import React, { useReducer, createContext } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Login from "./components/Login";
import Home from "./components/Home";
import SalesGrid from "./components/SalesGrid";
import SalesGrid2 from "./components/SalesGrid2";
import Header from "./components/Header";
import PositionsGrid from "./components/PositionsGrid";
import Register from "./components/Register";
import Nav from "./components/Nav";
import { RefreshPositionsProvider } from "./contexts/RefreshPositionsProvider";
import ManagementGrid from "./components/ManagementGrid";
import Admin from "./components/Admin";
import SunburstData from "./components/SunburstData";
import AnalysisGrid from "./components/AnalysisGrid";
import { LoadQSProvider } from "./contexts/LoadQSProvider";

// Export Auth Context to be used in Login.js
export const AuthContext = createContext();

// Define initial state vlues when opening app. Grab values from local storage if available otherwise set to default unlogged values.
const initialState = {
  isAuthenticated: JSON.parse(localStorage.getItem("isAuthenticated")) || false,
  user: JSON.parse(localStorage.getItem("user")) || null,
  accesstoken: null,
  refreshtoken: JSON.parse(localStorage.getItem("refreshtoken")) || null,
};

// Reducer that tells app what to do when LOGOUT and LOGIN cases are called from other components
const reducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      // When successful Login, this sets values for user, WGusercode, WGuserID, refreshtoken, accesstoken, isAuthenticated and role
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      localStorage.setItem(
        "WGusercode",
        JSON.stringify(action.payload.usercode)
      );
      localStorage.setItem("WGuserID", JSON.stringify(action.payload.userID));
      localStorage.setItem(
        "refreshtoken",
        JSON.stringify(action.payload.refreshtoken)
      );
      localStorage.setItem(
        "accesstoken",
        JSON.stringify(action.payload.accesstoken)
      );
      localStorage.setItem("isAuthenticated", true);
      localStorage.setItem("role", action.payload.role);
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        usercode: action.payload.usercode,
        refreshtoken: action.payload.refreshtoken,
        accesstoken: action.payload.accesstoken,
      };
    case "LOGOUT":
      // when successful Logout, this removes all auth values from local storage
      localStorage.removeItem("user");
      localStorage.removeItem("WGusercode");
      localStorage.removeItem("WGuserID");
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("refreshtoken");
      localStorage.removeItem("accesstoken");
      localStorage.removeItem("role");
      localStorage.removeItem("rgl-mgmt");
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
    <LoadQSProvider>
      <RefreshPositionsProvider>
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
                    <Route path="/sales2">
                      <SalesGrid2 />
                    </Route>
                    <Route path="/management">
                      <ManagementGrid />
                    </Route>
                    <Route path="/admin">
                      <Admin />
                    </Route>
                    <Route path="/analysis">
                      <AnalysisGrid />
                    </Route>
                  </Switch>
                </Router>
              </>
            )}
          </div>
        </AuthContext.Provider>
      </RefreshPositionsProvider>
    </LoadQSProvider>
  );
}

export default App;
