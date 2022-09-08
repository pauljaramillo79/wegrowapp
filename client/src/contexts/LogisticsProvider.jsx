import React, { useState } from "react";

export const LogisticsContext = React.createContext();

export const LogisticsProvider = ({ children }) => {
  const [updateScores, setUpdateScores] = useState(false);
  return (
    <LogisticsContext.Provider value={{ updateScores, setUpdateScores }}>
      {children}
    </LogisticsContext.Provider>
  );
};
