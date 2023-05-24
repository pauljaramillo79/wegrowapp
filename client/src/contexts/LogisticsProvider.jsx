import React, { useState, useEffect } from "react";
import Axios from "axios";

export const LogisticsContext = React.createContext();

export const LogisticsProvider = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("WGusercode"));

  const [opToEdit, setOpToEdit] = useState(0);
  const [opNotes, setOpNotes] = useState();
  const [opsWithNewNotes, setOpsWithNewNotes] = useState([]);

  useEffect(() => {
    Axios.post("/getopnotes", { QSID: opToEdit }).then((response) => {
      if (Array.isArray(response.data)) {
        setOpNotes(response.data);
      } else {
        setOpNotes([]);
      }
    });
  }, [opToEdit]);

  useEffect(() => {
    Axios.post("/getQSListwithNewMsg", { user: user }).then((response) => {
      if (Array.isArray(response.data)) {
        let newlist = response.data.map((item) => item.QSID);
        setOpsWithNewNotes(newlist);
      }
    });
  }, []);

  const [updateScores, setUpdateScores] = useState(false);
  return (
    <LogisticsContext.Provider
      value={{
        updateScores,
        setUpdateScores,
        opToEdit,
        setOpToEdit,
        opNotes,
        setOpNotes,
        opsWithNewNotes,
        setOpsWithNewNotes,
      }}
    >
      {children}
    </LogisticsContext.Provider>
  );
};
