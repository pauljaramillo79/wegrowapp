import React, { useState, useEffect } from "react";

const QSEditModal = ({ handleClose, show, QStoedit }) => {
  const showHideClassName = show ? "modal display-block" : "modal display-none";
  const postoeditinit = {
    KTP: QStoedit.KTP,
    abbreviation: QStoedit.abbreviation,
    companyCode: QStoedit.companyCode,
    quantity: QStoedit.quantity,
    FOB: QStoedit.FOB,
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
          <h2>Edit Quotation Sheet</h2>
          <div className="form-group">
            <label htmlFor="">Position Number:</label>
            <input
              name="KTP"
              type="text"
              value={postoedit.KTP}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="">Product:</label>
            <input
              name="abbreviation"
              type="text"
              value={postoedit.abbreviation}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="">Supplier:</label>
            <input
              name="companyCode"
              type="text"
              value={postoedit.companyCode}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="">Quantity:</label>
            <input
              name="quantity"
              type="text"
              value={postoedit.quantity}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="">FOB:</label>
            <input
              name="FOB"
              type="text"
              value={postoedit.FOB}
              onChange={handleInputChange}
            />
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

export default QSEditModal;
