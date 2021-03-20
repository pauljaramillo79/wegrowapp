import React, { useState, useEffect } from "react";
import "./QSEditModal.css";
import Axios from "axios";

const QSEditModal = ({ handleClose, show, QStoedit }) => {
  const showHideClassName = show
    ? "modal QSmodal display-block"
    : "modal QSmodal display-none";
  const QSID = QStoedit.QSID;

  const [QSeditable, setQSeditable] = useState();
  const [QSoriginal, setQSoriginal] = useState();
  // const postoeditinit = {
  //   KTP: QStoedit.KTP,
  //   abbreviation: QStoedit.abbreviation,
  //   companyCode: QStoedit.companyCode,
  //   quantity: QStoedit.quantity,
  //   FOB: QStoedit.FOB,
  // };
  // const [postoedit, setPostoedit] = useState({});

  useEffect(() => {
    if (show && QSID) {
      Axios.post("/QStoedit", { id: QSID }).then((response) => {
        setQSeditable(response.data[0]);
        setQSoriginal(response.data[0]);
        console.log(response.data);
      });
    }
    // setPostoedit(postoeditinit);
    // console.log(QSID);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show]);

  const handleInputChange = (e) => {
    e.preventDefault();
    setQSeditable({
      ...QSeditable,
      [e.target.name]: e.target.value,
    });

    // setPostoedit({
    //   ...postoedit,
    //   [e.target.name]: e.target.value,
    // });
  };
  const handleQInputChange = (e) => {
    e.preventDefault();
    const isdecimalnumber = RegExp("^[0-9.,$]+$");
    if (isdecimalnumber.test(e.target.value)) {
      setQSeditable({
        ...QSeditable,
        [e.target.name]: e.target.value,
      });
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    handleClose();
  };
  const makecurrency = (num, field) => {
    if (num !== null && num !== "") {
      if (num.toString().includes("$")) {
        setQSeditable({
          ...QSeditable,
          [field]: "$" + Number(num.replace("$", "")).toFixed(2),
        });
      } else {
        setQSeditable({
          ...QSeditable,
          [field]: "$" + Number(num).toFixed(2),
        });
      }
    } else {
      setQSeditable({
        ...QSeditable,
        [field]: "$0.00",
      });
    }
  };
  const makepercent = (num, field) => {
    if (num !== null && num !== "") {
      if (num.toString().includes("%")) {
        setQSeditable({
          ...QSeditable,
          [field]: Number(num.replace("%", "")).toFixed(2) + "%",
        });
      } else {
        setQSeditable({
          ...QSeditable,
          [field]: Number(num).toFixed(2) + "%",
        });
      }
    } else {
      setQSeditable({
        ...QSeditable,
        [field]: "0.00%",
      });
    }
  };
  const formatCurrency = (e) => {
    makecurrency(e.target.value, e.target.name);
  };
  const formatPercent = (e) => {
    makepercent(e.target.value, e.target.name);
  };
  const createemail = (e) => {
    e.preventDefault();
    window.location.href =
      "mailto:user@example.com?subject=Subject&body=message%20goes%20here";
  };
  return show ? (
    <div className={showHideClassName}>
      <section className="modal-main">
        <h2>Edit Quotation Sheet</h2>
        <form className="QSModalForm" action="">
          <section id="edtQS-1">
            <div className="form-group">
              <label htmlFor="">QS Date:</label>
              <input
                name="QSDate"
                type="date"
                readOnly
                value={QSeditable ? QSeditable.QSDate || "" : ""}
              />
            </div>
            <fieldset>
              <legend>Sale Type</legend>
              <p>
                <input
                  type="radio"
                  name="saleTypeID"
                  required
                  checked={
                    QSeditable && QSeditable.saleTypeID === 1
                      ? true || ""
                      : false
                  }
                />
                <label htmlFor="">Back-to-back</label>
              </p>
              <p>
                <input
                  type="radio"
                  name="saleTypeID"
                  required
                  checked={
                    QSeditable && QSeditable.saleTypeID === 2
                      ? true || ""
                      : false
                  }
                />
                <label htmlFor="">Position</label>
              </p>
            </fieldset>
            <fieldset>
              <legend>General</legend>
              <div className="form-group">
                <label htmlFor="">QSID:</label>
                <input
                  name="QSID"
                  type="text"
                  required
                  value={QSeditable ? QSeditable.QSID || "" : ""}
                  readOnly
                />
              </div>
              <div className="form-group">
                <label htmlFor="">Product:</label>
                <input
                  name="product"
                  type="text"
                  required
                  value={QSeditable ? QSeditable.product || "" : ""}
                />
              </div>
              <div className="form-group">
                <label htmlFor="">Supplier:</label>
                <input
                  name="supplier"
                  type="text"
                  required
                  value={QSeditable ? QSeditable.supplier || "" : ""}
                />
              </div>
              <div className="form-group">
                <label htmlFor="">Customer:</label>
                <input
                  name="customer"
                  type="text"
                  required
                  value={QSeditable ? QSeditable.customer || "" : ""}
                />
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
                <input
                  name="packsize"
                  type="text"
                  required
                  value={QSeditable ? QSeditable.packsize || "" : ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="">Marks:</label>
                <input
                  name="marks"
                  type="text"
                  required
                  value={QSeditable ? QSeditable.marks || "" : ""}
                  onChange={handleInputChange}
                />
              </div>
            </fieldset>
            <fieldset>
              <legend>Delivery</legend>
              <div className="form-group">
                <label htmlFor="">From:</label>
                <input
                  name="from"
                  type="date"
                  required
                  value={QSeditable ? QSeditable.from || "" : ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="">To:</label>
                <input
                  name="to"
                  type="date"
                  required
                  value={QSeditable ? QSeditable.to || "" : ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="">POL:</label>
                <input
                  name="POL"
                  type="text"
                  required
                  value={QSeditable ? QSeditable.POL || "" : ""}
                />
              </div>
              <div className="form-group">
                <label htmlFor="">POD:</label>
                <input
                  name="POD"
                  type="text"
                  required
                  value={QSeditable ? QSeditable.POD || "" : ""}
                />
              </div>
            </fieldset>
          </section>
          <section id="editQS-2">
            <fieldset>
              <legend>In Charge</legend>
              <div className="form-group">
                <label htmlFor="">Trader:</label>
                <input
                  name="trader"
                  type="text"
                  required
                  value={QSeditable ? QSeditable.trader || "" : ""}
                  readOnly
                />
              </div>
              <div className="form-group">
                <label htmlFor="">Traffic:</label>
                <input
                  name="traffic"
                  type="text"
                  required
                  value={QSeditable ? QSeditable.traffic || "" : ""}
                />
              </div>
            </fieldset>
            <fieldset>
              <legend>Terms</legend>
              <div className="form-group">
                <label htmlFor="">Incoterms:</label>
                <input
                  name="incoterms"
                  type="text"
                  required
                  value={QSeditable ? QSeditable.incoterms || "" : ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="">Payment Terms:</label>
                <input
                  name="paymentterms"
                  type="text"
                  required
                  value={QSeditable ? QSeditable.paymentterms || "" : ""}
                />
              </div>
              <div className="form-group">
                <label htmlFor="">Inc. Interest:</label>
                <input
                  name="includedrate"
                  type="text"
                  required
                  value={QSeditable ? QSeditable.includedrate || "" : ""}
                  onChange={handleInputChange}
                  onBlur={formatPercent}
                />
              </div>
              <div className="form-group">
                <label htmlFor="">Inc. Days:</label>
                <input
                  name="includedperiod"
                  type="text"
                  required
                  value={QSeditable ? QSeditable.includedperiod || "" : ""}
                  onChange={handleInputChange}
                />
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
                  <input
                    className="QSfig"
                    name="quantity"
                    type="text"
                    required
                    value={QSeditable ? QSeditable.quantity || "" : ""}
                    onChange={handleInputChange}
                  />
                </div>
                <fieldset>
                  <legend>Costs</legend>
                  <div className="form-group">
                    <label htmlFor="">Material Cost:</label>
                    <input
                      className="QSfig"
                      name="materialcost"
                      type="text"
                      required
                      value={QSeditable ? QSeditable.materialcost || "" : ""}
                      onChange={handleQInputChange}
                      onBlur={formatCurrency}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="">P Commission:</label>
                    <input
                      className="QSfig"
                      name="pcommission"
                      type="text"
                      required
                      value={QSeditable ? QSeditable.pcommission || "" : ""}
                      onChange={handleQInputChange}
                      onBlur={formatCurrency}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="">P Finance Costt:</label>
                    <input
                      className="QSfig"
                      name="pfinancecost"
                      type="text"
                      required
                      value={QSeditable ? QSeditable.pfinancecost || "" : ""}
                      onChange={handleQInputChange}
                      onBlur={formatCurrency}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="">S Finance Cost:</label>
                    <input
                      className="QSfig"
                      name="sfinancecost"
                      type="text"
                      required
                      value={QSeditable ? QSeditable.sfinancecost || "" : ""}
                      onChange={handleQInputChange}
                      onBlur={formatCurrency}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="">Freight:</label>
                    <input
                      className="QSfig"
                      name="freightpmt"
                      type="text"
                      required
                      value={QSeditable ? QSeditable.freightpmt || "" : ""}
                      onChange={handleQInputChange}
                      onBlur={formatCurrency}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="">Insurance Cost:</label>
                    <input
                      className="QSfig"
                      name="insurancecost"
                      type="text"
                      required
                      value={QSeditable ? QSeditable.insurancecost || "" : ""}
                      onChange={handleQInputChange}
                      onBlur={formatCurrency}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="">Inspection Cost:</label>
                    <input
                      className="QSfig"
                      name="inspectioncost"
                      type="text"
                      required
                      value={QSeditable ? QSeditable.inspectioncost || "" : ""}
                      onChange={handleQInputChange}
                      onBlur={formatCurrency}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="">S Commission:</label>
                    <input
                      className="QSfig"
                      name="scommission"
                      type="text"
                      required
                      value={QSeditable ? QSeditable.scommission || "" : ""}
                      onChange={handleQInputChange}
                      onBlur={formatCurrency}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="">Interest Cost:</label>
                    <input
                      className="QSfig"
                      name="interestcost"
                      type="text"
                      required
                      value={QSeditable ? QSeditable.interestcost || "" : ""}
                      readOnly
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="">Legal:</label>
                    <input
                      className="QSfig"
                      name="legal"
                      type="text"
                      required
                      value={QSeditable ? QSeditable.legal || "" : ""}
                      onChange={handleQInputChange}
                      onBlur={formatCurrency}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="">Pallets:</label>
                    <input
                      className="QSfig"
                      name="pallets"
                      type="text"
                      required
                      value={QSeditable ? QSeditable.pallets || "" : ""}
                      onChange={handleQInputChange}
                      onBlur={formatCurrency}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="">Other:</label>
                    <input
                      className="QSfig"
                      name="other"
                      type="text"
                      required
                      value={QSeditable ? QSeditable.other || "" : ""}
                      onChange={handleQInputChange}
                      onBlur={formatCurrency}
                    />
                  </div>
                </fieldset>
                <div className="form-group">
                  <label htmlFor="">Total Cost:</label>
                  <input
                    className="QSfig"
                    name="totalcost"
                    type="text"
                    required
                    value={QSeditable ? QSeditable.totalcost || "" : ""}
                    onChange={handleQInputChange}
                    onBlur={formatCurrency}
                  />
                </div>
              </section>
              <section id="editQS-3-col2">
                <fieldset>
                  <legend>Sales Interest</legend>
                  <div className="form-group">
                    <label htmlFor="">Interest Rate:</label>
                    <input
                      className="QSfig"
                      name="interestrate"
                      type="text"
                      required
                      value={QSeditable ? QSeditable.interestrate || "" : ""}
                      onChange={handleInputChange}
                      onBlur={formatPercent}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="">Interest Days:</label>
                    <input
                      className="QSfig"
                      name="interestdays"
                      type="text"
                      required
                      value={
                        QSeditable
                          ? Number(QSeditable.interestdays).toFixed(0) || ""
                          : ""
                      }
                      onChange={handleInputChange}
                    />
                  </div>
                </fieldset>
                <fieldset>
                  <div className="form-group">
                    <label htmlFor="">Price Before Int.:</label>
                    <input
                      className="QSfig"
                      name="pricebeforeint"
                      type="text"
                      required
                      value={QSeditable ? QSeditable.pricebeforeint || "" : ""}
                      onChange={handleQInputChange}
                      onBlur={formatCurrency}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="">Sales Interest:</label>
                    <input
                      className="QSfig"
                      name="salesinterest"
                      type="text"
                      required
                      value={QSeditable ? QSeditable.salesinterest || "" : ""}
                      readOnly
                    />
                  </div>
                </fieldset>
                <div className="form-group">
                  <label htmlFor="">Price After Int.:</label>
                  <input
                    className="QSfig"
                    name="priceafterint"
                    type="text"
                    required
                    value={QSeditable ? QSeditable.priceafterint || "" : ""}
                    readOnly
                  />
                </div>
                <fieldset>
                  <legend>Economics</legend>
                  <div className="form-group">
                    <label htmlFor="">Profit:</label>
                    <input
                      className="QSfig"
                      name="profit"
                      type="text"
                      required
                      value={QSeditable ? QSeditable.profit || "" : ""}
                      readOnly
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="">Margin:</label>
                    <input
                      className="QSfig"
                      name="margin"
                      type="text"
                      required
                      value={QSeditable ? QSeditable.margin || "" : ""}
                      readOnly
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="">Turnover:</label>
                    <input
                      className="QSfig"
                      name="turnover"
                      type="text"
                      required
                      value={QSeditable ? QSeditable.turnover || "" : ""}
                      readOnly
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="">% Margin:</label>
                    <input
                      className="QSfig"
                      name="pctmargin"
                      type="text"
                      required
                      value={QSeditable ? QSeditable.pctmargin || "" : ""}
                      readOnly
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="">Netback:</label>
                    <input
                      className="QSfig"
                      name="netback"
                      type="text"
                      required
                      value={QSeditable ? QSeditable.netback || "" : ""}
                      readOnly
                    />
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
              <button className="cancelbutton" onClick={createemail}>
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
