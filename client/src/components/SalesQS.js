import React, { useState, useEffect, useContext } from "react";
import "./SalesQS.css";
import moment from "moment";
import QSSearchField from "./QSSearchField";
import Axios from "axios";
import { RefreshPositionsContext } from "../contexts/RefreshPositionsProvider";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

const SalesQS = () => {
  const { toggleQSrefresh } = useContext(RefreshPositionsContext);
  const QSDataInit = {
    KTP: "",
    KTS: "",
    saleType: "",
    QSDate: moment().format("yyyy-MM-DD"),
    abbreviation: "",
    supplier: "",
    customer: "",
    packsize: "",
    marks: "",
    from: "",
    to: "",
    POL: "",
    POD: "",
    TIC: JSON.parse(localStorage.getItem("WGuserID")),
    traffic: "",
    incoterms: "",
    CADintrate: 0.06,
    CADdays: 10,
    paymentTerm: "",
    shipmentType: 1,
    freightTotal: 0,
    shippingline: "",
    payload: 0,
    totalinspection: 0,
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
    legal: 1,
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
    saleComplete: 0,
  };
  const QSValuesInit = {
    KTP: "",
    KTS: "",
    saleType: "",
    QSDate: moment().format("yyyy-MM-DD"),
    customer: "",
    packsize: "",
    marks: "",
    from: "",
    to: "",
    POL: "",
    POD: "",
    TIC: JSON.parse(localStorage.getItem("WGusercode")),
    traffic: "",
    incoterms: "",
    CADintrate: "6.00%",
    CADdays: "10",
    paymentTerm: "",
    shipmentType: "Container",
    freightTotal: "0.00",
    shippingline: "",
    payload: "0.00",
    totalinspection: "0.00",
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
    legal: "1.00",
    pallets: "0.00",
    other: "0.00",
    totalcost: "0.00",
    interestrate: "0.00%",
    interestdays: "0",
    pricebeforeint: "0.00",
    salesinterest: "0.00",
    priceafterint: "0.00",
    profit: "0.00",
    margin: "0.00",
    turnover: "0.00",
    pctmargin: "0.00",
    netback: "0.00",
    saleComplete: 0,
  };

  const [QSData, setQSData] = useState(QSDataInit);
  const [QSValues, setQSValues] = useState(QSValuesInit);
  const [positionsddown, setPositionsddown] = useState();
  const [resetfield, setResetfield] = useState(false);
  const [sold, setSold] = useState(false);

  const handleSold = () => {
    setSold(!sold);
  };

  useEffect(() => {
    if (sold) {
      setQSData({ ...QSData, saleComplete: -1 });
    }
    if (!sold) {
      setQSData({ ...QSData, saleComplete: 0 });
    }
  }, [sold]);

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
    const isdecimalnumber = RegExp("^[0-9.,%]+$"); //RegExp("^[0-9\b]+$")
    if (isdecimalnumber.test(e.target.value) || e.target.value === "") {
      if (e.target.value.toString().includes("%")) {
        setQSData({
          ...QSData,
          [e.target.name]:
            Number(e.target.value.replace("%", "")).toFixed(2) / 100,
        });
        setQSValues({
          ...QSValues,
          [e.target.name]: e.target.value.replace("%", ""),
        });
      } else {
        setQSData({
          ...QSData,
          [e.target.name]: Number(e.target.value).toFixed(2) / 100,
        });
        setQSValues({
          ...QSValues,
          [e.target.name]: e.target.value,
        });
      }
    }
  };

  const PercentageBlur = (e) => {
    setQSValues({
      ...QSValues,
      [e.target.name]: Number(e.target.value.replace("%", "")).toFixed(2) + "%",
    });
  };
  const QtyChange = (e) => {
    const isdecimalnumber = RegExp("^[0-9.]+$");
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
      [e.target.name]: Number(e.target.value.replace(",", ""))
        .toFixed(2)
        .replace(/\B(?=(\d{3})+(?!\d))/g, ","),
    });
    if (e.target.value === "") {
      setQSData({ ...QSData, [e.target.name]: 0 });
    }
  };

  const handleCNumInputChange = (e) => {
    e.preventDefault();
    const isInteger = RegExp("^[0-9]+$");
    if (isInteger.test(e.target.value) || e.target.value == "") {
      setQSValues({
        ...QSValues,
        [e.target.name]: e.target.value,
      });
      setQSData({
        ...QSData,
        [e.target.name]: e.target.value,
      });
    }
  };

  // FROM and TO
  //////

  useEffect(() => {
    if (QSValues.from && !QSValues.to) {
      setQSValues({
        ...QSValues,
        to: QSValues.from,
      });
      setQSData({
        ...QSData,
        to: QSData.from,
      });
    }
    if (QSValues.from && QSValues.to) {
      let date1 = moment(QSValues.from);
      let date2 = moment(QSValues.to);
      console.log(date2.diff(date1, "days"));
      if (date2.diff(date1, "days") < 0) {
        confirmAlert({
          title: "Check shipment dates",
          message: `Delivery date (to) cannot be earlier than shipment date (from)`,
          buttons: [
            {
              label: "OK",
            },
          ],
          closeOnClickOutside: true,
          closeOnEscape: true,
        });
      }
      // console.log(moment(QSValues.from).diff(moment(QSValues.to)));
    }
  }, [QSValues.from, QSValues.to]);

  // FREIGHT and PAYLOAD
  //////

  useEffect(() => {
    if (QSData.freightTotal > 0 && QSData.payload > 0) {
      setQSValues({
        ...QSValues,
        freightpmt: (QSData.freightTotal / QSData.payload).toFixed(2),
      });
      setQSData({
        ...QSData,
        freightpmt: QSData.freightTotal / QSData.payload,
      });
    }
  }, [QSData.freightTotal, QSData.payload]);

  // UPDATE SALES INTEREST
  /// intdays, intrate, pricebeforeint

  useEffect(() => {
    setQSData({
      ...QSData,
      salesinterest: Number(
        (
          (QSData.interestrate *
            Number(QSData.interestdays) *
            Number(QSData.pricebeforeint)) /
          360
        ).toFixed(4)
      ),
    });
    setQSValues({
      ...QSValues,
      salesinterest: Number(
        (QSData.interestrate *
          Number(QSData.interestdays) *
          Number(QSData.pricebeforeint)) /
          360
      ).toFixed(2),
    });
    // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [QSData.interestdays, QSData.interestrate]);

  // INTEREST COST and SALES INTEREST
  // CADdays, CADrate, pricebeforeint

  useEffect(() => {
    setQSData({
      ...QSData,
      interestcost: Number(
        (
          (QSData.CADintrate * QSData.CADdays * QSData.pricebeforeint) /
          360
        ).toFixed(4)
      ),
      // salesinterest: Number(
      //   (
      //     (Number(QSData.interestrate) *
      //       Number(QSData.interestdays) *
      //       Number(QSData.pricebeforeint)) /
      //     360
      //   ).toFixed(4)
      // ),
    });
    setQSValues({
      ...QSValues,
      interestcost: Number(
        (QSData.CADintrate * QSData.CADdays * QSData.pricebeforeint) / 360
      ).toFixed(2),
      // salesinterest: Number(
      //   (Number(QSData.interestrate) *
      //     Number(QSData.interestdays) *
      //     Number(QSData.pricebeforeint)) /
      //     360
      // ).toFixed(2),
    });

    // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    QSData.CADdays,
    QSData.CADintrate,
    QSData.pricebeforeint,
    // QSData.salesinterest,
  ]);

  //Update economics
  useEffect(() => {
    // if (QSData.quantity !== 0 && QSData.pricebeforeint !== 0) {
    setQSData({
      ...QSData,
      insurance:
        QSData.incoterms === "CPT" ||
        QSData.incoterms === "CFR" ||
        QSData.incoterms === "DAP"
          ? Number(((QSData.pricebeforeint * 0.07 * 1.1) / 100).toFixed(2))
          : QSData.incoterms === "CIP" || QSData.incoterms === "CIF"
          ? Number(((QSData.pricebeforeint * 0.14 * 1.1) / 100).toFixed(2))
          : 0,
      inspectionpmt:
        QSData.quantity > 0 && QSData.totalinspection
          ? Number((QSData.totalinspection / QSData.quantity).toFixed(2))
          : 0,
      interestcost: Number(
        (
          (QSData.CADintrate * QSData.CADdays * QSData.pricebeforeint) /
          360
        ).toFixed(4)
      ),
      salesinterest: Number(
        (
          (Number(QSData.interestrate) *
            Number(QSData.interestdays) *
            Number(QSData.pricebeforeint)) /
          360
        ).toFixed(4)
      ),
      priceafterint:
        Number(QSData.pricebeforeint) + Number(QSData.salesinterest) * 10,
      profit:
        QSData.quantity !== 0 && QSData.pricebeforeint !== 0
          ? Number((QSData.pricebeforeint - QSData.totalcost).toFixed(4))
          : 0,
      margin:
        QSData.quantity !== 0 && QSData.pricebeforeint !== 0
          ? Number(
              (
                (QSData.pricebeforeint - QSData.totalcost) *
                QSData.quantity
              ).toFixed(4)
            )
          : 0,
      turnover:
        QSData.quantity !== 0 && QSData.pricebeforeint !== 0
          ? Number((QSData.quantity * QSData.pricebeforeint).toFixed(4))
          : 0,
      pctmargin:
        QSData.quantity !== 0 && QSData.pricebeforeint !== 0
          ? Number(
              (
                (QSData.pricebeforeint - QSData.totalcost) /
                QSData.pricebeforeint
              ).toFixed(4)
            )
          : 0,
      netback:
        QSData.quantity !== 0 && QSData.pricebeforeint !== 0
          ? Number(
              (
                QSData.pricebeforeint -
                QSData.totalcost +
                QSData.materialcost
              ).toFixed(4)
            )
          : 0,
    });

    setQSValues({
      ...QSValues,
      insurance:
        QSData.incoterms === "CPT" ||
        QSData.incoterms === "CFR" ||
        QSData.incoterms === "DAP"
          ? Number((QSData.pricebeforeint * 0.07 * 1.1) / 100).toFixed(2)
          : QSData.incoterms === "CIP" || QSData.incoterms === "CIF"
          ? Number((QSData.pricebeforeint * 0.14 * 1.1) / 100).toFixed(2)
          : Number(0).toFixed(2),
      inspectionpmt:
        QSData.quantity > 0 && QSData.totalinspection
          ? Number(QSData.totalinspection / QSData.quantity).toFixed(2)
          : "0.00",
      interestcost: Number(
        (QSData.CADintrate * QSData.CADdays * QSData.pricebeforeint) / 360
      ).toFixed(2),
      salesinterest: Number(
        (Number(QSData.interestrate) *
          Number(QSData.interestdays) *
          Number(QSData.pricebeforeint)) /
          360
      ).toFixed(2),
      priceafterint: Number(
        Number(QSData.pricebeforeint) + Number(QSData.salesinterest) * 10
      ).toFixed(2),
      profit:
        QSData.quantity !== 0 && QSData.pricebeforeint !== 0
          ? Number(QSData.pricebeforeint - QSData.totalcost).toFixed(2)
          : Number(0).toFixed(2),
      margin:
        QSData.quantity !== 0 && QSData.pricebeforeint !== 0
          ? Number((QSData.pricebeforeint - QSData.totalcost) * QSData.quantity)
              .toFixed(2)
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          : Number(0).toFixed(2),
      turnover:
        QSData.quantity !== 0 && QSData.pricebeforeint !== 0
          ? Number(QSData.quantity * QSData.pricebeforeint)
              .toFixed(2)
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          : Number(0).toFixed(2),
      pctmargin:
        QSData.quantity !== 0 && QSData.pricebeforeint !== 0
          ? Number(
              ((QSData.pricebeforeint - QSData.totalcost) /
                QSData.pricebeforeint) *
                100
            ).toFixed(2) + "%"
          : Number(0).toFixed(2) + "%",
      netback:
        QSData.quantity !== 0 && QSData.pricebeforeint !== 0
          ? Number(
              QSData.pricebeforeint - QSData.totalcost + QSData.materialcost
            )
              .toFixed(2)
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          : Number(0).toFixed(2),
    });
    // } else {
    //   setQSData({
    //     ...QSData,
    //     profit: 0,
    //     margin: 0,
    //     turnover: 0,
    //     pctmargin: 0,
    //     netback: 0,
    //   });
    //   setQSValues({
    //     ...QSValues,
    //     profit: Number(0).toFixed(2),
    //     margin: Number(0).toFixed(2),
    //     turnover: Number(0).toFixed(2),
    //     pctmargin: Number(0).toFixed(2) + "%",
    //     netback: Number(0).toFixed(2),
    //   });
    // }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    QSData.quantity,
    QSData.pricebeforeint,
    QSData.totalinspection,
    QSData.incoterms,
  ]);

  // UPDATE ECONOMICS
  // After total cost change

  useEffect(() => {
    if (QSData.quantity !== 0 && QSData.pricebeforeint !== 0) {
      setQSData({
        ...QSData,

        profit:
          QSData.quantity !== 0 && QSData.pricebeforeint !== 0
            ? Number((QSData.pricebeforeint - QSData.totalcost).toFixed(4))
            : 0,
        margin:
          QSData.quantity !== 0 && QSData.pricebeforeint !== 0
            ? Number(
                (
                  (QSData.pricebeforeint - QSData.totalcost) *
                  QSData.quantity
                ).toFixed(4)
              )
            : 0,
        turnover:
          QSData.quantity !== 0 && QSData.pricebeforeint !== 0
            ? Number((QSData.quantity * QSData.pricebeforeint).toFixed(4))
            : 0,
        pctmargin:
          QSData.quantity !== 0 && QSData.pricebeforeint !== 0
            ? Number(
                (
                  (QSData.pricebeforeint - QSData.totalcost) /
                  QSData.pricebeforeint
                ).toFixed(4)
              )
            : 0,
        netback:
          QSData.quantity !== 0 && QSData.pricebeforeint !== 0
            ? Number(
                (
                  QSData.pricebeforeint -
                  QSData.totalcost +
                  QSData.materialcost
                ).toFixed(4)
              )
            : 0,
      });
      setQSValues({
        ...QSValues,

        profit:
          QSData.quantity !== 0 && QSData.pricebeforeint !== 0
            ? Number(QSData.pricebeforeint - QSData.totalcost).toFixed(2)
            : Number(0).toFixed(2),
        margin:
          QSData.quantity !== 0 && QSData.pricebeforeint !== 0
            ? Number(
                (QSData.pricebeforeint - QSData.totalcost) * QSData.quantity
              )
                .toFixed(2)
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            : Number(0).toFixed(2),
        turnover:
          QSData.quantity !== 0 && QSData.pricebeforeint !== 0
            ? Number(QSData.quantity * QSData.pricebeforeint)
                .toFixed(2)
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            : Number(0).toFixed(2),
        pctmargin:
          QSData.quantity !== 0 && QSData.pricebeforeint !== 0
            ? Number(
                ((QSData.pricebeforeint - QSData.totalcost) /
                  QSData.pricebeforeint) *
                  100
              ).toFixed(2) + "%"
            : Number(0).toFixed(2) + "%",
        netback:
          QSData.quantity !== 0 && QSData.pricebeforeint !== 0
            ? Number(
                QSData.pricebeforeint - QSData.totalcost + QSData.materialcost
              )
                .toFixed(2)
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            : Number(0).toFixed(2),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [QSData.totalcost]);

  // PRICEAFTERINT;
  // salesinterest;

  useEffect(() => {
    setQSData({
      ...QSData,

      priceafterint:
        Number(QSData.pricebeforeint) + Number(QSData.salesinterest),
    });
    setQSValues({
      ...QSValues,
      priceafterint: Number(
        Number(QSData.pricebeforeint) + Number(QSData.salesinterest)
      ).toFixed(2),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [QSData.salesinterest]);

  //Update total cost
  useEffect(() => {
    setQSValues({
      ...QSValues,
      totalcost: Number(
        Number(QSData.materialcost) +
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
          Number(QSData.materialcost) +
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  //SAVE QS
  const addQS = async (e) => {
    e.preventDefault();
    await Axios.post("/saveQS", { QSData }).then((response) => {
      toggleQSrefresh();
    });
    await clearQSData();
    // createemail();
  };

  const loadPositions = () => {
    Axios.post("/positiondropdown").then((response) => {
      // console.log(response.data);
      setPositionsddown(response.data);
    });
  };
  const setPosition = (val) => {
    let position = positionsddown[val];
    setQSValues({
      ...QSValues,
      abbreviation: position.product,
      supplier: position.Supplier,
      from: position.start,
      to: position.end,
      KTP: position.KTP,
      materialcost: Number(
        position.Price.replace("$", "").replace(",", "")
      ).toFixed(2),
    });
    setQSData({
      ...QSData,
      abbreviation: position.productID,
      supplier: position.supplierID,
      from: position.start,
      to: position.end,
      KTP: position.KTP,
      materialcost: Number(position.Price.replace("$", "").replace(",", "")),
    });
  };

  const createemail = () => {
    let Subject = `WeGrow - FIRM OFFER - ${QSValues.quantity}mt - ${QSValues.abbreviation} - ${QSValues.customer}`;
    let Message = `Product:   ${QSValues.abbreviation}%0dQuantity:  ${QSValues.quantity} metric tons +/-10% at Seller's option %0dPrice:  ${QSValues.priceafterint} pmt ${QSValues.incoterms} ${QSValues.POD}`;
    window.location.href = `mailto:user@example.com?subject=${Subject}&body=${Message}`;
  };
  const clearQSData = () => {
    setQSValues(QSValuesInit);
    setQSData(QSDataInit);
    setSold(false);
  };

  return (
    <div className="salesQS">
      <h3 className="saleslisttitle">Quotation Sheet</h3>

      <form className="salesQS-form" onSubmit={(e) => addQS(e)}>
        <section id="salesQS-1">
          <div className="form-group">
            <label htmlFor="">QS Date:</label>
            <input
              readOnly
              className="canceldrag"
              value={QSValues.QSDate}
              type="date"
            />
          </div>
          <div className="form-group">
            <label>WGP:</label>
            <input
              name="KTP"
              placeholder="5000..."
              value={QSValues ? QSValues.KTP || "" : ""}
              onChange={handleCNumInputChange}
              className="canceldrag"
            ></input>
          </div>
          <fieldset>
            <legend>Sale Type</legend>
            {/* <div className="form-group"> */}
            <div className="saletype-group">
              <input
                name="saletype"
                type="radio"
                checked={QSData && QSData.saleType === 1 ? true : false}
                required
                onClick={(e) => {
                  setQSData({ ...QSData, saleType: 1 });
                  setQSValues({ ...QSValues, saleType: "Back-to-back" });
                }}
              />
              <label htmlFor="">Back-to-back</label>
            </div>
            <div className="saletype-group">
              <input
                name="saletype"
                type="radio"
                checked={QSData && QSData.saleType === 2 ? true : false}
                required
                onClick={(e) => {
                  setQSData({ ...QSData, saleType: 2 });
                  setQSValues({ ...QSValues, saleType: "Position" });
                  loadPositions();
                }}
              />
              <label htmlFor="">Position</label>
              {QSData && QSData.saleType === 2 ? (
                <select
                  className="WGPSelect"
                  onChange={(e) => setPosition(e.target.value)}
                >
                  <option>Select...</option>
                  {positionsddown
                    ? positionsddown.map((pos, i) => {
                        return (
                          <option value={i}>
                            {pos.KTP +
                              " - " +
                              pos.product +
                              " - " +
                              pos.Supplier}
                          </option>
                        );
                      })
                    : ""}
                  {/* <option>P500320 - T-MAP - Cashmere</option>
                <option>B</option>
                <option>C</option> */}
                </select>
              ) : (
                ""
              )}
            </div>
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
                value={QSValues ? QSValues.abbreviation || "" : ""}
                resetfield={resetfield}
                setResetfield={setResetfield}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="">Supplier:</label>
              <input
                placeholder="Supplier..."
                value={QSValues.supplier}
                type="text"
                required
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
                value={QSValues ? QSValues.customer || "" : ""}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="">Contact:</label>
              <input className="canceldrag" type="text" />
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
                className="canceldrag"
                required
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
                className="canceldrag"
                // required
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
                className="canceldrag"
                required
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
                className="canceldrag"
                required
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
                value={QSValues ? QSValues.POL || "" : ""}
                required
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
                value={QSValues ? QSValues.POD || "" : ""}
                required
              />
            </div>
          </fieldset>
        </section>
        <section id="salesQS-2">
          {/* <div className="form-group">
            <label>WGP:</label>
            <input
              name="KTP"
              value={QSValues ? QSValues.KTP || "" : ""}
              onChange={handleChange}
              className="canceldrag"
            ></input>
          </div> */}
          <div className="soldcheckbox">
            <input
              className="canceldrag"
              name="saleComplete"
              type="checkbox"
              checked={sold}
              onClick={handleSold}
            />
            <label>Sold</label>
          </div>
          <div className="form-group">
            <label>WGS:</label>
            <input
              name="KTS"
              placeholder="5000..."
              value={QSValues ? QSValues.KTS || "" : ""}
              onChange={handleCNumInputChange}
              className="canceldrag"
            ></input>
          </div>
          <fieldset>
            <legend>In Charge</legend>
            <div className="form-group">
              <label htmlFor="">Trader:</label>
              <input
                className="canceldrag"
                value={QSValues.TIC}
                type="text"
                readOnly
              />
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
                value={QSValues ? QSValues.traffic || "" : ""}
              />
            </div>
          </fieldset>
          <fieldset>
            <legend>Terms</legend>
            <div className="form-group">
              <label htmlFor="">Incoterms:</label>
              <input
                placeholder="Incoterms..."
                onChange={handleChange}
                name="incoterms"
                value={QSValues.incoterms}
                type="text"
                onDoubleClick={(e) => {
                  e.target.select();
                }}
                className="canceldrag"
                required
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
                value={QSValues ? QSValues.paymentTerm || "" : ""}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="">Inc. Interest:</label>
              <input
                value={QSValues.CADintrate}
                placeholder="Interest rate..."
                type="text"
                name="CADintrate"
                // onDoubleClick={(e) => {
                //   e.target.select();
                // }}
                onChange={PercentageChange}
                onBlur={PercentageBlur}
                className="canceldrag"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="">Inc. Days:</label>
              <input
                value={QSValues.CADdays}
                name="CADdays"
                onChange={QtyChange}
                type="text"
                placeholder="Days..."
                // onDoubleClick={(e) => {
                //   e.target.select();
                // }}
                className="canceldrag"
                required
              />
            </div>
          </fieldset>

          <div id="shipmenttyperadio" className="form-group">
            {/* <p> */}
            <input
              name="shipmenttype"
              type="radio"
              defaultChecked
              required
              onClick={(e) => {
                setQSData({ ...QSData, shipmentType: 1 });
                setQSValues({ ...QSValues, shipmentType: "Container" });
              }}
            />
            <label htmlFor="">Container</label>
            {/* </p>

            <p> */}
            <input
              name="shipmenttype"
              type="radio"
              required
              onClick={(e) => {
                setQSData({ ...QSData, shipmentType: 2 });
                setQSValues({ ...QSValues, shipmentType: "Breakbulk" });
              }}
            />
            <label htmlFor="">Breakbulk</label>
            <input
              name="shipmenttype"
              type="radio"
              required
              onClick={(e) => {
                setQSData({ ...QSData, shipmentType: 3 });
                setQSValues({ ...QSValues, shipmentType: "Distribution" });
              }}
            />
            <label htmlFor="">Distribution</label>
            {/* </p> */}
          </div>

          {QSData && QSData.shipmentType === 1 ? (
            <fieldset>
              <legend>Freight</legend>
              <div className="form-group">
                <label htmlFor="">Freight ID:</label>
                <input placeholder="[Leave Blank]" type="text" />
              </div>
              <div className="form-group">
                <label htmlFor="">Freight Total:</label>
                <input
                  type="text"
                  name="freightTotal"
                  className="QSfig2 canceldrag"
                  value={QSValues.freightTotal}
                  onChange={QtyChange}
                  onBlur={QtyBlur}
                />
              </div>
              <div className="form-group">
                <label htmlFor="">Shipping Line:</label>
                <input
                  className="canceldrag"
                  placeholder="Shipping Line..."
                  name="shippingline"
                  onChange={handleChange}
                  value={QSValues ? QSValues.shippingline || "" : ""}
                  type="text"
                />
              </div>
              <div className="form-group">
                <label htmlFor="">Payload:</label>
                <input
                  type="text"
                  name="payload"
                  className="QSfig2 canceldrag"
                  value={QSValues.payload}
                  onChange={QtyChange}
                  onBlur={QtyBlur}
                />
              </div>
              <div className="form-group">
                <label htmlFor="">Total Inspection:</label>
                <input
                  name="totalinspection"
                  className="QSfig2 canceldrag"
                  value={QSValues.totalinspection}
                  onChange={QtyChange}
                  onBlur={QtyBlur}
                  type="text"
                />
              </div>
            </fieldset>
          ) : QSData && QSData.shipmentType == 2 ? (
            "Under Construction"
          ) : (
            "Under Construction Too :)"
          )}
        </section>
        <section id="salesQS-3">
          <fieldset id="salesQS-3-fieldset">
            <legend>Figures</legend>
            <section id="salesQS-3-col1">
              <div className="form-group">
                <label htmlFor="">Quantity:</label>
                <input
                  className="QSfig2 canceldrag"
                  name="quantity"
                  value={QSValues.quantity}
                  onChange={QtyChange}
                  type="text"
                  placeholder="MT"
                  // onDoubleClick={(e) => {
                  //   e.target.select();
                  // }}
                  onBlur={QtyBlur}
                  required
                />
              </div>
              <fieldset>
                <legend>Costs</legend>
                <div className="form-group">
                  <label htmlFor="">Material Cost:</label>
                  <input
                    className="QSfig canceldrag"
                    // onDoubleClick={(e) => {
                    //   e.target.select();
                    // }}
                    type="text"
                    placeholder="...Material Cost pmt"
                    onChange={QtyChange}
                    name="materialcost"
                    value={QSValues.materialcost}
                    onBlur={QtyBlur}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="">P Commission:</label>
                  <input
                    className="QSfig canceldrag"
                    // onDoubleClick={(e) => {
                    //   e.target.select();
                    // }}
                    type="text"
                    placeholder="...P Commission pmt"
                    name="pcommission"
                    value={QSValues.pcommission}
                    onChange={QtyChange}
                    onBlur={QtyBlur}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="">P Finance Cost:</label>
                  <input
                    className="QSfig canceldrag"
                    // onDoubleClick={(e) => {
                    //   e.target.select();
                    // }}
                    type="text"
                    placeholder="...P Finance Cost pmt"
                    name="pfinancecost"
                    value={QSValues.pfinancecost}
                    onChange={QtyChange}
                    onBlur={QtyBlur}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="">S Finance Cost:</label>
                  <input
                    className="QSfig canceldrag"
                    value={QSValues.sfinancecost}
                    // onDoubleClick={(e) => {
                    //   e.target.select();
                    // }}
                    name="sfinancecost"
                    placeholder="...S Finance Cost pmt"
                    onChange={QtyChange}
                    onBlur={QtyBlur}
                    type="text"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="">Freight (pmt):</label>
                  <input
                    className="QSfig canceldrag"
                    value={QSValues.freightpmt}
                    // onDoubleClick={(e) => {
                    //   e.target.select();
                    // }}
                    name="freightpmt"
                    placeholder="...Freight pmt"
                    onChange={QtyChange}
                    onBlur={QtyBlur}
                    type="text"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="">Insurance Cost:</label>
                  <input
                    className="QSfig canceldrag"
                    value={QSValues.insurance}
                    // onDoubleClick={(e) => {
                    //   e.target.select();
                    // }}
                    name="insurance"
                    placeholder="...Insurance Cost pmt"
                    onChange={QtyChange}
                    onBlur={QtyBlur}
                    type="text"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="">Inspection Cost:</label>
                  <input
                    className="QSfig canceldrag"
                    value={QSValues.inspectionpmt}
                    // onDoubleClick={(e) => {
                    //   e.target.select();
                    // }}
                    name="inspectionpmt"
                    placeholder="...Inspection Cost pmt"
                    onChange={QtyChange}
                    onBlur={QtyBlur}
                    type="text"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="">S Commission:</label>
                  <input
                    className="QSfig canceldrag"
                    value={QSValues.scommission}
                    // onDoubleClick={(e) => {
                    //   e.target.select();
                    // }}
                    name="scommission"
                    placeholder="...S Commission pmt"
                    onChange={QtyChange}
                    onBlur={QtyBlur}
                    type="text"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="">Interest Cost:</label>
                  <input
                    className="QSfig canceldrag"
                    value={QSValues.interestcost}
                    // onDoubleClick={(e) => {
                    //   e.target.select();
                    // }}
                    name="interestcost"
                    placeholder="...Interest Cost pmt"
                    onChange={QtyChange}
                    onBlur={QtyBlur}
                    type="text"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="">Legal:</label>
                  <input
                    className="QSfig canceldrag"
                    value={QSValues.legal}
                    // onDoubleClick={(e) => {
                    //   e.target.select();
                    // }}
                    name="legal"
                    placeholder="...Legal Cost pmt"
                    onChange={QtyChange}
                    onBlur={QtyBlur}
                    type="text"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="">Pallets:</label>
                  <input
                    className="QSfig canceldrag"
                    value={QSValues.pallets}
                    // onDoubleClick={(e) => {
                    //   e.target.select();
                    // }}
                    name="pallets"
                    placeholder="...Pallets Cost pmt"
                    onChange={QtyChange}
                    onBlur={QtyBlur}
                    type="text"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="">Other:</label>
                  <input
                    className="QSfig canceldrag"
                    value={QSValues.other}
                    // onDoubleClick={(e) => {
                    //   e.target.select();
                    // }}
                    name="other"
                    placeholder="...Other Costs pmt"
                    onChange={QtyChange}
                    onBlur={QtyBlur}
                    type="text"
                    required
                  />
                </div>
              </fieldset>
              <div className="form-group">
                <label htmlFor="">Total Cost:</label>
                <input
                  className="QSfig2 canceldrag"
                  readOnly
                  value={QSValues.totalcost}
                  type="text"
                  required
                />
              </div>
            </section>
            <section id="salesQS-3-col2">
              <fieldset>
                <legend>Sales Interest</legend>
                <div className="form-group">
                  <label htmlFor="">Interest Rate:</label>
                  <input
                    className="QSfig canceldrag"
                    value={QSValues.interestrate}
                    placeholder="...Interest Rate"
                    name="interestrate"
                    // onDoubleClick={(e) => {
                    //   e.target.select();
                    // }}
                    onChange={PercentageChange}
                    onBlur={PercentageBlur}
                    type="text"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="">Interest Days:</label>
                  <input
                    className="QSfig canceldrag"
                    value={QSValues.interestdays}
                    name="interestdays"
                    onChange={QtyChange}
                    placeholder="...Interest Days"
                    // onDoubleClick={(e) => {
                    //   e.target.select();
                    // }}
                    type="text"
                    required
                  />
                </div>
              </fieldset>
              <fieldset>
                <div className="form-group">
                  <label htmlFor="">Price Before Int.:</label>
                  <input
                    className="QSfig canceldrag"
                    value={QSValues.pricebeforeint}
                    // onDoubleClick={(e) => {
                    //   e.target.select();
                    // }}
                    name="pricebeforeint"
                    placeholder="...Price Before Int pmt"
                    onChange={QtyChange}
                    onBlur={QtyBlur}
                    type="text"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="">Sales Interest:</label>
                  <input
                    className="QSfig canceldrag"
                    value={QSValues.salesinterest}
                    readOnly
                    type="text"
                    required
                  />
                </div>
              </fieldset>
              <div className="form-group">
                <label htmlFor="">Price After Int.:</label>
                <input
                  readOnly
                  className="QSfig2 canceldrag"
                  value={QSValues.priceafterint}
                  type="text"
                  required
                />
              </div>
              <fieldset>
                <legend>Economics</legend>
                <div className="form-group">
                  <label htmlFor="">Profit:</label>
                  <input
                    readOnly
                    className="QSfig canceldrag"
                    value={QSValues.profit}
                    type="text"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="">Margin:</label>
                  <input
                    readOnly
                    className="QSfig canceldrag"
                    value={QSValues.margin}
                    type="text"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="">Turnover:</label>
                  <input
                    readOnly
                    className="QSfig canceldrag"
                    value={QSValues.turnover}
                    type="text"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="">% Margin:</label>
                  <input
                    readOnly
                    className="QSfig canceldrag"
                    value={QSValues.pctmargin}
                    type="text"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="">Netback:</label>
                  <input
                    readOnly
                    className="QSfig canceldrag"
                    value={QSValues.netback}
                    type="text"
                    required
                  />
                </div>
              </fieldset>
            </section>
          </fieldset>
          <div id="QSbuttons">
            <button
              type="button"
              onClick={(e) => {
                clearQSData();
              }}
            >
              Clear
            </button>
            <button type="submit">Save and New</button>
            {/* <button type="submit" onClick={(e) => console.log("prepare offer")}>
            Save and Offer
          </button> */}
          </div>
        </section>
      </form>
    </div>
  );
};

export default SalesQS;
