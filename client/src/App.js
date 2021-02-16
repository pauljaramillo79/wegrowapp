import "./App.css";
import React, { useContext, useReducer, createContext } from "react";
import Login from "./components/Login";
import Home from "./components/Home";

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
      localStorage.clear();
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
      <div className="App">{!state.isAuthenticated ? <Login /> : <Home />}</div>
    </AuthContext.Provider>
  );
}

export default App;
