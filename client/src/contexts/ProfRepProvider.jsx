import React, { useState } from "react";
import Axios from "axios";
import { useEffect } from "react";

export const ProfRepContext = React.createContext();

export const ProfRepProvider = ({ children }) => {
  const [mktpricedata, setMktpricedata] = useState();

  useEffect(() => {
    Axios.post("/usmktpriceupdates").then((response) => {
      setMktpricedata(response.data);
    });
  }, []);

  return (
    <ProfRepContext.Provider value={{ mktpricedata, setMktpricedata }}>
      {children}
    </ProfRepContext.Provider>
  );
};
