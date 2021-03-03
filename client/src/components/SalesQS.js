import React, { useState } from "react";
import "./SalesQS.css";
import moment from "moment";
import QSSearchField from "./QSSearchField";

const SalesQS = () => {
  const QSDataInit = {
    saleType: "",
    QSDate: moment().format("yyyy-MM-DD"),
    abbreviation: "",
    supplier: "",
    customer: "",
    packsize: "",
    marks: "",
    from: "",
    to: "",
  };
  const QSValuesInit = {
    saleType: "",
    QSDate: moment().format("yyyy-MM-DD"),
    abbreviation: "",
    supplier: "",
    customer: "",
    packsize: "",
    marks: "",
    from: "",
    to: "",
  };
  const [QSData, setQSData] = useState(QSDataInit);
  const [QSValues, setQSValues] = useState(QSValuesInit);
  const setQSFields = (ID1, ID2, Field1, Field2, name1, name2) => {
    if (ID2 === "" && Field2 === "" && name2 === "") {
      setQSData({
        ...QSData,
        [Field1]: ID1,
      });
      setQSValues({
        ...QSValues,
        [Field1]: name1,
      });
    } else {
      setQSData({
        ...QSData,
        [Field1]: ID1,
        [Field2]: ID2,
      });
      setQSValues({
        ...QSValues,
        [Field1]: name1,
        [Field2]: name2,
      });
    }
  };
  const handleChange = (e) => {
    setQSData({
      ...QSData,
      [e.target.name]: e.target.value,
    });
    setQSValues({
      ...QSValues,
      [e.target.name]: e.target.value,
    });
  };
  return (
    <div className="salesQS">
      <h3 className="saleslisttitle">Quotation Sheet</h3>
      <form className="salesQS-form" action="">
        <section id="salesQS-1">
          <div className="form-group">
            <label htmlFor="">QS Date:</label>
            <input value={QSValues.QSDate} type="date" />
          </div>
          <fieldset>
            <legend>Sale Type:</legend>
            {/* <div className="form-group"> */}
            <p>
              <input
                name="saletype"
                type="radio"
                onClick={(e) => {
                  setQSData({ ...QSData, saleType: 1 });
                  setQSValues({ ...QSValues, saleType: "Back-to-back" });
                }}
              />
              <label htmlFor="">Back-to-back</label>
            </p>
            {/* </div> */}
            {/* <div className="form-group"> */}
            <p>
              <input
                name="saletype"
                type="radio"
                onClick={(e) => {
                  setQSData({ ...QSData, saleType: 2 });
                  setQSValues({ ...QSValues, saleType: "Position" });
                }}
              />
              <label htmlFor="">Position</label>
              {/* </div> */}
            </p>
          </fieldset>

          <fieldset>
            <legend>General:</legend>
            <div className="form-group">
              <label htmlFor="">QSID:</label>
              <input readOnly />
            </div>
            <div className="form-group">
              <label htmlFor="">Product:</label>
              <QSSearchField
                className="searchfield"
                searchURL={"/productlist"}
                searchName={"abbreviation"}
                searchID={"productID"}
                otherName={"supplier"}
                otherID={"supplierID"}
                placeholder={"Product..."}
                setQSFields={setQSFields}
              />
            </div>

            <div className="form-group">
              <label htmlFor="">Supplier:</label>
              <input
                placeholder="Supplier..."
                value={QSValues.supplier}
                type="text"
                readOnly
              />
            </div>
            <div className="form-group">
              <label htmlFor="">Customer:</label>
              <QSSearchField
                className="searchfield"
                searchURL={"/customers"}
                searchName={"customer"}
                searchID={"customerID"}
                placeholder={"Customer..."}
                setQSFields={setQSFields}
              />
            </div>
            <div className="form-group">
              <label htmlFor="">Contact:</label>
              <input type="text" />
            </div>
          </fieldset>
          <fieldset>
            <legend>Packaging:</legend>
            <div className="form-group">
              <label htmlFor="">Pack Size:</label>
              <input
                value={QSData.packsize}
                onChange={handleChange}
                name="packsize"
                type="text"
              />
            </div>
            <div className="form-group">
              <label htmlFor="">Marks:</label>
              <input
                name="marks"
                onChange={handleChange}
                value={QSData.marks}
                type="text"
              />
            </div>
          </fieldset>
          <fieldset>
            <legend>Delivery:</legend>
            {/* <div className="form-group"> */}
            <div className="form-group">
              <label htmlFor="">From:</label>
              <input
                name="from"
                onChange={handleChange}
                value={QSData.from}
                type="date"
              />
            </div>
            <div className="form-group">
              <label htmlFor="">To:</label>
              <input
                name="to"
                onChange={handleChange}
                value={QSData.to}
                type="date"
              />
            </div>
            {/* </div> */}
            <div className="form-group">
              <label htmlFor="">POL:</label>
              <QSSearchField
                className="searchfield"
                searchURL={"/POLS"}
                searchName={"POL"}
                searchID={"POLID"}
                placeholder={"POL..."}
                setQSFields={setQSFields}
              />
            </div>
            <div className="form-group">
              <label htmlFor="">POD:</label>
              <QSSearchField
                className="searchfield"
                searchURL={"/PODS"}
                searchName={"POD"}
                searchID={"PODID"}
                placeholder={"POD..."}
                setQSFields={setQSFields}
              />
            </div>
          </fieldset>
        </section>
        <section id="salesQS-2">
          <fieldset>
            <legend>In Charge:</legend>
            <div className="form-group">
              <label htmlFor="">Trader:</label>
              <input type="text" />
            </div>
            <div className="form-group">
              <label htmlFor="">Traffic:</label>
              <input type="text" />
            </div>
          </fieldset>
          <fieldset>
            <legend>Terms:</legend>
            <div className="form-group">
              <label htmlFor="">Incoterms:</label>
              <input type="text" />
            </div>
            <div className="form-group">
              <label htmlFor="">Payment Terms:</label>
              <input type="text" />
            </div>
            <div className="form-group">
              <label htmlFor="">CAD Interest:</label>
              <input type="text" />
            </div>
            <div className="form-group">
              <label htmlFor="">CAD Days:</label>
              <input type="text" />
            </div>
          </fieldset>
          <fieldset>
            <legend>Freight</legend>
            <div className="form-group">
              <label htmlFor="">Freight ID:</label>
              <input type="text" />
            </div>
            <div className="form-group">
              <label htmlFor="">Freight Total:</label>
              <input type="text" />
            </div>
            <div className="form-group">
              <label htmlFor="">Shipping Line:</label>
              <input type="text" />
            </div>
            <div className="form-group">
              <label htmlFor="">Payload:</label>
              <input type="text" />
            </div>
            <div className="form-group">
              <label htmlFor="">Inspection Cost:</label>
              <input type="text" />
            </div>
          </fieldset>
        </section>
        <section id="salesQS-3">
          <fieldset id="salesQS-3-fieldset">
            <legend>Figures:</legend>
            <section id="salesQS-3-col1">
              <div className="form-group">
                <label htmlFor="">Quantity:</label>
                <input type="text" />
              </div>
              <fieldset>
                <legend>Costs: </legend>
                <div className="form-group">
                  <label htmlFor="">Material Cost:</label>
                  <input type="text" />
                </div>
                <div className="form-group">
                  <label htmlFor="">P Commission:</label>
                  <input type="text" />
                </div>
                <div className="form-group">
                  <label htmlFor="">P Finance Cost:</label>
                  <input type="text" />
                </div>
                <div className="form-group">
                  <label htmlFor="">S Finance Cost:</label>
                  <input type="text" />
                </div>
                <div className="form-group">
                  <label htmlFor="">Freight (pmt):</label>
                  <input type="text" />
                </div>
                <div className="form-group">
                  <label htmlFor="">Insurance Cost:</label>
                  <input type="text" />
                </div>
                <div className="form-group">
                  <label htmlFor="">Inspection Cost:</label>
                  <input type="text" />
                </div>
                <div className="form-group">
                  <label htmlFor="">S Commission:</label>
                  <input type="text" />
                </div>
                <div className="form-group">
                  <label htmlFor="">Legal:</label>
                  <input type="text" />
                </div>
                <div className="form-group">
                  <label htmlFor="">Pallets:</label>
                  <input type="text" />
                </div>
                <div className="form-group">
                  <label htmlFor="">Other:</label>
                  <input type="text" />
                </div>
              </fieldset>
              <div className="form-group">
                <label htmlFor="">Total Cost:</label>
                <input type="text" />
              </div>
            </section>
            <section id="salesQS-3-col2">
              <fieldset>
                <legend>Sales Interest:</legend>
                <div className="form-group">
                  <label htmlFor="">Interest Rate:</label>
                  <input type="text" />
                </div>
                <div className="form-group">
                  <label htmlFor="">Interest Days:</label>
                  <input type="text" />
                </div>
              </fieldset>
              <fieldset>
                <div className="form-group">
                  <label htmlFor="">Price Before Int.:</label>
                  <input type="text" />
                </div>
                <div className="form-group">
                  <label htmlFor="">Sales Interest:</label>
                  <input type="text" />
                </div>
              </fieldset>
              <div className="form-group">
                <label htmlFor="">Price After Int.:</label>
                <input type="text" />
              </div>
              <fieldset>
                <legend>Economics:</legend>
                <div className="form-group">
                  <label htmlFor="">Profit:</label>
                  <input type="text" />
                </div>
                <div className="form-group">
                  <label htmlFor="">Margin:</label>
                  <input type="text" />
                </div>
                <div className="form-group">
                  <label htmlFor="">Turnover:</label>
                  <input type="text" />
                </div>
                <div className="form-group">
                  <label htmlFor="">% Margin:</label>
                  <input type="text" />
                </div>
                <div className="form-group">
                  <label htmlFor="">Netback:</label>
                  <input type="text" />
                </div>
              </fieldset>
            </section>
          </fieldset>

          <button>Offer</button>
          <button>Save</button>
          <button>Offer and Save</button>
        </section>
      </form>
    </div>
  );
};

export default SalesQS;
