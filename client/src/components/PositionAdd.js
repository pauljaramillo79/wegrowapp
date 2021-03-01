import React, { useState } from "react";
import "./PositionAdd.css";
import SearchField from "./SearchField";

const PositionAdd = () => {
  const postoaddInit = {
    WGP: "",
    product: "",
    supplier: "",
    quantitylow: "",
    quantityhigh: "",
    FOB: "",
    from: "",
    to: "",
  };

  const [postoadd, setPostoadd] = useState(postoaddInit);
  const handlePosChange = (e) => {
    e.preventDefault();
    setPostoadd({
      ...postoadd,
      [e.target.name]: e.target.value,
    });
    console.log(postoadd);
  };
  const setProdSupplier = (prodID, supplierID) => {
    setPostoadd({
      ...postoadd,
      product: prodID,
      supplier: supplierID,
    });
  };
  return (
    <div className="positionadd">
      <h3 className="positionaddtitle">Add New Position</h3>
      <form id="positionaddform">
        <div className="form-group">
          <label htmlFor="">WGP:</label>
          <input
            name="WGP"
            value={postoadd.WGP}
            type="text"
            onChange={handlePosChange}
            placeholder="WGP..."
          />
        </div>
        <div className="form-group">
          <label htmlFor="">Product:</label>
          <SearchField
            className="searchfield"
            searchURL={"/productlist"}
            searchName={"abbreviation"}
            searchID={"productID"}
            otherName={"companyCode"}
            otherID={"supplierID"}
            placeholder={"Product..."}
            setProdSupplier={setProdSupplier}
          />
        </div>
        {/* <div className="form-group">
          <label htmlFor="">Supplier:</label>
          <input readOnly placeholder="Supplier..." value={postoadd.supplier} />
        </div> */}
        <div className="form-group">
          <label htmlFor="">QuantityL:</label>
          <input
            name="quantitylow"
            type="text"
            placeholder="Quantity Low..."
            onChange={handlePosChange}
            value={postoadd.quantitylow}
          />
        </div>
        <div className="form-group">
          <label htmlFor="">QuantityH:</label>
          <input
            name="quantityhigh"
            type="text"
            placeholder="Quantity High..."
            onChange={handlePosChange}
            value={postoadd.quantityhigh}
          />
        </div>
        <div className="form-group">
          <label htmlFor="">FOB:</label>
          <input
            type="text"
            name="FOB"
            placeholder="FOB..."
            onChange={handlePosChange}
            value={postoadd.FOB}
          />
        </div>
        <div className="form-group">
          <label htmlFor="">From:</label>
          <input
            name="from"
            type="date"
            placeholder="From..."
            onChange={handlePosChange}
            value={postoadd.from}
          />
        </div>
        <div className="form-group">
          <label htmlFor="">To:</label>
          <input
            name="to"
            type="date"
            placeholder="To..."
            onChange={handlePosChange}
            value={postoadd.to}
          />
        </div>
        <button>Add</button>
      </form>
    </div>
  );
};

export default PositionAdd;
