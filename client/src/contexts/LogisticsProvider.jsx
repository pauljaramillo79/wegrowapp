import React, { useState, useEffect } from "react";
import Axios from "axios";

export const LogisticsContext = React.createContext();

export const LogisticsProvider = ({ children }) => {
  const [opToEdit, setOpToEdit] = useState(0);
  const [opNotes, setOpNotes] = useState();

  useEffect(() => {
    Axios.post("/getopnotes", { QSID: opToEdit }).then((response) => {
      if (Array.isArray(response.data)) {
        setOpNotes(response.data);
      } else {
        setOpNotes([]);
      }
    });
  }, [opToEdit]);

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
      }}
    >
      {children}
    </LogisticsContext.Provider>
  );
};
