import React, { useState, useEffect } from "react";
import Axios from "axios";

const GProdList = ({
  selectedgprods,
  selectedprodgroup,
  handleProdNameClick,
  updateList,
}) => {
  const [selectedproducts, setSelectedproducts] = useState();
  const [prodnameID, setProdnameID] = useState();

  useEffect(() => {
    Axios.post("/selectgroupedprods", {
      selectedprod: selectedprodgroup,
    }).then((response) => {
      setSelectedproducts(response.data);
    });
    // setSelectedproducts(selectedgprods);
  }, [updateList, selectedgprods]);
  useEffect(async () => {
    if (prodnameID) {
      // await handleProdNameClick(prodnameID);
      // await setSelectedproducts(selectedgprods);

      console.log(prodnameID);
      console.log("called this");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prodnameID, updateList, selectedgprods]);
  return (
    <div className="selectedprodgroup">
      <h4>{selectedprodgroup}</h4>
      {selectedproducts
        ? selectedproducts.map((item) => (
            <p
              className="prodnameadmin"
              onClick={(e) => {
                e.preventDefault();
                setProdnameID(item.prodNameID);
                handleProdNameClick(item.prodNameID);
              }}
              name={item.prodNameID}
            >
              PG: {item.prodGroupID} - {item.abbreviation}
            </p>
          ))
        : ""}
    </div>
  );
};

export default GProdList;
