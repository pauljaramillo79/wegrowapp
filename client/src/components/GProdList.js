import React from "react";

const GProdList = ({ selectedgprods, selectedprodgroup }) => {
  return (
    <div className="selectedprodgroup">
      <h4>{selectedprodgroup}</h4>
      {selectedgprods.map((item) => (
        <p>
          PG: {item.prodGroupID} - {item.abbreviation}
        </p>
      ))}
    </div>
  );
};

export default GProdList;
