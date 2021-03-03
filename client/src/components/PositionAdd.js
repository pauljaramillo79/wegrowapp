import React, { useState, useContext } from "react";
import "./PositionAdd.css";
import SearchField from "./SearchField";
import { RefreshPositionsContext } from "../contexts/RefreshPositionsProvider";
import Axios from "axios";

const PositionAdd = () => {
  const { posrefresh, togglePosrefresh } = useContext(RefreshPositionsContext);
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
  const posaddErrorsInit = {
    WGP: "",
    quantitylow: "",
    quantityhigh: "",
    to: "",
    general: "",
  };

  const [postoadd, setPostoadd] = useState(postoaddInit);
  const [posaddErrors, setPosaddErrors] = useState(posaddErrorsInit);
  const handlePosChange = (e) => {
    e.preventDefault();
    setPosaddErrors({
      ...posaddErrors,
      WGP: "",
      general: "",
    });
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
        } else if (
          Number(postoadd.quantityhigh) < Number(postoadd.quantitylow)
        ) {
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
        } else if (
          Number(postoadd.quantityhigh) < Number(postoadd.quantitylow)
        ) {
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
      Axios.post("/checkposition", { WGP: postoadd.WGP })
        .then((response) => {
          if (response.data.msg === "OK") {
            Axios.post("/addposition", { postoadd }).then(togglePosrefresh());
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
  };
  return (
    <div className="positionadd">
      <h3 className="positionaddtitle">Add New Position</h3>
      <form id="positionaddform" onSubmit={addPosition}>
        <div className="form-group">
          <label htmlFor="">WGP:</label>
          <input
            name="WGP"
            value={postoadd.WGP}
            type="text"
            onChange={handlePosChange}
            placeholder="WGP..."
            onDoubleClick={(e) => {
              e.target.select();
            }}
            required
          />
        </div>
        <span className="posadderror">{posaddErrors.WGP}</span>
        <div className="form-group">
          <label htmlFor="">Product:</label>
          <SearchField
            className="searchfield"
            searchURL={"/productlist"}
            searchName={"abbreviation"}
            searchID={"productID"}
            otherName={"supplier"}
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
            onBlur={handlePosAddValidation}
            onDoubleClick={(e) => {
              e.target.select();
            }}
            required
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
            value={postoadd.quantityhigh}
            onBlur={handlePosAddValidation}
            onDoubleClick={(e) => {
              e.target.select();
            }}
            required
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
            value={postoadd.FOB}
            onDoubleClick={(e) => {
              e.target.select();
            }}
            required
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
            onDoubleClick={(e) => {
              e.target.select();
            }}
            required
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
            onDoubleClick={(e) => {
              e.target.select();
            }}
            required
          />
        </div>
        <button>Add</button>
        <span className="posadderror">{posaddErrors.general}</span>
      </form>
    </div>
  );
};

export default PositionAdd;
