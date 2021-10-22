import React, { useState, useEffect, useContext } from "react";
import "./SalesQS.css";
import moment from "moment";
import QSSearchField from "./QSSearchField";
import Axios from "axios";
import { RefreshPositionsContext } from "../contexts/RefreshPositionsProvider";
import { LoadQSContext } from "../contexts/LoadQSProvider";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { ReactComponent as UnlockedIcon } from "../assets/_images/unlocked.svg";
import { ReactComponent as LockedIcon } from "../assets/_images/locked.svg";

const SalesQS2 = () => {
  const { toggleQSrefresh } = useContext(RefreshPositionsContext);
  const { QStoload, diffQS, duplicateBoolean } = useContext(LoadQSContext);

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
    totalcost: 1,
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
    totalcost: "$ 1.00",
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
    saleComplete: "indication",
  };

  const [QSData, setQSData] = useState(QSDataInit);
  const [QSValues, setQSValues] = useState(QSValuesInit);
  const [positionsddown, setPositionsddown] = useState();
  const [resetfield, setResetfield] = useState(false);
  const [sold, setSold] = useState(false);
  const [allocated, setAllocated] = useState(false);

  const [QSsaved, setQSSaved] = useState(false);

  const [QSIDList, setQSIDList] = useState([]);
  const [QSIDtoedit, setQSIDtoedit] = useState();
  const [QSID, setQSID] = useState();
  const [QSindex, setQSindex] = useState();
  const [QSindexerror, setQSindexerror] = useState("");

  const [inEuros, setInEuros] = useState(false);
  const [exchangerate, setExchangerate] = useState();
  const [lockER, setLockER] = useState(false);

  const [editMode, setEditMode] = useState(false);
  const [QSOriginal, setQSOriginal] = useState({});

  const [QSOriginalData, setQSOriginalData] = useState({});

  const [editing, setEditing] = useState(false);

  const [consolidatedEdits, setConsolidatedEdits] = useState({});

  const [loading, setLoading] = useState(false);

  const [userID, setUserID] = useState(
    JSON.parse(localStorage.getItem("WGusercode"))
  );
  const [traders, setTraders] = useState();

  useEffect(() => {
    Axios.post("/traders").then((response) => {
      setTraders(response.data);
    });
  }, []);

  useEffect(() => {
    Axios.post("/QSIDList", { user: userID }).then((response) => {
      const QSlist = [...new Set(response.data.map((item) => item.QSID))];
      setQSIDList(QSlist);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [QSsaved, userID, duplicateBoolean]);

  useEffect(() => {
    setQSindex(QSIDList.length);
  }, [QSIDList]);

  useEffect(() => {
    if (QSindex === QSIDList.length) {
      setEditMode(false);
      setSold(false);
      setAllocated(false);
    } else {
      setEditMode(true);
    }
  }, [QSindex]);

  useEffect(() => {
    if (QSIDList.includes(QStoload)) {
      if (editing === true) {
        checkChanges(QSValues, QSOriginal, "enter", QStoload);
      }
      if (editing === false) {
        setQSindex(QSIDList.indexOf(QStoload));
        setQSIDtoedit(QStoload);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [QStoload, diffQS]);

  useEffect(() => {
    if (QSindex < QSIDList.length) {
      Axios.post("/loadQStoedit", { id: QSIDList[QSindex] }).then(
        (response) => {
          const changeER = (resp) => {
            return new Promise((resolve, reject) => {
              if (resp.data[0].exchRate) {
                setExchangerate(Number(resp.data[0].exchRate));
                resolve(Number(resp.data[0].exchRate));
              }
              if (!resp.data[0].exchRate) {
                setExchangerate(Number(resp.data[0].exchRate));
                resolve(1);
              }
            });
          };
          const checkER = (resp) => {
            return new Promise((resolve, reject) => {
              if (resp.data[0].exchRate) {
                resolve(true);
              }
              if (!resp.data[0].exchRate && inEuros) {
                setInEuros(false);
                setExchangerate(Number(resp.data[0].exchRate));
                confirmAlert({
                  title: "Back to $ dollars!",
                  message: `This QS does not have an Exchange Rate defined. Reverting back to $ dollar currency`,
                  buttons: [
                    {
                      label: "OK",
                    },
                  ],
                  closeOnClickOutside: true,
                  closeOnEscape: true,
                });
                resolve(false);
              }
              if (!resp.data[0].exchRate && !inEuros) {
                setExchangerate(Number(resp.data[0].exchRate));
                resolve(false);
              }
            });
          };
          const loading = () => {
            return new Promise((resolve, reject) => {
              setLoading(true);
              resolve();
            });
          };
          const doneloading = () => {
            return new Promise((resolve, reject) => {
              setLoading(false);
              resolve();
            });
          };
          const doWork = async () => {
            const check = await checkER(response);
            const exrate = await changeER(response);
            await loading();
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
              saleComplete:
                response.data[0].saleComplete === -1 ? "sold" : "indication",
              TIC: response.data[0].trader,
              traffic: response.data[0].traffic,
              incoterms: response.data[0].incoterms,
              paymentTerm: response.data[0].paymentTerm,
              CADintrate: response.data[0].includedrate,
              CADdays: response.data[0].includedperiod,
              shipmentType: response.data[0].shipmentType
                ? response.data[0].shipmentType
                : "Container",
              freightTotal:
                check && inEuros && response.data[0].freightTotal
                  ? "€ " +
                    (
                      Number(
                        response.data[0].freightTotal
                          .replace("$", "")
                          .replace(",", "")
                      ) / exrate
                    )
                      .toFixed(2)
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  : check && inEuros && !response.data[0].freightTotal
                  ? "€ 0.00"
                  : response.data[0].freightTotal,
              shippingline: response.data[0].shippingline,
              payload: response.data[0].payload,
              totalinspection:
                check && inEuros && response.data[0].totalinspection
                  ? "€ " +
                    (
                      Number(
                        response.data[0].totalinspection
                          .replace("$", "")
                          .replace(",", "")
                      ) / exrate
                    )
                      .toFixed(2)
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  : check && inEuros && !response.data[0].totalinspection
                  ? "€ 0.00"
                  : response.data[0].totalinspection,
              quantity: response.data[0].quantity,
              materialcost:
                check && inEuros && response.data[0].materialcost
                  ? "€ " +
                    (
                      Number(
                        response.data[0].materialcost
                          .replace("$", "")
                          .replace(",", "")
                      ) / exrate
                    )
                      .toFixed(2)
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  : check && inEuros && !response.data[0].materialcost
                  ? "€ 0.00"
                  : response.data[0].materialcost,
              pcommission:
                check && inEuros && response.data[0].pcommission
                  ? "€ " +
                    (
                      Number(
                        response.data[0].pcommission
                          .replace("$", "")
                          .replace(",", "")
                      ) / exrate
                    )
                      .toFixed(2)
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  : check && inEuros && !response.data[0].pcommission
                  ? "€ 0.00"
                  : response.data[0].pcommission,
              pfinancecost:
                check && inEuros && response.data[0].pfinancecost
                  ? "€ " +
                    (
                      Number(
                        response.data[0].pfinancecost
                          .replace("$", "")
                          .replace(",", "")
                      ) / exrate
                    )
                      .toFixed(2)
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  : check && inEuros && !response.data[0].pfinancecost
                  ? "€ 0.00"
                  : response.data[0].pfinancecost,
              sfinancecost:
                check && inEuros && response.data[0].sfinancecost
                  ? "€ " +
                    (
                      Number(
                        response.data[0].sfinancecost
                          .replace("$", "")
                          .replace(",", "")
                      ) / exrate
                    )
                      .toFixed(2)
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  : check && inEuros && !response.data[0].sfinancecost
                  ? "€ 0.00"
                  : response.data[0].sfinancecost,
              freightpmt:
                check && inEuros && response.data[0].freightpmt
                  ? "€ " +
                    (
                      Number(
                        response.data[0].freightpmt
                          .replace("$", "")
                          .replace(",", "")
                      ) / exrate
                    )
                      .toFixed(2)
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  : check && inEuros && !response.data[0].freightpmt
                  ? "€ 0.00"
                  : response.data[0].freightpmt,
              insurance:
                check && inEuros && response.data[0].insurance
                  ? "€ " +
                    (
                      Number(
                        response.data[0].insurance
                          .replace("$", "")
                          .replace(",", "")
                      ) / exrate
                    )
                      .toFixed(2)
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  : check && inEuros && !response.data[0].insurance
                  ? "€ 0.00"
                  : response.data[0].insurance,
              inspectionpmt:
                check && inEuros && response.data[0].inspectionpmt
                  ? "€ " +
                    (
                      Number(
                        response.data[0].inspectionpmt
                          .replace("$", "")
                          .replace(",", "")
                      ) / exrate
                    )
                      .toFixed(2)
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  : check && inEuros && !response.data[0].inspectionpmt
                  ? "€ 0.00"
                  : response.data[0].inspectionpmt,
              scommission:
                check && inEuros && response.data[0].scommission
                  ? "€ " +
                    (
                      Number(
                        response.data[0].scommission
                          .replace("$", "")
                          .replace(",", "")
                      ) / exrate
                    )
                      .toFixed(2)
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  : check && inEuros && !response.data[0].scommission
                  ? "€ 0.00"
                  : response.data[0].scommission,
              interestcost:
                check && inEuros && response.data[0].interestcost
                  ? "€ " +
                    (
                      Number(
                        response.data[0].interestcost
                          .replace("$", "")
                          .replace(",", "")
                      ) / exrate
                    )
                      .toFixed(2)
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  : check && inEuros && !response.data[0].interestcost
                  ? "€ 0.00"
                  : response.data[0].interestcost,
              legal:
                check && inEuros && response.data[0].legal
                  ? "€ " +
                    (
                      Number(
                        response.data[0].legal.replace("$", "").replace(",", "")
                      ) / exrate
                    )
                      .toFixed(2)
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  : check && inEuros && !response.data[0].legal
                  ? "€ 0.00"
                  : response.data[0].legal,
              pallets:
                check && inEuros && response.data[0].pallets
                  ? "€ " +
                    (
                      Number(
                        response.data[0].pallets
                          .replace("$", "")
                          .replace(",", "")
                      ) / exrate
                    )
                      .toFixed(2)
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  : check && inEuros && !response.data[0].pallets
                  ? "€ 0.00"
                  : response.data[0].pallets,
              other:
                check && inEuros && response.data[0].other
                  ? "€ " +
                    (
                      Number(
                        response.data[0].other.replace("$", "").replace(",", "")
                      ) / exrate
                    )
                      .toFixed(2)
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  : check && inEuros && !response.data[0].other
                  ? "€ 0.00"
                  : response.data[0].other,
              totalcost:
                check && inEuros && response.data[0].totalcost
                  ? "€ " +
                    (
                      Number(
                        response.data[0].totalcost
                          .replace("$", "")
                          .replace(",", "")
                      ) / exrate
                    )
                      .toFixed(2)
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  : check && inEuros && !response.data[0].totalcost
                  ? "€ 0.00"
                  : response.data[0].totalcost,
              interestrate: response.data[0].interestrate,
              interestdays: response.data[0].interestdays,
              pricebeforeint:
                check && inEuros && response.data[0].pricebeforeint
                  ? "€ " +
                    (
                      Number(
                        response.data[0].pricebeforeint
                          .replace("$", "")
                          .replace(",", "")
                      ) / exrate
                    )
                      .toFixed(2)
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  : check && inEuros && !response.data[0].pricebeforeint
                  ? "€ 0.00"
                  : response.data[0].pricebeforeint,
              salesinterest:
                check && inEuros && response.data[0].salesinterest
                  ? "€ " +
                    (
                      Number(
                        response.data[0].salesinterest
                          .replace("$", "")
                          .replace(",", "")
                      ) / exrate
                    )
                      .toFixed(2)
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  : check && inEuros && !response.data[0].salesinterest
                  ? "€ 0.00"
                  : response.data[0].salesinterest,
              priceafterint:
                check && inEuros && response.data[0].priceafterint
                  ? "€ " +
                    (
                      Number(
                        response.data[0].priceafterint
                          .replace("$", "")
                          .replace(",", "")
                      ) / exrate
                    )
                      .toFixed(2)
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  : check && inEuros && !response.data[0].priceafterint
                  ? "€ 0.00"
                  : response.data[0].priceafterint,
              profit:
                check && inEuros && response.data[0].profit
                  ? "€ " +
                    (
                      Number(
                        response.data[0].profit
                          .replace("$", "")
                          .replace(",", "")
                      ) / exrate
                    )
                      .toFixed(2)
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  : check && inEuros && !response.data[0].pricebeforeint
                  ? "€ 0.00"
                  : response.data[0].profit,
              margin:
                check && inEuros && response.data[0].margin
                  ? "€ " +
                    (
                      Number(
                        response.data[0].margin
                          .replace("$", "")
                          .replace(",", "")
                      ) / exrate
                    )
                      .toFixed(2)
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  : check && inEuros && !response.data[0].margin
                  ? "€ 0.00"
                  : response.data[0].margin,
              turnover:
                check && inEuros && response.data[0].turnover
                  ? "€ " +
                    (
                      Number(
                        response.data[0].turnover
                          .replace("$", "")
                          .replace(",", "")
                      ) / exrate
                    )
                      .toFixed(2)
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  : check && inEuros && !response.data[0].turnover
                  ? "€ 0.00"
                  : response.data[0].turnover,
              pctmargin:
                check && response.data[0].pctmargin
                  ? response.data[0].pctmargin
                  : "0.00%",
              netback:
                check && inEuros && response.data[0].netback
                  ? "€ " +
                    (
                      Number(
                        response.data[0].netback
                          .replace("$", "")
                          .replace(",", "")
                      ) / exrate
                    )
                      .toFixed(2)
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  : check && inEuros && !response.data[0].netback
                  ? "€ 0.00"
                  : response.data[0].netback,
            });
            setQSData({
              ...QSData,
              KTP: response.data[0].KTP,
              KTS: response.data[0].KTS,
              QSDate: response.data[0].QSDate,
              saleType: response.data[0].saleTypeID,
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
              saleComplete: response.data[0].saleComplete,
              TIC: response.data[0].traderID,
              traffic: response.data[0].trafficID,
              incoterms: response.data[0].incoterms,
              paymentTerm: response.data[0].pTermID,
              CADintrate:
                Number(response.data[0].includedrate.replace("%", "")) / 100,
              CADdays: response.data[0].includedperiod,
              shipmentType: response.data[0].shipmentTypeID
                ? response.data[0].shipmentTypeID
                : 1,
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
                    response.data[0].pcommission
                      .replace("$", "")
                      .replace(",", "")
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
              freightpmt: response.data[0].freightpmt
                ? Number(
                    response.data[0].freightpmt
                      .replace("$", "")
                      .replace(",", "")
                  )
                : 0,
              insurance: response.data[0].insurance
                ? Number(
                    response.data[0].insurance.replace("$", "").replace(",", "")
                  )
                : 0,
              inspectionpmt: response.data[0].inspectionpmt
                ? Number(
                    response.data[0].inspectionpmt
                      .replace("$", "")
                      .replace(",", "")
                  )
                : 0,
              scommission: response.data[0].scommission
                ? Number(
                    response.data[0].scommission
                      .replace("$", "")
                      .replace(",", "")
                  )
                : 0,
              interestcost: response.data[0].interestcost
                ? Number(
                    response.data[0].interestcost
                      .replace("$", "")
                      .replace(",", "")
                  )
                : 0,
              legal: response.data[0].legal
                ? Number(
                    response.data[0].legal.replace("$", "").replace(",", "")
                  )
                : 0,
              pallets: response.data[0].pallets
                ? Number(
                    response.data[0].pallets.replace("$", "").replace(",", "")
                  )
                : 0,
              other: response.data[0].other
                ? Number(
                    response.data[0].other.replace("$", "").replace(",", "")
                  )
                : 0,
              totalcost: response.data[0].totalcost
                ? Number(
                    response.data[0].totalcost.replace("$", "").replace(",", "")
                  )
                : 0,
              interestrate:
                Number(response.data[0].interestrate.replace("%", "")) / 100,
              interestdays: response.data[0].interestdays,
              pricebeforeint: response.data[0].pricebeforeint
                ? Number(
                    response.data[0].pricebeforeint
                      .replace("$", "")
                      .replace(",", "")
                  )
                : 0,
              salesinterest: response.data[0].salesinterest
                ? Number(
                    response.data[0].salesinterest
                      .replace("$", "")
                      .replace(",", "")
                  )
                : 0,
              priceafterint: response.data[0].priceafterint
                ? Number(
                    response.data[0].priceafterint
                      .replace("$", "")
                      .replace(",", "")
                  )
                : 0,
              profit: response.data[0].profit
                ? Number(
                    response.data[0].profit.replace("$", "").replace(",", "")
                  )
                : 0,
              margin: response.data[0].margin
                ? Number(
                    response.data[0].margin.replace("$", "").replace(",", "")
                  )
                : 0,
              turnover: response.data[0].turnover
                ? Number(
                    response.data[0].turnover.replace("$", "").replace(",", "")
                  )
                : 0,
              pctmargin:
                Number(response.data[0].pctmargin.replace("%", "")) / 100,
              netback: response.data[0].netback
                ? Number(
                    response.data[0].netback.replace("$", "").replace(",", "")
                  )
                : 0,
            });
            setQSOriginal({
              ...QSOriginal,
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
              saleComplete:
                response.data[0].saleComplete === -1 ? "sold" : "indication",
              TIC: response.data[0].trader,
              traffic: response.data[0].traffic,
              incoterms: response.data[0].incoterms,
              paymentTerm: response.data[0].paymentTerm,
              CADintrate: response.data[0].includedrate,
              CADdays: response.data[0].includedperiod,
              shipmentType: response.data[0].shipmentType,
              freightTotal: response.data[0].freightTotal
                ? response.data[0].freightTotal
                : "",
              shippingline: response.data[0].shippingline,
              payload: response.data[0].payload,
              totalinspection: response.data[0].totalinspection
                ? response.data[0].totalinspection
                : "",
              quantity: response.data[0].quantity,
              materialcost: response.data[0].materialcost
                ? response.data[0].materialcost
                : "$ 0.00",
              pcommission: response.data[0].pcommission
                ? response.data[0].pcommission
                : "$ 0.00",
              pfinancecost: response.data[0].pfinancecost
                ? response.data[0].pfinancecost
                : "$ 0.00",
              sfinancecost: response.data[0].sfinancecost
                ? response.data[0].sfinancecost
                : "$ 0.00",
              freightpmt: response.data[0].freightpmt
                ? response.data[0].freightpmt
                : "$ 0.00",
              insurance: response.data[0].insurance
                ? response.data[0].insurance
                : "$ 0.00",
              inspectionpmt: response.data[0].inspectionpmt
                ? response.data[0].inspectionpmt
                : "$ 0.00",
              scommission: response.data[0].scommission
                ? response.data[0].scommission
                : "$ 0.00",
              interestcost: response.data[0].interestcost
                ? response.data[0].interestcost
                : "$ 0.00",
              legal: response.data[0].legal ? response.data[0].legal : "$ 0.00",
              pallets: response.data[0].pallets
                ? response.data[0].pallets
                : "$ 0.00",
              other: response.data[0].other ? response.data[0].other : "$ 0.00",
              totalcost: response.data[0].totalcost
                ? response.data[0].totalcost
                : "$ 0.00",
              interestrate: response.data[0].interestrate,
              interestdays: response.data[0].interestdays,
              pricebeforeint: response.data[0].pricebeforeint
                ? response.data[0].pricebeforeint
                : "$ 0.00",
              salesinterest: response.data[0].salesinterest
                ? response.data[0].salesinterest
                : "$ 0.00",
              priceafterint: response.data[0].priceafterint
                ? response.data[0].priceafterint
                : "$ 0.00",
              profit: response.data[0].profit
                ? response.data[0].profit
                : "$ 0.00",
              margin: response.data[0].margin
                ? response.data[0].margin
                : "$ 0.00",
              turnover: response.data[0].turnover
                ? response.data[0].turnover
                : "$ 0.00",
              pctmargin: response.data[0].pctmargin,
              netback: response.data[0].netback
                ? response.data[0].netback
                : "$ 0.00",
            });
            setQSOriginalData({
              ...QSOriginal,
              KTP: response.data[0].KTP,
              KTS: response.data[0].KTS,
              QSDate: response.data[0].QSDate,
              saleType: response.data[0].saleTypeID,
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
              saleComplete: response.data[0].saleComplete,
              TIC: response.data[0].traderID,
              traffic: response.data[0].trafficID,
              incoterms: response.data[0].incoterms,
              paymentTerm: response.data[0].pTermID,
              CADintrate:
                Number(response.data[0].includedrate.replace("%", "")) / 100,
              CADdays: response.data[0].includedperiod,
              shipmentType: response.data[0].shipmentTypeID
                ? response.data[0].shipmentTypeID
                : 1,
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
                    response.data[0].pcommission
                      .replace("$", "")
                      .replace(",", "")
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
              freightpmt: response.data[0].freightpmt
                ? Number(
                    response.data[0].freightpmt
                      .replace("$", "")
                      .replace(",", "")
                  )
                : 0,
              insurance: response.data[0].insurance
                ? Number(
                    response.data[0].insurance.replace("$", "").replace(",", "")
                  )
                : 0,
              inspectionpmt: response.data[0].inspectionpmt
                ? Number(
                    response.data[0].inspectionpmt
                      .replace("$", "")
                      .replace(",", "")
                  )
                : 0,
              scommission: response.data[0].scommission
                ? Number(
                    response.data[0].scommission
                      .replace("$", "")
                      .replace(",", "")
                  )
                : 0,
              interestcost: response.data[0].interestcost
                ? Number(
                    response.data[0].interestcost
                      .replace("$", "")
                      .replace(",", "")
                  )
                : 0,
              legal: response.data[0].legal
                ? Number(
                    response.data[0].legal.replace("$", "").replace(",", "")
                  )
                : 0,
              pallets: response.data[0].pallets
                ? Number(
                    response.data[0].pallets.replace("$", "").replace(",", "")
                  )
                : 0,
              other: response.data[0].other
                ? Number(
                    response.data[0].other.replace("$", "").replace(",", "")
                  )
                : 0,
              interestrate:
                Number(response.data[0].interestrate.replace("%", "")) / 100,
              interestdays: response.data[0].interestdays,
              pricebeforeint: response.data[0].pricebeforeint
                ? Number(
                    response.data[0].pricebeforeint
                      .replace("$", "")
                      .replace(",", "")
                  )
                : 0,
              salesinterest: response.data[0].salesinterest
                ? Number(
                    response.data[0].salesinterest
                      .replace("$", "")
                      .replace(",", "")
                  )
                : 0,
              priceafterint: response.data[0].priceafterint
                ? Number(
                    response.data[0].priceafterint
                      .replace("$", "")
                      .replace(",", "")
                  )
                : 0,
            });
            if (response.data[0].saleComplete === -1) {
              setSold(true);
              setAllocated(false);
            }
            if (response.data[0].saleComplete === 1) {
              setAllocated(true);
              setSold(false);
            }
            if (response.data[0].saleComplete === 0) {
              setSold(false);
              setAllocated(false);
            }
            await doneloading();
          };
          doWork();
        }
      );
    }
    if (QSindex === QSIDList.length) {
      setQSValues(QSValuesInit);
      setQSData(QSDataInit);
      setExchangerate(null);
    }
    setEditing(false);
  }, [QSindex]);

  const checkChanges = (a, b, str, id) => {
    let c = [];
    let d = [];
    let e = [];
    for (const x in a) {
      if (inEuros === false) {
        if (a[x] !== b[x]) {
          c.push(x);
          if (b[x] === "") {
            d.push("(empty)");
          } else {
            d.push(b[x]);
          }
          e.push(a[x]);
        }
      }
      if (inEuros === true) {
        if (a[x]) {
          if (a[x].toString().indexOf("€") > -1) {
            if (
              Number(a[x].toString().replace("€", "").replace(",", "")).toFixed(
                2
              ) !==
              (
                Number(b[x].toString().replace("$", "").replace(",", "")) /
                exchangerate
              ).toFixed(2)
            ) {
              console.log(
                Number(
                  a[x].toString().replace("€", "").replace(",", "")
                ).toFixed(2),
                (
                  Number(b[x].toString().replace("$", "").replace(",", "")) /
                  exchangerate
                ).toFixed(2)
              );
              c.push(x);
              if (b[x] === "") {
                d.push("(empty)");
              } else {
                d.push(
                  "€ " +
                    (
                      Number(
                        b[x].toString().replace("$", "").replace(",", "")
                      ) / exchangerate
                    ).toFixed(2)
                );
              }
              e.push(a[x]);
            }
          } else {
            if (a[x] !== b[x]) {
              c.push(x);
              if (b[x] === "") {
                d.push("(empty)");
              } else {
                d.push(b[x]);
              }
              e.push(a[x]);
            }
          }
        }
      }
    }
    if (editMode === true) {
      confirmAlert({
        customUI: ({ onClose }) => {
          return (
            <div className="custom-ui">
              <h1>Are you sure?</h1>
              <p className="confirmmsg">
                If you leave this QS now, the following unsaved edits will be
                lost. Click CONTINUE to leave the QS anyway OR click CANCEL to
                go back and avoid losing your edits.
              </p>
              <ul>
                <li className="editsline editsheader">
                  <p>Item:</p>
                  <p className="editfig">Original:</p>
                  <p>Edit:</p>
                </li>
                {c.map((it, index) => (
                  <li className="editsline">
                    <p className="edititem">{c[index]}</p>
                    <p className="editfig">{d[index]}</p>
                    <p className="editfig">{e[index]}</p>
                  </li>
                ))}
              </ul>
              <button onClick={onClose}>Cancel</button>
              <button
                onClick={(e) => {
                  if (str === "prev") {
                    setQSindex(QSindex - 1);
                    setQSIDtoedit(QSIDList[QSindex - 1]);
                    setQSID(QSIDList[QSindex - 1]);
                    setQSindexerror(null);
                  }
                  if (str === "next") {
                    setQSindex(
                      QSindex < QSIDList.length ? QSindex + 1 : QSIDList.length
                    );
                    setQSIDtoedit(
                      QSindex < QSIDList.length - 1 ? QSIDList[QSindex + 1] : ""
                    );
                    setQSID(
                      QSindex < QSIDList.length - 1 ? QSIDList[QSindex + 1] : ""
                    );
                    setQSindexerror(null);
                  }
                  if (str === "enter") {
                    setQSindex(QSIDList.indexOf(id));
                    setQSindexerror("");
                    setQSIDtoedit(id);
                  }
                  if (str === "new") {
                    setQSindex(QSIDList.length);
                    setQSIDtoedit("");
                    setQSID("");
                    setSold(false);
                    setAllocated(false);
                  }
                  onClose();
                }}
              >
                Continue
              </button>
            </div>
          );
        },
      });
    }

    if (editMode === false) {
      confirmAlert({
        customUI: ({ onClose }) => {
          return (
            <div className="custom-ui">
              <h1>Are you sure?</h1>
              <p className="confirmmsg">
                You have already added some data to this new QS. If you leave
                this QS now without saving, the inputed data will be lost. Click
                CONTINUE to leave the QS anyway OR click CANCEL to go back and
                avoid losing your added data.
              </p>

              <button onClick={onClose}>Cancel</button>
              <button
                onClick={(e) => {
                  if (str === "prev") {
                    setQSindex(QSindex - 1);
                    setQSIDtoedit(QSIDList[QSindex - 1]);
                    setQSID(QSIDList[QSindex - 1]);
                    setQSindexerror(null);
                  }
                  if (str === "enter") {
                    setQSindex(QSIDList.indexOf(id));
                    setQSindexerror("");
                  }
                  if (str === "new") {
                    setQSindex(QSIDList.length);
                    setQSIDtoedit("");
                    setQSID("");
                    clearQSData();
                  }
                  onClose();
                }}
              >
                Continue
              </button>
            </div>
          );
        },
      });
    }

    // console.log(c);

    // console.log("checking changes");
  };

  const handleSold = () => {
    setSold(!sold);
    setAllocated(false);
    setEditing(true);
  };

  const handleAllocated = () => {
    setAllocated(!allocated);
    setSold(false);
    setEditing(true);
    setQSValues({
      ...QSValues,
      customer: "USA Distribution",
      CADdays: 100,
    });
    setQSData({
      ...QSData,
      customer: 452,
      CADdays: 100,
    });
  };

  useEffect(() => {
    if (sold) {
      setQSData({ ...QSData, saleComplete: -1 });
      setQSValues({ ...QSValues, saleComplete: "sold" });
    }
    if (allocated) {
      setQSData({ ...QSData, saleComplete: 1 });
      setQSValues({ ...QSValues, saleComplete: "allocated-US" });
    }
    if (!sold & !allocated) {
      setQSData({ ...QSData, saleComplete: 0 });
      setQSValues({ ...QSValues, saleComplete: "indication" });
    }
  }, [sold, allocated]);

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
    setEditing(true);
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
    setEditing(true);
    if (inEuros === true && exchangerate && lockER === false) {
      setLockER(true);
    }
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
    setEditing(true);
    if (inEuros === true && exchangerate && lockER === false) {
      setLockER(true);
    }
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
    setEditing(true);
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
      if (!lockER) {
        setLockER(true);
      }
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
    setEditing(true);
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
      // console.log(date2.diff(date1, "days"));
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

  const freightcalc = (frttotal, pload) => {
    return new Promise((resolve, reject) => {
      if (frttotal > 0 && pload > 0) {
        resolve(frttotal / pload);
      } else {
        resolve(0);
      }
    });
  };

  const intcostcalc = (incr, incd, pbi) => {
    return new Promise((resolve, reject) => {
      if (incr > 0 && incd > 0 && pbi > 0) {
        resolve((incr * incd * pbi) / 360);
      } else {
        resolve(0);
      }
    });
  };

  const inspcostcalc = (instotal, qty) => {
    return new Promise((resolve, reject) => {
      if (instotal > 0 && qty > 0) {
        resolve(instotal / qty);
      } else {
        resolve(0);
      }
    });
  };

  const insurcalc = (inco, pbi) => {
    return new Promise((resolve, reject) => {
      if (pbi > 0 && (inco === "CPT" || inco === "CFR" || inco === "DAP")) {
        resolve((pbi * 0.07 * 1.1) / 100);
      } else if (pbi > 0 && (inco === "CIP" || inco === "CIF")) {
        resolve((pbi * 0.14 * 1.1) / 100);
      } else {
        resolve(0);
      }
    });
  };

  const ttlcostcalc = (
    mc,
    pc,
    pf,
    sf,
    frt,
    ins,
    insp,
    sc,
    int,
    lg,
    pal,
    oth
  ) => {
    return new Promise((resolve, reject) => {
      resolve(mc + pc + pf + sf + frt + ins + insp + sc + int + lg + pal + oth);
    });
  };

  const paicalc = (pbi, slsint) => {
    return new Promise((resolve, reject) => {
      resolve(pbi + slsint);
    });
  };

  // QS CALCULATIONS
  useEffect(() => {
    const docalcs = async () => {
      const frtpmt = await freightcalc(QSData.freightTotal, QSData.payload);
      const intcost = await intcostcalc(
        QSData.CADintrate,
        QSData.CADdays,
        QSData.pricebeforeint
      );
      const slsint = await intcostcalc(
        QSData.interestrate,
        QSData.interestdays,
        QSData.pricebeforeint
      );
      const inspcost = await inspcostcalc(
        QSData.totalinspection,
        QSData.quantity
      );
      const insur = await insurcalc(QSData.incoterms, QSData.pricebeforeint);
      const ttlcost = await ttlcostcalc(
        QSData.materialcost,
        QSData.pcommission,
        QSData.pfinancecost,
        QSData.sfinancecost,
        frtpmt,
        insur,
        inspcost,
        QSData.scommission,
        intcost,
        QSData.legal,
        QSData.pallets,
        QSData.other
      );
      const praftint = await paicalc(QSData.pricebeforeint, slsint);
      setQSData({
        ...QSData,
        freightpmt: frtpmt,
        insurance: insur,
        inspectionpmt: inspcost,
        interestcost: intcost,
        totalcost: ttlcost,
        salesinterest: slsint,
        priceafterint: praftint,
        profit:
          QSData.quantity !== 0 && QSData.pricebeforeint !== 0
            ? Number((QSData.pricebeforeint - ttlcost).toFixed(4))
            : 0,
        margin:
          QSData.quantity !== 0 && QSData.pricebeforeint !== 0
            ? Number(
                ((QSData.pricebeforeint - ttlcost) * QSData.quantity).toFixed(4)
              )
            : 0,
        turnover:
          QSData.quantity !== 0 && QSData.pricebeforeint !== 0
            ? Number((QSData.quantity * praftint).toFixed(4))
            : 0,
        pctmargin:
          QSData.quantity !== 0 && QSData.pricebeforeint !== 0
            ? Number(
                (
                  (QSData.pricebeforeint - ttlcost) /
                  QSData.pricebeforeint
                ).toFixed(4)
              )
            : 0,
        netback:
          QSData.quantity !== 0 && QSData.pricebeforeint !== 0
            ? Number(
                (QSData.pricebeforeint - ttlcost + QSData.materialcost).toFixed(
                  4
                )
              )
            : 0,
      });
      if (inEuros === false) {
        setQSValues({
          ...QSValues,
          freightpmt: "$ " + frtpmt.toFixed(2),
          insurance: "$ " + insur.toFixed(2),
          inspectionpmt: "$ " + inspcost.toFixed(2),
          interestcost: "$ " + intcost.toFixed(2),
          totalcost:
            "$ " + ttlcost.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
          salesinterest: "$ " + slsint.toFixed(2),
          priceafterint:
            "$ " + praftint.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
          profit:
            QSData.quantity !== 0 && QSData.pricebeforeint !== 0
              ? "$ " +
                Number(QSData.pricebeforeint - ttlcost)
                  .toFixed(2)
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              : "$ " + Number(0).toFixed(2),

          margin:
            QSData.quantity !== 0 && QSData.pricebeforeint !== 0
              ? "$ " +
                Number((QSData.pricebeforeint - ttlcost) * QSData.quantity)
                  .toFixed(2)
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              : "$ " + Number(0).toFixed(2),
          turnover:
            QSData.quantity !== 0 && QSData.pricebeforeint !== 0
              ? "$ " +
                Number(QSData.quantity * praftint)
                  .toFixed(2)
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              : "$ " + Number(0).toFixed(2),
          pctmargin:
            QSData.quantity !== 0 && QSData.pricebeforeint !== 0
              ? Number(
                  ((QSData.pricebeforeint - ttlcost) / QSData.pricebeforeint) *
                    100
                ).toFixed(2) + "%"
              : Number(0).toFixed(2) + "%",
          netback:
            QSData.quantity !== 0 && QSData.pricebeforeint !== 0
              ? "$ " +
                Number(QSData.pricebeforeint - ttlcost + QSData.materialcost)
                  .toFixed(2)
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              : "$ " + Number(0).toFixed(2),
        });
      }
      if (inEuros === true && exchangerate) {
        setQSValues({
          ...QSValues,
          freightpmt: "€ " + (frtpmt / exchangerate).toFixed(2),
          insurance: "€ " + (insur / exchangerate).toFixed(2),
          inspectionpmt: "€ " + (inspcost / exchangerate).toFixed(2),
          interestcost: "€ " + (intcost / exchangerate).toFixed(2),
          totalcost:
            "€ " +
            (ttlcost / exchangerate)
              .toFixed(2)
              .replace(/\B(?=(\d{3})+(?!\d))/g, ","),
          salesinterest: "€ " + (slsint / exchangerate).toFixed(2),
          priceafterint:
            "€ " +
            (praftint / exchangerate)
              .toFixed(2)
              .replace(/\B(?=(\d{3})+(?!\d))/g, ","),
          profit:
            QSData.quantity !== 0 && QSData.pricebeforeint !== 0
              ? "€ " +
                Number((QSData.pricebeforeint - ttlcost) / exchangerate)
                  .toFixed(2)
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              : "€ " + Number(0).toFixed(2),
          margin:
            QSData.quantity !== 0 && QSData.pricebeforeint !== 0
              ? "€ " +
                Number(
                  ((QSData.pricebeforeint - ttlcost) * QSData.quantity) /
                    exchangerate
                )
                  .toFixed(2)
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              : "€ " + Number(0).toFixed(2),
          turnover:
            QSData.quantity !== 0 && QSData.pricebeforeint !== 0
              ? "€ " +
                Number((QSData.quantity * praftint) / exchangerate)
                  .toFixed(2)
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              : "€ " + Number(0).toFixed(2),
          pctmargin:
            QSData.quantity !== 0 && QSData.pricebeforeint !== 0
              ? Number(
                  ((QSData.pricebeforeint - ttlcost) / QSData.pricebeforeint) *
                    100
                ).toFixed(2) + "%"
              : Number(0).toFixed(2) + "%",
          netback:
            QSData.quantity !== 0 && QSData.pricebeforeint !== 0
              ? "€ " +
                Number(
                  (QSData.pricebeforeint - ttlcost + QSData.materialcost) /
                    exchangerate
                )
                  .toFixed(2)
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              : "€ " + Number(0).toFixed(2),
        });
      }
    };
    if (loading === false) {
      docalcs();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    QSData.freightTotal,
    QSData.payload,
    // QSData.freightpmt,
    QSData.CADintrate,
    QSData.CADdays,
    QSData.pricebeforeint,
    QSData.interestrate,
    QSData.interestdays,
    QSData.totalinspection,
    QSData.quantity,
    QSData.incoterms,
    QSData.materialcost,
    QSData.pcommission,
    QSData.scommission,
    QSData.pfinancecost,
    QSData.sfinancecost,
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

  // CONSOLIDATE EDITS
  const consolidateEdits = (a, b) => {
    return new Promise((resolve, reject) => {
      let c = {};
      for (const x in a) {
        if (a[x] !== b[x]) {
          c[x] = a[x];
        }
      }
      resolve(c);
    });
  };

  //SAVE and UPDATE QS
  const addupdateQS = async (e) => {
    if (editMode) {
      e.preventDefault();
      const QSedits = await consolidateEdits(QSData, QSOriginalData);
      console.log(exchangerate);
      Axios.post("/updateQS", {
        QSedits,
        QSID: QSIDtoedit,
        exchrate: exchangerate,
      }).then((response) => {
        setEditing(false);
        toggleQSrefresh();
        console.log(response.data);
      });
      // console.log("updatingQS");
    }
    if (!editMode) {
      e.preventDefault();
      await Axios.post("/saveQS", { QSData }).then((response) => {
        toggleQSrefresh();
        setQSSaved(!QSsaved);
      });
      await clearQSData();
      // createemail();
    }
  };

  const loadPositions = () => {
    Axios.post("/positiondropdown").then((response) => {
      // console.log(response.data);
      setPositionsddown(response.data);
    });
  };
  const setPosition = (val) => {
    setEditing(true);
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

  //CLEAR QS
  const clearQSData = () => {
    setQSValues(QSValuesInit);
    setQSData(QSDataInit);
    setSold(false);
    setAllocated(false);
    setLockER(false);
    setEditing(false);
  };

  const ignoreEnter = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
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
            <select onChange={(e) => setUserID(e.target.value)}>
              <option value="all">All</option>
              {traders
                ? traders.map((trader) => {
                    if (trader.trader === userID) {
                      return (
                        <option selected value={trader.trader}>
                          {trader.trader}
                        </option>
                      );
                    } else {
                      return (
                        <option value={trader.trader}>{trader.trader}</option>
                      );
                    }
                  })
                : "reload"}
            </select>
            <button
              onClick={(e) => {
                e.preventDefault();
                if (editing === true && editMode === false) {
                  checkChanges(QSValues, QSValuesInit, "prev");
                }
                if (editing === true && editMode === true) {
                  checkChanges(QSValues, QSOriginal, "prev");
                }
                // console.log(QSindex);
                if (editing === false) {
                  setQSindex(QSindex - 1);
                  setQSIDtoedit(QSIDList[QSindex - 1]);
                  setQSID(QSIDList[QSindex - 1]);
                  setQSindexerror(null);
                }
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
                  // console.log(e.target.value);
                  // console.log(QSIDList);
                  if (QSIDList.includes(Number(e.target.value))) {
                    if (editing === true) {
                      checkChanges(
                        QSValues,
                        QSOriginal,
                        "enter",
                        Number(e.target.value)
                      );
                    }
                    if (editing === false) {
                      setQSindex(QSIDList.indexOf(Number(e.target.value)));
                      setQSindexerror("");
                    }
                  } else {
                    setQSindexerror("QSID not found.");
                    // console.log("nope");
                  }
                }
              }}
              onChange={(e) => setQSIDtoedit(e.target.value)}
              value={QSIDtoedit ? QSIDtoedit : ""}
            />

            <button
              onClick={(e) => {
                e.preventDefault();
                // if (editing === true && editMode === false) {
                //   checkChanges(QSValues, QSValuesInit);
                // }
                if (editing === true && editMode === true) {
                  checkChanges(QSValues, QSOriginal, "next");
                }
                // console.log(QSindex);
                if (editing === false) {
                  setQSindex(
                    QSindex < QSIDList.length ? QSindex + 1 : QSIDList.length
                  );
                  setQSIDtoedit(
                    QSindex < QSIDList.length - 1 ? QSIDList[QSindex + 1] : ""
                  );
                  setQSID(
                    QSindex < QSIDList.length - 1 ? QSIDList[QSindex + 1] : ""
                  );
                  setQSindexerror(null);
                }
              }}
            >
              Next
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                if (editMode === true && editing === true) {
                  checkChanges(QSValues, QSOriginal, "new");
                }
                if (editMode === false && editing === true) {
                  checkChanges(QSValues, QSValuesInit, "new");
                }
                if (editing === false) {
                  setQSindex(QSIDList.length);
                  setQSIDtoedit("");
                  setQSID("");
                }
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
        onSubmit={(e) => {
          addupdateQS(e);
        }}
      >
        <section id="salesQS-1">
          <div className="form-group">
            <label htmlFor="">QS Date:</label>
            <input
              readOnly
              className="canceldrag"
              value={QSValues.QSDate}
              type="date"
              onKeyDown={ignoreEnter}
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
              onKeyDown={ignoreEnter}
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
                  setEditing(true);
                  setQSData({ ...QSData, saleType: 1 });
                  setQSValues({ ...QSValues, saleType: "Back-to-back" });
                }}
                onKeyDown={ignoreEnter}
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
                  setEditing(true);
                  setQSData({ ...QSData, saleType: 2 });
                  setQSValues({ ...QSValues, saleType: "Position" });
                  loadPositions();
                }}
                onKeyDown={ignoreEnter}
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
                onKeyDown={ignoreEnter}
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
                setEditing={setEditing}
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
                onKeyDown={ignoreEnter}
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
                setEditing={setEditing}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="">Contact:</label>
              <input
                className="canceldrag"
                type="text"
                onKeyDown={ignoreEnter}
              />
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
                onKeyDown={ignoreEnter}
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
                onKeyDown={ignoreEnter}

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
                onKeyDown={ignoreEnter}
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
                onKeyDown={ignoreEnter}
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
                setEditing={setEditing}
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
                setEditing={setEditing}
                required
              />
            </div>
          </fieldset>
        </section>
        <section id="salesQS-2">
          <div className="saleboxes">
            <div className="soldcheckbox">
              <input
                className="canceldrag"
                name="saleComplete"
                type="checkbox"
                checked={sold}
                onClick={handleSold}
                onKeyDown={ignoreEnter}
              />
              <label>Sold</label>
            </div>
            <div className="soldcheckbox">
              <input
                className="canceldrag"
                name="allocationComplete"
                type="checkbox"
                checked={allocated}
                onClick={handleAllocated}
                onKeyDown={ignoreEnter}
              />
              <label>US-Allocation</label>
            </div>
          </div>
          <div className="form-group">
            <label>WGS:</label>
            <input
              name="KTS"
              placeholder="5000..."
              value={QSValues ? QSValues.KTS || "" : ""}
              onChange={handleCNumInputChange}
              className="canceldrag"
              onKeyDown={ignoreEnter}
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
                onKeyDown={ignoreEnter}
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
                setEditing={setEditing}
                required
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
                onKeyDown={ignoreEnter}
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
                setEditing={setEditing}
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
                onKeyDown={ignoreEnter}
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
                onKeyDown={ignoreEnter}
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
            <input
              name="shipmenttype"
              type="radio"
              defaultChecked
              required
              onKeyDown={ignoreEnter}
              onClick={(e) => {
                setQSData({ ...QSData, shipmentType: 1 });
                setQSValues({ ...QSValues, shipmentType: "Container" });
              }}
            />
            <label htmlFor="">Container</label>

            <input
              name="shipmenttype"
              type="radio"
              required
              onKeyDown={ignoreEnter}
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
              onKeyDown={ignoreEnter}
              onClick={(e) => {
                setQSData({ ...QSData, shipmentType: 3 });
                setQSValues({ ...QSValues, shipmentType: "Truck" });
              }}
            />
            <label htmlFor="">Truck</label>
          </div>

          {QSData && QSData.shipmentType === 1 ? (
            <fieldset>
              <legend>Freight</legend>
              <div className="form-group">
                <label htmlFor="">Freight ID:</label>
                <input
                  placeholder="[Leave Blank]"
                  type="text"
                  onKeyDown={ignoreEnter}
                />
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
                  onKeyDown={ignoreEnter}
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
                  onKeyDown={ignoreEnter}
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
                  onKeyDown={ignoreEnter}
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
                  onKeyDown={ignoreEnter}
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
                  onKeyDown={ignoreEnter}
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
                    onKeyDown={ignoreEnter}
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
                    onKeyDown={ignoreEnter}
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
                    onKeyDown={ignoreEnter}
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
                    onKeyDown={ignoreEnter}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="">Freight (pmt):</label>
                  <input
                    style={{ backgroundColor: "rgb(244,244,244)" }}
                    className="QSfig canceldrag"
                    value={QSValues.freightpmt}
                    // onDoubleClick={(e) => {
                    //   e.target.select();
                    // }}
                    name="freightpmt"
                    placeholder="...Freight pmt"
                    onChange={(e) => {
                      CurrencyChange(e);
                    }}
                    onBlur={(e) => {
                      CurrencyBlur(e);
                    }}
                    type="text"
                    required
                    readOnly
                    onKeyDown={ignoreEnter}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="">Insurance Cost:</label>
                  <input
                    style={{ backgroundColor: "rgb(244,244,244)" }}
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
                    readOnly
                    onKeyDown={ignoreEnter}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="">Inspection Cost:</label>
                  <input
                    style={{ backgroundColor: "rgb(244,244,244)" }}
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
                    readOnly
                    onKeyDown={ignoreEnter}
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
                    onKeyDown={ignoreEnter}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="">Interest Cost:</label>
                  <input
                    style={{ backgroundColor: "rgb(244,244,244)" }}
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
                    onKeyDown={ignoreEnter}
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
                    onKeyDown={ignoreEnter}
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
                    onKeyDown={ignoreEnter}
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
                    onKeyDown={ignoreEnter}
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
                  onKeyDown={ignoreEnter}
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
                    onKeyDown={ignoreEnter}
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
                    onKeyDown={ignoreEnter}
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
                    onKeyDown={ignoreEnter}
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
                    onKeyDown={ignoreEnter}
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
                  onKeyDown={ignoreEnter}
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
                    onKeyDown={ignoreEnter}
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
                    onKeyDown={ignoreEnter}
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
                    onKeyDown={ignoreEnter}
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
                    onKeyDown={ignoreEnter}
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
                    onKeyDown={ignoreEnter}
                  />
                </div>
              </fieldset>
              <div id="exchangerate" className="form-group">
                <label>Exch. Rate ($/€):</label>
                <input
                  className="canceldrag"
                  onChange={(e) => {
                    e.preventDefault();
                    setEditing(true);
                    const isdecimalnumber = RegExp("^[0-9.]+$");
                    if (
                      isdecimalnumber.test(e.target.value) ||
                      e.target.value === ""
                    ) {
                      // console.log("hey u");
                      setExchangerate(e.target.value);
                    }
                  }}
                  value={exchangerate ? exchangerate : ""}
                  placeholder="$/€ (up to 4 decimals)"
                  readOnly={lockER}
                  onKeyDown={ignoreEnter}
                />
                <UnlockedIcon
                  onClick={(e) => {
                    setLockER(!lockER);
                  }}
                  className={
                    !lockER
                      ? "unlockicon display-block"
                      : "unlockicon display-none"
                  }
                />
                <LockedIcon
                  onClick={(e) => {
                    e.preventDefault();
                    confirmAlert({
                      title: "Warning",
                      message: `If you have already entered data with a different exchange rate. Changing the rate at this point will likely cause currency and calculation inconsistencies in the QS.`,
                      buttons: [
                        {
                          label: "Go ahead",
                          onClick: () => setLockER(!lockER),
                        },
                        {
                          label: "Cancel",
                        },
                      ],
                      closeOnClickOutside: true,
                      closeOnEscape: true,
                    });
                  }}
                  className={
                    lockER ? "lockicon display-block" : "lockicon display-none"
                  }
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
              <button type="submit">Save Edits</button>
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
