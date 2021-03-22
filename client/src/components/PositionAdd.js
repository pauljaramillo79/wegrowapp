import React, { useState, useContext } from "react";
import "./PositionAdd.css";
import SearchField from "./SearchField";
import { RefreshPositionsContext } from "../contexts/RefreshPositionsProvider";
import Axios from "axios";

const PositionAdd = () => {
  const { posrefresh, togglePosrefresh } = useContext(RefreshPositionsContext);
  const posDataInit = {
    WGP: "",
    product: "",
    supplier: "",
    productgroup: "",
    quantitylow: "",
    quantityhigh: "",
    FOB: "",
    from: "",
    to: "",
    notes: "",
  };
  const posValuesInit = {
    WGP: "",
    product: "",
    supplier: "",
    productgroup: "",
    quantitylow: "",
    quantityhigh: "",
    FOB: "",
    from: "",
    to: "",
    notes: "",
  };
  const posaddErrorsInit = {
    WGP: "",
    quantitylow: "",
    quantityhigh: "",
    to: "",
    general: "",
  };
  const [resetfield, setResetfield] = useState(true);
  const [posData, setPosData] = useState(posDataInit);
  const [posValues, setPosValues] = useState(posValuesInit);
  const [posaddErrors, setPosaddErrors] = useState(posaddErrorsInit);
  const handlePosChange = (e) => {
    e.preventDefault();
    setPosaddErrors({
      ...posaddErrors,
      WGP: "",
      general: "",
    });
    setPosData({
      ...posData,
      [e.target.name]: e.target.value,
    });
    // console.log(postoadd);
  };
  const setProdSupplier = (
    prodID,
    prodName,
    supplierID,
    supplierName,
    prodgroupID,
    productGroup
  ) => {
    setPosData({
      ...posData,
      product: prodID,
      supplier: supplierID,
      productgroup: prodgroupID,
    });
    setPosValues({
      ...posValues,
      product: prodName,
      supplier: supplierName,
      productgroup: productGroup,
    });
  };
  const handlePosAddValidation = (e) => {
    const field = e.target.name;
    const value = e.target.value;
    const validNumber = RegExp("^-?[0-9][0-9,.]+$");
    switch (field) {
      case "quantitylow":
        if (!validNumber.test(value)) {
          setPosaddErrors({
            ...posaddErrors,
            [field]: "Only numerical values.",
          });
        } else if (Number(posData.quantityhigh) < Number(posData.quantitylow)) {
          setPosaddErrors({
            ...posaddErrors,
            [field]: "QuantityL must be equal or smaller than QuantityH.",
          });
        } else {
          setPosaddErrors({ ...posaddErrors, [field]: "", quantityhigh: "" });
        }
        break;
      case "quantityhigh":
        if (!validNumber.test(value)) {
          setPosaddErrors({
            ...posaddErrors,
            [field]: "Only numerical values.",
          });
        } else if (Number(posData.quantityhigh) < Number(posData.quantitylow)) {
          setPosaddErrors({
            ...posaddErrors,
            [field]: "QuantityH must be larger than QuantityL.",
          });
        } else {
          setPosaddErrors({ ...posaddErrors, [field]: "", quantitylow: "" });
        }

        break;
      default:
        break;
    }
  };
  const addPosition = (e) => {
    e.preventDefault();
    if (Object.values(posaddErrors).every((x) => x === "")) {
      Axios.post("/checkposition", { WGP: posData.WGP })
        .then((response) => {
          if (response.data.msg === "OK") {
            Axios.post("/addposition", { posData }).then((response) =>
              togglePosrefresh()
            );
          } else {
            setPosaddErrors({
              ...posaddErrors,
              WGP: response.data.msg,
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      setPosaddErrors({
        ...posaddErrors,
        general: "Please review items in red.",
      });
    }
    setPosData(posDataInit);
    setPosValues(posValuesInit);
    setResetfield(true);
  };
  return (
    <div className="positionadd">
      <h3 className="positionaddtitle">Add New Position</h3>
      <form id="positionaddform" onSubmit={addPosition}>
        <div className="form-group">
          <label htmlFor="">WGP:</label>
          <input
            name="WGP"
            value={posData.WGP}
            type="text"
            onChange={handlePosChange}
            placeholder="WGP..."
            // onDoubleClick={(e) => {
            //   e.target.select();
            // }}
            required
            className="canceldrag"
          />
        </div>
        <span className="posadderror">{posaddErrors.WGP}</span>
        <div className="form-group">
          <label htmlFor="">Product:</label>
          <SearchField
            className="searchfield canceldrag"
            searchURL={"/productlist"}
            searchName={"abbreviation"}
            searchID={"productID"}
            otherName={"supplier"}
            otherID={"supplierID"}
            thirdName={"productGroup"}
            thirdID={"prodGroupID"}
            placeholder={"Product..."}
            setProdSupplier={setProdSupplier}
            resetfield={resetfield}
            setResetfield={setResetfield}
            value={posValues ? posValues.product || "" : ""}
            // className="canceldrag"

            // value={postoadd.product}
          />
        </div>

        <div className="form-group">
          <label htmlFor="">Supplier:</label>
          <input
            readOnly
            placeholder="Supplier..."
            value={posValues.supplier}
            className="canceldrag"
          />
        </div>
        <div className="form-group">
          <label htmlFor="">ProdGroup:</label>
          <input
            readOnly
            placeholder="ProductGroup..."
            value={posValues.productgroup}
            className="canceldrag"
          />
        </div>
        <div className="form-group">
          <label htmlFor="">QuantityL:</label>
          <input
            name="quantitylow"
            type="text"
            placeholder="Quantity Low..."
            onChange={handlePosChange}
            value={posData.quantitylow}
            onBlur={handlePosAddValidation}
            // onDoubleClick={(e) => {
            //   e.target.select();
            // }}
            required
            className="canceldrag"
          />
        </div>
        <span className="posadderror">{posaddErrors.quantitylow}</span>

        <div className="form-group">
          <label htmlFor="">QuantityH:</label>
          <input
            name="quantityhigh"
            type="text"
            placeholder="Quantity High..."
            onChange={handlePosChange}
            value={posData.quantityhigh}
            onBlur={handlePosAddValidation}
            // onDoubleClick={(e) => {
            //   e.target.select();
            // }}
            required
            className="canceldrag"
          />
        </div>
        <span className="posadderror">{posaddErrors.quantityhigh}</span>
        <div className="form-group">
          <label htmlFor="">FOB:</label>
          <input
            type="text"
            name="FOB"
            placeholder="FOB..."
            onChange={handlePosChange}
            value={posData.FOB}
            // onDoubleClick={(e) => {
            //   e.target.select();
            // }}
            required
            className="canceldrag"
          />
        </div>
        <div className="form-group">
          <label htmlFor="">From:</label>
          <input
            name="from"
            type="date"
            placeholder="From..."
            onChange={handlePosChange}
            value={posData.from}
            // onDoubleClick={(e) => {
            //   e.target.select();
            // }}
            required
            className="canceldrag"
          />
        </div>
        <div className="form-group">
          <label htmlFor="">To:</label>
          <input
            name="to"
            type="date"
            placeholder="To..."
            onChange={handlePosChange}
            value={posData.to}
            // onDoubleClick={(e) => {
            //   e.target.select();
            // }}
            required
            className="canceldrag"
          />
        </div>
        <div className="form-group">
          <label htmlFor="">Notes:</label>
          <textarea
            // onDoubleClick={(e) => {
            //   e.target.select();
            // }}
            name="notes"
            className="canceldrag"
            onChange={handlePosChange}
            value={posData.notes}
          ></textarea>
        </div>
        <button>Add</button>
        <span className="posadderror">{posaddErrors.general}</span>
      </form>
    </div>
  );
};

export default PositionAdd;
