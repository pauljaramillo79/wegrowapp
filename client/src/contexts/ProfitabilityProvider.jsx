import React, { useState } from "react";

export const ProfitabilityContext = React.createContext();

export const ProfitabilityProvider = ({ children }) => {
  const [prdata, setPrdata] = useState();
  const [prcustomers, setPrcustomers] = useState();
  const [prcustomerfilter, setPrcustomerfilter] = useState();
  const [prcustomerchecks, setPrcustomerchecks] = useState();
  const [prproducts, setPrproducts] = useState();
  const [prproductfilter, setPrproductfilter] = useState();
  const [prproductchecks, setPrproductchecks] = useState();
  const [prpgroups, setPrpgroups] = useState();
  const [prpgroupfilter, setPrpgroupfilter] = useState();
  const [prpgroupchecks, setPrpgroupchecks] = useState();
  const [prprodcats, setPrprodcats] = useState();
  const [prprodcatfilter, setPrprodcatfilter] = useState();
  const [prprodcatchecks, setPrprodcatchecks] = useState();
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
        prproducts,
        setPrproducts,
        prproductfilter,
        setPrproductfilter,
        prproductchecks,
        setPrproductchecks,
        prpgroups,
        setPrpgroups,
        prpgroupfilter,
        setPrpgroupfilter,
        prpgroupchecks,
        setPrpgroupchecks,
        prprodcats,
        setPrprodcats,
        prprodcatfilter,
        setPrprodcatfilter,
        prprodcatchecks,
        setPrprodcatchecks,
      }}
    >
      {children}
    </ProfitabilityContext.Provider>
  );
};
