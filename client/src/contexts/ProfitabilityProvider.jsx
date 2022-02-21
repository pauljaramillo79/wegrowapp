import React, { useState } from "react";

export const ProfitabilityContext = React.createContext();

export const ProfitabilityProvider = ({ children }) => {
  const [prdata, setPrdata] = useState();
  const [prcustomers, setPrcustomers] = useState();
  const [prcustomerfilter, setPrcustomerfilter] = useState();
  const [prcustomerchecks, setPrcustomerchecks] = useState();
  return (
    <ProfitabilityContext.Provider
      value={{
        prdata,
        setPrdata,
        prcustomers,
        setPrcustomers,
        prcustomerfilter,
        setPrcustomerfilter,
        prcustomerchecks,
        setPrcustomerchecks,
      }}
    >
      {children}
    </ProfitabilityContext.Provider>
  );
};
