import React, { useState, useEffect } from "react";
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
    TIC: JSON.parse(localStorage.getItem("WGuserID")),
    traffic: "",
    incoterms: "",
    CADintrate: 0.03,
    CADdays: 15,
    quantity: 0,
    materialcost: 0,
    pcommission: 0,
    pfinancecost: 0,
    sfinancecost: 0,
    freightpmt: 0,
    insurance: 0,
    inspectionpmt: 0,
    scommission: 0,
    interestcost: 0.0,
    legal: 0,
    pallets: 0,
    other: 0,
    totalcost: 0,
    interestrate: 0,
    interestdays: 0,
    pricebeforeint: 0,
    salesinterest: 0,
    priceafterint: 0,
    profit: 0,
    margin: 0,
    turnover: 0,
    pctmargin: 0,
    netback: 0,
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
    TIC: JSON.parse(localStorage.getItem("WGusercode")),
    traffic: "",
    incoterms: "",
    CADintrate: "3.00%",
    CADdays: "15",
    quantity: "",
    materialcost: "0.00",
    pcommission: "0.00",
    pfinancecost: "0.00",
    sfinancecost: "0.00",
    freightpmt: "0.00",
    insurance: "0.00",
    inspectionpmt: "0.00",
    scommission: "0.00",
    interestcost: "0.00",
    legal: "0.00",
    pallets: "0.00",
    other: "0.00",
    totalcost: "0.00",
    interestrate: "0.00",
    interestdays: "0",
    pricebeforeint: "0.00",
    salesinterest: "0.00",
    priceafterint: "0.00",
    profit: "0.00",
    margin: "0.00",
    turnover: "0.00",
    pctmargin: "0.00",
    netback: "0.00",
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
  const PercentageChange = (e) => {
    const isdecimalnumber = RegExp("^[0-9.,]+$"); //RegExp("^[0-9\b]+$")
    if (isdecimalnumber.test(e.target.value) || e.target.value === "") {
      setQSData({
        ...QSData,
        [e.target.name]: Number(e.target.value).toFixed(2) / 100,
      });
      setQSValues({
        ...QSValues,
        [e.target.name]: e.target.value,
      });
    }
  };
  const PercentageBlur = (e) => {
    setQSValues({
      ...QSValues,
      [e.target.name]: Number(e.target.value).toFixed(2) + "%",
    });
  };
  const QtyChange = (e) => {
    const isdecimalnumber = RegExp("^[0-9.,]+$");
    if (isdecimalnumber.test(e.target.value) || e.target.value === "") {
      setQSData({
        ...QSData,
        [e.target.name]: Number(Number(e.target.value).toFixed(2)),
      });
      setQSValues({
        ...QSValues,
        [e.target.name]: e.target.value,
      });
    }
  };
  const QtyBlur = (e) => {
    setQSValues({
      ...QSValues,
      [e.target.name]: Number(e.target.value)
        .toFixed(2)
        .replace(/\B(?=(\d{3})+(?!\d))/g, ","),
    });
    if (e.target.value === "") {
      setQSData({ ...QSData, [e.target.name]: 0 });
    }
  };

  // Update sales interest
  useEffect(() => {
    // if (
    //   QSData.interestdays !== 0 &&
    //   QSData.interestrate !== 0 &&
    //   QSData.pricebeforeint !== 0
    // ) {
    setQSData({
      ...QSData,
      salesinterest: Number(
        (QSData.interestrate *
          Number(QSData.interestdays) *
          Number(QSData.pricebeforeint)) /
          365
      ),
    });
    setQSValues({
      ...QSValues,
      salesinterest: Number(
        (QSData.interestrate *
          Number(QSData.interestdays) *
          Number(QSData.pricebeforeint)) /
          365
      ).toFixed(2),
    });
    // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [QSData.interestdays, QSData.interestrate]);
  //Update total cost
  useEffect(() => {
    setQSValues({
      ...QSValues,
      totalcost: Number(
        QSData.materialcost +
          QSData.pcommission +
          QSData.pfinancecost +
          QSData.sfinancecost +
          QSData.freightpmt +
          QSData.insurance +
          QSData.inspectionpmt +
          QSData.scommission +
          QSData.interestcost +
          QSData.legal +
          QSData.pallets +
          QSData.other
      ).toFixed(2),
    });
    setQSData({
      ...QSData,
      totalcost: Number(
        (
          QSData.materialcost +
          QSData.pcommission +
          QSData.pfinancecost +
          QSData.sfinancecost +
          QSData.freightpmt +
          QSData.insurance +
          QSData.inspectionpmt +
          QSData.scommission +
          QSData.interestcost +
          QSData.legal +
          QSData.pallets +
          QSData.other
        ).toFixed(2)
      ),
    });
  }, [
    QSData.materialcost,
    QSData.pcommission,
    QSData.pfinancecost,
    QSData.sfinancecost,
    QSData.freightpmt,
    QSData.insurance,
    QSData.inspectionpmt,
    QSData.scommission,
    QSData.interestcost,
    QSData.legal,
    QSData.pallets,
    QSData.other,
  ]);
  //Update price after interest
  useEffect(() => {
    setQSData({
      ...QSData,
      priceafterint: QSData.pricebeforeint + QSData.salesinterest,
    });
    setQSValues({
      ...QSValues,
      priceafterint: Number(
        QSData.pricebeforeint + QSData.salesinterest
      ).toFixed(2),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [QSData.pricebeforeint, QSData.salesinterest]);
  //Update Included Interest Cost
  useEffect(() => {
    // if (
    //   QSData.CADdays !== 0 &&
    //   QSData.CADintrate !== 0 &&
    //   QSData.pricebeforeint !== 0
    // ) {
    console.log(typeof ((QSData.CADintrate * QSData.CADdays) / 365));
    setQSData({
      ...QSData,
      interestcost: Number(
        (QSData.CADintrate * QSData.CADdays * QSData.pricebeforeint) / 365
      ),
      salesinterest: Number(
        (QSData.interestrate *
          Number(QSData.interestdays) *
          Number(QSData.pricebeforeint)) /
          365
      ),
    });
    setQSValues({
      ...QSValues,
      interestcost: Number(
        (QSData.CADintrate * QSData.CADdays * QSData.pricebeforeint) / 365
      ).toFixed(2),
      salesinterest: Number(
        (QSData.interestrate *
          Number(QSData.interestdays) *
          Number(QSData.pricebeforeint)) /
          365
      ).toFixed(2),
    });
    // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [QSData.CADdays, QSData.CADintrate, QSData.pricebeforeint]);
  //Update economics
  useEffect(() => {
    if (QSData.quantity !== 0 && QSData.priceafterint !== 0) {
      setQSValues({
        ...QSValues,
        profit: Number(QSData.priceafterint - QSData.totalcost).toFixed(2),
        margin: Number(
          (QSData.priceafterint - QSData.totalcost) * QSData.quantity
        )
          .toFixed(2)
          .replace(/\B(?=(\d{3})+(?!\d))/g, ","),
        turnover: Number(QSData.quantity * QSData.priceafterint)
          .toFixed(2)
          .replace(/\B(?=(\d{3})+(?!\d))/g, ","),
        pctmargin:
          Number(
            ((QSData.priceafterint - QSData.totalcost) / QSData.priceafterint) *
              100
          ).toFixed(2) + "%",
        netback: Number(
          QSData.priceafterint - QSData.totalcost + QSData.materialcost
        )
          .toFixed(2)
          .replace(/\B(?=(\d{3})+(?!\d))/g, ","),
      });
    }
  }, [QSData.quantity, QSData.priceafterint, QSData.totalcost]);
  return (
    <div className="salesQS">
      <h3 className="saleslisttitle">Quotation Sheet</h3>
      <form className="salesQS-form" action="">
        <section id="salesQS-1">
          <div className="form-group">
            <label htmlFor="">QS Date:</label>
            <input readOnly value={QSValues.QSDate} type="date" />
          </div>
          <fieldset>
            <legend>Sale Type</legend>
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
            <legend>General</legend>
            {/* <div className="form-group">
              <label htmlFor="">QSID:</label>
              <input readOnly />
            </div> */}
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
            <legend>Packaging</legend>
            <div className="form-group">
              <label htmlFor="">Pack Size:</label>
              <input
                value={QSData.packsize}
                onChange={handleChange}
                name="packsize"
                type="text"
                placeholder="9kg, 25kg, 50kg, bigbag"
                onDoubleClick={(e) => {
                  e.target.select();
                }}
              />
            </div>
            <div className="form-group">
              <label htmlFor="">Marks:</label>
              <input
                name="marks"
                onChange={handleChange}
                value={QSData.marks}
                type="text"
                placeholder="neutral, WG, seller, buyer"
                onDoubleClick={(e) => {
                  e.target.select();
                }}
              />
            </div>
          </fieldset>
          <fieldset>
            <legend>Delivery</legend>
            {/* <div className="form-group"> */}
            <div className="form-group">
              <label htmlFor="">From:</label>
              <input
                name="from"
                onChange={handleChange}
                value={QSData.from}
                type="date"
                onDoubleClick={(e) => {
                  e.target.select();
                }}
              />
            </div>
            <div className="form-group">
              <label htmlFor="">To:</label>
              <input
                name="to"
                onChange={handleChange}
                value={QSData.to}
                type="date"
                onDoubleClick={(e) => {
                  e.target.select();
                }}
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
            <legend>In Charge</legend>
            <div className="form-group">
              <label htmlFor="">Trader:</label>
              <input value={QSValues.TIC} type="text" readOnly />
            </div>
            <div className="form-group">
              <label htmlFor="">Traffic:</label>
              <QSSearchField
                className="searchfield"
                searchURL={"/trafficmgrs"}
                searchName={"traffic"}
                searchID={"trafficID"}
                placeholder={"Traffic..."}
                setQSFields={setQSFields}
              />
            </div>
          </fieldset>
          <fieldset>
            <legend>Terms</legend>
            <div className="form-group">
              <label htmlFor="">Incoterms:</label>
              <input
                placeholder="...Incoterms"
                onChange={handleChange}
                name="incoterms"
                value={QSValues.incoterms}
                type="text"
                onDoubleClick={(e) => {
                  e.target.select();
                }}
              />
            </div>
            <div className="form-group">
              <label htmlFor="">Payment Terms:</label>
              <QSSearchField
                className="searchfield"
                searchURL={"/paymentterms"}
                searchName={"paymentTerm"}
                searchID={"paytermID"}
                placeholder={"Payment terms..."}
                setQSFields={setQSFields}
              />
            </div>
            <div className="form-group">
              <label htmlFor="">CAD Interest:</label>
              <input
                value={QSValues.CADintrate}
                placeholder="...Interest rate"
                type="text"
                name="CADintrate"
                onDoubleClick={(e) => {
                  e.target.select();
                }}
                onChange={PercentageChange}
                onBlur={PercentageBlur}
              />
            </div>
            <div className="form-group">
              <label htmlFor="">CAD Days:</label>
              <input
                value={QSValues.CADdays}
                name="CADdays"
                onChange={QtyChange}
                type="text"
                placeholder="...Days"
                onDoubleClick={(e) => {
                  e.target.select();
                }}
              />
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
            <legend>Figures</legend>
            <section id="salesQS-3-col1">
              <div className="form-group">
                <label htmlFor="">Quantity:</label>
                <input
                  className="QSfig2"
                  name="quantity"
                  value={QSValues.quantity}
                  onChange={QtyChange}
                  type="text"
                  placeholder="MT"
                  onDoubleClick={(e) => {
                    e.target.select();
                  }}
                  onBlur={QtyBlur}
                />
              </div>
              <fieldset>
                <legend>Costs</legend>
                <div className="form-group">
                  <label htmlFor="">Material Cost:</label>
                  <input
                    className="QSfig"
                    onDoubleClick={(e) => {
                      e.target.select();
                    }}
                    type="text"
                    placeholder="...Material Cost pmt"
                    onChange={QtyChange}
                    name="materialcost"
                    value={QSValues.materialcost}
                    onBlur={QtyBlur}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="">P Commission:</label>
                  <input
                    className="QSfig"
                    onDoubleClick={(e) => {
                      e.target.select();
                    }}
                    type="text"
                    placeholder="...P Commission pmt"
                    name="pcommission"
                    value={QSValues.pcommission}
                    onChange={QtyChange}
                    onBlur={QtyBlur}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="">P Finance Cost:</label>
                  <input
                    className="QSfig"
                    onDoubleClick={(e) => {
                      e.target.select();
                    }}
                    type="text"
                    placeholder="...P Finance Cost pmt"
                    name="pfinancecost"
                    value={QSValues.pfinancecost}
                    onChange={QtyChange}
                    onBlur={QtyBlur}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="">S Finance Cost:</label>
                  <input
                    className="QSfig"
                    value={QSValues.sfinancecost}
                    onDoubleClick={(e) => {
                      e.target.select();
                    }}
                    name="sfinancecost"
                    placeholder="...S Finance Cost pmt"
                    onChange={QtyChange}
                    onBlur={QtyBlur}
                    type="text"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="">Freight (pmt):</label>
                  <input
                    className="QSfig"
                    value={QSValues.freightpmt}
                    onDoubleClick={(e) => {
                      e.target.select();
                    }}
                    name="freightpmt"
                    placeholder="...Freight pmt"
                    onChange={QtyChange}
                    onBlur={QtyBlur}
                    type="text"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="">Insurance Cost:</label>
                  <input
                    className="QSfig"
                    value={QSValues.insurance}
                    onDoubleClick={(e) => {
                      e.target.select();
                    }}
                    name="insurance"
                    placeholder="...Insurance Cost pmt"
                    onChange={QtyChange}
                    onBlur={QtyBlur}
                    type="text"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="">Inspection Cost:</label>
                  <input
                    className="QSfig"
                    value={QSValues.inspectionpmt}
                    onDoubleClick={(e) => {
                      e.target.select();
                    }}
                    name="inspectionpmt"
                    placeholder="...Inspection Cost pmt"
                    onChange={QtyChange}
                    onBlur={QtyBlur}
                    type="text"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="">S Commission:</label>
                  <input
                    className="QSfig"
                    value={QSValues.scommission}
                    onDoubleClick={(e) => {
                      e.target.select();
                    }}
                    name="scommission"
                    placeholder="...S Commission pmt"
                    onChange={QtyChange}
                    onBlur={QtyBlur}
                    type="text"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="">Interest Cost:</label>
                  <input
                    className="QSfig"
                    value={QSValues.interestcost}
                    onDoubleClick={(e) => {
                      e.target.select();
                    }}
                    name="interestcost"
                    placeholder="...Interest Cost pmt"
                    onChange={QtyChange}
                    onBlur={QtyBlur}
                    type="text"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="">Legal:</label>
                  <input
                    className="QSfig"
                    value={QSValues.legal}
                    onDoubleClick={(e) => {
                      e.target.select();
                    }}
                    name="legal"
                    placeholder="...Legal Cost pmt"
                    onChange={QtyChange}
                    onBlur={QtyBlur}
                    type="text"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="">Pallets:</label>
                  <input
                    className="QSfig"
                    value={QSValues.pallets}
                    onDoubleClick={(e) => {
                      e.target.select();
                    }}
                    name="pallets"
                    placeholder="...Pallets Cost pmt"
                    onChange={QtyChange}
                    onBlur={QtyBlur}
                    type="text"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="">Other:</label>
                  <input
                    className="QSfig"
                    value={QSValues.other}
                    onDoubleClick={(e) => {
                      e.target.select();
                    }}
                    name="other"
                    placeholder="...Other Costs pmt"
                    onChange={QtyChange}
                    onBlur={QtyBlur}
                    type="text"
                  />
                </div>
              </fieldset>
              <div className="form-group">
                <label htmlFor="">Total Cost:</label>
                <input
                  className="QSfig2"
                  readOnly
                  value={QSValues.totalcost}
                  type="text"
                />
              </div>
            </section>
            <section id="salesQS-3-col2">
              <fieldset>
                <legend>Sales Interest</legend>
                <div className="form-group">
                  <label htmlFor="">Interest Rate:</label>
                  <input
                    className="QSfig"
                    value={QSValues.interestrate}
                    placeholder="...Interest Rate"
                    name="interestrate"
                    onDoubleClick={(e) => {
                      e.target.select();
                    }}
                    onChange={PercentageChange}
                    onBlur={PercentageBlur}
                    type="text"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="">Interest Days:</label>
                  <input
                    className="QSfig"
                    value={QSValues.interestdays}
                    name="interestdays"
                    onChange={QtyChange}
                    placeholder="...Interest Days"
                    onDoubleClick={(e) => {
                      e.target.select();
                    }}
                    type="text"
                  />
                </div>
              </fieldset>
              <fieldset>
                <div className="form-group">
                  <label htmlFor="">Price Before Int.:</label>
                  <input
                    className="QSfig"
                    value={QSValues.pricebeforeint}
                    onDoubleClick={(e) => {
                      e.target.select();
                    }}
                    name="pricebeforeint"
                    placeholder="...Price Before Int pmt"
                    onChange={QtyChange}
                    onBlur={QtyBlur}
                    type="text"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="">Sales Interest:</label>
                  <input
                    className="QSfig"
                    value={QSValues.salesinterest}
                    readOnly
                    type="text"
                  />
                </div>
              </fieldset>
              <div className="form-group">
                <label htmlFor="">Price After Int.:</label>
                <input
                  readOnly
                  className="QSfig2"
                  value={QSValues.priceafterint}
                  type="text"
                />
              </div>
              <fieldset>
                <legend>Economics</legend>
                <div className="form-group">
                  <label htmlFor="">Profit:</label>
                  <input
                    readOnly
                    className="QSfig"
                    value={QSValues.profit}
                    type="text"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="">Margin:</label>
                  <input
                    readOnly
                    className="QSfig"
                    value={QSValues.margin}
                    type="text"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="">Turnover:</label>
                  <input
                    readOnly
                    className="QSfig"
                    value={QSValues.turnover}
                    type="text"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="">% Margin:</label>
                  <input
                    readOnly
                    className="QSfig"
                    value={QSValues.pctmargin}
                    type="text"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="">Netback:</label>
                  <input
                    readOnly
                    className="QSfig"
                    value={QSValues.netback}
                    type="text"
                  />
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
