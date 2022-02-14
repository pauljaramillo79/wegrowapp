import React, { useState } from "react";

export const LoadQSContext = React.createContext();

export const LoadQSProvider = ({ children }) => {
  const [QStoload, setQStoload] = useState();
  const [diffQS, setdiffQS] = useState(true);
  const [loaduser, setLoaduser] = useState();
  const toggleQSload = (e) => {
    setdiffQS((prevdiffQS) => !prevdiffQS);
  };
  const [duplicateBoolean, setDuplicateBoolean] = useState(true);
  const toggleDuplicate = (e) => {
    setDuplicateBoolean((prevduplicateBoolean) => !prevduplicateBoolean);
  };

  return (
    <LoadQSContext.Provider
      value={{
        QStoload,
        setQStoload,
        toggleQSload,
        diffQS,
        toggleDuplicate,
        duplicateBoolean,
        loaduser,
        setLoaduser,
      }}
    >
      {children}
    </LoadQSContext.Provider>
  );
};
