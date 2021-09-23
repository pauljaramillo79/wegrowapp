import React, { useState, useEffect, useContext } from "react";
import "./SalesQS.css";
import moment from "moment";
import QSSearchField from "./QSSearchField";
import Axios from "axios";
import { RefreshPositionsContext } from "../contexts/RefreshPositionsProvider";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

const SalesQS2 = () => {
  const { toggleQSrefresh } = useContext(RefreshPositionsContext);
  const QSDataInit = {
    KTP: "",
    KTS: "",
    saleType: "",
    QSDate: moment().format("yyyy-MM-DD"),
    QSID: "",
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
    QSID: "",
    abbreviation: "",
    supplier: "",
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
    freightTotal: "$ 0.00",
    shippingline: "",
    payload: "0.00",
    totalinspection: "$ 0.00",
    quantity: "",
    materialcost: "$ 0.00",
    pcommission: "$ 0.00",
    pfinancecost: "$ 0.00",
    sfinancecost: "$ 0.00",
    freightpmt: "$ 0.00",
    insurance: "$ 0.00",
    inspectionpmt: "$ 0.00",
    scommission: "$ 0.00",
    interestcost: "$ 0.00",
    legal: "$ 1.00",
    pallets: "$ 0.00",
    other: "$ 0.00",
    totalcost: "$ 0.00",
    interestrate: "0.00%",
    interestdays: "0",
    pricebeforeint: "$ 0.00",
    salesinterest: "$ 0.00",
    priceafterint: "$ 0.00",
    profit: "$ 0.00",
    margin: "$ 0.00",
    turnover: "$ 0.00",
    pctmargin: "0.00%",
    netback: "$ 0.00",
    saleComplete: 0,
  };

  const [QSData, setQSData] = useState(QSDataInit);
  const [QSValues, setQSValues] = useState(QSValuesInit);
  const [positionsddown, setPositionsddown] = useState();
  const [resetfield, setResetfield] = useState(false);
  const [sold, setSold] = useState(false);

  const [QSsaved, setQSSaved] = useState(false);

  const [QSIDList, setQSIDList] = useState([]);
  const [QSIDtoedit, setQSIDtoedit] = useState();
  const [QSID, setQSID] = useState();
  const [QSindex, setQSindex] = useState();
  const [QSindexerror, setQSindexerror] = useState("");

  const [inEuros, setInEuros] = useState(false);
  const [exchangerate, setExchangerate] = useState();

  const [editMode, setEditMode] = useState(false);
  const [QSoriginaltoedit, setQSoriginaltoedit] = useState({});

  useEffect(() => {
    Axios.post("/QSIDList").then((response) => {
      const QSlist = [...new Set(response.data.map((item) => item.QSID))];
      setQSIDList(QSlist);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [QSsaved]);

  useEffect(() => {
    setQSindex(QSIDList.length);
  }, [QSIDList]);

  useEffect(() => {
    if (QSindex === QSIDList.length) {
      setEditMode(false);
    } else {
      setEditMode(true);
    }
  }, [QSindex]);

  useEffect(() => {
    if (QSindex < QSIDList.length) {
      Axios.post("/loadQStoedit", { id: QSIDList[QSindex] }).then(
        (response) => {
          console.log(response.data[0]);
          setQSValues({
            ...QSValues,
            KTP: response.data[0].KTP,
            KTS: response.data[0].KTS,
            QSDate: response.data[0].QSDate,
            saleType: response.data[0].saleType,
            QSID: response.data[0].QSID,
            abbreviation: response.data[0].abbreviation,
            supplier: response.data[0].supplier,
            customer: response.data[0].customer,
            packsize: response.data[0].packsize,
            marks: response.data[0].marks,
            from: response.data[0].from,
            to: response.data[0].to,
            POL: response.data[0].POL,
            POD: response.data[0].POD,
            traffic: response.data[0].traffic,
            incoterms: response.data[0].incoterms,
            paymentTerm: response.data[0].paymentTerm,
            CADintrate: response.data[0].includedrate,
            CADdays: response.data[0].includedperiod,
            freightTotal:
              inEuros && response.data[0].freightTotal
                ? "€ " +
                  (
                    Number(
                      response.data[0].freightTotal
                        .replace("$", "")
                        .replace(",", "")
                    ) / exchangerate
                  )
                    .toFixed(2)
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                : inEuros && !response.data[0].freightTotal
                ? "€ 0.00"
                : response.data[0].freightTotal,
            shippingline: response.data[0].shippingline,
            payload: response.data[0].payload,
            totalinspection:
              inEuros && response.data[0].totalinspection
                ? "€ " +
                  (
                    Number(
                      response.data[0].totalinspection
                        .replace("$", "")
                        .replace(",", "")
                    ) / exchangerate
                  )
                    .toFixed(2)
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                : inEuros && !response.data[0].totalinspection
                ? "€ 0.00"
                : response.data[0].totalinspection,
            quantity: response.data[0].quantity,
            materialcost:
              inEuros && response.data[0].materialcost
                ? "€ " +
                  (
                    Number(
                      response.data[0].materialcost
                        .replace("$", "")
                        .replace(",", "")
                    ) / exchangerate
                  )
                    .toFixed(2)
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                : inEuros && !response.data[0].materialcost
                ? "€ 0.00"
                : response.data[0].materialcost,
            pcommission:
              inEuros && response.data[0].pcommission
                ? "€ " +
                  (
                    Number(
                      response.data[0].pcommission
                        .replace("$", "")
                        .replace(",", "")
                    ) / exchangerate
                  )
                    .toFixed(2)
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                : inEuros && !response.data[0].pcommission
                ? "€ 0.00"
                : response.data[0].pcommission,
            pfinancecost:
              inEuros && response.data[0].pfinancecost
                ? "€ " +
                  (
                    Number(
                      response.data[0].pfinancecost
                        .replace("$", "")
                        .replace(",", "")
                    ) / exchangerate
                  )
                    .toFixed(2)
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                : inEuros && !response.data[0].pfinancecost
                ? "€ 0.00"
                : response.data[0].pfinancecost,
            sfinancecost:
              inEuros && response.data[0].sfinancecost
                ? "€ " +
                  (
                    Number(
                      response.data[0].sfinancecost
                        .replace("$", "")
                        .replace(",", "")
                    ) / exchangerate
                  )
                    .toFixed(2)
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                : inEuros && !response.data[0].sfinancecost
                ? "€ 0.00"
                : response.data[0].sfinancecost,
          });
          setQSData({
            ...QSData,
            KTP: response.data[0].KTP,
            KTS: response.data[0].KTS,
            QSDate: response.data[0].QSDate,
            saleType: response.data[0].saleType,
            QSID: response.data[0].QSID,
            abbreviation: response.data[0].productID,
            supplier: response.data[0].supplierID,
            customer: response.data[0].customerID,
            packsize: response.data[0].packsize,
            marks: response.data[0].marks,
            from: response.data[0].from,
            to: response.data[0].to,
            POL: response.data[0].POLID,
            POD: response.data[0].PODID,
            traffic: response.data[0].trafficID,
            incoterms: response.data[0].incoterms,
            paymentTerm: response.data[0].pTermID,
            CADintrate:
              Number(response.data[0].includedrate.replace("%", "")) / 100,
            CADdays: response.data[0].includedperiod,
            freightTotal: response.data[0].freightTotal
              ? Number(
                  response.data[0].freightTotal
                    .replace("$", "")
                    .replace(",", "")
                )
              : 0,
            shippingline: response.data[0].shippingline,
            payload: response.data[0].payload,
            totalinspection: response.data[0].totalinspection
              ? Number(
                  response.data[0].totalinspection
                    .replace("$", "")
                    .replace(",", "")
                )
              : 0,
            quantity: Number(response.data[0].quantity.replace(",", "")),
            materialcost: response.data[0].materialcost
              ? Number(
                  response.data[0].materialcost
                    .replace("$", "")
                    .replace(",", "")
                )
              : 0,
            pcommission: response.data[0].pcommission
              ? Number(
                  response.data[0].pcommission.replace("$", "").replace(",", "")
                )
              : 0,
            pfinancecost: response.data[0].pfinancecost
              ? Number(
                  response.data[0].pfinancecost
                    .replace("$", "")
                    .replace(",", "")
                )
              : 0,
            sfinancecost: response.data[0].sfinancecost
              ? Number(
                  response.data[0].sfinancecost
                    .replace("$", "")
                    .replace(",", "")
                )
              : 0,
          });
        }
      );
    }
    if (QSindex === QSIDList.length) {
      setQSValues(QSValuesInit);
      setQSData(QSDataInit);
    }
  }, [QSindex]);

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

  const CurrencyChange = (e) => {
    if (inEuros === false) {
      const isCurrency = RegExp("^[ $0-9.]+$");
      if (isCurrency.test(e.target.value) || e.target.value === "") {
        setQSData({
          ...QSData,
          [e.target.name]: Number(
            Number(e.target.value.replace("$", "")).toFixed(2)
          ),
        });
        setQSValues({
          ...QSValues,
          [e.target.name]: e.target.value,
        });
      }
    }
    if (inEuros === true && exchangerate) {
      const isCurrency = RegExp("^[ €0-9.]+$");
      if (isCurrency.test(e.target.value) || e.target.value === "") {
        setQSData({
          ...QSData,
          [e.target.name]:
            Number(Number(e.target.value.replace("€", "")).toFixed(2)) *
            exchangerate,
        });
        setQSValues({
          ...QSValues,
          [e.target.name]: e.target.value,
        });
      }
    }
    if (inEuros === true && (!exchangerate || exchangerate === "")) {
      confirmAlert({
        title: "No Exchange Rate",
        message: `Please input an Exchange Rate ($/€)`,
        buttons: [
          {
            label: "OK",
          },
        ],
        closeOnClickOutside: true,
        closeOnEscape: true,
      });
    }
  };

  const CurrencyBlur = (e) => {
    if (inEuros === false) {
      setQSValues({
        ...QSValues,
        [e.target.name]:
          "$ " +
          Number(e.target.value.replace(",", "").replace("$", ""))
            .toFixed(2)
            .replace(/\B(?=(\d{3})+(?!\d))/g, ","),
      });
      if (e.target.value === "" || e.target.value === "$") {
        setQSData({
          ...QSData,
          [e.target.name]: 0,
        });
      }
    }
    if (inEuros === true) {
      setQSValues({
        ...QSValues,
        [e.target.name]:
          "€ " +
          Number(e.target.value.replace(",", "").replace("€", ""))
            .toFixed(2)
            .replace(/\B(?=(\d{3})+(?!\d))/g, ","),
      });
      if (e.target.value === "" || e.target.value === "€") {
        setQSData({
          ...QSData,
          [e.target.name]: 0,
        });
      }
    }
  };

  const handleCNumInputChange = (e) => {
    e.preventDefault();
    const isInteger = RegExp("^[0-9]+$");
    if (isInteger.test(e.target.value) || e.target.value === "") {
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
    if (inEuros === false) {
      if (QSData.freightTotal > 0 && QSData.payload > 0) {
        setQSValues({
          ...QSValues,
          freightpmt: "$ " + (QSData.freightTotal / QSData.payload).toFixed(2),
        });
        setQSData({
          ...QSData,
          freightpmt: QSData.freightTotal / QSData.payload,
        });
      }
    }
    if (inEuros === true) {
      if (QSData.freightTotal > 0 && QSData.payload > 0) {
        setQSValues({
          ...QSValues,
          freightpmt:
            "€ " +
            (QSData.freightTotal / QSData.payload / exchangerate).toFixed(2),
        });
        setQSData({
          ...QSData,
          freightpmt: QSData.freightTotal / QSData.payload,
        });
      }
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
    if (inEuros === true && exchangerate) {
      setQSValues({
        ...QSValues,
        salesinterest:
          "€ " +
          Number(
            (QSData.interestrate *
              Number(QSData.interestdays) *
              Number(QSData.pricebeforeint)) /
              360 /
              exchangerate
          ).toFixed(2),
      });
    }

    if (inEuros === false) {
      setQSValues({
        ...QSValues,
        salesinterest:
          "$ " +
          Number(
            (QSData.interestrate *
              Number(QSData.interestdays) *
              Number(QSData.pricebeforeint)) /
              360
          ).toFixed(2),
      });
    }
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
    });
    if (inEuros === true && exchangerate) {
      setQSValues({
        ...QSValues,
        interestcost:
          "€ " +
          Number(
            (QSData.CADintrate * QSData.CADdays * QSData.pricebeforeint) /
              360 /
              exchangerate
          ).toFixed(2),
      });
    }
    if (inEuros === false) {
      setQSValues({
        ...QSValues,
        interestcost:
          "$ " +
          Number(
            (QSData.CADintrate * QSData.CADdays * QSData.pricebeforeint) / 360
          ).toFixed(2),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [QSData.CADdays, QSData.CADintrate, QSData.pricebeforeint]);

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

    if (inEuros === true && exchangerate) {
      setQSValues({
        ...QSValues,
        insurance:
          QSData.incoterms === "CPT" ||
          QSData.incoterms === "CFR" ||
          QSData.incoterms === "DAP"
            ? "€ " +
              Number(
                (QSData.pricebeforeint * 0.07 * 1.1) / 100 / exchangerate
              ).toFixed(2)
            : QSData.incoterms === "CIP" || QSData.incoterms === "CIF"
            ? "€ " +
              Number(
                (QSData.pricebeforeint * 0.14 * 1.1) / 100 / exchangerate
              ).toFixed(2)
            : "€ " + Number(0).toFixed(2),
        inspectionpmt:
          QSData.quantity > 0 && QSData.totalinspection
            ? "€ " +
              Number(
                QSData.totalinspection / QSData.quantity / exchangerate
              ).toFixed(2)
            : "$ 0.00",
        interestcost:
          "€ " +
          Number(
            (QSData.CADintrate * QSData.CADdays * QSData.pricebeforeint) /
              360 /
              exchangerate
          ).toFixed(2),
        salesinterest:
          "€ " +
          Number(
            (Number(QSData.interestrate) *
              Number(QSData.interestdays) *
              Number(QSData.pricebeforeint)) /
              360 /
              exchangerate
          ).toFixed(2),
        priceafterint:
          "€ " +
          Number(
            Number(QSData.pricebeforeint) +
              (Number(QSData.salesinterest) * 10) / exchangerate
          )
            .toFixed(2)
            .replace(/\B(?=(\d{3})+(?!\d))/g, ","),
        profit:
          QSData.quantity !== 0 && QSData.pricebeforeint !== 0
            ? "€ " +
              Number(
                (QSData.pricebeforeint - QSData.totalcost) / exchangerate
              ).toFixed(2)
            : "€ " +
              Number(0)
                .toFixed(2)
                .replace(/\B(?=(\d{3})+(?!\d))/g, ","),
        margin:
          QSData.quantity !== 0 && QSData.pricebeforeint !== 0
            ? "€ " +
              Number(
                ((QSData.pricebeforeint - QSData.totalcost) * QSData.quantity) /
                  exchangerate
              )
                .toFixed(2)
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            : "€ " + Number(0).toFixed(2),
        turnover:
          QSData.quantity !== 0 && QSData.pricebeforeint !== 0
            ? "€ " +
              Number((QSData.quantity * QSData.pricebeforeint) / exchangerate)
                .toFixed(2)
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            : "€ " + Number(0).toFixed(2),
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
            ? "€ " +
              Number(
                (QSData.pricebeforeint -
                  QSData.totalcost +
                  QSData.materialcost) /
                  exchangerate
              )
                .toFixed(2)
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            : "€ " + Number(0).toFixed(2),
      });
    }
    if (inEuros === false) {
      setQSValues({
        ...QSValues,
        insurance:
          QSData.incoterms === "CPT" ||
          QSData.incoterms === "CFR" ||
          QSData.incoterms === "DAP"
            ? "$ " +
              Number((QSData.pricebeforeint * 0.07 * 1.1) / 100).toFixed(2)
            : QSData.incoterms === "CIP" || QSData.incoterms === "CIF"
            ? "$ " +
              Number((QSData.pricebeforeint * 0.14 * 1.1) / 100).toFixed(2)
            : "$ " + Number(0).toFixed(2),
        inspectionpmt:
          QSData.quantity > 0 && QSData.totalinspection
            ? "$ " + Number(QSData.totalinspection / QSData.quantity).toFixed(2)
            : "$ 0.00",
        interestcost:
          "$ " +
          Number(
            (QSData.CADintrate * QSData.CADdays * QSData.pricebeforeint) / 360
          ).toFixed(2),
        salesinterest:
          "$ " +
          Number(
            (Number(QSData.interestrate) *
              Number(QSData.interestdays) *
              Number(QSData.pricebeforeint)) /
              360
          ).toFixed(2),
        priceafterint:
          "$ " +
          Number(
            Number(QSData.pricebeforeint) + Number(QSData.salesinterest) * 10
          )
            .toFixed(2)
            .replace(/\B(?=(\d{3})+(?!\d))/g, ","),
        profit:
          QSData.quantity !== 0 && QSData.pricebeforeint !== 0
            ? "$ " + Number(QSData.pricebeforeint - QSData.totalcost).toFixed(2)
            : "$ " +
              Number(0)
                .toFixed(2)
                .replace(/\B(?=(\d{3})+(?!\d))/g, ","),
        margin:
          QSData.quantity !== 0 && QSData.pricebeforeint !== 0
            ? "$ " +
              Number(
                (QSData.pricebeforeint - QSData.totalcost) * QSData.quantity
              )
                .toFixed(2)
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            : "$ " + Number(0).toFixed(2),
        turnover:
          QSData.quantity !== 0 && QSData.pricebeforeint !== 0
            ? "$ " +
              Number(QSData.quantity * QSData.pricebeforeint)
                .toFixed(2)
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            : "$ " + Number(0).toFixed(2),
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
            ? "$ " +
              Number(
                QSData.pricebeforeint - QSData.totalcost + QSData.materialcost
              )
                .toFixed(2)
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            : "$ " + Number(0).toFixed(2),
      });
    }
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
      if (inEuros === true && exchangerate) {
        setQSValues({
          ...QSValues,
          profit:
            QSData.quantity !== 0 && QSData.pricebeforeint !== 0
              ? "€ " +
                Number(
                  (QSData.pricebeforeint - QSData.totalcost) / exchangerate
                ).toFixed(2)
              : "€ " +
                Number(0)
                  .toFixed(2)
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ","),
          margin:
            QSData.quantity !== 0 && QSData.pricebeforeint !== 0
              ? "€ " +
                Number(
                  ((QSData.pricebeforeint - QSData.totalcost) *
                    QSData.quantity) /
                    exchangerate
                )
                  .toFixed(2)
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              : "€ " + Number(0).toFixed(2),
          turnover:
            QSData.quantity !== 0 && QSData.pricebeforeint !== 0
              ? "€ " +
                Number((QSData.quantity * QSData.pricebeforeint) / exchangerate)
                  .toFixed(2)
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              : "€ " + Number(0).toFixed(2),
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
              ? "€ " +
                Number(
                  (QSData.pricebeforeint -
                    QSData.totalcost +
                    QSData.materialcost) /
                    exchangerate
                )
                  .toFixed(2)
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              : "€ " + Number(0).toFixed(2),
        });
      }
      if (inEuros === false) {
        setQSValues({
          ...QSValues,
          profit:
            QSData.quantity !== 0 && QSData.pricebeforeint !== 0
              ? "$ " +
                Number(QSData.pricebeforeint - QSData.totalcost).toFixed(2)
              : "$ " +
                Number(0)
                  .toFixed(2)
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ","),
          margin:
            QSData.quantity !== 0 && QSData.pricebeforeint !== 0
              ? "$ " +
                Number(
                  (QSData.pricebeforeint - QSData.totalcost) * QSData.quantity
                )
                  .toFixed(2)
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              : "$ " + Number(0).toFixed(2),
          turnover:
            QSData.quantity !== 0 && QSData.pricebeforeint !== 0
              ? "$ " +
                Number(QSData.quantity * QSData.pricebeforeint)
                  .toFixed(2)
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              : "$ " + Number(0).toFixed(2),
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
              ? "$ " +
                Number(
                  QSData.pricebeforeint - QSData.totalcost + QSData.materialcost
                )
                  .toFixed(2)
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              : "$ " + Number(0).toFixed(2),
        });
      }
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
    if (inEuros === true && exchangerate) {
      setQSValues({
        ...QSValues,
        priceafterint:
          "€ " +
          Number(
            (Number(QSData.pricebeforeint) + Number(QSData.salesinterest)) /
              exchangerate
          )
            .toFixed(2)
            .replace(/\B(?=(\d{3})+(?!\d))/g, ","),
      });
    }
    if (inEuros === false) {
      setQSValues({
        ...QSValues,
        priceafterint:
          "$ " +
          Number(Number(QSData.pricebeforeint) + Number(QSData.salesinterest))
            .toFixed(2)
            .replace(/\B(?=(\d{3})+(?!\d))/g, ","),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [QSData.salesinterest]);

  //Update total cost
  useEffect(() => {
    if (inEuros === true && exchangerate) {
      setQSValues({
        ...QSValues,
        totalcost:
          "€ " +
          Number(
            Number(
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
            ) / exchangerate
          )
            .toFixed(2)
            .replace(/\B(?=(\d{3})+(?!\d))/g, ","),
      });
    }
    if (inEuros === false) {
      setQSValues({
        ...QSValues,
        totalcost:
          "$ " +
          Number(
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
          )
            .toFixed(2)
            .replace(/\B(?=(\d{3})+(?!\d))/g, ","),
      });
    }
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

  // CONVERT TO EUROS
  useEffect(() => {
    if (inEuros === true) {
      setQSValues({
        ...QSValues,
        freightTotal:
          "€ " +
          (QSData.freightTotal / exchangerate)
            .toFixed(2)
            .replace(/\B(?=(\d{3})+(?!\d))/g, ","),
        totalinspection:
          "€ " +
          (QSData.totalinspection / exchangerate)
            .toFixed(2)
            .replace(/\B(?=(\d{3})+(?!\d))/g, ","),
        materialcost:
          "€ " +
          (QSData.materialcost / exchangerate)
            .toFixed(2)
            .replace(/\B(?=(\d{3})+(?!\d))/g, ","),
        pcommission: "€ " + (QSData.pcommission / exchangerate).toFixed(2),
        pfinancecost: "€ " + (QSData.pfinancecost / exchangerate).toFixed(2),
        sfinancecost: "€ " + (QSData.sfinancecost / exchangerate).toFixed(2),
        freightpmt: "€ " + (QSData.freightpmt / exchangerate).toFixed(2),
        insurance: "€ " + (QSData.insurance / exchangerate).toFixed(2),
        inspectionpmt: "€ " + (QSData.inspectionpmt / exchangerate).toFixed(2),
        scommission: "€ " + (QSData.scommission / exchangerate).toFixed(2),
        interestcost: "€ " + (QSData.interestcost / exchangerate).toFixed(2),
        legal: "€ " + (QSData.legal / exchangerate).toFixed(2),
        pallets: "€ " + (QSData.pallets / exchangerate).toFixed(2),
        other: "€ " + (QSData.other / exchangerate).toFixed(2),
        totalcost:
          "€ " +
          (QSData.totalcost / exchangerate)
            .toFixed(2)
            .replace(/\B(?=(\d{3})+(?!\d))/g, ","),
        pricebeforeint:
          "€ " +
          (QSData.pricebeforeint / exchangerate)
            .toFixed(2)
            .replace(/\B(?=(\d{3})+(?!\d))/g, ","),
        salesinterest: "€ " + (QSData.salesinterest / exchangerate).toFixed(2),
        priceafterint:
          "€ " +
          (QSData.priceafterint / exchangerate)
            .toFixed(2)
            .replace(/\B(?=(\d{3})+(?!\d))/g, ","),
        profit:
          "€ " +
          (QSData.profit / exchangerate)
            .toFixed(2)
            .replace(/\B(?=(\d{3})+(?!\d))/g, ","),
        margin:
          "€ " +
          (QSData.margin / exchangerate)
            .toFixed(2)
            .replace(/\B(?=(\d{3})+(?!\d))/g, ","),
        turnover:
          "€ " +
          (QSData.turnover / exchangerate)
            .toFixed(2)
            .replace(/\B(?=(\d{3})+(?!\d))/g, ","),
        netback:
          "€ " +
          (QSData.netback / exchangerate)
            .toFixed(2)
            .replace(/\B(?=(\d{3})+(?!\d))/g, ","),
      });
    }
    if (inEuros === false) {
      setQSValues({
        ...QSValues,
        freightTotal:
          "$ " +
          QSData.freightTotal.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
        totalinspection:
          "$ " +
          QSData.totalinspection
            .toFixed(2)
            .replace(/\B(?=(\d{3})+(?!\d))/g, ","),
        materialcost:
          "$ " +
          QSData.materialcost.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
        pcommission: "$ " + QSData.pcommission.toFixed(2),
        pfinancecost: "$ " + QSData.pfinancecost.toFixed(2),
        sfinancecost: "$ " + QSData.sfinancecost.toFixed(2),
        freightpmt: "$ " + QSData.freightpmt.toFixed(2),
        insurance: "$ " + QSData.insurance.toFixed(2),
        inspectionpmt: "$ " + QSData.inspectionpmt.toFixed(2),
        scommission: "$ " + QSData.scommission.toFixed(2),
        interestcost: "$ " + QSData.interestcost.toFixed(2),
        legal: "$ " + QSData.legal.toFixed(2),
        pallets: "$ " + QSData.pallets.toFixed(2),
        other: "$ " + QSData.other.toFixed(2),
        totalcost:
          "$ " +
          QSData.totalcost.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
        pricebeforeint:
          "$ " +
          QSData.pricebeforeint
            .toFixed(2)
            .replace(/\B(?=(\d{3})+(?!\d))/g, ","),
        salesinterest: "$ " + QSData.salesinterest.toFixed(2),
        priceafterint:
          "$ " +
          QSData.priceafterint.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
        profit:
          "$ " + QSData.profit.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
        margin:
          "$ " + QSData.margin.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
        turnover:
          "$ " +
          QSData.turnover.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
        netback:
          "$ " +
          QSData.netback.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
      });
    }
  }, [inEuros]);

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
      <div className="salesQStitleline">
        <h3 className="saleslisttitle">Quotation Sheet</h3>
        <span style={{ width: "100px", fontWeight: "bold" }}>
          {editMode ? "Edit Mode" : "New QS"}
        </span>
        <div className="QSindexbox">
          <div className="salesQSnavbuttons">
            <button
              onClick={(e) => {
                e.preventDefault();
                // console.log(QSindex);
                setQSindex(QSindex - 1);
                setQSIDtoedit(QSIDList[QSindex - 1]);
                setQSID(QSIDList[QSindex - 1]);
              }}
            >
              Prev
            </button>

            <input
              className="canceldrag"
              type="text"
              placeholder=" New..."
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  console.log(e.target.value);
                  console.log(QSIDList);
                  if (QSIDList.includes(Number(e.target.value))) {
                    setQSindex(QSIDList.indexOf(Number(e.target.value)));
                    setQSindexerror("");
                  } else {
                    setQSindexerror("QSID not found.");
                    console.log("nope");
                  }
                }
              }}
              onChange={(e) => setQSIDtoedit(e.target.value)}
              // onEnter={(e) => {
              //   console.log("yep");
              //   if (QSIDList.includes(e.target.value)) {
              //     console.log("yep");
              //   } else {
              //     console.log("nope");
              //   }
              // }}
              value={QSIDtoedit ? QSIDtoedit : ""}
            />

            <button
              onClick={(e) => {
                e.preventDefault();
                console.log(QSindex);
                setQSindex(
                  QSindex < QSIDList.length ? QSindex + 1 : QSIDList.length
                );
                setQSIDtoedit(
                  QSindex < QSIDList.length - 1 ? QSIDList[QSindex + 1] : ""
                );
                setQSID(
                  QSindex < QSIDList.length - 1 ? QSIDList[QSindex + 1] : ""
                );
              }}
            >
              Next
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                setQSindex(QSIDList.length);
                setQSIDtoedit("");
                setQSID("");
              }}
            >
              New
            </button>
          </div>
          <span className="QSIDerror">{QSindexerror}</span>
        </div>
      </div>

      <form
        className={editMode ? "salesQS-form editmode" : "salesQS-form"}
        onSubmit={(e) => addQS(e)}
      >
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
            <div className="form-group">
              <label htmlFor="">QSID:</label>
              <input
                placeholder="New QS"
                readOnly
                value={QSData ? QSData.QSID || "" : ""}
              />
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
                onChange={(e) => {
                  if (inEuros === true && !exchangerate) {
                    confirmAlert({
                      title: "No Exchange Rate",
                      message: `Please input an Exchange Rate ($/€)`,
                      buttons: [
                        {
                          label: "OK",
                        },
                      ],
                      closeOnClickOutside: true,
                      closeOnEscape: true,
                    });
                  } else {
                    PercentageChange(e);
                  }
                }}
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
                onChange={(e) => {
                  if (inEuros === true && !exchangerate) {
                    confirmAlert({
                      title: "No Exchange Rate",
                      message: `Please input an Exchange Rate ($/€)`,
                      buttons: [
                        {
                          label: "OK",
                        },
                      ],
                      closeOnClickOutside: true,
                      closeOnEscape: true,
                    });
                  } else {
                    QtyChange(e);
                  }
                }}
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
                  onChange={CurrencyChange}
                  onBlur={CurrencyBlur}
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
                  onChange={CurrencyChange}
                  onBlur={CurrencyBlur}
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
          <fieldset id="salesQS-3-fieldset" style={{ paddingBottom: "2rem" }}>
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
                    onChange={CurrencyChange}
                    name="materialcost"
                    value={QSValues.materialcost}
                    onBlur={CurrencyBlur}
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
                    onChange={CurrencyChange}
                    onBlur={CurrencyBlur}
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
                    onChange={CurrencyChange}
                    onBlur={CurrencyBlur}
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
                    onChange={CurrencyChange}
                    onBlur={CurrencyBlur}
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
                    onChange={CurrencyChange}
                    onBlur={CurrencyBlur}
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
                    onChange={CurrencyChange}
                    onBlur={CurrencyBlur}
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
                    onChange={CurrencyChange}
                    onBlur={CurrencyBlur}
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
                    onChange={CurrencyChange}
                    onBlur={CurrencyBlur}
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
                    onChange={CurrencyChange}
                    onBlur={CurrencyBlur}
                    type="text"
                    required
                    readOnly
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
                    onChange={CurrencyChange}
                    onBlur={CurrencyBlur}
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
                    onChange={CurrencyChange}
                    onBlur={CurrencyBlur}
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
                    onChange={CurrencyChange}
                    onBlur={CurrencyBlur}
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
                    onChange={(e) => {
                      if (inEuros === true && !exchangerate) {
                        confirmAlert({
                          title: "No Exchange Rate",
                          message: `Please input an Exchange Rate ($/€)`,
                          buttons: [
                            {
                              label: "OK",
                            },
                          ],
                          closeOnClickOutside: true,
                          closeOnEscape: true,
                        });
                      } else {
                        PercentageChange(e);
                      }
                    }}
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
                    onChange={(e) => {
                      if (inEuros === true && !exchangerate) {
                        confirmAlert({
                          title: "No Exchange Rate",
                          message: `Please input an Exchange Rate ($/€)`,
                          buttons: [
                            {
                              label: "OK",
                            },
                          ],
                          closeOnClickOutside: true,
                          closeOnEscape: true,
                        });
                      } else {
                        QtyChange(e);
                      }
                    }}
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
                    onChange={CurrencyChange}
                    onBlur={CurrencyBlur}
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
              <div id="exchangerate" className="form-group">
                <label>Exch. Rate ($/€):</label>
                <input
                  className="canceldrag"
                  onChange={(e) => {
                    e.preventDefault();
                    const isdecimalnumber = RegExp("^[0-9.]+$");
                    if (
                      isdecimalnumber.test(e.target.value) ||
                      e.target.value === ""
                    ) {
                      console.log("hey u");
                      setExchangerate(e.target.value);
                    }
                  }}
                  value={exchangerate ? exchangerate : ""}
                  placeholder="$/€ (up to 4 decimals)"
                />
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    if (!exchangerate || exchangerate === "") {
                      confirmAlert({
                        title: "No Exchange Rate",
                        message: `Please input an Exchange Rate ($/€)`,
                        buttons: [
                          {
                            label: "OK",
                          },
                        ],
                        closeOnClickOutside: true,
                        closeOnEscape: true,
                      });
                    } else {
                      setInEuros(!inEuros);
                    }
                  }}
                >
                  {!inEuros ? "Convert To Euros" : "Convert To USD"}
                </button>
              </div>
            </section>
          </fieldset>
          <div id="QSbuttons">
            {QSIDtoedit === "" || !QSIDtoedit ? (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    clearQSData();
                  }}
                >
                  Clear
                </button>
                <button type="submit">Save and New</button>
              </>
            ) : (
              <button type="button">Save Edits</button>
            )}
            {/* <button type="submit" onClick={(e) => console.log("prepare offer")}>
            Save and Offer
          </button> */}
          </div>
        </section>
      </form>
    </div>
  );
};

export default SalesQS2;
