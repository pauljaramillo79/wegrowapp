import React, { useState } from "react";
import Axios from "axios";

const ProdNamesCard = ({
  group,
  data,
  handleProductClick,
  handleProdGroupClick,
}) => {
  const [selectedprod, setSelectedprod] = useState();

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
        // prod = Object.keys(data)[k];
        // console.log(Object.entries(data)[k]);
        return [
          <p
            className="productlink"
            //   name={Object.keys(data)[k]}
            // onClick={(e) => {
            //   e.preventDefault();
            //   handleClick(prod);
            // }}
            onClick={(e) => {
              e.preventDefault();
              handleProductClick(Object.keys(data)[k]);
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
