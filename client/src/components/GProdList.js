import React, { useState, useEffect } from "react";
import Axios from "axios";

const GProdList = ({
  selectedgprods,
  selectedprodgroup,
  handleProdNameClick,
  updateList,
  addNewProdName,
  addNewProdDetail,
}) => {
  const [selectedproducts, setSelectedproducts] = useState();
  const [prodnameID, setProdnameID] = useState();
  const [prodname, setProdname] = useState();
  const [selectedproddetails, setSelectedproddetails] = useState();

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
      // console.log("called this");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prodnameID, updateList, selectedgprods]);

  const handleProdClick = (nameID) => {
    Axios.post("/selectproducts", { prodnameID: nameID }).then((response) => {
      setSelectedproddetails(response.data);
    });
  };

  return (
    <div className="selectedprods">
      <div className="selectedprodgroup">
        <h4>{selectedprodgroup}</h4>
        {selectedproducts
          ? selectedproducts.map((item) => (
              <p
                name={item.prodNameID}
                className="prodnameadmin"
                onClick={(e) => {
                  e.preventDefault();
                  setProdnameID(item.prodNameID);
                  setProdname(item.abbreviation);
                  handleProdNameClick(item.prodNameID);
                  handleProdClick(item.prodNameID);
                }}
              >
                PG: {item.prodGroupID} - {item.abbreviation}
              </p>
            ))
          : ""}
        {selectedprodgroup ? (
          <p style={{ marginTop: "1rem" }} onClick={addNewProdName}>
            + Add New Prodname
          </p>
        ) : (
          ""
        )}
      </div>
      <div className="selectedproddetails">
        {prodname
          ? [<h4> {prodname} </h4>, <h4> productID - supplier</h4>]
          : ""}
        {selectedproddetails
          ? selectedproddetails.map((item) => (
              <p>
                {item.productID} - {item.companyCode}
              </p>
            ))
          : ""}
        {selectedprodgroup ? (
          <p style={{ marginTop: "1rem" }} onClick={addNewProdDetail}>
            + Add New Product
          </p>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default GProdList;
