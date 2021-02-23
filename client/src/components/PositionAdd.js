import React from "react";
import "./PositionAdd.css";

const PositionAdd = () => {
  return (
    <div className="positionadd">
      <h3 className="positionaddtitle">Add New Position</h3>
      <form id="positionaddform">
        <input type="text" placeholder="WGP..." />
        <input type="text" placeholder="Quantity..." />
        <input type="text" placeholder="FOB..." />
        <input type="text" placeholder="Supplier..." />
        <input type="text" placeholder="From..." />
        <input type="text" placeholder="To..." />
        <button>Add</button>
      </form>
    </div>
  );
};

export default PositionAdd;
