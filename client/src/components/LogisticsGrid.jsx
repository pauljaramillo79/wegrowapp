import React, { useEffect, useState, useContext } from "react";
import "./LogisticsGrid.css";
import { NavLink, Route } from "react-router-dom";
import MatchingGrid from "./MatchingGrid";
import InProgress from "./InProgress";
import Axios from "axios";
import { LogisticsContext } from "../contexts/LogisticsProvider";
import MyOperations from "./MyOperations";
// import Chat from "./Chat";

const LogisticsGrid = () => {
  const { updateScores } = useContext(LogisticsContext);
  const [tmcscores, setTmcscores] = useState();

  useEffect(() => {
    Axios.post("/tmcscores").then((response) => {
      setTmcscores(response.data);
    });
  }, [updateScores]);
  return (
    <div className="logcontainer">
      <div className="lognav">
        <NavLink
          className="myoper"
          activeClassName="navbaractive"
          to="/logistics/myoperations"
          exact
        >
          My Operations
        </NavLink>

        <NavLink
          activeClassName="navbaractive"
          to="/logistics/inprogress"
          exact
        >
          In Progress
        </NavLink>
        <NavLink activeClassName="navbaractive" to="/logistics/matching" exact>
          Matching Report
        </NavLink>
        <NavLink activeClassName="navbaractive" to="/logistics/chat" exact>
          Chat
        </NavLink>
        <div className="scores">
          <h4 style={{ marginBottom: "1rem" }}>Scores:</h4>
          {tmcscores
            ? tmcscores.map((item) => {
                return [
                  <div className="score">
                    <p>{item.tCode}</p> <p>{item.totalscore.toFixed(1)}</p>
                  </div>,
                ];
              })
            : ""}
        </div>
      </div>
      <div className="gridcontainer loggridcontainer">
        {/* <Route path="/logistics/myoperations">
          <MyOperations />
        </Route> */}
        <Route path="/logistics/matching">
          <MatchingGrid />
        </Route>
        <Route path="/logistics/inprogress">
          <InProgress />
        </Route>
        {/* <Route path="/logistics/chat">
          <Chat />
        </Route> */}
      </div>
    </div>
  );
};

export default LogisticsGrid;
