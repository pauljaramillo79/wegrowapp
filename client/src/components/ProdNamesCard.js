import React, { useState } from "react";
import Axios from "axios";

const ProdNamesCard = ({
  group,
  data,
  handleProductClick,
  handleProdGroupClick,
  setSelectedprodgroupforced,
  setSelectedprodgroupforcedID,
  setNewprodname,
  newprodname,
}) => {
  const forceselectgroup = () => {
    Axios.post("/forceselectgroup", { group }).then((response) => {
      setNewprodname({
        ...newprodname,
        prodgroupID: response.data[0].prodgroupID,
        productGroup: group,
      });
    });
  };

  return (
    <div className="prodgroupcard">
      <h4
        onClick={(e) => {
          e.preventDefault();
          handleProdGroupClick(group);
        }}
      >
        {group}
      </h4>
      {Object.entries(data).map((j, k) => {
        return [
          <p
            className="productlink"
            onClick={(e) => {
              e.preventDefault();
              handleProductClick(Object.keys(data)[k]);
              // setSelectedprodgroupforced(group);

              forceselectgroup();
            }}
          >
            {Object.keys(data)[k]}
          </p>,
        ];
      })}
    </div>
  );
};

export default ProdNamesCard;
