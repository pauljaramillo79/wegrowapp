import React, { useState } from "react";

export const RefreshPositionsContext = React.createContext();

export const RefreshPositionsProvider = ({ children }) => {
  const [posrefresh, setPosrefresh] = useState(true);
  const togglePosrefresh = (e) => {
    setPosrefresh((prevPosrefresh) => !prevPosrefresh);
  };

  return (
    <RefreshPositionsContext.Provider value={{ posrefresh, togglePosrefresh }}>
      {children}
    </RefreshPositionsContext.Provider>
  );
};
