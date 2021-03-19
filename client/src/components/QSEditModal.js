import React, { useState, useEffect } from "react";
import "./QSEditModal.css";

const QSEditModal = ({ handleClose, show, QStoedit }) => {
  const showHideClassName = show
    ? "modal QSmodal display-block"
    : "modal QSmodal display-none";
  const id = QStoedit.QSID;

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
    console.log(id);
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
  return show ? (
    <div className={showHideClassName}>
      <section className="modal-main">
        <h2>Edit Quotation Sheet</h2>
        <form className="QSModalForm" action="">
          <section id="edtQS-1">
            <div className="form-group">
              <label htmlFor="">QS Date:</label>
              <input name="QSDate" type="text" readOnly />
            </div>
            <fieldset>
              <legend>Sale Type</legend>
              <p>
                <input type="radio" name="saleType" required />
                <label htmlFor="">Back-to-back</label>
              </p>
              <p>
                <input type="radio" name="saleType" required />
                <label htmlFor="">Position</label>
              </p>
            </fieldset>
            <fieldset>
              <legend>General</legend>
              <div className="form-group">
                <label htmlFor="">QSID:</label>
                <input name="QSID" type="text" required readOnly />
              </div>
              <div className="form-group">
                <label htmlFor="">Product:</label>
                <input name="product" type="text" required />
              </div>
              <div className="form-group">
                <label htmlFor="">Supplier:</label>
                <input name="supplier" type="text" required />
              </div>
              <div className="form-group">
                <label htmlFor="">Customer:</label>
                <input name="customer" type="text" required />
              </div>
              <div className="form-group">
                <label htmlFor="">Contact:</label>
                <input name="contact" type="text" required />
              </div>
            </fieldset>
            <fieldset>
              <legend>Packaging</legend>
              <div className="form-group">
                <label htmlFor="">Pack Size:</label>
                <input name="packsize" type="text" required />
              </div>
              <div className="form-group">
                <label htmlFor="">Marks:</label>
                <input name="marks" type="text" required />
              </div>
            </fieldset>
            <fieldset>
              <legend>Delivery</legend>
              <div className="form-group">
                <label htmlFor="">From:</label>
                <input name="from" type="text" required />
              </div>
              <div className="form-group">
                <label htmlFor="">To:</label>
                <input name="to" type="text" required />
              </div>
              <div className="form-group">
                <label htmlFor="">POL:</label>
                <input name="POL" type="text" required />
              </div>
              <div className="form-group">
                <label htmlFor="">POD:</label>
                <input name="POD" type="text" required />
              </div>
            </fieldset>
          </section>
          <section id="editQS-2">
            <fieldset>
              <legend>In Charge</legend>
              <div className="form-group">
                <label htmlFor="">Trader:</label>
                <input name="trader" type="text" required />
              </div>
              <div className="form-group">
                <label htmlFor="">Traffic:</label>
                <input name="traffic" type="text" required />
              </div>
            </fieldset>
            <fieldset>
              <legend>Terms</legend>
              <div className="form-group">
                <label htmlFor="">Incoterms:</label>
                <input name="incoterms" type="text" required />
              </div>
              <div className="form-group">
                <label htmlFor="">Payment Terms:</label>
                <input name="paymentterms" type="text" required />
              </div>
              <div className="form-group">
                <label htmlFor="">Inc. Interest:</label>
                <input name="CADintrate" type="text" required />
              </div>
              <div className="form-group">
                <label htmlFor="">Inc. Days:</label>
                <input name="CADdays" type="text" required />
              </div>
            </fieldset>
            <div className="shipmentType">
              <input type="radio" name="shipmenttype" required />
              <label htmlFor="">Container</label>
              <input type="radio" name="shipmenttype" required />
              <label htmlFor="">Breakbulk</label>
              <input type="radio" name="shipmenttype" required />
              <label htmlFor="">Distribution</label>
            </div>
            <fieldset>
              <legend>Freight</legend>
              <div className="form-group">
                <label htmlFor="">Freight ID:</label>
                <input name="freightID" type="text" required />
              </div>
              <div className="form-group">
                <label htmlFor="">Freight Total:</label>
                <input name="freighttotal" type="text" required />
              </div>
              <div className="form-group">
                <label htmlFor="">Shipping Line:</label>
                <input name="shippingline" type="text" required />
              </div>
              <div className="form-group">
                <label htmlFor="">Inspection Cost:</label>
                <input name="inspectiontotal" type="text" required />
              </div>
              <div className="form-group">
                <label htmlFor="">Freight ID:</label>
                <input name="freightID" type="text" required />
              </div>
            </fieldset>
          </section>
          <section id="editQS-3">
            <fieldset>
              <legend>Figures</legend>
              <section id="editQS-3-col1">
                <div className="form-group">
                  <label htmlFor="">Quantity:</label>
                  <input name="quantity" type="text" required />
                </div>
                <fieldset>
                  <legend>Costs</legend>
                  <div className="form-group">
                    <label htmlFor="">Material Cost:</label>
                    <input name="materialcost" type="text" required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="">P Commission:</label>
                    <input name="pcommission" type="text" required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="">P Finance Costt:</label>
                    <input name="pfinancecost" type="text" required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="">S Finance Cost:</label>
                    <input name="sfinancecost" type="text" required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="">Freight:</label>
                    <input name="freightpmt" type="text" required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="">Insurance Cost:</label>
                    <input name="insurance" type="text" required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="">Inspection Cost:</label>
                    <input name="inspectionpmt" type="text" required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="">S Commission:</label>
                    <input name="scommission" type="text" required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="">Interest Cost:</label>
                    <input name="interestcost" type="text" required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="">Legal:</label>
                    <input name="legal" type="text" required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="">Pallets:</label>
                    <input name="pallets" type="text" required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="">Other:</label>
                    <input name="other" type="text" required />
                  </div>
                </fieldset>
                <div className="form-group">
                  <label htmlFor="">Total Cost:</label>
                  <input name="other" type="text" required />
                </div>
              </section>
              <section id="editQS-3-col2">
                <fieldset>
                  <legend>Sales Interest</legend>
                  <div className="form-group">
                    <label htmlFor="">Interest Rate:</label>
                    <input name="interestrate" type="text" required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="">Interest Days:</label>
                    <input name="interestdays" type="text" required />
                  </div>
                </fieldset>
                <fieldset>
                  <div className="form-group">
                    <label htmlFor="">Price Before Int.:</label>
                    <input name="pricebeforeint" type="text" required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="">Sales Interest:</label>
                    <input name="salesinterest" type="text" required />
                  </div>
                </fieldset>
                <div className="form-group">
                  <label htmlFor="">Price After Int.:</label>
                  <input name="priceafterint" type="text" required />
                </div>
                <fieldset>
                  <legend>Economics</legend>
                  <div className="form-group">
                    <label htmlFor="">Profit:</label>
                    <input name="profit" type="text" required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="">Margin:</label>
                    <input name="margin" type="text" required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="">Turnover:</label>
                    <input name="turnover" type="text" required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="">% Margin:</label>
                    <input name="pctmargin" type="text" required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="">Netback:</label>
                    <input name="netback" type="text" required />
                  </div>
                </fieldset>
              </section>
            </fieldset>
            <div className="QSedit-buttons">
              <button
                className="confirmbutton"
                type="submit"
                onClick={handleClose}
              >
                Save Edits
              </button>
              <button className="cancelbutton" onClick={handleClose}>
                Save Edits and Offer
              </button>
              <button className="cancelbutton" onClick={handleClose}>
                Cancel
              </button>
            </div>
          </section>
        </form>
      </section>
    </div>
  ) : (
    ""
  );
};

export default QSEditModal;
