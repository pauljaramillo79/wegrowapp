import React, { useState, useEffect, useContext, useRef } from "react";
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
import USPositionReport from "./USPositionReport";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalculator } from "@fortawesome/free-solid-svg-icons";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import { faUnlock } from "@fortawesome/free-solid-svg-icons";
import { gsap } from "gsap";

const SalesQS2 = () => {
  const { toggleQSrefresh } = useContext(RefreshPositionsContext);
  const { QStoload, diffQS, duplicateBoolean } = useContext(LoadQSContext);

  const refrespmsg = useRef(null);
  const [showmsg, setShowmsg] = useState(false);

  const onComplete = () => {
    setQSresponsemsg("");
  };
  useEffect(() => {
    const elem = refrespmsg.current;
    gsap.fromTo(
      elem,
      { opacity: 1 },
      {
        opacity: 0,
        duration: 2.5,
        ease: "power1.inOut",
        onComplete: onComplete,
      }
    );
  }, [showmsg]);
  // Initial values for New QS
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
    // customsentry: 0,
    materialvalue: 0,
    generalduty: 0,
    additionalduty: 0,
    totalduty: 0,
    dutyfee: 0,
    harborfeepct: 0,
    harborfee: 0,
    merchprocfeepct: 0,
    merchprocfee: 0,
    cflatfee: 0,
    tsca: 0,
    isf: 0,
    totalcentryfee: 0,
    centryfeepmt: 0,
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
    // customsentry: "$ 0.00",
    materialvalue: "$ 0,00",
    generalduty: "0.00%",
    additionalduty: "0.00%",
    totalduty: "0.00%",
    dutyfee: "$ 0.00",
    harborfeepct: "0.00%",
    harborfee: "$ 0.00",
    merchprocfeepct: "0.00%",
    merchprocfee: "$ 0.00",
    cflatfee: "$ 0.00",
    tsca: "$ 0.00",
    isf: "$ 0.00",
    totalcentryfee: "$ 0.00",
    centryfeepmt: "$ 0.00",
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

  // State Variables
  const [QSData, setQSData] = useState(QSDataInit);
  const [QSValues, setQSValues] = useState(QSValuesInit);
  const [positionsddown, setPositionsddown] = useState();
  const [USPositionsddown, setUSPositionsddown] = useState();
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
  const [showcustomscalculator, setShowcustomscalculator] = useState(false);

  // Load Userid from local storage
  const [userID, setUserID] = useState(
    JSON.parse(localStorage.getItem("WGusercode"))
  );

  // Load and set trader list for dropdown menus
  const [traders, setTraders] = useState();
  useEffect(() => {
    Axios.post("/traders").then((response) => {
      setTraders(response.data);
    });
  }, []);

  // load and set a user-dependent QSID list for navigation
  //Refresh QSID List everytime a QS is saved, userID is changed, or QS is duplicated
  useEffect(() => {
    Axios.post("/QSIDList", { user: userID }).then((response) => {
      const loadQSList = (resp) => {
        return new Promise((resolve, reject) => {
          const QSlist = [...new Set(response.data.map((item) => item.QSID))];
          setQSIDList(QSlist);
          resolve();
        });
      };
      const doWork = async () => {
        await loadQSList(response);
      };
      doWork();
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

  /**
   * takes number and turns into currency string with comma separated thousands
   * @param {number} value number to be currencified
   * @param {string} symbol currency symbol, default='$'
   * @param {int} decim decimal places, default=2
   * @return {string} (str) - currency string with comma separated thousands
   */
  const currencify = (val, symbol = "$", decim = 2) => {
    return (
      symbol + " " + val.toFixed(decim).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    );
  };

  /**
   * takes a currency string (e.g., $1,000) and returns a number
   * @ param {string} value - string to be numerified
   * @ param {string} symbol - currency symbol to be stripped, default='$'
   */
  const numerify = (val, symbol = "$") => {
    return Number(val.replace(symbol, "").replace(",", ""));
  };

  /** takes a value, currency symbol, number of decimals, exchange rate - processes currency data coming from /loadQStoedit - and returns
   * */
  const numcurrex = (
    val,
    er = 1,
    symboltoadd = "€",
    symboltoremove = "$",
    decim = 2
  ) => {
    return (
      symboltoadd +
      " " +
      (Number(val.replace(symboltoremove, "").replace(",", "")) / er)
        .toFixed(decim)
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    );
  };

  useEffect(() => {
    // if navigating, load values from database based on QSindex selected
    if (QSindex < QSIDList.length) {
      Axios.post("/loadQStoedit", { id: QSIDList[QSindex] }).then(
        (response) => {
          // const loaddata = (resp) => {
          //   return new Promise((resolve, reject) => {
          //     resolve(resp.data[0]);
          //   });
          // };
          // const ldata = await loaddata(response);
          const ldata = response.data[0];
          // Define promise to change exchange rate using loaded value
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
          // Define promise to check if exchange rate exists, otherwise revert back to dollars
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
          // loading
          const loading = () => {
            return new Promise((resolve, reject) => {
              setLoading(true);
              resolve();
            });
          };
          // finish loading
          const doneloading = () => {
            return new Promise((resolve, reject) => {
              setLoading(false);
              resolve();
            });
          };
          const doWork = async () => {
            const check = await checkER(response);
            const exrate = await changeER(response);
            // Start loading
            await loading();
            // Set Values
            const matvalue = await materialvaluecalc(
              Number(ldata.materialcost.replace("$", "")),
              ldata.quantity
            );
            const totalduty =
              ldata.generalduty && ldata.additionalduty
                ? await totaldutycalc(
                    Number(ldata.generalduty.replace("%", "")),
                    Number(ldata.additionalduty.replace("%", ""))
                  )
                : 0;
            const dutyfee = await dutyfeecalc(matvalue, totalduty / 100);
            const harborfee = ldata.harborfeepct
              ? await harborfeecalc(
                  matvalue,
                  Number(ldata.harborfeepct.replace("%", "") / 100)
                )
              : 0;
            const merchprocfee = ldata.merchprocfeepct
              ? await mercprocfeecalc(
                  matvalue,
                  Number(ldata.merchprocfeepct.replace("%", "") / 100)
                )
              : 0;
            const totalcentryfee = await totalcentryfeecalc(
              dutyfee ? dutyfee : 0,
              harborfee ? harborfee : 0,
              merchprocfee ? merchprocfee : 0,
              ldata.cflatfee ? numerify(ldata.cflatfee, "$") : 0,
              ldata.tsca ? numerify(ldata.tsca, "$") : 0,
              ldata.isf ? numerify(ldata.isf, "$") : 0
            );

            setQSValues({
              ...QSValues,
              KTP: ldata.KTP,
              KTS: ldata.KTS,
              QSDate: ldata.QSDate,
              saleType: ldata.saleType,
              QSID: ldata.QSID,
              abbreviation: ldata.abbreviation,
              supplier: ldata.supplier,
              customer: ldata.customer,
              packsize: ldata.packsize,
              marks: ldata.marks,
              from: ldata.from,
              to: ldata.to,
              POL: ldata.POL,
              POD: ldata.POD,
              saleComplete: ldata.saleComplete === -1 ? "sold" : "indication",
              TIC: ldata.trader,
              traffic: ldata.traffic,
              incoterms: ldata.incoterms,
              paymentTerm: ldata.paymentTerm,
              CADintrate: ldata.includedrate,
              CADdays: ldata.includedperiod,
              shipmentType: ldata.shipmentType
                ? ldata.shipmentType
                : "Container",
              freightTotal:
                check && inEuros && ldata.freightTotal
                  ? numcurrex(ldata.freightTotal, exrate)
                  : check && inEuros && !ldata.freightTotal
                  ? "€ 0.00"
                  : ldata.freightTotal,
              shippingline: ldata.shippingline,
              payload: ldata.payload,
              totalinspection:
                check && inEuros && ldata.totalinspection
                  ? numcurrex(ldata.totalinspection, exrate)
                  : check && inEuros && !ldata.totalinspection
                  ? "€ 0.00"
                  : ldata.totalinspection,
              quantity: ldata.quantity,
              materialcost:
                check && inEuros && ldata.materialcost
                  ? numcurrex(ldata.materialcost, exrate)
                  : check && inEuros && !ldata.materialcost
                  ? "€ 0.00"
                  : ldata.materialcost,
              materialvalue:
                check && inEuros && matvalue
                  ? numcurrex(matvalue.toFixed(2), exrate)
                  : check && inEuros && !matvalue
                  ? "€ 0.00"
                  : currencify(matvalue, "$", 2),
              generalduty: ldata.generalduty ? ldata.generalduty : "0.00%",
              additionalduty: ldata.additionalduty
                ? ldata.additionalduty
                : "0.00%",
              totalduty: totalduty ? totalduty + "%" : "0.00%",
              dutyfee:
                check && inEuros && dutyfee
                  ? numcurrex(dutyfee.toFixed(2), exrate)
                  : check && inEuros && !dutyfee
                  ? "€ 0.00"
                  : currencify(dutyfee, "$", 2),
              harborfeepct: ldata.harborfeepct ? ldata.harborfeepct : "0.00%",
              harborfee:
                check && inEuros && harborfee
                  ? numcurrex(harborfee.toFixed(2), exrate)
                  : check && inEuros && !harborfee
                  ? "€ 0.00"
                  : currencify(harborfee, "$", 2),
              merchprocfeepct: ldata.merchprocfeepct
                ? ldata.merchprocfeepct
                : "0.00%",
              merchprocfee:
                check && inEuros && merchprocfee
                  ? numcurrex(merchprocfee.toFixed(2), exrate)
                  : check && inEuros && !merchprocfee
                  ? "€ 0.00"
                  : currencify(merchprocfee, "$", 2),
              cflatfee:
                check && inEuros && ldata.cflatfee
                  ? numcurrex(ldata.cflatfee, exrate)
                  : check && inEuros && !ldata.cflatfee
                  ? "€ 0.00"
                  : ldata.cflatfee,
              tsca:
                check && inEuros && ldata.tsca
                  ? numcurrex(ldata.tsca, exrate)
                  : check && inEuros && !ldata.tsca
                  ? "€ 0.00"
                  : ldata.tsca,
              isf:
                check && inEuros && ldata.isf
                  ? numcurrex(ldata.isf, exrate)
                  : check && inEuros && !ldata.isf
                  ? "€ 0.00"
                  : ldata.isf,
              totalcentryfee:
                check && inEuros && totalcentryfee
                  ? numcurrex(totalcentryfee.toFixed(2), exrate)
                  : check && inEuros && !totalcentryfee
                  ? "€ 0.00"
                  : currencify(totalcentryfee, "$", 2),
              centryfeepmt:
                check && inEuros && totalcentryfee
                  ? numcurrex(
                      (totalcentryfee / ldata.quantity).toFixed(2),
                      exrate
                    )
                  : check && inEuros && !totalcentryfee
                  ? "€ 0.00"
                  : currencify(totalcentryfee / ldata.quantity, "$", 2),
              pcommission:
                check && inEuros && ldata.pcommission
                  ? numcurrex(ldata.pcommission, exrate)
                  : check && inEuros && !ldata.pcommission
                  ? "€ 0.00"
                  : ldata.pcommission,
              pfinancecost:
                check && inEuros && ldata.pfinancecost
                  ? numcurrex(ldata.pfinancecost, exrate)
                  : check && inEuros && !ldata.pfinancecost
                  ? "€ 0.00"
                  : ldata.pfinancecost,
              sfinancecost:
                check && inEuros && ldata.sfinancecost
                  ? numcurrex(ldata.sfinancecost, exrate)
                  : check && inEuros && !ldata.sfinancecost
                  ? "€ 0.00"
                  : ldata.sfinancecost,
              freightpmt:
                check && inEuros && ldata.freightpmt
                  ? numcurrex(ldata.freightpmt, exrate)
                  : check && inEuros && !ldata.freightpmt
                  ? "€ 0.00"
                  : ldata.freightpmt,
              insurance:
                check && inEuros && ldata.insurance
                  ? numcurrex(ldata.insurance, exrate)
                  : check && inEuros && !ldata.insurance
                  ? "€ 0.00"
                  : ldata.insurance,
              inspectionpmt:
                check && inEuros && ldata.inspectionpmt
                  ? numcurrex(ldata.inspectionpmt, exrate)
                  : check && inEuros && !ldata.inspectionpmt
                  ? "€ 0.00"
                  : ldata.inspectionpmt,
              scommission:
                check && inEuros && ldata.scommission
                  ? numcurrex(ldata.scommission, exrate)
                  : check && inEuros && !ldata.scommission
                  ? "€ 0.00"
                  : ldata.scommission,
              interestcost:
                check && inEuros && ldata.interestcost
                  ? numcurrex(ldata.interestcost, exrate)
                  : check && inEuros && !ldata.interestcost
                  ? "€ 0.00"
                  : ldata.interestcost,
              legal:
                check && inEuros && ldata.legal
                  ? numcurrex(ldata.legal, exrate)
                  : check && inEuros && !ldata.legal
                  ? "€ 0.00"
                  : ldata.legal,
              pallets:
                check && inEuros && ldata.pallets
                  ? numcurrex(ldata.pallets, exrate)
                  : check && inEuros && !ldata.pallets
                  ? "€ 0.00"
                  : ldata.pallets,
              other:
                check && inEuros && ldata.other
                  ? numcurrex(ldata.other, exrate)
                  : check && inEuros && !ldata.other
                  ? "€ 0.00"
                  : ldata.other,
              totalcost:
                check && inEuros && ldata.totalcost
                  ? numcurrex(ldata.totalcost, exrate)
                  : check && inEuros && !ldata.totalcost
                  ? "€ 0.00"
                  : ldata.totalcost,
              interestrate: ldata.interestrate,
              interestdays: ldata.interestdays,
              pricebeforeint:
                check && inEuros && ldata.pricebeforeint
                  ? numcurrex(ldata.pricebeforeint, exrate)
                  : check && inEuros && !ldata.pricebeforeint
                  ? "€ 0.00"
                  : ldata.pricebeforeint,
              salesinterest:
                check && inEuros && ldata.salesinterest
                  ? numcurrex(ldata.salesinterest, exrate)
                  : check && inEuros && !ldata.salesinterest
                  ? "€ 0.00"
                  : ldata.salesinterest,
              priceafterint:
                check && inEuros && ldata.priceafterint
                  ? numcurrex(ldata.priceafterint, exrate)
                  : check && inEuros && !ldata.priceafterint
                  ? "€ 0.00"
                  : ldata.priceafterint,
              profit:
                check && inEuros && ldata.profit
                  ? numcurrex(ldata.profit, exrate)
                  : check && inEuros && !ldata.pricebeforeint
                  ? "€ 0.00"
                  : ldata.profit,
              margin:
                check && inEuros && ldata.margin
                  ? numcurrex(ldata.margin, exrate)
                  : check && inEuros && !ldata.margin
                  ? "€ 0.00"
                  : ldata.margin,
              turnover:
                check && inEuros && ldata.turnover
                  ? numcurrex(ldata.turnover, exrate)
                  : check && inEuros && !ldata.turnover
                  ? "€ 0.00"
                  : ldata.turnover,
              pctmargin: check && ldata.pctmargin ? ldata.pctmargin : "0.00%",
              netback:
                check && inEuros && ldata.netback
                  ? numcurrex(ldata.netback, exrate)
                  : check && inEuros && !ldata.netback
                  ? "€ 0.00"
                  : ldata.netback,
            });
            setQSData({
              ...QSData,
              KTP: ldata.KTP,
              KTS: ldata.KTS,
              QSDate: ldata.QSDate,
              saleType: ldata.saleTypeID,
              QSID: ldata.QSID,
              abbreviation: ldata.productID,
              supplier: ldata.supplierID,
              customer: ldata.customerID,
              packsize: ldata.packsize,
              marks: ldata.marks,
              from: ldata.from,
              to: ldata.to,
              POL: ldata.POLID,
              POD: ldata.PODID,
              saleComplete: ldata.saleComplete,
              TIC: ldata.traderID,
              traffic: ldata.trafficID,
              incoterms: ldata.incoterms,
              paymentTerm: ldata.pTermID,
              CADintrate: Number(ldata.includedrate.replace("%", "")) / 100,
              CADdays: ldata.includedperiod,
              shipmentType: ldata.shipmentTypeID ? ldata.shipmentTypeID : 1,
              freightTotal: ldata.freightTotal
                ? numerify(ldata.freightTotal, "$")
                : 0,
              shippingline: ldata.shippingline,
              payload: ldata.payload,
              totalinspection: ldata.totalinspection
                ? numerify(ldata.totalinspection, "$")
                : 0,
              quantity: Number(ldata.quantity.replace(",", "")),
              materialcost: ldata.materialcost
                ? numerify(ldata.materialcost, "$")
                : 0,
              materialvalue: matvalue ? matvalue : 0,
              generalduty: ldata.generalduty
                ? Number(ldata.generalduty.replace("%", "")) / 100
                : 0,
              additionalduty: ldata.additionalduty
                ? Number(ldata.additionalduty.replace("%", "")) / 100
                : 0,
              totalduty: totalduty ? totalduty / 100 : 0,
              dutyfee: dutyfee ? dutyfee : 0,
              harborfeepct: ldata.harborfeepct
                ? Number(ldata.harborfeepct.replace("%", "")) / 100
                : 0,
              harborfee: harborfee ? harborfee : 0,
              merchprocfeepct: ldata.merchprocfeepct
                ? Number(ldata.merchprocfeepct.replace("%", "")) / 100
                : 0,
              merchprocfee: merchprocfee ? merchprocfee : 0,
              cflatfee: ldata.cflatfee ? numerify(ldata.cflatfee, "$") : 0,
              tsca: ldata.tsca ? numerify(ldata.tsca, "$") : 0,
              isf: ldata.isf ? numerify(ldata.isf, "$") : 0,
              totalcentryfee: totalcentryfee ? totalcentryfee : 0,
              centryfeepmt: totalcentryfee
                ? totalcentryfee / ldata.quantity
                : 0,
              pcommission: ldata.pcommission
                ? numerify(ldata.pcommission, "$")
                : 0,
              pfinancecost: ldata.pfinancecost
                ? numerify(ldata.pfinancecost, "$")
                : 0,
              sfinancecost: ldata.sfinancecost
                ? numerify(ldata.sfinancecost, "$")
                : 0,
              freightpmt: ldata.freightpmt
                ? numerify(ldata.freightpmt, "$")
                : 0,
              insurance: ldata.insurance ? numerify(ldata.insurance, "$") : 0,
              inspectionpmt: ldata.inspectionpmt
                ? numerify(ldata.inspectionpmt, "$")
                : 0,
              scommission: ldata.scommission
                ? numerify(ldata.scommission, "$")
                : 0,
              interestcost: ldata.interestcost
                ? numerify(ldata.interestcost, "$")
                : 0,
              legal: ldata.legal ? numerify(ldata.legal, "$") : 0,
              pallets: ldata.pallets ? numerify(ldata.pallets, "$") : 0,
              other: ldata.other ? numerify(ldata.other, "$") : 0,
              totalcost: ldata.totalcost ? numerify(ldata.totalcost, "$") : 0,
              interestrate: Number(ldata.interestrate.replace("%", "")) / 100,
              interestdays: ldata.interestdays,
              pricebeforeint: ldata.pricebeforeint
                ? numerify(ldata.pricebeforeint, "$")
                : 0,
              salesinterest: ldata.salesinterest
                ? numerify(ldata.salesinterest, "$")
                : 0,
              priceafterint: ldata.priceafterint
                ? numerify(ldata.priceafterint, "$")
                : 0,
              profit: ldata.profit ? numerify(ldata.profit, "$") : 0,
              margin: ldata.margin ? numerify(ldata.margin, "$") : 0,
              turnover: ldata.turnover ? numerify(ldata.turnover, "$") : 0,
              pctmargin: Number(ldata.pctmargin.replace("%", "")) / 100,
              netback: ldata.netback ? numerify(ldata.netback, "$") : 0,
            });
            setQSOriginal({
              ...QSOriginal,
              KTP: ldata.KTP,
              KTS: ldata.KTS,
              QSDate: ldata.QSDate,
              saleType: ldata.saleType,
              QSID: ldata.QSID,
              abbreviation: ldata.abbreviation,
              supplier: ldata.supplier,
              customer: ldata.customer,
              packsize: ldata.packsize,
              marks: ldata.marks,
              from: ldata.from,
              to: ldata.to,
              POL: ldata.POL,
              POD: ldata.POD,
              saleComplete:
                ldata.saleComplete === -1
                  ? "sold"
                  : ldata.saleComplete === 0
                  ? "indication"
                  : ldata.saleComplete === 1
                  ? "US Allocation"
                  : "",
              TIC: ldata.trader,
              traffic: ldata.traffic,
              incoterms: ldata.incoterms,
              paymentTerm: ldata.paymentTerm,
              CADintrate: ldata.includedrate,
              CADdays: ldata.includedperiod,
              shipmentType: ldata.shipmentType,
              freightTotal: ldata.freightTotal ? ldata.freightTotal : "",
              shippingline: ldata.shippingline,
              payload: ldata.payload,
              totalinspection: ldata.totalinspection
                ? ldata.totalinspection
                : "",
              quantity: ldata.quantity,
              materialcost: ldata.materialcost ? ldata.materialcost : "$ 0.00",
              materialvalue: matvalue ? currencify(matvalue) : "$ 0.00",
              generalduty: ldata.generalduty ? ldata.generalduty : "0.00%",
              additionalduty: ldata.additionalduty
                ? ldata.additionalduty
                : "0.00%",
              totalduty: totalduty ? totalduty + "%" : "0.00%",
              dutyfee: dutyfee ? currencify(dutyfee) : "$ 0.00",
              harborfeepct: ldata.harborfeepct ? ldata.harborfeepct : "0.00%",
              harborfee: harborfee ? currencify(harborfee) : "$ 0.00",
              merchprocfeepct: ldata.merchprocfeepct
                ? ldata.merchprocfeepct
                : "0.00%",
              merchprocfee: merchprocfee ? currencify(merchprocfee) : "$ 0.00",
              cflatfee: ldata.cflatfee ? ldata.cflatfee : "$ 0.00",
              tsca: ldata.tsca ? ldata.tsca : "$ 0.00",
              isf: ldata.isf ? ldata.isf : "$ 0.00",
              totalcentryfee: totalcentryfee
                ? currencify(totalcentryfee)
                : "$ 0.00",
              centryfeepmt: totalcentryfee
                ? currencify(totalcentryfee / ldata.quantity)
                : "$ 0.00",
              pcommission: ldata.pcommission ? ldata.pcommission : "$ 0.00",
              pfinancecost: ldata.pfinancecost ? ldata.pfinancecost : "$ 0.00",
              sfinancecost: ldata.sfinancecost ? ldata.sfinancecost : "$ 0.00",
              freightpmt: ldata.freightpmt ? ldata.freightpmt : "$ 0.00",
              insurance: ldata.insurance ? ldata.insurance : "$ 0.00",
              inspectionpmt: ldata.inspectionpmt
                ? ldata.inspectionpmt
                : "$ 0.00",
              scommission: ldata.scommission ? ldata.scommission : "$ 0.00",
              interestcost: ldata.interestcost ? ldata.interestcost : "$ 0.00",
              legal: ldata.legal ? ldata.legal : "$ 0.00",
              pallets: ldata.pallets ? ldata.pallets : "$ 0.00",
              other: ldata.other ? ldata.other : "$ 0.00",
              totalcost: ldata.totalcost ? ldata.totalcost : "$ 0.00",
              interestrate: ldata.interestrate,
              interestdays: ldata.interestdays,
              pricebeforeint: ldata.pricebeforeint
                ? ldata.pricebeforeint
                : "$ 0.00",
              salesinterest: ldata.salesinterest
                ? ldata.salesinterest
                : "$ 0.00",
              priceafterint: ldata.priceafterint
                ? ldata.priceafterint
                : "$ 0.00",
              profit: ldata.profit ? ldata.profit : "$ 0.00",
              margin: ldata.margin ? ldata.margin : "$ 0.00",
              turnover: ldata.turnover ? ldata.turnover : "$ 0.00",
              pctmargin: ldata.pctmargin,
              netback: ldata.netback ? ldata.netback : "$ 0.00",
            });
            setQSOriginalData({
              ...QSOriginal,
              KTP: ldata.KTP,
              KTS: ldata.KTS,
              QSDate: ldata.QSDate,
              saleType: ldata.saleTypeID,
              QSID: ldata.QSID,
              abbreviation: ldata.productID,
              supplier: ldata.supplierID,
              customer: ldata.customerID,
              packsize: ldata.packsize,
              marks: ldata.marks,
              from: ldata.from,
              to: ldata.to,
              POL: ldata.POLID,
              POD: ldata.PODID,
              saleComplete: ldata.saleComplete,
              TIC: ldata.traderID,
              traffic: ldata.trafficID,
              incoterms: ldata.incoterms,
              paymentTerm: ldata.pTermID,
              CADintrate: Number(ldata.includedrate.replace("%", "")) / 100,
              CADdays: ldata.includedperiod,
              shipmentType: ldata.shipmentTypeID ? ldata.shipmentTypeID : 1,
              freightTotal: ldata.freightTotal
                ? numerify(ldata.freightTotal)
                : 0,
              shippingline: ldata.shippingline,
              payload: ldata.payload,
              totalinspection: ldata.totalinspection
                ? numerify(ldata.totalinspection)
                : 0,
              quantity: Number(ldata.quantity.replace(",", "")),
              materialcost: ldata.materialcost
                ? numerify(ldata.materialcost)
                : 0,
              materialvalue: matvalue ? matvalue : 0,
              generalduty: ldata.generalduty
                ? numerify(ldata.generalduty, "%") / 100
                : 0,
              additionalduty: ldata.additionalduty
                ? numerify(ldata.additionalduty, "%") / 100
                : 0,
              totalduty: totalduty ? totalduty / 100 : 0,

              dutyfee: dutyfee ? dutyfee : 0,
              harborfeepct: ldata.harborfeepct
                ? numerify(ldata.harborfeepct, "%") / 100
                : 0,
              harborfee: harborfee ? harborfee : 0,
              merchprocfeepct: ldata.merchprocfeepct
                ? numerify(ldata.merchprocfeepct, "%") / 100
                : 0,
              merchprocfee: merchprocfee ? merchprocfee : 0,
              cflatfee: ldata.cflatfee ? numerify(ldata.cflatfee) : 0,
              tsca: ldata.tsca ? numerify(ldata.tsca) : 0,
              isf: ldata.isf ? numerify(ldata.isf) : 0,
              pcommission: ldata.pcommission ? numerify(ldata.pcommission) : 0,
              totalcentryfee: totalcentryfee ? totalcentryfee : 0,
              centryfeepmt: totalcentryfee
                ? totalcentryfee / ldata.quantity
                : 0,
              pfinancecost: ldata.pfinancecost
                ? numerify(ldata.pfinancecost)
                : 0,
              sfinancecost: ldata.sfinancecost
                ? numerify(ldata.sfinancecost)
                : 0,
              freightpmt: ldata.freightpmt ? numerify(ldata.freightpmt) : 0,
              insurance: ldata.insurance ? numerify(ldata.insurance) : 0,
              inspectionpmt: ldata.inspectionpmt
                ? numerify(ldata.inspectionpmt)
                : 0,
              scommission: ldata.scommission ? numerify(ldata.scommission) : 0,
              interestcost: ldata.interestcost
                ? numerify(ldata.interestcost)
                : 0,
              legal: ldata.legal ? numerify(ldata.legal) : 0,
              pallets: ldata.pallets ? numerify(ldata.pallets) : 0,
              other: ldata.other ? numerify(ldata.other) : 0,
              interestrate: Number(ldata.interestrate.replace("%", "")) / 100,
              interestdays: ldata.interestdays,
              pricebeforeint: ldata.pricebeforeint
                ? numerify(ldata.pricebeforeint)
                : 0,
              salesinterest: ldata.salesinterest
                ? numerify(ldata.salesinterest)
                : 0,
              priceafterint: ldata.priceafterint
                ? numerify(ldata.priceafterint)
                : 0,
            });
            if (ldata.saleComplete === -1) {
              setSold(true);
              setAllocated(false);
            }
            if (ldata.saleComplete === 1) {
              setAllocated(true);
              setSold(false);
            }
            if (ldata.saleComplete === 0) {
              setSold(false);
              setAllocated(false);
            }
            // Finish loading
            await doneloading();
          };
          // Call the do work function
          doWork();
        }
      );
    }
    // otherwise, this is a new QS and set initial values
    if (QSindex === QSIDList.length) {
      setQSValues(QSValuesInit);
      setQSData(QSDataInit);
      setExchangerate(null);
    }
    // reset to non-editing mode everytime a QS is loaded or a new QS is started
    setEditing(false);
  }, [QSindex]);

  // Check changes before leaving current QS
  const checkChanges = (a, b, str, id) => {
    let c = [];
    let d = [];
    let e = [];
    // loop over a, an array containing all new values.
    for (const x in a) {
      if (inEuros === false) {
        // compare each value in a to its original in b. If values are different:
        if (a[x] !== b[x]) {
          // push the value name into c
          c.push(x);
          // if original value was "" then push (empty) into d, else push the original value into b
          if (b[x] === "") {
            d.push("(empty)");
          } else {
            d.push(b[x]);
          }
          // push the new value into e
          e.push(a[x]);
        }
      }
      if (inEuros === true) {
        if (a[x]) {
          if (a[x].toString().indexOf("€") > -1) {
            if (
              numerify(a[x], "€").toFixed(2) !==
              (numerify(b[x], "$") / exchangerate).toFixed(2)
            ) {
              c.push(x);
              if (b[x] === "") {
                d.push("(empty)");
              } else {
                d.push(
                  numcurrex(b[x], exchangerate, "€", "$", 2)
                  // if any bug arrises it may be because numcurrex adds commas as thousand separator. This was not the case in the original code.
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
    if (!allocated) {
      setQSValues({
        ...QSValues,
        customer: "USA Distribution",
        CADdays: 100,
        saleComplete: "US Allocation",
      });
      setQSData({
        ...QSData,
        customer: 452,
        CADdays: 100,
        saleComplete: 1,
      });
    }
    if (allocated) {
      setQSValues({
        ...QSValues,
        customer: "",
        CADdays: 10,
        saleComplete: "Indication",
      });
      setQSData({
        ...QSData,
        customer: "",
        CADdays: 10,
        saleComplete: 0,
      });
    }
    setAllocated(!allocated);
    setSold(false);
    setEditing(true);
  };

  useEffect(() => {
    if (sold) {
      setQSData({ ...QSData, saleComplete: -1 });
      setQSValues({ ...QSValues, saleComplete: "sold" });
    }
    if (allocated) {
      setQSData({ ...QSData, saleComplete: 1 });
      setQSValues({ ...QSValues, saleComplete: "US Allocation" });
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

  const PercentageChange = (e, dec = 2) => {
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
            Number(e.target.value.replace("%", "")).toFixed(dec) / 100,
        });
        setQSValues({
          ...QSValues,
          [e.target.name]: e.target.value.replace("%", ""),
        });
      } else {
        setQSData({
          ...QSData,
          [e.target.name]: Number(e.target.value).toFixed(dec) / 100,
        });
        setQSValues({
          ...QSValues,
          [e.target.name]: e.target.value,
        });
      }
    }
  };

  const PercentageBlur = (e, dec = 2) => {
    setQSValues({
      ...QSValues,
      [e.target.name]:
        Number(e.target.value.replace("%", "")).toFixed(dec) + "%",
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
    cef,
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
      resolve(
        mc + cef + pc + pf + sf + frt + ins + insp + sc + int + lg + pal + oth
      );
    });
  };

  const paicalc = (pbi, slsint) => {
    return new Promise((resolve, reject) => {
      resolve(pbi + slsint);
    });
  };
  const materialvaluecalc = (matcost, qty) => {
    return new Promise((resolve, reject) => {
      resolve(matcost * qty);
    });
  };
  const totaldutycalc = (gduty, aduty) => {
    return new Promise((resolve, reject) => {
      resolve(gduty + aduty);
    });
  };
  const dutyfeecalc = (entryfee, tduty) => {
    return new Promise((resolve, reject) => {
      resolve(entryfee * tduty);
    });
  };
  const harborfeecalc = (entryfee, hpct) => {
    return new Promise((resolve, reject) => {
      resolve(entryfee * hpct);
    });
  };
  const mercprocfeecalc = (entryfee, mppct) => {
    return new Promise((resolve, reject) => {
      resolve(entryfee * mppct);
    });
  };
  const totalcentryfeecalc = (dfee, hfee, mpfee, ffee, tsca, isf) => {
    return new Promise((resolve, reject) => {
      resolve(dfee + hfee + mpfee + ffee + tsca + isf);
    });
  };
  const centryfeepmtcalc = (tcfee, qty) => {
    return new Promise((resolve, reject) => {
      resolve(tcfee / qty);
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

      const materialvalue = await materialvaluecalc(
        QSData.materialcost,
        QSData.quantity
      );
      const totalduty = await totaldutycalc(
        QSData.generalduty,
        QSData.additionalduty
      );
      const dutyfee = await dutyfeecalc(materialvalue, totalduty);
      const harborfee = await harborfeecalc(materialvalue, QSData.harborfeepct);
      const merchprocfee = await mercprocfeecalc(
        materialvalue,
        QSData.merchprocfeepct
      );
      const totalcentryfee = await totalcentryfeecalc(
        dutyfee,
        harborfee,
        merchprocfee,
        QSData.cflatfee,
        QSData.tsca,
        QSData.isf
      );
      const centryfeepmt = QSData.quantity
        ? await centryfeepmtcalc(totalcentryfee, QSData.quantity)
        : 0;
      const ttlcost = await ttlcostcalc(
        QSData.materialcost,
        centryfeepmt,
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
        materialvalue: materialvalue,
        totalduty: totalduty,
        dutyfee: dutyfee,
        harborfee: harborfee,
        merchprocfee: merchprocfee,
        totalcentryfee: totalcentryfee,
        centryfeepmt: centryfeepmt,
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
          materialvalue:
            "$ " +
            materialvalue.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
          totalduty: Number(totalduty * 100).toFixed(2) + "%",
          dutyfee:
            "$ " + dutyfee.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
          harborfee: "$ " + harborfee.toFixed(2),
          merchprocfee: "$ " + merchprocfee.toFixed(2),
          totalcentryfee: "$ " + totalcentryfee.toFixed(2),
          centryfeepmt: "$ " + centryfeepmt.toFixed(2),
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
          materialvalue:
            "€ " +
            (materialvalue / exchangerate)
              .toFixed(2)
              .replace(/\B(?=(\d{3})+(?!\d))/g, ","),
          totalduty: Number(totalduty * 100).toFixed(2) + "%",
          dutyfee:
            "€ " +
            (dutyfee / exchangerate)
              .toFixed(2)
              .replace(/\B(?=(\d{3})+(?!\d))/g, ","),
          harborfee: "€ " + Number(harborfee / exchangerate).toFixed(2),
          merchprocfee: "€ " + Number(merchprocfee / exchangerate).toFixed(2),
          totalcentryfee:
            "€ " + Number(totalcentryfee / exchangerate).toFixed(2),
          centryfeepmt: "€ " + Number(centryfeepmt / exchangerate).toFixed(2),
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
    QSData.generalduty,
    QSData.additionalduty,
    QSData.harborfeepct,
    QSData.merchprocfeepct,
    QSData.cflatfee,
    QSData.tsca,
    QSData.isf,
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
        freightTotal: currencify(QSData.freightTotal / exchangerate, "€"),
        totalinspection: currencify(QSData.totalinspection / exchangerate, "€"),
        materialcost: currencify(QSData.materialcost / exchangerate, "€"),
        materialvalue: currencify(QSData.materialvalue / exchangerate, "€"),
        dutyfee: currencify(QSData.dutyfee / exchangerate, "€"),
        harborfee: currencify(QSData.harborfee / exchangerate, "€"),
        merchprocfee: currencify(QSData.merchprocfee / exchangerate, "€"),
        cflatfee: currencify(QSData.cflatfee / exchangerate, "€"),
        tsca: currencify(QSData.tsca / exchangerate, "€"),
        isf: currencify(QSData.isf / exchangerate, "€"),
        totalcentryfee: currencify(QSData.totalcentryfee / exchangerate, "€"),
        centryfeepmt: currencify(QSData.centryfeepmt / exchangerate, "€"),
        pcommission: currencify(QSData.pcommission / exchangerate, "€"),
        pfinancecost: currencify(QSData.pfinancecost / exchangerate, "€"),
        sfinancecost: currencify(QSData.sfinancecost / exchangerate, "€"),
        freightpmt: currencify(QSData.freightpmt / exchangerate, "€"),
        insurance: currencify(QSData.insurance / exchangerate, "€"),
        inspectionpmt: currencify(QSData.inspectionpmt / exchangerate, "€"),
        scommission: currencify(QSData.scommission / exchangerate, "€"),
        interestcost: currencify(QSData.interestcost / exchangerate, "€"),
        legal: currencify(QSData.legal / exchangerate, "€"),
        pallets: currencify(QSData.pallets / exchangerate, "€"),
        other: currencify(QSData.other / exchangerate, "€"),
        totalcost: currencify(QSData.totalcost / exchangerate, "€"),
        pricebeforeint: currencify(QSData.pricebeforeint / exchangerate, "€"),
        salesinterest: currencify(QSData.salesinterest / exchangerate, "€"),
        priceafterint: currencify(QSData.priceafterint / exchangerate, "€"),
        profit: currencify(QSData.profit / exchangerate, "€"),
        margin: currencify(QSData.margin / exchangerate, "€"),
        turnover: currencify(QSData.turnover / exchangerate, "€"),
        netback: currencify(QSData.netback / exchangerate, "€"),
      });
    }
    if (inEuros === false) {
      setQSValues({
        ...QSValues,
        freightTotal: currencify(QSData.freightTotal, "$"),
        totalinspection: currencify(QSData.totalinspection, "$"),
        materialcost: currencify(QSData.materialcost, "$"),
        materialvalue: currencify(QSData.materialvalue, "$"),
        dutyfee: currencify(QSData.dutyfee, "$"),
        harborfee: currencify(QSData.harborfee, "$"),
        merchprocfee: currencify(QSData.merchprocfee, "$"),
        cflatfee: currencify(QSData.cflatfee, "$"),
        tsca: currencify(QSData.tsca, "$"),
        isf: currencify(QSData.isf, "$"),
        totalcentryfee: currencify(QSData.totalcentryfee, "$"),
        centryfeepmt: currencify(QSData.centryfeepmt, "$"),
        pcommission: currencify(QSData.pcommission, "$"),
        pfinancecost: currencify(QSData.pfinancecost, "$"),
        sfinancecost: currencify(QSData.sfinancecost, "$"),
        freightpmt: currencify(QSData.freightpmt, "$"),
        insurance: currencify(QSData.insurance, "$"),
        inspectionpmt: currencify(QSData.inspectionpmt, "$"),
        scommission: currencify(QSData.scommission, "$"),
        interestcost: currencify(QSData.interestcost, "$"),
        legal: currencify(QSData.legal, "$"),
        pallets: currencify(QSData.pallets, "$"),
        other: currencify(QSData.other, "$"),
        totalcost: currencify(QSData.totalcost, "$"),
        pricebeforeint: currencify(QSData.pricebeforeint, "$"),
        salesinterest: currencify(QSData.salesinterest, "$"),
        priceafterint: currencify(QSData.priceafterint, "$"),
        profit: currencify(QSData.profit, "$"),
        margin: currencify(QSData.margin, "$"),
        turnover: currencify(QSData.turnover, "$"),
        netback: currencify(QSData.netback, "$"),
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

  const [QSresponsemsg, setQSresponsemsg] = useState();
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
        setQSresponsemsg(response.data["message"]);
        setShowmsg(!showmsg);
        setEditing(false);
        toggleQSrefresh();

        // console.log(response.data["message"]);
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
  const loadUSPositions = () => {
    Axios.post("/uspositiondropdown").then((response) => {
      setUSPositionsddown(response.data);
      console.log(response.data);
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
      materialcost:
        "$ " +
        Number(position.Price.replace("$", "").replace(",", "")).toFixed(2),
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

  const setUSPosition = (val) => {
    setEditing(true);
    let usposition = USPositionsddown[val];
    console.log(usposition);
    setQSValues({
      ...QSValues,
      KTP: usposition.USWGP,
      abbreviation: usposition.product,
      supplier: usposition.supplier,
      packsize: usposition.packaging ? usposition.packaging : "",
      marks: usposition.marks ? usposition.marks : "",
      materialcost:
        "$ " +
        Number(usposition.EWPrice.replace("$", "").replace(",", "")).toFixed(2),
    });
    setQSData({
      ...QSData,
      KTP: usposition.USWGP,
      abbreviation: usposition.productID,
      supplier: usposition.supplierID,
      packsize: usposition.packaging ? usposition.packaging : "",
      marks: usposition.marks ? usposition.marks : "",
      materialcost: Number(
        usposition.EWPrice.replace("$", "").replace(",", "")
      ),
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
      if (e.target.name === "centryfeepmt") {
        setShowcustomscalculator(!showcustomscalculator);
      }
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
            <div className="saletype-group">
              <input
                name="saletype"
                type="radio"
                checked={QSData && QSData.saleType === 3 ? true : false}
                required
                onClick={(e) => {
                  setEditing(true);
                  setQSData({ ...QSData, saleType: 3 });
                  setQSValues({ ...QSValues, saleType: "US Distribution" });
                  loadUSPositions();
                }}
              />
              <label>US Distribution</label>
              {QSData && QSData.saleType == 3 ? (
                <select
                  className="USWGPSelect"
                  onChange={(e) => setUSPosition(e.target.value)}
                >
                  <option>Select...</option>
                  {USPositionsddown
                    ? USPositionsddown.map((pos, i) => {
                        return (
                          <option value={i}>
                            {pos.USWGP +
                              " - " +
                              pos.product +
                              " - " +
                              pos.supplier +
                              " - " +
                              pos.Inventory +
                              "mt left"}
                          </option>
                        );
                      })
                    : ""}
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
                <legend>Costs (per mt)</legend>
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

                {QSData.saleComplete !== 1 ? (
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
                ) : (
                  ""
                )}
                {QSData.saleComplete === 1 ? (
                  <div className="form-group">
                    <label htmlFor="" style={{ position: "relative" }}>
                      Customs Entry:{" "}
                      <FontAwesomeIcon
                        icon={faCalculator}
                        onClick={(e) => {
                          setShowcustomscalculator(!showcustomscalculator);
                        }}
                      />
                    </label>
                    <input
                      style={{ backgroundColor: "rgb(244,244,244)" }}
                      className="QSfig canceldrag"
                      value={QSValues.centryfeepmt}
                      // onDoubleClick={(e) => {
                      //   e.target.select();
                      // }}
                      name="centryfeepmt"
                      placeholder="...Customs Entry pmt"
                      onChange={CurrencyChange}
                      onBlur={CurrencyBlur}
                      type="text"
                      required
                      readOnly
                      onKeyDown={ignoreEnter}
                    />
                  </div>
                ) : (
                  ""
                )}
                {showcustomscalculator & (QSData.saleComplete === 1) ? (
                  <div className="customscalc" style={{ position: "absolute" }}>
                    <div className="form-group">
                      <label htmlFor="">Quantity:</label>
                      <input
                        className="QSfig canceldrag"
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
                    <div className="form-group">
                      <label htmlFor="">Material Cost/mt:</label>
                      <input
                        className="QSfig canceldrag"
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
                      <label htmlFor="">Entry Value:</label>
                      <input
                        style={{
                          backgroundColor: "rgb(230,230,230",
                          borderBottom: "None",
                        }}
                        className="QSfig canceldrag"
                        type="text"
                        placeholder="...Material Value $"
                        onChange={CurrencyChange}
                        name="materialvalue"
                        value={QSValues.materialvalue}
                        onBlur={CurrencyBlur}
                        required
                        readOnly
                        onKeyDown={ignoreEnter}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="">General Duty (%):</label>
                      <input
                        className="QSfig canceldrag"
                        type="text"
                        placeholder="...General Duty"
                        onChange={PercentageChange}
                        name="generalduty"
                        value={QSValues.generalduty}
                        onBlur={PercentageBlur}
                        required
                        onKeyDown={ignoreEnter}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="">Additional Duty (%):</label>
                      <input
                        className="QSfig canceldrag"
                        type="text"
                        placeholder="...Additional Duty"
                        onChange={PercentageChange}
                        name="additionalduty"
                        value={QSValues.additionalduty}
                        onBlur={PercentageBlur}
                        required
                        onKeyDown={ignoreEnter}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="">Total Duty:</label>
                      <input
                        style={{
                          backgroundColor: "rgb(230,230,230",
                          borderBottom: "None",
                        }}
                        className="QSfig canceldrag"
                        type="text"
                        placeholder="...Total Duty %"
                        onChange={PercentageChange}
                        name="totalduty"
                        value={QSValues.totalduty}
                        onBlur={PercentageBlur}
                        required
                        readOnly
                        onKeyDown={ignoreEnter}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="">Duty Fee:</label>
                      <input
                        style={{
                          backgroundColor: "rgb(230,230,230",
                          borderBottom: "None",
                        }}
                        className="QSfig canceldrag"
                        type="text"
                        placeholder="...Duty Fee $"
                        onChange={CurrencyChange}
                        name="dutyfee"
                        value={QSValues.dutyfee}
                        onBlur={CurrencyBlur}
                        required
                        readOnly
                        onKeyDown={ignoreEnter}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="">Harbor Fee %:</label>
                      <input
                        className="QSfig canceldrag"
                        type="text"
                        placeholder="...HarborFee %"
                        onChange={(e) => PercentageChange(e, 3)}
                        name="harborfeepct"
                        value={QSValues.harborfeepct}
                        onBlur={(e) => PercentageBlur(e, 3)}
                        required
                        onKeyDown={ignoreEnter}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="">Harbor Fee:</label>
                      <input
                        style={{
                          backgroundColor: "rgb(230,230,230",
                          borderBottom: "None",
                        }}
                        className="QSfig canceldrag"
                        type="text"
                        placeholder="...Harbor Fee $"
                        onChange={CurrencyChange}
                        name="harborfee"
                        value={QSValues.harborfee}
                        onBlur={CurrencyBlur}
                        required
                        readOnly
                        onKeyDown={ignoreEnter}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="">Merch. Proc. Fee %:</label>
                      <input
                        className="QSfig canceldrag"
                        type="text"
                        placeholder="...Merch. Proc. %"
                        onChange={(e) => PercentageChange(e, 4)}
                        name="merchprocfeepct"
                        value={QSValues.merchprocfeepct}
                        onBlur={(e) => PercentageBlur(e, 4)}
                        required
                        onKeyDown={ignoreEnter}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="">Merch. Proc. Fee:</label>
                      <input
                        style={{
                          backgroundColor: "rgb(230,230,230",
                          borderBottom: "None",
                        }}
                        className="QSfig canceldrag"
                        type="text"
                        placeholder="...MP Fee $"
                        onChange={CurrencyChange}
                        name="merchprocfee"
                        value={QSValues.merchprocfee}
                        onBlur={CurrencyBlur}
                        required
                        readOnly
                        onKeyDown={ignoreEnter}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="">Flat Fee:</label>
                      <input
                        className="QSfig canceldrag"
                        type="text"
                        placeholder="...Flat Fee $"
                        onChange={CurrencyChange}
                        name="cflatfee"
                        value={QSValues.cflatfee}
                        onBlur={CurrencyBlur}
                        required
                        onKeyDown={ignoreEnter}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="">TSCA:</label>
                      <input
                        className="QSfig canceldrag"
                        type="text"
                        placeholder="...TSCA $"
                        onChange={CurrencyChange}
                        name="tsca"
                        value={QSValues.tsca}
                        onBlur={CurrencyBlur}
                        required
                        onKeyDown={ignoreEnter}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="">ISF:</label>
                      <input
                        className="QSfig canceldrag"
                        type="text"
                        placeholder="...ISF $"
                        onChange={CurrencyChange}
                        name="isf"
                        value={QSValues.isf}
                        onBlur={CurrencyBlur}
                        required
                        onKeyDown={ignoreEnter}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="">Total Entry Fee:</label>
                      <input
                        style={{
                          backgroundColor: "rgb(230,230,230",
                          borderBottom: "None",
                        }}
                        className="QSfig canceldrag"
                        type="text"
                        placeholder="...Total Entry Fee $"
                        onChange={CurrencyChange}
                        name="totalcentryfee"
                        value={QSValues.totalcentryfee}
                        onBlur={CurrencyBlur}
                        required
                        readOnly
                        onKeyDown={ignoreEnter}
                      />
                    </div>
                    <button
                      onClick={(e) => {
                        setShowcustomscalculator(false);
                      }}
                    >
                      Reset
                    </button>
                    <button
                      onClick={(e) => {
                        setShowcustomscalculator(false);
                      }}
                    >
                      OK
                    </button>
                  </div>
                ) : (
                  ""
                )}
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
                <FontAwesomeIcon
                  icon={faUnlock}
                  onClick={(e) => {
                    setLockER(!lockER);
                  }}
                  className={
                    !lockER
                      ? "unlockicon display-block"
                      : "unlockicon display-none"
                  }
                />
                <FontAwesomeIcon
                  icon={faLock}
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
              <>
                <span ref={refrespmsg}>{QSresponsemsg}</span>
                <button className="saveQSeditsbutton" type="submit">
                  Save Edits
                </button>
              </>
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
