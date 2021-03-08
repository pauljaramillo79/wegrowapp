import React, { useState } from "react";

export const RefreshPositionsContext = React.createContext();

export const RefreshPositionsProvider = ({ children }) => {
  const [posrefresh, setPosrefresh] = useState(true);
  const togglePosrefresh = (e) => {
    setPosrefresh((prevPosrefresh) => !prevPosrefresh);
  };
  const [QSrefresh, setQSrefresh] = useState(true);
  const toggleQSrefresh = (e) => {
    setQSrefresh((prevQSrefresh) => !prevQSrefresh);
  };

  return (
    <RefreshPositionsContext.Provider
      value={{ posrefresh, togglePosrefresh, QSrefresh, toggleQSrefresh }}
    >
      {children}
    </RefreshPositionsContext.Provider>
  );
};
