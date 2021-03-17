import React, { useState, useEffect } from "react";
import "./PositionModal.css";
import Axios from "axios";

const PositionModal = ({ handleClose, show, positiontoedit }) => {
  const showHideClassName = show ? "modal display-block" : "modal display-none";

  const positionid = positiontoedit.WGP;
  const [posEditInit, setPosEditInit] = useState();

  useEffect(() => {
    if (positionid) {
      Axios.post("/positiontoedit", { id: positionid }).then((response) => {
        setPosEditInit(response.data[0]);
        console.log(response.data[0]);
      });
    }
  }, [show]);
  const postoeditinit = {
    WGP: positiontoedit.WGP,
    supplier: positiontoedit.abbreviation,
    companyCode: positiontoedit.companyCode,
    quantity: positiontoedit.quantity,
    FOB: positiontoedit.FOB,
  };
  const [postoedit, setPostoedit] = useState({});

  useEffect(() => {
    setPostoedit(postoeditinit);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show]);

  const handleInputChange = (e) => {
    e.preventDefault();
    setPostoedit({
      ...postoedit,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    handleClose();
  };
  return (
    <div className={showHideClassName}>
      <section className="modal-main">
        <form className="positionModalForm" action="">
          <h2>Edit Position</h2>
          <div className="form-group">
            <label htmlFor="">WGP:</label>
            <input
              name="WGP"
              type="text"
              value={posEditInit ? posEditInit.WGP : ""}
              // onChange={handleInputChange}
              className="canceldrag"
            />
          </div>
          <div className="form-group">
            <label htmlFor="">Product:</label>
            <input
              name="product"
              type="text"
              value={posEditInit ? posEditInit.product : ""}
              onChange={handleInputChange}
              className="canceldrag"
            />
          </div>
          <div className="form-group">
            <label htmlFor="">Supplier:</label>
            <input
              name="supplier"
              type="text"
              value={posEditInit ? posEditInit.supplier : ""}
              className="canceldrag"
              readOnly
            />
          </div>
          <div className="form-group">
            <label htmlFor="">Prod Group:</label>
            <input
              name="productgroup"
              type="text"
              value={posEditInit ? posEditInit.productGroup : ""}
              className="canceldrag"
              readOnly
            />
          </div>
          <div className="form-group">
            <label htmlFor="">QuantityL:</label>
            <input
              name="quantityLow"
              type="text"
              value={posEditInit ? posEditInit.quantityLow : ""}
              onChange={handleInputChange}
              className="canceldrag"
            />
          </div>
          <div className="form-group">
            <label htmlFor="">QuantityH:</label>
            <input
              name="quantityHigh"
              type="text"
              value={posEditInit ? posEditInit.quantityHigh : ""}
              onChange={handleInputChange}
              className="canceldrag"
            />
          </div>
          <div className="form-group">
            <label htmlFor="">FOB:</label>
            <input
              name="FOB"
              type="text"
              value={posEditInit ? posEditInit.FOBCost : ""}
              onChange={handleInputChange}
              className="canceldrag"
            />
          </div>

          <div className="form-group">
            <label>From:</label>
            <input
              name="from"
              type="date"
              value={posEditInit ? posEditInit.shipmentStart : ""}
            />
          </div>
          <div className="form-group">
            <label htmlFor="">Notes:</label>
            <textarea
              name="notes"
              className="canceldrag"
              value={posEditInit ? posEditInit.notes : ""}
            ></textarea>
          </div>

          <button className="confirmbutton" type="submit" onClick={handleClose}>
            Save Edits
          </button>
          <button className="cancelbutton" onClick={handleClose}>
            Cancel
          </button>
        </form>
      </section>
    </div>
  );
};

export default PositionModal;
