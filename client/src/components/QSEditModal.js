import React, { useState, useEffect, useContext } from "react";
import "./QSEditModal.css";
import Axios from "axios";
import SearchField from "./SearchField";
import { RefreshPositionsContext } from "../contexts/RefreshPositionsProvider";

const QSEditModal = ({ handleClose, show, QStoedit }) => {
  const { toggleQSrefresh } = useContext(RefreshPositionsContext);
  const showHideClassName = show
    ? "modal QSmodal display-block"
    : "modal QSmodal display-none";

  const [QSID, setQSID] = useState();
  const [QSIDtoedit, setQSIDtoedit] = useState();
  const [QSIDList, setQSIDList] = useState([]);
  const [QSindex, setQSindex] = useState();
  const [QSload, setQSload] = useState(true);
  // let QSID = QStoedit.QSID;

  useEffect(() => {
    if (show) {
      Axios.post("/QSIDList").then((response) => {
        // console.log(response.data);
        const QSlist = [...new Set(response.data.map((item) => item.QSID))]; // [ 'A', 'B']
        // console.log(QSlist);
        setQSID(QStoedit.QSID);
        setQSIDtoedit(QStoedit.QSID);
        setQSIDList(QSlist);
        console.log(QStoedit.QSID);
        setQSload(!QSload);

        // console.log(QSIDList[QSindex]);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show]);

  useEffect(() => {
    console.log(QSID);

    setQSindex(QSIDList.indexOf(QSID));
  }, [QSload]);

  const QSeditableInit = {
    includedrate: "",
    includedperiod: "",
    quantity: "",
    materialcost: "",
    pcommission: "",
    pfinancecost: "",
    sfinancecost: "",
    freightpmt: "",
    insurancecost: "",
    inspectioncost: "",
    scommission: "",
    interestcost: "",
    legal: "",
    pallets: "",
    other: "",
    totalcost: "",
    // totalcost: "",
    interestrate: "",
    interestdays: "",
    pricebeforeint: "",
    salesinterest: "",
    priceafterint: "",
  };

  const [QSeditable, setQSeditable] = useState(QSeditableInit);
  const [QSoriginal, setQSoriginal] = useState(null);
  const [resetfield, setResetfield] = useState(false);
  const [QSedits, setQSedits] = useState();
  const [positions, setPositions] = useState();
  const [sold, setSold] = useState();

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
      console.log("current:" + QSID);
      Axios.post("/QStoedit", { id: QSID }).then((response) => {
        setQSeditable(response.data[0]);
        console.log(response.data[0]);
        setQSoriginal(response.data[0]);
        setSold(response.data[0].saleComplete);
        setQSedits({
          ...QSedits,
          totalcost: Number(
            response.data[0].totalcost.replace("$", "").replace(",", "")
          ),
          interestcost: Number(
            response.data[0].interestcost.replace("$", "").replace(",", "")
          ),
          salesinterest: Number(
            response.data[0].salesinterest.replace("$", "").replace(",", "")
          ),
          priceafterint: Number(
            response.data[0].priceafterint.replace("$", "").replace(",", "")
          ),
          profit: Number(
            response.data[0].profit.replace("$", "").replace(",", "")
          ),
          margin: Number(
            response.data[0].margin.replace("$", "").replace(",", "")
          ),
          turnover: Number(
            response.data[0].turnover.replace("$", "").replace(",", "")
          ),
          pctmargin: Number(
            response.data[0].pctmargin.replace("%", "").replace(",", "") / 100
          ),
          netback: Number(
            response.data[0].netback.replace("$", "").replace(",", "")
          ),
        });
        // console.log(response.data);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show, QSID]);

  const handleInputChange = (e) => {
    e.preventDefault();
    setQSeditable({
      ...QSeditable,
      [e.target.name]: e.target.value,
    });
    setQSedits({
      ...QSedits,
      [e.target.name]: e.target.value,
    });

    // setPostoedit({
    //   ...postoedit,
    //   [e.target.name]: e.target.value,
    // });
  };
  const handleCNumInputChange = (e) => {
    e.preventDefault();
    const isInteger = RegExp("^[0-9]+$");
    if (isInteger.test(e.target.value) || e.target.value == "") {
      setQSeditable({
        ...QSeditable,
        [e.target.name]: e.target.value,
      });
      setQSedits({
        ...QSedits,
        [e.target.name]: e.target.value,
      });
    }
  };
  const handleQInputChange = (e) => {
    e.preventDefault();
    const isdecimalnumber = RegExp("^[0-9.,$]+$");
    if (isdecimalnumber.test(e.target.value)) {
      setQSeditable({
        ...QSeditable,
        [e.target.name]: e.target.value,
      });
      setQSedits({
        ...QSedits,
        [e.target.name]: e.target.value.includes("$")
          ? e.target.value.replace("$", "")
          : e.target.value,
      });
    }
  };
  const handlePctInputChange = (e) => {
    e.preventDefault();
    const ispercent = RegExp("^[0-9.%]+$");
    if (ispercent.test(e.target.value)) {
      setQSeditable({
        ...QSeditable,
        [e.target.name]: e.target.value,
      });
      setQSedits({
        ...QSedits,
        [e.target.name]: e.target.value.includes("%")
          ? Number(e.target.value.replace("%", "")) / 100
          : Number(e.target.value) / 100,
      });
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    handleClose();
  };
  const makecurrency = (num, field) => {
    if (num !== null && num !== "") {
      // console.log(num.replace("$", ""));
      if (num.toString().includes("$") || num.toString().includes(",")) {
        setQSeditable({
          ...QSeditable,
          [field]:
            "$" + Number(num.replace("$", "").replace(",", "")).toFixed(2),
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
    let Subject = `WeGrow - FIRM OFFER - ${QSeditable.quantity}mt - ${QSeditable.product} - ${QSeditable.customer}`;
    let Message = `<p>Dear Paul</p>`;
    window.location.href = `mailto:user@example.com?subject=${Subject}&body=${Message}`;
  };
  const handleProductChange = (id1, name1, id2, name2, id3, name3) => {
    setQSeditable({
      ...QSeditable,
      product: name1,
      supplier: name2,
      productgroup: name3,
    });
    setQSedits({
      ...QSedits,
      productID: id1,
      supplierID: id2,
      // productgroupID: id3,
    });
  };
  const handleCustomerChange = (id1, name1) => {
    setQSeditable({
      ...QSeditable,
      customer: name1,
    });
    setQSedits({
      ...QSedits,
      customerID: id1,
    });
  };
  const handlePOLChange = (id1, name1) => {
    setQSeditable({
      ...QSeditable,
      POL: name1,
    });
    setQSedits({
      ...QSedits,
      POLID: id1,
    });
  };
  const handlePODChange = (id1, name1) => {
    setQSeditable({
      ...QSeditable,
      POD: name1,
    });
    setQSedits({
      ...QSedits,
      PODID: id1,
    });
  };
  const handleTrafficChange = (id1, name1) => {
    setQSeditable({
      ...QSeditable,
      traffic: name1,
    });
    setQSedits({
      ...QSedits,
      trafficID: id1,
    });
  };
  const handlePaytermChange = (id1, name1) => {
    setQSeditable({
      ...QSeditable,
      paymentterms: name1,
    });
    setQSedits({
      ...QSedits,
      pTermID: id1,
    });
  };
  const closeandclear = () => {
    // setQSID(null);

    setQSeditable(QSeditableInit);

    handleClose();
    setQSedits(null);
  };
  const loadPositions = () => {
    Axios.post("/positiondropdown").then((response) => {
      // console.log(response.data);
      setPositions(response.data);
    });
  };
  const setPosition = (val) => {
    let position = positions[val];
    console.log(position);
    setQSeditable({
      ...QSeditable,
      KTP: position.KTP,
      product: position.product,
      supplier: position.Supplier,
      from: position.start,
      to: position.end,
      materialcost: position.Price,
    });
    setQSedits({
      ...QSedits,
      KTP: position.KTP,
      productID: position.productID,
      supplierID: position.supplierID,
      from: position.start,
      to: position.end,
      materialcost: position.Price.replace("$", "").replace(",", ""),
    });
  };
  const handleSold = () => {
    setSold(!sold);
  };
  useEffect(() => {
    if (sold) {
      setQSeditable({ ...QSeditable, saleComplete: -1 });
      setQSedits({ ...QSedits, saleComplete: -1 });
    }
    if (!sold) {
      setQSeditable({ ...QSeditable, saleComplete: 0 });
      setQSedits({ ...QSedits, saleComplete: 0 });
    }
  }, [sold]);
  // const deps = QSeditable
  //   ? [
  //       QSeditable.interestdays,
  //       QSeditable.interestrate,
  //       QSeditable.pricebeforeint,
  //     ]
  //   : [];

  useEffect(() => {
    if (QSeditable.freightTotal && QSeditable.payload) {
      if (
        Number(QSeditable.freightTotal.replace("$", "").replace(",", "")) > 0 &&
        Number(QSeditable.payload) > 0
      ) {
        setQSeditable({
          ...QSeditable,
          freightpmt:
            "$" +
            (
              Number(
                QSeditable.freightTotal.replace("$", "").replace(",", "")
              ) / Number(QSeditable.payload)
            ).toFixed(2),
        });
        setQSedits({
          ...QSedits,
          freightTotal: Number(
            QSeditable.freightTotal.replace("$", "").replace(",", "")
          ),
          payload: Number(QSeditable.payload),
          freightpmt:
            Number(QSeditable.freightTotal.replace("$", "").replace(",", "")) /
            Number(QSeditable.payload),
        });
      }
    }
  }, [QSeditable.freightTotal, QSeditable.payload]);

  useEffect(() => {
    setQSeditable({
      ...QSeditable,
      salesinterest:
        "$" +
        (
          ((Number(QSeditable.interestrate.replace("%", "")) / 100) *
            Number(QSeditable.interestdays) *
            Number(
              QSeditable.pricebeforeint.replace("$", "").replace(",", "")
            )) /
          360
        ).toFixed(2),
    });
    setQSedits({
      ...QSedits,
      salesinterest:
        ((Number(QSeditable.interestrate.replace("%", "")) / 100) *
          Number(QSeditable.interestdays) *
          Number(QSeditable.pricebeforeint.replace("$", "").replace(",", ""))) /
        360,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    QSeditable.interestdays,
    QSeditable.interestrate,
    QSeditable.pricebeforeint,
  ]);

  // const deps2 = QSeditable
  //   ? [
  //       QSeditable.materialcost,
  //       QSeditable.pcommission,
  //       QSeditable.pfinancecost,
  //       QSeditable.sfinancecost,
  //       QSeditable.freightpmt,
  //       QSeditable.insurancecost,
  //       QSeditable.inspectioncost,
  //       QSeditable.scommission,
  //       QSeditable.interestcost,
  //       QSeditable.legal,
  //       QSeditable.pallets,
  //       QSeditable.other,
  //     ]
  //   : [];
  useEffect(() => {
    setQSeditable({
      ...QSeditable,
      interestcost:
        "$" +
        (
          (Number(QSeditable.includedrate.toString().replace("%", "")) *
            Number(QSeditable.includedperiod) *
            Number(
              QSeditable.pricebeforeint
                .toString()
                .replace("$", "")
                .replace(",", "")
            )) /
          360 /
          100
        ).toFixed(2),
    });
    setQSedits({
      ...QSedits,
      interestcost:
        (Number(QSeditable.includedrate.toString().replace("%", "")) *
          Number(QSeditable.includedperiod) *
          Number(
            QSeditable.pricebeforeint
              .toString()
              .replace("$", "")
              .replace(",", "")
          )) /
        360 /
        100,
    });
  }, [QSeditable.includedrate, QSeditable.includedperiod]);

  useEffect(() => {
    if (
      Number(QSeditable.interestrate.replace("%", "")) === 0 ||
      QSeditable.interestdays === 0
    ) {
      setQSeditable({
        ...QSeditable,
        interestcost:
          "$" +
          (
            (Number(QSeditable.includedrate.toString().replace("%", "")) *
              Number(QSeditable.includedperiod) *
              Number(
                QSeditable.pricebeforeint
                  .toString()
                  .replace("$", "")
                  .replace(",", "")
              )) /
            360 /
            100
          ).toFixed(2),
        salesinterest:
          "$" +
          (
            (Number(QSeditable.interestrate.replace("%", "")) *
              Number(QSeditable.interestdays) *
              Number(
                QSeditable.pricebeforeint.replace("$", "").replace(",", "")
              )) /
            360 /
            100
          ).toFixed(2),
        priceafterint:
          "$" +
          (
            Number(
              QSeditable.pricebeforeint.replace("$", "").replace(",", "")
            ) + Number(QSeditable.salesinterest.replace("$", ""))
          ).toFixed(2),
      });
      setQSedits({
        ...QSedits,
        interestcost:
          (Number(QSeditable.includedrate.toString().replace("%", "")) *
            Number(QSeditable.includedperiod) *
            Number(
              QSeditable.pricebeforeint
                .toString()
                .replace("$", "")
                .replace(",", "")
            )) /
          360 /
          100,
        salesinterest:
          (Number(QSeditable.interestrate.replace("%", "")) *
            Number(QSeditable.interestdays) *
            Number(
              QSeditable.pricebeforeint.replace("$", "").replace(",", "")
            )) /
          360 /
          100,
        priceafterint:
          Number(QSeditable.pricebeforeint.replace("$", "").replace(",", "")) +
          Number(QSeditable.salesinterest.replace("$", "")),
      });
    } else {
      setQSeditable({
        ...QSeditable,
        interestcost:
          "$" +
          (
            (Number(QSeditable.includedrate.toString().replace("%", "")) *
              Number(QSeditable.includedperiod) *
              Number(
                QSeditable.pricebeforeint
                  .toString()
                  .replace("$", "")
                  .replace(",", "")
              )) /
            360 /
            100
          ).toFixed(2),
        //
        salesinterest:
          "$" +
          (
            (Number(QSeditable.interestrate.replace("%", "")) *
              Number(QSeditable.interestdays) *
              Number(
                QSeditable.pricebeforeint.replace("$", "").replace(",", "")
              )) /
            360 /
            100
          ).toFixed(2),
        priceafterint:
          "$" +
          (
            Number(
              QSeditable.pricebeforeint.replace("$", "").replace(",", "")
            ) + Number(QSeditable.salesinterest.replace("$", ""))
          ).toFixed(2),
      });
      setQSedits({
        ...QSedits,
        interestcost:
          (Number(QSeditable.includedrate.toString().replace("%", "")) *
            Number(QSeditable.includedperiod) *
            Number(
              QSeditable.pricebeforeint
                .toString()
                .replace("$", "")
                .replace(",", "")
            )) /
          360 /
          100,
        salesinterest:
          (Number(QSeditable.interestrate.replace("%", "")) *
            Number(QSeditable.interestdays) *
            Number(
              QSeditable.pricebeforeint.replace("$", "").replace(",", "")
            )) /
          360 /
          100,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [QSeditable.pricebeforeint]);
  useEffect(() => {
    setQSeditable({
      ...QSeditable,
      priceafterint:
        "$" +
        (
          Number(QSeditable.pricebeforeint.replace("$", "").replace(",", "")) +
          Number(QSeditable.salesinterest.replace("$", ""))
        ).toFixed(2),
    });
    setQSedits({
      ...QSedits,
      priceafterint:
        Number(QSeditable.pricebeforeint.replace("$", "").replace(",", "")) +
        Number(QSeditable.salesinterest.replace("$", "")),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [QSeditable.salesinterest]);
  useEffect(() => {
    setQSeditable({
      ...QSeditable,
      interestcost:
        "$" +
        (
          (Number(QSeditable.includedrate.toString().replace("%", "")) *
            Number(QSeditable.includedperiod) *
            Number(
              QSeditable.pricebeforeint
                .toString()
                .replace("$", "")
                .replace(",", "")
            )) /
          360 /
          100
        ).toFixed(2),
      salesinterest:
        "$" +
        (
          (Number(QSeditable.interestrate.replace("%", "")) *
            Number(QSeditable.interestdays) *
            Number(
              QSeditable.pricebeforeint.replace("$", "").replace(",", "")
            )) /
          360 /
          100
        ).toFixed(2),
      priceafterint:
        "$" +
        (
          Number(QSeditable.pricebeforeint.replace("$", "").replace(",", "")) +
          Number(QSeditable.salesinterest.replace("$", ""))
        ).toFixed(2),
      profit:
        "$" +
        (
          Number(QSeditable.pricebeforeint.replace("$", "").replace(",", "")) -
          Number(QSeditable.totalcost.replace("$", "").replace(",", ""))
        ).toFixed(2),
      margin:
        "$" +
        (
          (Number(QSeditable.pricebeforeint.replace("$", "").replace(",", "")) -
            Number(QSeditable.totalcost.replace("$", "").replace(",", ""))) *
          Number(QSeditable.quantity)
        )
          .toFixed(2)
          .replace(/\B(?=(\d{3})+(?!\d))/g, ","),
      turnover:
        "$" +
        (
          Number(QSeditable.quantity) *
          Number(QSeditable.pricebeforeint.replace("$", "").replace(",", ""))
        )
          .toFixed(2)
          .replace(/\B(?=(\d{3})+(?!\d))/g, ","),
      pctmargin:
        (
          ((Number(
            QSeditable.pricebeforeint.replace("$", "").replace(",", "")
          ) -
            Number(QSeditable.totalcost.replace("$", "").replace(",", ""))) /
            Number(
              QSeditable.pricebeforeint.replace("$", "").replace(",", "")
            )) *
          100
        ).toFixed(2) + "%",
      netback:
        "$" +
        (
          Number(QSeditable.pricebeforeint.replace("$", "").replace(",", "")) -
          Number(QSeditable.totalcost.replace("$", "").replace(",", "")) +
          Number(QSeditable.materialcost.replace("$", "").replace(",", ""))
        )
          .toFixed(2)
          .replace(/\B(?=(\d{3})+(?!\d))/g, ","),
    });
    setQSedits({
      ...QSedits,
      interestcost:
        (Number(QSeditable.includedrate.toString().replace("%", "")) *
          Number(QSeditable.includedperiod) *
          Number(
            QSeditable.pricebeforeint
              .toString()
              .replace("$", "")
              .replace(",", "")
          )) /
        360 /
        100,
      salesinterest:
        (Number(QSeditable.interestrate.replace("%", "")) *
          Number(QSeditable.interestdays) *
          Number(QSeditable.pricebeforeint.replace("$", "").replace(",", ""))) /
        360 /
        100,
      priceafterint:
        Number(QSeditable.pricebeforeint.replace("$", "").replace(",", "")) +
        Number(QSeditable.salesinterest.replace("$", "")),
      profit:
        Number(QSeditable.pricebeforeint.replace("$", "").replace(",", "")) -
        Number(QSeditable.totalcost.replace("$", "").replace(",", "")),
      margin:
        (Number(QSeditable.pricebeforeint.replace("$", "").replace(",", "")) -
          Number(QSeditable.totalcost.replace("$", "").replace(",", ""))) *
        Number(QSeditable.quantity),
      turnover:
        Number(QSeditable.quantity) *
        Number(QSeditable.pricebeforeint.replace("$", "").replace(",", "")),
      pctmargin:
        (Number(QSeditable.pricebeforeint.replace("$", "").replace(",", "")) -
          Number(QSeditable.totalcost.replace("$", "").replace(",", ""))) /
        Number(QSeditable.pricebeforeint.replace("$", "").replace(",", "")),
      netback:
        Number(QSeditable.pricebeforeint.replace("$", "").replace(",", "")) -
        Number(QSeditable.totalcost.replace("$", "").replace(",", "")) +
        Number(QSeditable.materialcost.replace("$", "").replace(",", "")),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [QSeditable.quantity, QSeditable.pricebefore, QSeditable.totalcost]);
  useEffect(() => {
    setQSeditable({
      ...QSeditable,
      totalcost:
        "$" +
        (
          Number(QSeditable.materialcost.replace("$", "").replace(",", "")) +
          Number(QSeditable.pcommission.replace("$", "").replace(",", "")) +
          Number(QSeditable.pfinancecost.replace("$", "").replace(",", "")) +
          Number(QSeditable.sfinancecost.replace("$", "").replace(",", "")) +
          Number(QSeditable.freightpmt.replace("$", "").replace(",", "")) +
          Number(QSeditable.insurancecost.replace("$", "").replace(",", "")) +
          Number(QSeditable.inspectioncost.replace("$", "").replace(",", "")) +
          Number(QSeditable.scommission.replace("$", "").replace(",", "")) +
          Number(QSeditable.interestcost.replace("$", "").replace(",", "")) +
          Number(QSeditable.legal.replace("$", "").replace(",", "")) +
          Number(QSeditable.pallets.replace("$", "").replace(",", "")) +
          Number(QSeditable.other.replace("$", "").replace(",", ""))
        ).toFixed(2),
    });
    setQSedits({
      ...QSedits,
      totalcost:
        Number(QSeditable.materialcost.replace("$", "").replace(",", "")) +
        Number(QSeditable.pcommission.replace("$", "").replace(",", "")) +
        Number(QSeditable.pfinancecost.replace("$", "").replace(",", "")) +
        Number(QSeditable.sfinancecost.replace("$", "").replace(",", "")) +
        Number(QSeditable.freightpmt.replace("$", "").replace(",", "")) +
        Number(QSeditable.insurancecost.replace("$", "").replace(",", "")) +
        Number(QSeditable.inspectioncost.replace("$", "").replace(",", "")) +
        Number(QSeditable.scommission.replace("$", "").replace(",", "")) +
        Number(QSeditable.interestcost.replace("$", "").replace(",", "")) +
        Number(QSeditable.legal.replace("$", "").replace(",", "")) +
        Number(QSeditable.pallets.replace("$", "").replace(",", "")) +
        Number(QSeditable.other.replace("$", "").replace(",", "")),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    QSeditable.materialcost,
    QSeditable.pcommission,
    QSeditable.pfinancecost,
    QSeditable.sfinancecost,
    QSeditable.freightpmt,
    QSeditable.insurancecost,
    QSeditable.inspectioncost,
    QSeditable.scommission,
    QSeditable.interestcost,
    QSeditable.legal,
    QSeditable.pallets,
    QSeditable.other,
  ]);
  const updateQS = async (e) => {
    e.preventDefault();
    await Axios.post("/updateQS", { QSedits, QSID })
      .then((response) => {
        toggleQSrefresh();
        setQSeditable(QSeditableInit);
      })
      .catch(setQSedits({}));
    await handleClose();
  };
  return show ? (
    <div className={showHideClassName}>
      <section className="modal-main">
        <div className="QSeditmodaltitle">
          <h2>Edit Quotation Sheet</h2>
          <div>
            <button>Prev</button>
            <input
              className="QSeditmodalsearch"
              onKeyDown={(e) => {
                if (show && e.key === "ArrowRight") {
                  e.preventDefault();
                  // QSID = QSID + 1;
                  setQSID(QSIDList[QSindex + 1]);
                  setQSIDtoedit(QSIDList[QSindex + 1]);
                  setQSindex(QSindex + 1);
                  // console.log(QSID);
                }
                if (show && e.key === "ArrowLeft") {
                  e.preventDefault();
                  // QSID = QSID + 1;
                  setQSID(QSIDList[QSindex - 1]);
                  setQSIDtoedit(QSIDList[QSindex - 1]);
                  setQSindex(QSindex - 1);
                  // console.log(QSID);
                }
                if (show && e.key === "Enter") {
                  if (QSIDList.includes(Number(e.target.value))) {
                    setQSID(Number(e.target.value));
                  }
                }
              }}
              value={QSIDtoedit ? QSIDtoedit || "" : ""}
              onChange={(e) => {
                e.preventDefault();
                setQSIDtoedit(e.target.value);
                setQSindex(QSIDList.indexOf(Number(e.target.value)));
              }}
            />
            <button>Next</button>
          </div>
        </div>
        <form
          className="QSModalForm"
          action=""
          onSubmit={(e) => {
            updateQS(e);
          }}
        >
          <section id="edtQS-1">
            <div className="form-group">
              <label htmlFor="">QS Date:</label>
              <input
                name="QSDate"
                type="date"
                readOnly
                value={QSeditable ? QSeditable.QSDate || "" : ""}
                className="canceldrag"
              />
            </div>
            <div className="form-group">
              <label>WGP:</label>
              <input
                name="KTP"
                placeholder="5000..."
                value={QSeditable ? QSeditable.KTP || "" : ""}
                onChange={handleCNumInputChange}
                className="canceldrag"
              ></input>
            </div>
            <fieldset>
              <legend>Sale Type</legend>
              <div>
                <input
                  type="radio"
                  name="saleTypeID"
                  required
                  checked={
                    QSeditable && QSeditable.saleTypeID === 1
                      ? true || ""
                      : false
                  }
                  onClick={(e) => {
                    setQSeditable({ ...QSeditable, saleTypeID: 1 });
                    setQSedits({ ...QSedits, saleTypeID: 1 });
                  }}
                />
                <label htmlFor="">Back-to-back</label>
              </div>
              <div>
                <input
                  type="radio"
                  name="saleTypeID"
                  required
                  checked={
                    QSeditable && QSeditable.saleTypeID === 2
                      ? true || ""
                      : false
                  }
                  onClick={(e) => {
                    setQSeditable({ ...QSeditable, saleTypeID: 2 });
                    setQSedits({ ...QSedits, saleTypeID: 2 });
                  }}
                />
                <label htmlFor="">Position</label>
                {QSeditable && QSeditable.saleTypeID === 2 ? (
                  <select
                    className="WGPSelect2"
                    onClick={loadPositions}
                    onChange={(e) => setPosition(e.target.value)}
                  >
                    <option>Select...</option>
                    {QSeditable && positions
                      ? positions.map((pos, i) => {
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
                  name="QSID"
                  type="text"
                  required
                  value={QSeditable ? QSeditable.QSID || "" : ""}
                  readOnly
                />
              </div>
              <div className="form-group">
                <label htmlFor="">Product:</label>
                <SearchField
                  className="searchfield"
                  searchURL={"/productlist"}
                  searchName={"abbreviation"}
                  searchID={"productID"}
                  otherName={"supplier"}
                  otherID={"supplierID"}
                  thirdName={"productGroup"}
                  thirdID={"prodGroupID"}
                  value={QSeditable ? QSeditable.product || "" : ""}
                  resetfield={resetfield}
                  setResetfield={setResetfield}
                  setProdSupplier={handleProductChange}
                />
                {/* <input
                  name="product"
                  type="text"
                  required
                  value={QSeditable ? QSeditable.product || "" : ""}
                /> */}
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
                <SearchField
                  className="searchfield"
                  searchURL={"/customers"}
                  searchID={"customerID"}
                  searchName={"customer"}
                  value={QSeditable ? QSeditable.customer || "" : ""}
                  resetfield={resetfield}
                  setResetfield={setResetfield}
                  setProdSupplier={handleCustomerChange}
                />
                {/* <input
                  name="customer"
                  type="text"
                  required
                  value={QSeditable ? QSeditable.customer || "" : ""}
                /> */}
              </div>
              <div className="form-group">
                <label htmlFor="">Contact:</label>
                <input name="contact" type="text" />
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
                <SearchField
                  className="searchfield"
                  searchURL={"/POLS"}
                  searchID={"POLID"}
                  searchName={"POL"}
                  value={QSeditable ? QSeditable.POL || "" : ""}
                  resetfield={resetfield}
                  setResetfield={setResetfield}
                  setProdSupplier={handlePOLChange}
                />
                {/* <input
                  name="POL"
                  type="text"
                  required
                  value={QSeditable ? QSeditable.POL || "" : ""}
                /> */}
              </div>
              <div className="form-group">
                <label htmlFor="">POD:</label>
                <SearchField
                  className="searchfield"
                  searchURL={"/PODS"}
                  searchID={"PODID"}
                  searchName={"POD"}
                  value={QSeditable ? QSeditable.POD || "" : ""}
                  resetfield={resetfield}
                  setResetfield={setResetfield}
                  setProdSupplier={handlePODChange}
                />
                {/* <input
                  name="POD"
                  type="text"
                  required
                  value={QSeditable ? QSeditable.POD || "" : ""}
                /> */}
              </div>
            </fieldset>
          </section>
          <section id="editQS-2">
            <div className="soldcheckbox" style={{ marginBottom: "1rem" }}>
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
                value={QSeditable ? QSeditable.KTS || "" : ""}
                onChange={handleCNumInputChange}
                className="canceldrag"
              ></input>
            </div>
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
                <SearchField
                  className="searchfield"
                  searchURL={"/trafficmgrs"}
                  searchID={"trafficID"}
                  searchName={"traffic"}
                  value={QSeditable ? QSeditable.traffic || "" : ""}
                  resetfield={resetfield}
                  setResetfield={setResetfield}
                  setProdSupplier={handleTrafficChange}
                />
                {/* <input
                  name="traffic"
                  type="text"
                  required
                  value={QSeditable ? QSeditable.traffic || "" : ""}
                /> */}
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
                <SearchField
                  className="searchfield"
                  searchURL={"/paymentterms"}
                  searchID={"paytermID"}
                  searchName={"paymentTerm"}
                  value={QSeditable ? QSeditable.paymentterms || "" : ""}
                  resetfield={resetfield}
                  setResetfield={setResetfield}
                  setProdSupplier={handlePaytermChange}
                />
                {/* <input
                  name="paymentterms"
                  type="text"
                  required
                  value={QSeditable ? QSeditable.paymentterms || "" : ""}
                /> */}
              </div>
              <div className="form-group">
                <label htmlFor="">Inc. Interest:</label>
                <input
                  name="includedrate"
                  type="text"
                  required
                  value={QSeditable ? QSeditable.includedrate || "" : ""}
                  onChange={handlePctInputChange}
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
              <input type="radio" name="shipmenttype" />
              <label htmlFor="">Container</label>
              <input type="radio" name="shipmenttype" />
              <label htmlFor="">Breakbulk</label>
              <input type="radio" name="shipmenttype" />
              <label htmlFor="">Distribution</label>
            </div>
            <fieldset>
              <legend>Freight</legend>
              <div className="form-group">
                <label htmlFor="">Freight ID:</label>
                <input name="freightID" type="text" />
              </div>
              <div className="form-group">
                <label htmlFor="">Freight Total:</label>
                <input
                  name="freightTotal"
                  className="QSfig"
                  type="text"
                  value={QSeditable ? QSeditable.freightTotal || "" : ""}
                  onChange={handleQInputChange}
                  onBlur={formatCurrency}
                />
              </div>
              <div className="form-group">
                <label htmlFor="">Shipping Line:</label>
                <input name="shippingline" type="text" />
              </div>
              <div className="form-group">
                <label htmlFor="">Payload:</label>
                <input
                  name="payload"
                  className="QSfig"
                  type="text"
                  value={QSeditable ? QSeditable.payload || "" : ""}
                  onChange={handleQInputChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="">Inspection Cost:</label>
                <input name="intpectiontotal" type="text" />
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
                    onChange={handleQInputChange}
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
                    <label htmlFor="">P Finance Cost:</label>
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
                    readOnly
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
                      onChange={handlePctInputChange}
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
                // onClick={handleClose}
              >
                Save Edits
              </button>
              {/* <button className="cancelbutton" onClick={createemail}>
                Save Edits and Offer
              </button> */}
              <button className="cancelbutton" onClick={closeandclear}>
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
