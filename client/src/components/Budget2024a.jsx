import React, { useEffect, useState, useRef, useCallback } from "react";
import Axios from "axios";
import ExportToCSV from "./ExportCSV";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { faMinusCircle } from "@fortawesome/free-solid-svg-icons";
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from "react-accessible-accordion";
import { gsap } from "gsap";
import * as XLSX from "xlsx";
import useContextMenu from "../contexts/useContextMenu";
import "./Budget2024a.css";
import moment from "moment";

const Budget2024a = () => {
  const { clicked, setClicked, points, setPoints } = useContextMenu();

  const [newcomment, setNewcomment] = useState("");

  const usercode = JSON.parse(localStorage.getItem("WGusercode"));

  const commentRef = useRef(null);

  const delayedclicked = () => {
    return new Promise((resolve, reject) => {
      setClicked(true);
      resolve(true);
    });
  };

  const saveNewBudgetComment = (ind, pcatnameid) => {
    if (newcomment !== "") {
      // console.log("hahaha");
      Axios.post("/savenewbudgetcomment", {
        id: ind,
        commentdate: moment().format("YYYY-MM-DD HH:mm"),
        newcomment: newcomment,
        user: usercode,
        prodCatNameID: pcatnameid,
        bdgtyear: bdgtyear,
      }).then((response) => {
        // console.log(response);
        setNewcomment("");
        setClicked(false);
        setReloadcomments(!reloadcomments);
      });
    }
  };

  const refresmsg = useRef(null);
  const [showmsg, setShowmsg] = useState(false);

  const onComplete = () => {
    setBdgtresponsemsg("");
  };

  const [bdgtyear, setBdgtyear] = useState(2024);

  useEffect(() => {
    const elem = refresmsg.current;
    gsap.fromTo(
      elem,
      { opacity: 1 },
      {
        opacity: 0,
        duration: 2,
        ease: "power1.inOut",
        onComplete: onComplete,
      }
    );
  }, [showmsg]);

  const refloadmsg = useRef(null);

  useEffect(() => {
    const elem = refloadmsg.current;
    gsap.fromTo(
      elem,
      { opacity: 1 },
      {
        opacity: 0,
        duration: 15,
        ease: "power1.inOut",
        // onComplete: onComplete,
      }
    );
  }, [loadmsgrefresh]);

  const [prodList, setProdList] = useState();
  const searchProdRef = useRef(null);

  useEffect(() => {
    Axios.post("/budgetprodNames").then((response) => {
      setProdList(response.data);
      setFilteredProdnames(response.data);
    });
  }, []);

  const [showprodnamefilter, setShowprodnamefilter] = useState(false);

  const setaddingProd = () => {
    return new Promise((resolve, reject) => {
      setShowprodnamefilter(!showprodnamefilter);
      resolve();
    });
  };

  const showaddProd = async () => {
    await setaddingProd();
    if (showprodnamefilter === false) {
      searchProdRef.current.focus();
    }
    setSearchterm("");
  };

  const prodstoadd = [];
  const prodscattoadd = [];

  const [searchterm, setSearchterm] = useState();
  const [filteredProdnames, setFilteredProdnames] = useState();

  useEffect(() => {
    if (prodList) {
      if (searchterm && searchterm !== "") {
        const results = prodList.filter((item) => {
          if (searchterm && searchterm !== "") {
            return item.abbreviation
              .toLowerCase()
              .includes(searchterm.toLowerCase());
          }
        });
        setFilteredProdnames(results);
      } else {
        setFilteredProdnames(prodList);
      }
    }
  }, [searchterm]);

  const [updatebuttons, setUpdatebuttons] = useState(false);

  const [prodgroupsbtn, setProdgroupsbtn] = useState();

  const [budgetbtns, setBudgetbtns] = useState();

  const addprod = () => {
    Axios.post("/addprodbudget", {
      prodstoadd,
      prodscattoadd,
      year: bdgtyear,
    }).then((response) => {
      // console.log(response);
      // console.log(response);
      setUpdatebuttons(!updatebuttons);
    });
    setShowprodnamefilter(false);
  };

  const [numRows, setNumRows] = useState();
  const [numCols, setNumCols] = useState(4);
  const [numColsEcon, setNumColsEcon] = useState(2);

  // const [numRows, numCols] = [19, 4]; // No magic numbers
  const [activeIndex, setActiveIndex] = useState(-1); // Track which cell to highlight
  const [activeEconIndex, setActiveEconIndex] = useState(-1);
  const [isNavigating, setIsNavigating] = useState(false); // Track navigation
  const [isEditing, setIsEditing] = useState(false); // Track editing
  const [values, setValues] = useState([]); // Track input values
  const boardRef = useRef(); // For setting/ unsetting navigation
  const inputRefs = useRef([]); // For setting / unsetting input focus
  const inputEconRefs = useRef([]);

  const handleChange1 = (e, prod, reg, cty, qtr) => {
    const isdecimalnumber = RegExp("^[0-9.%]+$");
    if (isdecimalnumber.test(e.target.value)) {
      setFormatedData({
        ...formatedData,
        [prod]: {
          ...formatedData[prod],
          [reg]: {
            ...formatedData[prod][reg],
            [cty]: {
              ...formatedData[prod][reg][cty],
              [qtr]: Number(e.target.value),
            },
          },
        },
      });
    }
  };

  const handleEconChange = (e, prod, reg, cty, item) => {
    setBdgtecondata({
      ...bdgtecondata,
      [prod]: {
        ...bdgtecondata[prod],
        [reg]: {
          ...bdgtecondata[prod][reg],
          [cty]: {
            ...bdgtecondata[prod][reg][cty],
            [item]: Number(e.target.value),
          },
        },
      },
    });
  };

  const [reloadyearbdgdata, setReloadyearbdgdata] = useState(false);

  const [budgetyeartotals, setBudgetyeartotals] = useState({});

  const [bdgtregiondta, setBdgtregiondata] = useState();

  // useEffect(() => {

  // }, []);

  useEffect(() => {
    Axios.post("/yearbudgetdata", { year: bdgtyear }).then((response) => {
      // console.log(response.data);
      setYearbudgetdata(response.data);
      setBudgetyeartotals(getbudgetyeartotals(response.data));
    });
    Axios.post("/budgetgroupbtns", { year: bdgtyear }).then((response) => {
      setProdgroupsbtn(response.data);
    });
    Axios.post("/budgetfilterbtns", { year: bdgtyear }).then((resp) => {
      setBudgetbtns(resp.data);
      // console.log(resp.data);
    });
    Axios.post("/bdgtregiondata", { year: bdgtyear }).then((response) => {
      setBdgtregiondata(response.data);
      // Object.entries(response.data.groupBy("region")).map((item) =>
      //   console.log(item)
      // );
    });
  }, [reloadyearbdgdata]);

  useEffect(() => {
    Axios.post("/budgetfilterbtns", { year: bdgtyear }).then((resp) => {
      setBudgetbtns(resp.data);
      // console.log(resp.data);
    });
  }, [updatebuttons]);
  // useEffect(() => {

  // }, [reloadyearbdgdata]);

  const [bdgtresponsemsg, setBdgtresponsemsg] = useState();

  const saveNewValue = (e, i, prod, reg, cty, q) => {
    let qty = Number(e.target.value);

    if (qty !== Number(OFormatedData[prod][reg][cty][q])) {
      if (qty !== Number(IFormatedData[prod][reg][cty][q])) {
        Axios.post("/savebdgtqty", {
          newqty: qty,
          entryID: budgetdata[i]["budgetentryID"],
        }).then((response) => {
          setBdgtresponsemsg(response.data.msg);
          setIFormatedData(formatedData);
          setReloadyearbdgdata(!reloadyearbdgdata);
        });
      }
    }
    if (
      qty === Number(OFormatedData[prod][reg][cty][q]) &&
      Number(IFormatedData[prod][reg][cty][q]) !==
        Number(OFormatedData[prod][reg][cty][q])
    ) {
      Axios.post("/savebdgtqty", {
        newqty: qty,
        entryID: budgetdata[i]["budgetentryID"],
      }).then((response) => {
        setBdgtresponsemsg(response.data.msg);
        setIFormatedData(formatedData);
        setReloadyearbdgdata(!reloadyearbdgdata);
      });
    }
  };

  const saveNewEconValue = (e, i, prod, reg, cty, item) => {
    let val = Number(e.target.value);
    if (val !== Number(Obdgtecondata[prod][reg][cty][item])) {
      if (val !== Number(Ibdgtecondata[prod][reg][cty][item])) {
        Axios.post("/savebdgteconfig", {
          year: bdgtyear,
          item: item,
          value: val,
          prod: prodkeys[prod],
          cty: countrykeys[cty],
        }).then((response) => {
          setBdgtresponsemsg(response.data.msg);
          setIBdgtecondata(bdgtecondata);
          setReloadyearbdgdata(!reloadyearbdgdata);
        });
      }
    }
    if (
      val === Number(Obdgtecondata[prod][reg][cty][item]) &&
      Number(Ibdgtecondata[prod][reg][cty][item]) !==
        Number(Obdgtecondata[prod][reg][cty][item])
    ) {
      Axios.post("/savebdgteconfig", {
        year: bdgtyear,
        item: item,
        value: val,
        prod: prodkeys[prod],
        cty: countrykeys[cty],
      }).then((response) => {
        setBdgtresponsemsg(response.data.msg);
        setIBdgtecondata(bdgtecondata);
        setReloadyearbdgdata(!reloadyearbdgdata);
      });
    }
  };

  // Handle mouse down inside or outside the board
  const handleMouseDown = useCallback(
    (e) => {
      if (boardRef.current && boardRef.current.contains(e.target)) {
        if (e.target.className === "cell-input") {
          setIsNavigating(true);
          setIsEditing(true);
        }
      } else {
        setIsNavigating(false);
      }
    },
    [boardRef, setIsNavigating]
  );

  const [editingQty, setEditingQty] = useState(false);
  const [editingEcon, setEditingEcon] = useState(false);

  const handleKeyDown = useCallback((e) => {
    if (editingQty) {
      const { key } = e;
      switch (key) {
        case "ArrowUp":
          if (activeIndex >= numCols) {
            setActiveIndex(activeIndex - numCols);
          }
          break;
        case "ArrowDown":
          if (activeIndex < numCols * numRows - numCols) {
            setActiveIndex(activeIndex + numCols);
          }
          break;
        case "ArrowRight":
          if (activeIndex < numRows * numCols - 1) {
            setActiveIndex(activeIndex + 1);
          }
          break;
        case "ArrowLeft":
          if (activeIndex > 0) {
            setActiveIndex(activeIndex - 1);
          }
          break;
      }
    }
    if (editingEcon) {
      const { key } = e;
      switch (key) {
        case "ArrowUp":
          if (activeEconIndex >= numColsEcon) {
            setActiveEconIndex(activeEconIndex - numColsEcon);
          }
          break;
        case "ArrowDown":
          if (activeEconIndex < numColsEcon * numRows - numColsEcon) {
            setActiveEconIndex(activeEconIndex + numColsEcon);
          }
          break;
        case "ArrowRight":
          if (activeEconIndex < numRows * numColsEcon - 1) {
            setActiveEconIndex(activeEconIndex + 1);
          }
          break;
        case "ArrowLeft":
          if (activeEconIndex > 0) {
            setActiveEconIndex(activeEconIndex - 1);
          }
          break;
      }
    }
  });

  // Add listeners on mount, remove on unmount
  useEffect(() => {
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleMouseDown, handleKeyDown]);

  // When the index changes, determine if we should focus or blur the current input
  const onIndexChange = useCallback(() => {
    if (activeIndex >= 0 && activeIndex < numRows * numCols) {
      const inputRef = inputRefs.current[activeIndex];
      if (inputRef) {
        if (isEditing) {
          inputRef.focus();
        } else {
          inputRef.blur();
        }
      }
    }
  }, [activeIndex, isEditing, inputRefs, numRows, numCols]);

  useEffect(onIndexChange, [activeIndex, onIndexChange]);

  const onEconIndexChange = useCallback(() => {
    if (activeEconIndex >= 0 && activeEconIndex < numRows * numColsEcon) {
      const inputEconRef = inputEconRefs.current[activeEconIndex];
      if (inputEconRef) {
        if (isEditing) {
          inputEconRef.focus();
        } else {
          inputEconRef.blur();
        }
      }
    }
  }, [activeEconIndex, isEditing, inputEconRefs, numRows, numColsEcon]);

  useEffect(onEconIndexChange, [activeEconIndex, onEconIndexChange]);

  const [clickedProdGroup, setClickedProdGroup] = useState();

  const [selectedPG, setSelectedPG] = useState();

  const handleProdGroupClick = (e, i, item) => {
    e.preventDefault();
    setClickedProdGroup(i);
    setSelectedPG(item);
  };

  const [clickedlevel1, setClickedlevel1] = useState(1);
  const [clickedlevel2, setClickedlevel2] = useState(5);
  const [clickedlevel3, setClickedlevel3] = useState(1);

  // const handleClicklevel1 = (e, i) => {
  //   setClickedlevel1(i);
  // };

  // const handleClicklevel2 = (e, i) => {
  //   setClickedlevel2(i);
  // };

  const [clickedProdCat, setClickedProdCat] = useState();
  const [selectedPN, setSelectedPN] = useState();

  Array.prototype.groupBy = function(key) {
    return this.reduce(function(groups, item) {
      const val = item[key];
      groups[val] = groups[val] || [];
      groups[val].push(item);
      return groups;
    }, {});
  };

  function extractColumn(arr, column) {
    return arr.map((x) => x[column]);
  }

  const getcountrytotals = (arr, column) => {
    let totals = [];
    let c = arr.length / 4;
    let temptotal = 0;
    let countryindex = 0;
    let arrind = 0;
    for (let i = 0; i < c; i++) {
      for (let j = 0; j < 4; j++) {
        temptotal = temptotal + arr[arrind][column];
        arrind++;
      }
      totals.push(temptotal);
      temptotal = 0;
      countryindex++;
    }
    return totals;
  };

  const [budgetdata, setBudgetdata] = useState();
  const [editablevalues, setEditablevalues] = useState();
  const [intervalues, setIntervalues] = useState();
  const [originalvalues, setOriginalvalues] = useState();

  const [showdelctybtns, setShowdelctybtns] = useState({});

  const [showprodctyadd, setShowprodctyadd] = useState({});

  const formatData = (arr) => {
    let countryvalues = {};
    let countryrow = {};
    let regionvalues = {};
    let allvalues = {};
    let showaddctycty = {};
    let showaddctyreg = {};
    let showctydelcty = {};
    let showctydelreg = {};
    let showctydelprod = {};
    let showmainctyadd = {};

    let arr1 = Object.entries(arr.groupBy("abbreviation"));
    arr1.forEach((arr1el) => {
      let arr1ind = arr1el[0];
      let arr2 = Object.entries(arr1el[1].groupBy("region"));
      showmainctyadd[arr1ind] = false;
      arr2.forEach((arr2el) => {
        let arr2ind = arr2el[0];
        showaddctycty[arr2ind] = false;
        let arr3 = Object.entries(arr2el[1].groupBy("country"));
        arr3.forEach((arr3el) => {
          let arr3ind = arr3el[0];
          showctydelcty[arr3ind] = false;
          arr3el[1].forEach((el, n) => {
            countryvalues[n] = el["quantity"];
          });
          countryrow[arr3ind] = countryvalues;
          countryvalues = {};
        });
        showaddctyreg[arr1ind] = showaddctycty;
        showctydelreg[arr2ind] = showctydelcty;
        showctydelcty = {};
        setShowaddcty(showaddctyreg);
        regionvalues[arr2ind] = countryrow;
        countryrow = {};
      });
      showctydelprod[arr1ind] = showctydelreg;
      // setShowdelctybtns({ ...showdelctybtns, [arr1ind]: showctydelreg });
      // setShowdelctybtns("no work");
      showctydelreg = {};
      showaddctycty = {};
      allvalues[arr1ind] = regionvalues;
      regionvalues = {};
    });
    setShowdelctybtns(showctydelprod);
    setShowprodctyadd(showmainctyadd);
    // console.log(showctydelprod);
    return allvalues;
  };

  const [formatedData, setFormatedData] = useState();
  const [OFormatedData, setOFormatedData] = useState();
  const [IFormatedData, setIFormatedData] = useState();

  const [countrykeys, setCountrykeys] = useState();
  const [prodkeys, setProdkeys] = useState();

  const getkeys = (arr) => {
    let countrynames = [...new Set(arr.map((x) => x.country))];
    let countryIDs = [...new Set(arr.map((x) => x.countryID))];
    var result1 = {};
    countrynames.forEach((key, i) => (result1[key] = countryIDs[i]));
    setCountrykeys(result1);
    let prodnames = [...new Set(arr.map((x) => x.abbreviation))];
    let prodIDs = [...new Set(arr.map((x) => x.prodNameID))];
    var result2 = {};
    prodnames.forEach((key, i) => (result2[key] = prodIDs[i]));
    setProdkeys(result2);
  };

  const [prodforctytoadd, setProdfroctytoadd] = useState();

  const [prodcountriestoadd, setProdcountriestoadd] = useState({});

  // let [countriestoadd, setCountriestoadd] = useState([]);

  const addbdgtcountry = (pr) => {
    Axios.post("/addbdgtcty", {
      countries: Object.keys(prodcountriestoadd[pr]),
      pname: prodkeys[pr],
      pcatname: activePCatName,
      year: bdgtyear,
    }).then(() => {
      setReloadbdgtdata(!reloadbdgdata);
      // if (response.data.success === true) {
    });

    // });
  };

  const [activePCatName, setActivePCatName] = useState();
  const [reloadbdgdata, setReloadbdgtdata] = useState(false);

  const [bdgtlyearsales, setBdgtlyearsales] = useState({});

  const formatsaleslastyeardata = (arr) => {
    // console.log(arr);
    if (Array.isArray(arr)) {
      let ctylevel = {};
      let reglevel = {};
      let prodlevel = {};
      let prodgrouped = Object.entries(arr.groupBy("abbreviation"));
      prodgrouped.forEach((prodel) => {
        let prodind = prodel[0];
        let regrouped = Object.entries(prodel[1].groupBy("region"));
        regrouped.forEach((regel) => {
          let regind = regel[0];
          regel[1].forEach((ctyel) => {
            // console.log(prodind, regind, ctyel["country"], ctyel["quantity"]);
            ctylevel[ctyel["country"]] = {
              quantity: Number(ctyel["quantity"].toFixed(0)),
              avgprice: ctyel["avgprice"]
                ? Number(ctyel["avgprice"].replace(/,/g, ""))
                : 0,
              avgprofit: ctyel["avgprofit"]
                ? Number(ctyel["avgprofit"].replace(/,/g, ""))
                : 0,
            };
          });
          reglevel[regind] = ctylevel;
          ctylevel = {};
        });
        prodlevel[prodind] = reglevel;
        reglevel = {};
      });
      return prodlevel;
    }
  };

  const [bdgtecondata, setBdgtecondata] = useState({});
  const [Obdgtecondata, setOBdgtecondata] = useState({});
  const [Ibdgtecondata, setIBdgtecondata] = useState({});

  const formatecondata = (arr) => {
    let ctylevel = {};
    let reglevel = {};
    let prodlevel = {};
    let quantity = 0;
    let price = 0;
    let profit = 0;
    let prodgrouped = Object.entries(arr.groupBy("abbreviation"));
    prodgrouped.forEach((prodel) => {
      let prodind = prodel[0];
      let regrouped = Object.entries(prodel[1].groupBy("region"));
      regrouped.forEach((regel) => {
        let regind = regel[0];

        let ctygrouped = Object.entries(regel[1].groupBy("country"));
        ctygrouped.forEach((ctyel) => {
          // console.log(ctyel);
          let ctyind = ctyel[0];
          ctyel[1].forEach((qel) => {
            quantity = quantity + qel["quantity"];
            price = price + qel["quantity"] * qel["price"];
            profit = profit + qel["quantity"] * qel["profit"];
          });
          ctylevel[ctyind] = {
            price: quantity === 0 || price === 0 ? 0 : price / quantity,
            profit: quantity === 0 || profit === 0 ? 0 : profit / quantity,
            quantity: quantity,
          };

          quantity = 0;
          price = 0;
          profit = 0;
          //   console.log(ctyind);
        });
        reglevel[regind] = ctylevel;
        ctylevel = {};
      });
      prodlevel[prodind] = reglevel;
      reglevel = {};
    });
    return prodlevel;
  };

  const [lybformateddata, setLybformateddata] = useState();

  const [bdgtcomments, setBdgtcomments] = useState();
  const [bdgtcommentset, setBdgtcommentset] = useState();

  useEffect(() => {
    if (activePCatName && activePCatName !== "") {
      Axios.post("/getbudgetdata", {
        prodcat: activePCatName,
        year: bdgtyear,
      }).then((response) => {
        setBudgetdata(response.data);
        setNumRows(response.data.length / 4);
        setFormatedData(formatData(response.data));
        setOFormatedData(formatData(response.data));
        setIFormatedData(formatData(response.data));
        getkeys(response.data);
        setBdgtecondata(formatecondata(response.data));
        setOBdgtecondata(formatecondata(response.data));
        setIBdgtecondata(formatecondata(response.data));
      });
      Axios.post("/budgetlyearsales", {
        year: bdgtyear,
        prodcat: activePCatName,
      }).then((response) => {
        setBdgtlyearsales(formatsaleslastyeardata(response.data));
      });
      Axios.post("/bdgtlyearbdgt", {
        prodcat: activePCatName,
        year: bdgtyear,
      }).then((response) => {
        // console.log(formatsaleslastyeardata(response.data));
        setLybformateddata(formatsaleslastyeardata(response.data));
      });

      // console.log(activePCatName);
    }
  }, [activePCatName, reloadbdgdata]);

  const [reloadcomments, setReloadcomments] = useState(false);

  useEffect(() => {
    Axios.post("/getbdgtcomments", {
      prodcat: activePCatName,
      year: bdgtyear,
    }).then((response) => {
      // console.log(response.data);
      setBdgtcomments(response.data);
      if (Array.isArray(response.data)) {
        let commentset = [
          ...new Set(response.data.map((x) => x.budgetEntryID)),
        ];
        setBdgtcommentset(commentset);
        // console.log(bdgtcommentset);
      } else {
        let commentset = [];
        setBdgtcommentset(commentset);
        // console.log(bdgtcommentset);
      }
    });
  }, [activePCatName, reloadbdgdata, reloadcomments]);

  const handleProdCatClick = (e, i, item) => {
    e.preventDefault();
    setClickedProdCat(i);
    // setSelectedPN(item.prodCatName);
    setActivePCatName(item.prodCatNameID);
  };

  let ind = 0;
  let indecon = 0;
  var totalcountry = 0;
  let countryind = 0;

  const [showaddcty, setShowaddcty] = useState();

  const [loadregcties, setLoadregcties] = useState();

  const loadregcountries = (reg) => {
    Axios.post("/bdgtloadregcty", { reg }).then((response) => {
      setLoadregcties({ ...loadregcties, [reg]: [response.data] });
    });
  };

  const deletectyrow = (pr, ct) => {
    // console.log(prodkeys[pr], countrykeys[ct]);
    Axios.post("/bdgtdelctyrow", {
      pname: prodkeys[pr],
      countryid: countrykeys[ct],
      year: bdgtyear,
    }).then((response) => {
      setReloadbdgtdata(!reloadbdgdata);
    });
  };

  const [fullcountrylist, setFullcountrylist] = useState();

  useEffect(() => {
    Axios.post("/bdgtfullcountrylist").then((response) => {
      setFullcountrylist(response.data);
    });
  }, []);

  const [yearbudgetdata, setYearbudgetdata] = useState();

  const getbudgetyeartotals = (arr) => {
    let yearqty = 0;
    let yearrevenue = 0;
    let yearprofit = 0;
    let output = {};
    let yeargrouped = Object.entries(arr.groupBy("year"));
    yeargrouped.forEach((yearel) => {
      let yearind = yearel[0];
      yearel[1].forEach((el) => {
        yearqty = yearqty + el["quantity"];
        yearrevenue = yearrevenue + el["revenue"];
        yearprofit = yearprofit + el["totalprofit"];
      });
      output[yearind] = {
        quantity: yearqty,
        revenue: yearrevenue,
        totalprofit: yearprofit,
      };
      yearqty = 0;
      yearrevenue = 0;
      yearprofit = 0;
    });
    // console.log(output);
    return output;
  };

  const [summarygroupby1, setSummarygroupby1] = useState("region");
  const [summarygroupby2, setSummarygroupby2] = useState("country");
  const [summarygroupby3, setSummarygroupby3] = useState("quantity");

  const [lysalestotals, setLysalestotals] = useState();

  useEffect(() => {
    Axios.post("/bdgtlyearsalestotals", { year: bdgtyear }).then((response) => {
      setLysalestotals(response.data);
    });
  }, []);

  let q1total = 0;
  let q2total = 0;
  let q3total = 0;
  let q4total = 0;
  let p1total = 0;
  let p2total = 0;
  let p3total = 0;
  let p4total = 0;
  let r1total = 0;
  let r2total = 0;
  let r3total = 0;
  let r4total = 0;

  const sumvalues = (data, sstr) => {
    let total = 0;
    for (var x of data) {
      total += x[sstr];
    }
    return total;
  };
  const calcavg = (data, numer, denom) => {
    let numertotal = 0;
    let denomtotal = 0;
    for (var x of data) {
      numertotal += x[numer];
      denomtotal += x[denom];
    }
    if (numertotal !== 0 && denomtotal !== 0) {
      // console.log(numertotal / denomtotal);
      return numertotal / denomtotal;
    } else {
      return 0;
    }
  };

  const [datatoload, setDatatoload] = useState();
  const [filename, setFilename] = useState();
  const [loadmsg, setLoadmsg] = useState();
  const [loadmsgrefresh, setLoadmsgrefresh] = useState(false);
  // const [dataloaded, setDataloaded]=useState(false)

  const readUploadFile = (e) => {
    e.preventDefault();
    setFilename(e.target.files[0]["name"]);
    if (e.target.files) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet);
        setDatatoload(json);
      };
      reader.readAsArrayBuffer(e.target.files[0]);
    }
  };

  const loaddata = () => {
    Axios.post("/loadbudgetfile", { data: datatoload }).then((response) => {
      // console.log(response);
      setFilename("");
      setLoadmsg(response.data.msg);
      setLoadmsgrefresh(!loadmsgrefresh);
    });
  };

  return (
    <div>
      <div className="bdgttitles">
        <h2 className="bdgttitle">{bdgtyear} Budget</h2>

        <div className="addprodgroup">
          <button
            className="addprodbutton"
            onClick={(e) => {
              showaddProd();
            }}
          >
            Add Product
          </button>
          {showprodnamefilter ? (
            <div className="addprodpane">
              <input
                ref={searchProdRef}
                value={searchterm}
                onChange={(e) => {
                  setSearchterm(e.target.value);
                }}
                placeholder="Search Product Name"
                type="text"
              />
              <ul>
                {filteredProdnames
                  ? filteredProdnames.map((item) => {
                      return [
                        <div className="addprodrow">
                          <input
                            type="checkbox"
                            name={item.prodNameID}
                            id={item.prodNameID}
                            value={item.prodNameID}
                            onClick={(e) => {
                              if (e.target.checked) {
                                prodstoadd.push(item.prodNameID);
                                prodscattoadd.push(item.prodCatNameID);
                                // console.log(prodstoadd);
                                // console.log(prodscattoadd);
                              } else {
                                for (var i = 0; i < prodstoadd.length; i++) {
                                  if (prodstoadd[i] === item.prodNameID) {
                                    prodstoadd.splice(i, 1);
                                  }
                                  if (prodscattoadd[i] === item.prodCatNameID) {
                                    prodscattoadd.splice(i, 1);
                                  }
                                }
                                // console.log(prodstoadd);
                              }
                            }}
                          />{" "}
                          <label for={item.prodNameID}>
                            {item.abbreviation}
                          </label>
                        </div>,
                      ];
                    })
                  : "Please add a product."}
              </ul>
              <div className="addprodcanceladd">
                <button
                  className="cancelprodbutton"
                  onClick={(e) => {
                    setShowprodnamefilter(false);
                    setSearchterm("");
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={(e) => {
                    addprod();
                  }}
                  className="addprodbutton"
                >
                  Confirm
                </button>
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
        <ExportToCSV csvData={bdgtregiondta} fileName={"budget2024"} />
      </div>
      <div className="bdgttotals">
        <ul className="bdgttotalsul">
          <li>
            <p className="bdgttyearfig">
              {budgetyeartotals &&
              budgetyeartotals[bdgtyear] &&
              budgetyeartotals[bdgtyear]["quantity"]
                ? budgetyeartotals[bdgtyear]["quantity"]
                    .toFixed(0)
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                : 0}{" "}
              mt
            </p>
            <p className="bdgttyearname">Quantity</p>
            <div className="bdgtlyearfigs">
              <p>{bdgtyear - 1} Budget:</p>
              <p>
                {budgetyeartotals &&
                budgetyeartotals[bdgtyear - 1] &&
                budgetyeartotals[bdgtyear - 1]["quantity"]
                  ? budgetyeartotals[bdgtyear - 1]["quantity"]
                      .toFixed(0)
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  : 0}{" "}
                mt
              </p>
            </div>
            <div className="bdgtlyearfigs">
              <p>{bdgtyear - 2} Budget:</p>

              <p>115,479 mt</p>
              {/* <p>152,915 mt</p> */}
            </div>
          </li>
          <li>
            <p className="bdgttyearfig">
              {budgetyeartotals &&
              budgetyeartotals[bdgtyear] &&
              budgetyeartotals[bdgtyear]["revenue"]
                ? "$" +
                  budgetyeartotals[bdgtyear]["revenue"]
                    .toFixed(0)
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                : 0}
            </p>
            <p className="bdgttyearname">Revenue</p>
            <div className="bdgtlyearfigs">
              <p>{bdgtyear - 1} Budget:</p>
              <p>
                {budgetyeartotals &&
                budgetyeartotals[bdgtyear - 1] &&
                budgetyeartotals[bdgtyear - 1]["revenue"]
                  ? "$" +
                    budgetyeartotals[bdgtyear - 1]["revenue"]
                      .toFixed(0)
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  : "$" + 0}
              </p>
            </div>
            <div className="bdgtlyearfigs">
              <p>{bdgtyear - 2} Revenue:</p>
              <p>$91,611,788</p>
              {/* <p>$98,083,156</p> */}
            </div>
          </li>
          <li>
            <p className="bdgttyearfig">
              {budgetyeartotals &&
              budgetyeartotals[bdgtyear] &&
              budgetyeartotals[bdgtyear]["totalprofit"]
                ? "$" +
                  budgetyeartotals[bdgtyear]["totalprofit"]
                    .toFixed(0)
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                : 0}
            </p>
            <p className="bdgttyearname">Profit</p>
            <div className="bdgtlyearfigs">
              <p>{bdgtyear - 1} Budget:</p>
              <p>
                {budgetyeartotals &&
                budgetyeartotals[bdgtyear - 1] &&
                budgetyeartotals[bdgtyear - 1]["totalprofit"]
                  ? "$" +
                    budgetyeartotals[bdgtyear - 1]["totalprofit"]
                      .toFixed(0)
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  : "$" + 0}
              </p>
            </div>
            <div className="bdgtlyearfigs">
              <p>{bdgtyear - 2} Budget:</p>
              <p>$8,195,715</p>
              {/* <p>$4,007,228</p> */}
            </div>
          </li>
          <li>
            <p className="bdgttyearfig">
              {budgetyeartotals &&
              budgetyeartotals[bdgtyear] &&
              budgetyeartotals[bdgtyear]["totalprofit"]
                ? "$" +
                  (
                    budgetyeartotals[bdgtyear]["totalprofit"] /
                    budgetyeartotals[bdgtyear]["quantity"]
                  )
                    .toFixed(0)
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                : 0}
            </p>
            <p className="bdgttyearname">Avg Profit</p>
            <div className="bdgtlyearfigs">
              <p>{bdgtyear - 1} Budget:</p>
              <p>
                {budgetyeartotals &&
                budgetyeartotals[bdgtyear - 1] &&
                budgetyeartotals[bdgtyear - 1]["totalprofit"]
                  ? "$" +
                    (
                      budgetyeartotals[bdgtyear - 1]["totalprofit"] /
                      budgetyeartotals[bdgtyear - 1]["quantity"]
                    )
                      .toFixed(0)
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  : "$" + 0}
              </p>
            </div>
            <div className="bdgtlyearfigs">
              <p>{bdgtyear - 2} Budget:</p>
              <p>$53</p>
              {/* <p>$26</p> */}
            </div>
          </li>
          <li>
            <p className="bdgttyearfig">
              {budgetyeartotals &&
              budgetyeartotals[bdgtyear] &&
              budgetyeartotals[bdgtyear]["totalprofit"]
                ? (
                    (budgetyeartotals[bdgtyear]["totalprofit"] /
                      budgetyeartotals[bdgtyear]["revenue"]) *
                    100
                  ).toFixed(1) + "%"
                : 0}
            </p>
            <p className="bdgttyearname">Margin</p>
            <div className="bdgtlyearfigs">
              <p>{bdgtyear - 1} Budget:</p>
              <p>
                {budgetyeartotals &&
                budgetyeartotals[bdgtyear - 1] &&
                budgetyeartotals[bdgtyear - 1]["totalprofit"]
                  ? (
                      (budgetyeartotals[bdgtyear - 1]["totalprofit"] /
                        budgetyeartotals[bdgtyear - 1]["revenue"]) *
                      100
                    ).toFixed(1) + "%"
                  : "0.0%"}
              </p>
            </div>
            <div className="bdgtlyearfigs">
              <p>{bdgtyear - 2} Margin:</p>
              <p>5.3%</p>
              {/* <p>4.1%</p> */}
            </div>
          </li>
        </ul>
      </div>
      <div className="budgetfilterbuttons">
        <div className="pgroupfbtns">
          <p>Product Groups:</p>
          {prodgroupsbtn
            ? prodgroupsbtn.map((item, i) => {
                return (
                  <button
                    key={i}
                    onClick={(e) =>
                      handleProdGroupClick(e, i, item.productGroup)
                    }
                    className={
                      i === clickedProdGroup
                        ? "budgetfilterbutton budgetfilterbuttonactive"
                        : "budgetfilterbutton"
                    }
                  >
                    {
                      <div>
                        <p className="bdgtbtntitle">{item.productGroup}</p>
                        <p>
                          {item.quantity
                            .toFixed(0)
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " mt"}
                        </p>
                        <p>
                          {"$ " +
                            item.profit
                              .toFixed(0)
                              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        </p>
                      </div>
                    }
                  </button>
                );
              })
            : "Please add a product."}
        </div>
        <div className="pnamefbtns">
          <p>Product Name:</p>
          {budgetbtns
            ? budgetbtns.map((item, i) => {
                if (item.productGroup === selectedPG) {
                  // console.log("match");
                  return (
                    <button
                      key={i}
                      onClick={(e) => {
                        handleProdCatClick(e, i, item);
                      }}
                      className={
                        i === clickedProdCat
                          ? "pnamebutton pnamebuttonactive"
                          : "pnamebutton"
                      }
                    >
                      {
                        <div>
                          <p className="bdgtbtntitle">{item.prodCatName}</p>
                          <p>
                            {item.quantity
                              .toFixed(0)
                              .replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " mt"}
                          </p>
                          <p>
                            {"$ " +
                              item.profit
                                .toFixed(0)
                                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                          </p>
                        </div>
                      }
                    </button>
                  );
                }
              })
            : "Please add a product."}
        </div>
      </div>
      <div className="budgetprepdata">
        <div className="bdgtleftbottompanel">
          <div className="budgettablesandresponse">
            <div className="budgettables" ref={boardRef}>
              {formatedData
                ? Object.keys(formatedData).map((prod, key) => {
                    let q1prodtotal = 0;
                    let q2prodtotal = 0;
                    let q3prodtotal = 0;
                    let q4prodtotal = 0;
                    let pricetotal = 0;
                    let profittotal = 0;
                    return [
                      <div className="bdgtpnametable">
                        <div className="bdgtpnametabletitle">
                          <h3>2024 {prod} Budget</h3>
                          <FontAwesomeIcon
                            icon={faPlusCircle}
                            onClick={(e) => {
                              setShowprodctyadd({
                                ...showprodctyadd,
                                [prod]: !showprodctyadd[prod],
                              });
                            }}
                          />
                          <div
                            className={
                              showprodctyadd && showprodctyadd[prod]
                                ? "bdgtselectallcty showbdgtpane"
                                : "bdgtselectallcty hidebdgtpane"
                            }
                          >
                            <h4>Select countries to add.</h4>
                            <div className="bdgtselectctycty">
                              {fullcountrylist
                                ? fullcountrylist.map((ctyel) => {
                                    return (
                                      <div className="addctyrow">
                                        <input
                                          type="checkbox"
                                          name={ctyel.countryID}
                                          onClick={(e) => {
                                            if (
                                              e.target.checked &&
                                              prodcountriestoadd
                                            ) {
                                              setProdcountriestoadd({
                                                ...prodcountriestoadd,
                                                [prod]: {
                                                  ...prodcountriestoadd[prod],
                                                  [ctyel.countryID]:
                                                    ctyel.country,
                                                },
                                              });
                                            } else {
                                              setProdcountriestoadd(
                                                (current) => {
                                                  const copy = {
                                                    ...current,
                                                  };
                                                  delete copy[prod][
                                                    ctyel.countryID
                                                  ];
                                                  return copy;
                                                }
                                              );
                                            }
                                          }}
                                        />
                                        <label for={ctyel.countyID}>
                                          {ctyel.country}
                                        </label>
                                      </div>
                                    );
                                  })
                                : ""}
                            </div>
                            <div className="addprodcanceladd">
                              <button
                                className="cancelprodbutton"
                                onClick={(e) => {
                                  setShowprodctyadd({
                                    ...showprodctyadd,
                                    [prod]: false,
                                  });
                                }}
                              >
                                Cancel
                              </button>
                              <button
                                className="addprodbutton"
                                onClick={(e) => {
                                  addbdgtcountry(prod);
                                }}
                              >
                                Confirm
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="board">
                          <table>
                            <thead>
                              <tr>
                                <td className="countrycol">Country</td>
                                <td className="bdgtdatacol">Q1</td>
                                <td className="bdgtdatacol">Q2</td>
                                <td className="bdgtdatacol">Q3</td>
                                <td className="bdgtdatacol">Q4</td>
                                <td className="bdgtdatacol">Total</td>
                                <td className="bdgtcolseparation"></td>
                                <td className="bdgtdatacol">Price</td>
                                <td className="bdgtdatacol">Profit</td>
                                <td className="bdgtdatacol">Ttl Profit</td>
                                <td className="bdgtdatacol">% Mgn</td>
                              </tr>
                            </thead>
                            <tbody>
                              {Object.keys(formatedData[prod]).map(
                                (reg, key1) => {
                                  let q1reg = 0;
                                  let q2reg = 0;
                                  let q3reg = 0;
                                  let q4reg = 0;
                                  let priceqty = 0;
                                  let profitqty = 0;

                                  Object.keys(formatedData[prod][reg]).forEach(
                                    (ctry) => {
                                      q1reg =
                                        q1reg +
                                        formatedData[prod][reg][ctry]["0"];
                                      q2reg =
                                        q2reg +
                                        formatedData[prod][reg][ctry]["1"];
                                      q3reg =
                                        q3reg +
                                        formatedData[prod][reg][ctry]["2"];
                                      q4reg =
                                        q4reg +
                                        formatedData[prod][reg][ctry]["3"];
                                      if (
                                        bdgtecondata &&
                                        bdgtecondata[prod] &&
                                        bdgtecondata[prod][reg] &&
                                        bdgtecondata[prod][reg][ctry] &&
                                        bdgtecondata[prod][reg][ctry]["price"]
                                      ) {
                                        priceqty =
                                          priceqty +
                                          bdgtecondata[prod][reg][ctry][
                                            "price"
                                          ] *
                                            (formatedData[prod][reg][ctry][
                                              "0"
                                            ] +
                                              formatedData[prod][reg][ctry][
                                                "1"
                                              ] +
                                              formatedData[prod][reg][ctry][
                                                "2"
                                              ] +
                                              formatedData[prod][reg][ctry][
                                                "3"
                                              ]);
                                      }
                                      if (
                                        bdgtecondata &&
                                        bdgtecondata[prod] &&
                                        bdgtecondata[prod][reg] &&
                                        bdgtecondata[prod][reg][ctry] &&
                                        bdgtecondata[prod][reg][ctry]["profit"]
                                      ) {
                                        profitqty =
                                          profitqty +
                                          bdgtecondata[prod][reg][ctry][
                                            "profit"
                                          ] *
                                            (formatedData[prod][reg][ctry][
                                              "0"
                                            ] +
                                              formatedData[prod][reg][ctry][
                                                "1"
                                              ] +
                                              formatedData[prod][reg][ctry][
                                                "2"
                                              ] +
                                              formatedData[prod][reg][ctry][
                                                "3"
                                              ]);
                                      }
                                    }
                                  );
                                  q1prodtotal = q1prodtotal + q1reg;
                                  q2prodtotal = q2prodtotal + q2reg;
                                  q3prodtotal = q3prodtotal + q3reg;
                                  q4prodtotal = q4prodtotal + q4reg;

                                  let regprice =
                                    priceqty === 0
                                      ? 0
                                      : priceqty /
                                        (q1reg + q2reg + q3reg + q4reg);

                                  let regprofit =
                                    profitqty === 0
                                      ? 0
                                      : profitqty /
                                        (q1reg + q2reg + q3reg + q4reg);
                                  pricetotal = pricetotal + priceqty;
                                  profittotal = profittotal + profitqty;
                                  return [
                                    <tr className="bdgtregionrow">
                                      <td className="bdgtregioncol">
                                        <FontAwesomeIcon
                                          className="bdgtctyrowadd"
                                          icon={faPlusCircle}
                                          onClick={(e) => {
                                            setShowaddcty({
                                              ...showaddcty,
                                              [prod]: {
                                                ...showaddcty[prod],
                                                [reg]: !showaddcty[prod][reg],
                                              },
                                            });
                                            loadregcountries(reg);
                                          }}
                                        />
                                        {reg === "Latin America"
                                          ? "L. America"
                                          : reg}
                                        <div
                                          className={
                                            showaddcty && showaddcty[prod]
                                              ? showaddcty[prod][reg]
                                                ? "bdgtselectcty showbdgtpane"
                                                : "bdgtselectcty hidebdgtpane"
                                              : ""
                                          }
                                        >
                                          <h4>
                                            Select countries to add in {reg}
                                          </h4>
                                          <div className="bdgtselectctycty">
                                            {loadregcties && loadregcties[reg]
                                              ? loadregcties[reg][0].map(
                                                  (el) => (
                                                    <div className="addctyrow">
                                                      <input
                                                        type="checkbox"
                                                        name={el.countryID}
                                                        value={prod}
                                                        onClick={(e) => {
                                                          if (
                                                            e.target.checked &&
                                                            prodcountriestoadd
                                                          ) {
                                                            setProdcountriestoadd(
                                                              {
                                                                ...prodcountriestoadd,
                                                                [prod]: {
                                                                  ...prodcountriestoadd[
                                                                    prod
                                                                  ],
                                                                  [el.countryID]:
                                                                    el.country,
                                                                },
                                                              }
                                                            );
                                                          } else {
                                                            setProdcountriestoadd(
                                                              (current) => {
                                                                const copy = {
                                                                  ...current,
                                                                };
                                                                delete copy[
                                                                  prod
                                                                ][el.countryID];
                                                                return copy;
                                                              }
                                                            );
                                                          }
                                                        }}
                                                      />
                                                      <label for={el.countryID}>
                                                        {el.country}
                                                      </label>
                                                    </div>
                                                  )
                                                )
                                              : ""}
                                          </div>
                                          <div className="addprodcanceladd">
                                            <button
                                              className="cancelprodbutton"
                                              onClick={(e) => {
                                                setShowaddcty({
                                                  ...showaddcty,
                                                  [prod]: {
                                                    ...showaddcty[prod],
                                                    [reg]: !showaddcty[prod][
                                                      reg
                                                    ],
                                                  },
                                                });
                                              }}
                                            >
                                              Cancel
                                            </button>
                                            <button
                                              className="addprodbutton"
                                              onClick={(e) => {
                                                addbdgtcountry(prod);
                                              }}
                                            >
                                              Confirm
                                            </button>
                                          </div>
                                        </div>
                                      </td>

                                      <td className="bdgtregioncolttl">
                                        {q1reg}
                                      </td>
                                      <td className="bdgtregioncolttl">
                                        {q2reg}
                                      </td>
                                      <td className="bdgtregioncolttl">
                                        {q3reg}
                                      </td>
                                      <td className="bdgtregioncolttl">
                                        {q4reg}
                                      </td>
                                      <td className="bdgtregioncolttl">
                                        {q1reg + q2reg + q3reg + q4reg}
                                      </td>
                                      <td className="bdgtcolseparation"></td>
                                      <td className="bdgtregioncolttl">
                                        {/* {priceqty === 0
                                        ? 0
                                        : (
                                            priceqty /
                                            (q1reg + q2reg + q3reg + q4reg)
                                          ).toFixed(0)} */}
                                        {"$" +
                                          regprice
                                            .toFixed(0)
                                            .replace(
                                              /\B(?=(\d{3})+(?!\d))/g,
                                              ","
                                            )}
                                      </td>
                                      <td className="bdgtregioncolttl">
                                        {"$" +
                                          regprofit
                                            .toFixed(0)
                                            .replace(
                                              /\B(?=(\d{3})+(?!\d))/g,
                                              ","
                                            )}
                                      </td>
                                      <td className="bdgtregioncolttl">
                                        {"$" +
                                          (
                                            regprofit *
                                            (q1reg + q2reg + q3reg + q4reg)
                                          )
                                            .toFixed(0)
                                            .replace(
                                              /\B(?=(\d{3})+(?!\d))/g,
                                              ","
                                            )}
                                      </td>
                                      <td className="bdgtregioncolttl">
                                        {regprofit === 0 || regprice === 0
                                          ? 0 + "%"
                                          : (
                                              (regprofit / regprice) *
                                              100
                                            ).toFixed(1) + "%"}
                                      </td>
                                    </tr>,
                                    Object.keys(formatedData[prod][reg]).map(
                                      (cty) => {
                                        let indexecon = indecon;
                                        indecon = indecon + 2;
                                        //   q1reg = 0;
                                        return [
                                          <tr>
                                            <td className="countrycol">
                                              {cty === "Dominican Republic"
                                                ? "Dom Rep"
                                                : cty}
                                            </td>
                                            {Object.keys(
                                              formatedData[prod][reg][cty]
                                            ).map((q) => {
                                              let index = ind;
                                              // console.log(index);
                                              ind = ind + 1;
                                              return [
                                                <td
                                                  onContextMenu={async (e) => {
                                                    e.preventDefault();

                                                    const clickdone = await delayedclicked();
                                                    if (
                                                      // commentRef &&
                                                      clickdone === true
                                                    ) {
                                                      // console.log("how");
                                                      commentRef.current.focus();
                                                    }
                                                    setPoints({
                                                      x: e.pageX,
                                                      y: e.pageY,
                                                    });
                                                    // console.log("Right Click");
                                                  }}
                                                  className={
                                                    budgetdata &&
                                                    budgetdata[index]
                                                      ? bdgtcommentset &&
                                                        bdgtcommentset.includes(
                                                          budgetdata[index][
                                                            "budgetentryID"
                                                          ]
                                                        )
                                                        ? "bdgtdatacol cellwithcomment"
                                                        : "bdgtdatacol"
                                                      : ""
                                                  }
                                                >
                                                  <div
                                                    className={`tile ${
                                                      activeIndex === index
                                                        ? "active"
                                                        : ""
                                                    } ${
                                                      budgetdata &&
                                                      budgetdata[index]
                                                        ? bdgtcommentset &&
                                                          bdgtcommentset.includes(
                                                            budgetdata[index][
                                                              "budgetentryID"
                                                            ]
                                                          )
                                                          ? "cellwithcomment"
                                                          : ""
                                                        : ""
                                                    }`}
                                                  >
                                                    <input
                                                      value={
                                                        formatedData[prod][reg][
                                                          cty
                                                        ][q]
                                                      }
                                                      onChange={(e) => {
                                                        handleChange1(
                                                          e,
                                                          prod,
                                                          reg,
                                                          cty,
                                                          q
                                                        );
                                                      }}
                                                      className={
                                                        budgetdata &&
                                                        budgetdata[index]
                                                          ? bdgtcommentset &&
                                                            bdgtcommentset.includes(
                                                              budgetdata[index][
                                                                "budgetentryID"
                                                              ]
                                                            )
                                                            ? "cell-input cellwithcomment"
                                                            : "cell-input"
                                                          : ""
                                                      }
                                                      onFocus={(e) => {
                                                        setActiveIndex(index);
                                                        e.target.select();
                                                        setEditingQty(true);
                                                        setEditingEcon(false);
                                                        setClicked(false);
                                                        setNewcomment("");
                                                      }}
                                                      ref={(el) =>
                                                        (inputRefs.current[
                                                          index
                                                        ] = el)
                                                      }
                                                      onBlur={(e) => {
                                                        saveNewValue(
                                                          e,
                                                          index,
                                                          prod,
                                                          reg,
                                                          cty,
                                                          q
                                                        );
                                                        setShowmsg(!showmsg);
                                                      }}
                                                      id={
                                                        budgetdata &&
                                                        budgetdata[index]
                                                          ? budgetdata[index][
                                                              "budgetentryID"
                                                            ]
                                                          : ""
                                                      }
                                                    />
                                                    {clicked &&
                                                      activeIndex === index && (
                                                        <div
                                                          className="contextMenu"
                                                          top={points.y}
                                                          left={points.x}
                                                          // onBlur={(e) => {
                                                          //   e.preventDefault();
                                                          //   setClicked(false);
                                                          //   setNewcomment("");
                                                          // }}
                                                        >
                                                          <ul>
                                                            <li className="bdgtcomment">
                                                              {bdgtcomments &&
                                                              Array.isArray(
                                                                bdgtcomments
                                                              )
                                                                ? bdgtcomments.map(
                                                                    (comm) => {
                                                                      // console.log(
                                                                      //   comm.bdgtEntryID
                                                                      // );
                                                                      if (
                                                                        comm.budgetEntryID ===
                                                                        budgetdata[
                                                                          index
                                                                        ][
                                                                          "budgetentryID"
                                                                        ]
                                                                      ) {
                                                                        return (
                                                                          <p>
                                                                            {comm.user +
                                                                              ": " +
                                                                              comm.bdgtComment}
                                                                          </p>
                                                                        );
                                                                      }
                                                                    }
                                                                  )
                                                                : ""}
                                                            </li>
                                                            <li>
                                                              <textarea
                                                                ref={commentRef}
                                                                maxLength={200}
                                                                onChange={(
                                                                  e
                                                                ) => {
                                                                  setNewcomment(
                                                                    e.target
                                                                      .value
                                                                  );
                                                                  // console.log(
                                                                  //   budgetdata[
                                                                  //     index
                                                                  //   ]
                                                                  // );
                                                                }}
                                                                type="textarea"
                                                                value={
                                                                  newcomment
                                                                }
                                                              />
                                                            </li>
                                                            <li>
                                                              <button
                                                                onClick={(
                                                                  e
                                                                ) => {
                                                                  e.preventDefault();

                                                                  saveNewBudgetComment(
                                                                    budgetdata[
                                                                      index
                                                                    ][
                                                                      "budgetentryID"
                                                                    ],
                                                                    budgetdata[
                                                                      index
                                                                    ][
                                                                      "prodCatNameID"
                                                                    ]
                                                                  );
                                                                }}
                                                              >
                                                                Add Comment
                                                              </button>
                                                            </li>
                                                          </ul>
                                                        </div>
                                                      )}
                                                  </div>
                                                </td>,
                                              ];
                                            })}

                                            <td className="bdgtcountrytotals">
                                              {formatedData[prod][reg][cty][
                                                "0"
                                              ] +
                                                formatedData[prod][reg][cty][
                                                  "1"
                                                ] +
                                                formatedData[prod][reg][cty][
                                                  "2"
                                                ] +
                                                formatedData[prod][reg][cty][
                                                  "3"
                                                ]}
                                            </td>
                                            <td className="bdgtcolseparation"></td>
                                            <td className="bdgtctyeconomics">
                                              <input
                                                className="cell-input"
                                                value={
                                                  bdgtecondata &&
                                                  bdgtecondata[prod] &&
                                                  bdgtecondata[prod][reg] &&
                                                  bdgtecondata[prod][reg][
                                                    cty
                                                  ] &&
                                                  bdgtecondata[prod][reg][cty][
                                                    "price"
                                                  ] !== null
                                                    ? bdgtecondata[prod][reg][
                                                        cty
                                                      ]["price"]
                                                    : "na"
                                                }
                                                onChange={(e) => {
                                                  handleEconChange(
                                                    e,
                                                    prod,
                                                    reg,
                                                    cty,
                                                    "price"
                                                  );
                                                }}
                                                onFocus={(e) => {
                                                  setActiveEconIndex(indexecon);
                                                  e.target.select();
                                                  setEditingQty(false);
                                                  setEditingEcon(true);
                                                  setActiveIndex(-1);
                                                }}
                                                ref={(el) =>
                                                  (inputEconRefs.current[
                                                    indexecon
                                                  ] = el)
                                                }
                                                onBlur={(e) => {
                                                  saveNewEconValue(
                                                    e,
                                                    indexecon,
                                                    prod,
                                                    reg,
                                                    cty,
                                                    "price"
                                                  );
                                                  setShowmsg(!showmsg);
                                                }}
                                              />
                                            </td>
                                            <td className="bdgtctyeconomics">
                                              <input
                                                className="cell-input"
                                                value={
                                                  bdgtecondata &&
                                                  bdgtecondata[prod] &&
                                                  bdgtecondata[prod][reg] &&
                                                  bdgtecondata[prod][reg][
                                                    cty
                                                  ] &&
                                                  bdgtecondata[prod][reg][cty][
                                                    "profit"
                                                  ] !== null
                                                    ? bdgtecondata[prod][reg][
                                                        cty
                                                      ]["profit"]
                                                    : "na"
                                                }
                                                onChange={(e) => {
                                                  handleEconChange(
                                                    e,
                                                    prod,
                                                    reg,
                                                    cty,
                                                    "profit"
                                                  );
                                                }}
                                                onFocus={(e) => {
                                                  setActiveEconIndex(
                                                    indexecon + 1
                                                  );
                                                  e.target.select();
                                                  setEditingQty(false);
                                                  setEditingEcon(true);
                                                  setActiveIndex(-1);
                                                }}
                                                ref={(el) =>
                                                  (inputEconRefs.current[
                                                    indexecon + 1
                                                  ] = el)
                                                }
                                                onBlur={(e) => {
                                                  saveNewEconValue(
                                                    e,
                                                    indexecon,
                                                    prod,
                                                    reg,
                                                    cty,
                                                    "profit"
                                                  );
                                                  setShowmsg(!showmsg);
                                                }}
                                              />
                                            </td>
                                            <td className="bdgtctyeconomics">
                                              {bdgtecondata &&
                                              formatedData &&
                                              bdgtecondata[prod] &&
                                              formatedData[prod] &&
                                              bdgtecondata[prod][reg] &&
                                              formatedData[prod][reg] &&
                                              bdgtecondata[prod][reg][cty] &&
                                              formatedData[prod][reg][cty] &&
                                              bdgtecondata[prod][reg][cty][
                                                "profit"
                                              ] !== null
                                                ? (
                                                    bdgtecondata[prod][reg][
                                                      cty
                                                    ]["profit"] *
                                                    (formatedData[prod][reg][
                                                      cty
                                                    ][0] +
                                                      formatedData[prod][reg][
                                                        cty
                                                      ][1] +
                                                      formatedData[prod][reg][
                                                        cty
                                                      ][2] +
                                                      formatedData[prod][reg][
                                                        cty
                                                      ][3])
                                                  ).toFixed(0)
                                                : 0}
                                            </td>
                                            <td className="bdgtctyeconomics">
                                              {bdgtecondata &&
                                              bdgtecondata[prod] &&
                                              bdgtecondata[prod][reg] &&
                                              bdgtecondata[prod][reg][cty] &&
                                              bdgtecondata[prod][reg][cty][
                                                "profit"
                                              ] !== null &&
                                              bdgtecondata[prod][reg][cty][
                                                "price"
                                              ] !== 0
                                                ? (
                                                    (bdgtecondata[prod][reg][
                                                      cty
                                                    ]["profit"] /
                                                      bdgtecondata[prod][reg][
                                                        cty
                                                      ]["price"]) *
                                                    100
                                                  ).toFixed(1) + "%"
                                                : "0%"}
                                            </td>
                                            <FontAwesomeIcon
                                              className="bdgtctydelete"
                                              icon={faMinusCircle}
                                              onClick={(e) => {
                                                setShowdelctybtns({
                                                  ...showdelctybtns,
                                                  [prod]: {
                                                    ...showdelctybtns[prod],
                                                    [reg]: {
                                                      ...showdelctybtns[prod][
                                                        reg
                                                      ],
                                                      [cty]: !showdelctybtns[
                                                        prod
                                                      ][reg][cty],
                                                    },
                                                  },
                                                });
                                              }}
                                            />
                                            <button
                                              className={
                                                showdelctybtns &&
                                                showdelctybtns[prod] &&
                                                showdelctybtns[prod][reg][
                                                  cty
                                                ] === true
                                                  ? "bdgtctydeletebtn showbdgtpane"
                                                  : "bdgtctydeletebtn hidebdgtpane"
                                              }
                                              onClick={(e) => {
                                                deletectyrow(prod, cty);
                                              }}
                                            >
                                              Delete
                                            </button>
                                          </tr>,
                                        ];
                                      }
                                    ),
                                  ];
                                }
                              )}
                              <tr>
                                <td className="bdgttotal">Total</td>
                                <td className="bdgttotalqty">{q1prodtotal}</td>
                                <td className="bdgttotalqty">{q2prodtotal}</td>
                                <td className="bdgttotalqty">{q3prodtotal}</td>
                                <td className="bdgttotalqty">{q4prodtotal}</td>
                                <td className="bdgttotalqty">
                                  {q1prodtotal +
                                    q2prodtotal +
                                    q3prodtotal +
                                    q4prodtotal}
                                </td>
                                <td class="bdgtcolseparation"></td>
                                <td className="bdgttotalqty">
                                  {pricetotal === 0 ||
                                  q1prodtotal +
                                    q2prodtotal +
                                    q3prodtotal +
                                    q4prodtotal ===
                                    0
                                    ? 0
                                    : "$" +
                                      (
                                        pricetotal /
                                        (q1prodtotal +
                                          q2prodtotal +
                                          q3prodtotal +
                                          q4prodtotal)
                                      )
                                        .toFixed(0)
                                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                </td>
                                <td className="bdgttotalqty">
                                  {profittotal === 0 ||
                                  q1prodtotal +
                                    q2prodtotal +
                                    q3prodtotal +
                                    q4prodtotal ===
                                    0
                                    ? 0
                                    : "$" +
                                      (
                                        profittotal /
                                        (q1prodtotal +
                                          q2prodtotal +
                                          q3prodtotal +
                                          q4prodtotal)
                                      )
                                        .toFixed(0)
                                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                </td>
                                <td className="bdgttotalqty">
                                  {profittotal === 0
                                    ? 0
                                    : "$" +
                                      profittotal
                                        .toFixed(0)
                                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                </td>
                                <td className="bdgttotalqty">
                                  {profittotal === 0 || pricetotal == 0
                                    ? 0
                                    : (
                                        (profittotal / pricetotal) *
                                        100
                                      ).toFixed(1) + "%"}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>,
                    ];
                  })
                : ""}
            </div>
            <span className="bdgtresponsemsg" ref={refresmsg}>
              {bdgtresponsemsg}
            </span>
          </div>
          <div className="lyearfigures">
            {formatedData && bdgtlyearsales
              ? Object.keys(formatedData).map((prod) => {
                  let lyearqtytotal = 0;
                  let lyearpricetotal = 0;
                  let lyearprofittotal = 0;
                  return [
                    <h3>
                      {bdgtyear - 1} {prod} Sales Figures
                    </h3>,
                    <table className="lyeartable">
                      <thead className="lyearhead">
                        <tr>
                          <td className="lyearcountrycol">Country</td>
                          <td className="lyeardatah">Qty</td>
                          <td className="lyeardatah">Price</td>
                          <td className="lyeardatah">Profit</td>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.keys(formatedData[prod]).map((reg) => {
                          let lyearregqty = 0;
                          let lyearregprice = 0;
                          let lyearregprofit = 0;
                          Object.keys(formatedData[prod][reg]).forEach(
                            (ctry) => {
                              if (
                                bdgtlyearsales &&
                                bdgtlyearsales[prod] &&
                                bdgtlyearsales[prod][reg] &&
                                bdgtlyearsales[prod][reg][ctry] &&
                                bdgtlyearsales[prod][reg][ctry]["quantity"] &&
                                bdgtlyearsales[prod][reg][ctry]["avgprice"] &&
                                bdgtlyearsales[prod][reg][ctry]["avgprofit"]
                              ) {
                                lyearregqty =
                                  lyearregqty +
                                  bdgtlyearsales[prod][reg][ctry]["quantity"];
                                lyearregprice =
                                  lyearregprice +
                                  bdgtlyearsales[prod][reg][ctry]["quantity"] *
                                    bdgtlyearsales[prod][reg][ctry]["avgprice"];
                                lyearregprofit =
                                  lyearregprofit +
                                  bdgtlyearsales[prod][reg][ctry]["quantity"] *
                                    bdgtlyearsales[prod][reg][ctry][
                                      "avgprofit"
                                    ];
                              }
                            }
                          );
                          return [
                            <tr>
                              <td className="lyearregrow lyearcountrycol">
                                {reg === "Latin America" ? "L. America" : reg}
                              </td>
                              <td className="lyearregrowdata">{lyearregqty}</td>
                              <td className="lyearregrowdata">
                                {lyearregqty === 0
                                  ? 0
                                  : "$ " +
                                    (lyearregprice / lyearregqty).toFixed(0)}
                              </td>
                              <td className="lyearregrowdata">
                                {lyearregqty === 0
                                  ? 0
                                  : "$ " +
                                    (lyearregprofit / lyearregqty).toFixed(0)}
                              </td>
                              {/* <td colSpan={3}></td> */}
                            </tr>,
                            Object.keys(formatedData[prod][reg]).map((cty) => {
                              if (
                                bdgtlyearsales &&
                                bdgtlyearsales[prod] &&
                                bdgtlyearsales[prod][reg] &&
                                bdgtlyearsales[prod][reg][cty] &&
                                bdgtlyearsales[prod][reg][cty]["quantity"]
                              ) {
                                lyearqtytotal =
                                  lyearqtytotal +
                                  bdgtlyearsales[prod][reg][cty]["quantity"];
                              }
                              if (
                                bdgtlyearsales &&
                                bdgtlyearsales[prod] &&
                                bdgtlyearsales[prod][reg] &&
                                bdgtlyearsales[prod][reg][cty] &&
                                bdgtlyearsales[prod][reg][cty]["quantity"] &&
                                bdgtlyearsales[prod][reg][cty]["avgprice"]
                              ) {
                                lyearpricetotal =
                                  lyearpricetotal +
                                  bdgtlyearsales[prod][reg][cty]["avgprice"] *
                                    bdgtlyearsales[prod][reg][cty]["quantity"];
                              }
                              if (
                                bdgtlyearsales &&
                                bdgtlyearsales[prod] &&
                                bdgtlyearsales[prod][reg] &&
                                bdgtlyearsales[prod][reg][cty] &&
                                bdgtlyearsales[prod][reg][cty]["quantity"] &&
                                bdgtlyearsales[prod][reg][cty]["avgprofit"]
                              ) {
                                lyearprofittotal =
                                  lyearprofittotal +
                                  bdgtlyearsales[prod][reg][cty]["avgprofit"] *
                                    bdgtlyearsales[prod][reg][cty]["quantity"];
                              }

                              return [
                                <tr>
                                  <td className="lyearcountrycol">
                                    {cty === "Dominican Republic"
                                      ? "Dom Rep"
                                      : cty}
                                  </td>
                                  <td className="lyeardata">
                                    {bdgtlyearsales &&
                                    bdgtlyearsales[prod] &&
                                    bdgtlyearsales[prod][reg] &&
                                    bdgtlyearsales[prod][reg][cty] &&
                                    bdgtlyearsales[prod][reg][cty]["quantity"]
                                      ? bdgtlyearsales[prod][reg][cty][
                                          "quantity"
                                        ]
                                      : 0}
                                  </td>
                                  <td className="lyeardata">
                                    {bdgtlyearsales &&
                                    bdgtlyearsales[prod] &&
                                    bdgtlyearsales[prod][reg] &&
                                    bdgtlyearsales[prod][reg][cty] &&
                                    bdgtlyearsales[prod][reg][cty]["avgprice"]
                                      ? "$ " +
                                        bdgtlyearsales[prod][reg][cty][
                                          "avgprice"
                                        ]
                                      : 0}
                                  </td>
                                  <td className="lyeardata">
                                    {bdgtlyearsales &&
                                    bdgtlyearsales[prod] &&
                                    bdgtlyearsales[prod][reg] &&
                                    bdgtlyearsales[prod][reg][cty] &&
                                    bdgtlyearsales[prod][reg][cty]["avgprofit"]
                                      ? "$ " +
                                        bdgtlyearsales[prod][reg][cty][
                                          "avgprofit"
                                        ]
                                      : 0}
                                  </td>
                                </tr>,
                              ];
                            }),
                          ];
                        })}
                        <tr>
                          <td
                            className="lyearcountrycolttl"
                            style={{ background: "rgb(160, 182, 103)" }}
                          >
                            Total
                          </td>
                          <td
                            className="lyeardatattl"
                            style={{ background: "rgb(160, 182, 103)" }}
                          >
                            {lyearqtytotal}
                          </td>
                          <td
                            className="lyeardatattl"
                            style={{ background: "rgb(160, 182, 103)" }}
                          >
                            {lyearqtytotal === 0
                              ? 0
                              : "$ " +
                                (lyearpricetotal / lyearqtytotal).toFixed(0)}
                          </td>
                          <td
                            className="lyeardatattl"
                            style={{ background: "rgb(160, 182, 103)" }}
                          >
                            {lyearqtytotal === 0
                              ? 0
                              : "$ " +
                                (lyearprofittotal / lyearqtytotal).toFixed(0)}
                          </td>
                        </tr>
                      </tbody>
                    </table>,
                  ];
                })
              : ""}
          </div>
          <div className="lyearfigures">
            {formatedData && lybformateddata
              ? Object.keys(formatedData).map((prod) => {
                  let lyearbqtytotal = 0;
                  let lyearbpricetotal = 0;
                  let lyearbprofittotal = 0;
                  return [
                    <h3>
                      {bdgtyear - 1} {prod} Budget
                    </h3>,
                    <table className="lyeartable">
                      <thead className="lyearhead">
                        <tr>
                          {/* <td className="lyearcountrycol">Country</td> */}
                          <td
                            className="lyeardatah"
                            style={{ background: "rgb(68, 65, 162)" }}
                          >
                            Qty
                          </td>
                          <td
                            className="lyeardatah"
                            style={{ background: "rgb(68, 65, 162)" }}
                          >
                            Price
                          </td>
                          <td
                            className="lyeardatah"
                            style={{ background: "rgb(68, 65, 162)" }}
                          >
                            Profit
                          </td>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.keys(formatedData[prod]).map((reg) => {
                          let lyearregbqty = 0;
                          let lyearregbprice = 0;
                          let lyearregbprofit = 0;
                          Object.keys(formatedData[prod][reg]).forEach(
                            (ctry) => {
                              if (
                                lybformateddata &&
                                lybformateddata[prod] &&
                                lybformateddata[prod][reg] &&
                                lybformateddata[prod][reg][ctry] &&
                                lybformateddata[prod][reg][ctry]["quantity"] &&
                                lybformateddata[prod][reg][ctry]["avgprice"] &&
                                lybformateddata[prod][reg][ctry]["avgprofit"]
                              ) {
                                lyearregbqty =
                                  lyearregbqty +
                                  lybformateddata[prod][reg][ctry]["quantity"];
                                lyearregbprice =
                                  lyearregbprice +
                                  lybformateddata[prod][reg][ctry]["quantity"] *
                                    lybformateddata[prod][reg][ctry][
                                      "avgprice"
                                    ];
                                lyearregbprofit =
                                  lyearregbprofit +
                                  lybformateddata[prod][reg][ctry]["quantity"] *
                                    lybformateddata[prod][reg][ctry][
                                      "avgprofit"
                                    ];
                              }
                            }
                          );
                          return [
                            <tr>
                              {/* <td className="lyearregrow lyearcountrycol">
                                {reg === "Latin America" ? "L. America" : reg}
                              </td> */}
                              <td className="lyearregrowdata">
                                {lyearregbqty}
                              </td>
                              <td className="lyearregrowdata">
                                {lyearregbqty === 0
                                  ? 0
                                  : "$ " +
                                    (lyearregbprice / lyearregbqty).toFixed(0)}
                              </td>
                              <td className="lyearregrowdata">
                                {lyearregbqty === 0
                                  ? 0
                                  : "$ " +
                                    (lyearregbprofit / lyearregbqty).toFixed(0)}
                              </td>
                              {/* <td colSpan={3}></td> */}
                            </tr>,
                            Object.keys(formatedData[prod][reg]).map((cty) => {
                              if (
                                lybformateddata &&
                                lybformateddata[prod] &&
                                lybformateddata[prod][reg] &&
                                lybformateddata[prod][reg][cty] &&
                                lybformateddata[prod][reg][cty]["quantity"]
                              ) {
                                lyearbqtytotal =
                                  lyearbqtytotal +
                                  lybformateddata[prod][reg][cty]["quantity"];
                              }
                              if (
                                lybformateddata &&
                                lybformateddata[prod] &&
                                lybformateddata[prod][reg] &&
                                lybformateddata[prod][reg][cty] &&
                                lybformateddata[prod][reg][cty]["quantity"] &&
                                lybformateddata[prod][reg][cty]["avgprice"]
                              ) {
                                lyearbpricetotal =
                                  lyearbpricetotal +
                                  lybformateddata[prod][reg][cty]["avgprice"] *
                                    lybformateddata[prod][reg][cty]["quantity"];
                              }
                              if (
                                lybformateddata &&
                                lybformateddata[prod] &&
                                lybformateddata[prod][reg] &&
                                lybformateddata[prod][reg][cty] &&
                                lybformateddata[prod][reg][cty]["quantity"] &&
                                lybformateddata[prod][reg][cty]["avgprofit"]
                              ) {
                                lyearbprofittotal =
                                  lyearbprofittotal +
                                  lybformateddata[prod][reg][cty]["avgprofit"] *
                                    lybformateddata[prod][reg][cty]["quantity"];
                              }

                              return [
                                <tr>
                                  {/* <td className="lyearcountrycol">
                                    {cty === "Dominican Republic"
                                      ? "Dom Rep"
                                      : cty}
                                  </td> */}
                                  <td className="lyeardata">
                                    {lybformateddata &&
                                    lybformateddata[prod] &&
                                    lybformateddata[prod][reg] &&
                                    lybformateddata[prod][reg][cty] &&
                                    lybformateddata[prod][reg][cty]["quantity"]
                                      ? lybformateddata[prod][reg][cty][
                                          "quantity"
                                        ]
                                      : 0}
                                  </td>
                                  <td className="lyeardata">
                                    {lybformateddata &&
                                    lybformateddata[prod] &&
                                    lybformateddata[prod][reg] &&
                                    lybformateddata[prod][reg][cty] &&
                                    lybformateddata[prod][reg][cty]["avgprice"]
                                      ? "$ " +
                                        lybformateddata[prod][reg][cty][
                                          "avgprice"
                                        ]
                                      : 0}
                                  </td>
                                  <td className="lyeardata">
                                    {lybformateddata &&
                                    lybformateddata[prod] &&
                                    lybformateddata[prod][reg] &&
                                    lybformateddata[prod][reg][cty] &&
                                    lybformateddata[prod][reg][cty]["avgprofit"]
                                      ? "$ " +
                                        lybformateddata[prod][reg][cty][
                                          "avgprofit"
                                        ]
                                      : 0}
                                  </td>
                                </tr>,
                              ];
                            }),
                          ];
                        })}
                        <tr>
                          {/* <td className="lyearcountrycolttl">Total</td> */}
                          <td
                            className="lyeardatattl"
                            style={{ background: "rgb(68, 65, 162)" }}
                          >
                            {lyearbqtytotal}
                          </td>
                          <td
                            className="lyeardatattl"
                            style={{ background: "rgb(68, 65, 162)" }}
                          >
                            {lyearbqtytotal === 0
                              ? 0
                              : "$ " +
                                (lyearbpricetotal / lyearbqtytotal).toFixed(0)}
                          </td>
                          <td
                            className="lyeardatattl"
                            style={{ background: "rgb(68, 65, 162)" }}
                          >
                            {lyearbqtytotal === 0
                              ? 0
                              : "$ " +
                                (lyearbprofittotal / lyearbqtytotal).toFixed(0)}
                          </td>
                        </tr>
                      </tbody>
                    </table>,
                  ];
                })
              : ""}
          </div>
        </div>
        <div className="budgetbyprod">
          <h4>Budget Summary Figures 2024</h4>

          <div className="bdgtsummarybuttons1">
            <p>Level 1:</p>
            <button
              onClick={(e) => {
                setSummarygroupby1("region");
                setClickedlevel1(1);
              }}
              className={1 === clickedlevel1 ? "bdgtlvl1active" : ""}
            >
              Region
            </button>
            <button
              onClick={(e) => {
                setSummarygroupby1("productGroup");
                setClickedlevel1(2);
              }}
              className={2 === clickedlevel1 ? "bdgtlvl1active" : ""}
            >
              Group
            </button>
            <button
              onClick={(e) => {
                setSummarygroupby1("prodCatName");
                setClickedlevel1(3);
              }}
              className={3 === clickedlevel1 ? "bdgtlvl1active" : ""}
            >
              Category
            </button>
            <button
              onClick={(e) => {
                setSummarygroupby1("abbreviation");
                setClickedlevel1(4);
              }}
              className={4 === clickedlevel1 ? "bdgtlvl1active" : ""}
            >
              Name
            </button>
            <button
              onClick={(e) => {
                setSummarygroupby1("country");
                setClickedlevel1(5);
              }}
              className={5 === clickedlevel1 ? "bdgtlvl1active" : ""}
            >
              Country
            </button>
          </div>
          <div className="bdgtsummarybuttons2">
            <p>Level 2:</p>
            <button
              onClick={(e) => {
                setSummarygroupby2("region");
                setClickedlevel2(1);
              }}
              className={1 === clickedlevel2 ? "bdgtlvl2active" : ""}
            >
              Region
            </button>
            <button
              onClick={(e) => {
                setSummarygroupby2("productGroup");
                setClickedlevel2(2);
              }}
              className={2 === clickedlevel2 ? "bdgtlvl2active" : ""}
            >
              Group
            </button>
            <button
              onClick={(e) => {
                setSummarygroupby2("prodCatName");
                setClickedlevel2(3);
              }}
              className={3 === clickedlevel2 ? "bdgtlvl2active" : ""}
            >
              Category
            </button>
            <button
              onClick={(e) => {
                setSummarygroupby2("abbreviation");
                setClickedlevel2(4);
              }}
              className={4 === clickedlevel2 ? "bdgtlvl2active" : ""}
            >
              Name
            </button>
            <button
              onClick={(e) => {
                setSummarygroupby2("country");
                setClickedlevel2(5);
              }}
              className={5 === clickedlevel2 ? "bdgtlvl2active" : ""}
            >
              Country
            </button>
          </div>
          <div className="bdgtsummarybuttons">
            <p>Show:</p>
            <button
              onClick={(e) => {
                setSummarygroupby3("quantity");
                setClickedlevel3(1);
              }}
              className={1 === clickedlevel3 ? "bdgtlvl3active" : ""}
            >
              Quantity (mt)
            </button>
            <button
              onClick={(e) => {
                setSummarygroupby3("profit");
                setClickedlevel3(2);
              }}
              className={2 === clickedlevel3 ? "bdgtlvl3active" : ""}
            >
              Profit ($)
            </button>
            <button
              onClick={(e) => {
                setSummarygroupby3("avgprofit");
                setClickedlevel3(3);
              }}
              className={3 === clickedlevel3 ? "bdgtlvl3active" : ""}
            >
              Avg. Profit ($)
            </button>
            <button
              onClick={(e) => {
                setSummarygroupby3("margin");
                setClickedlevel3(4);
              }}
              className={4 === clickedlevel3 ? "bdgtlvl3active" : ""}
            >
              Margin (%)
            </button>
          </div>
          <ul className="bdgtsummarytable">
            <li className="stblrow stblheader">
              <p className="stblcollarge">Country</p>
              <p className="stblfig">Q1</p>
              <p className="stblfig">Q2</p>
              <p className="stblfig">Q3</p>
              <p className="stblfig">Q4</p>
              <p className="stblfig">Total</p>
            </li>
            <div className="bdgtsummarydata">
              {bdgtregiondta
                ? Object.entries(bdgtregiondta.groupBy(summarygroupby1))
                    .sort(([, a], [, b]) => {
                      if (
                        summarygroupby3 === "quantity" ||
                        summarygroupby3 === "profit"
                      ) {
                        return (
                          sumvalues(b, summarygroupby3) -
                          sumvalues(a, summarygroupby3)
                        );
                      }
                      if (summarygroupby3 === "avgprofit") {
                        return (
                          calcavg(b, "profit", "quantity") -
                          calcavg(a, "profit", "quantity")
                        );
                      }
                      if (summarygroupby3 === "margin") {
                        // console.log(calcavg(b, "revenue", "quantity"));
                        return (
                          calcavg(b, "profit", "revenue") -
                          calcavg(a, "profit", "revenue")
                        );
                      }
                    })
                    .map((reg, key) => {
                      let q1 = 0;
                      let q2 = 0;
                      let q3 = 0;
                      let q4 = 0;
                      let p1 = 0;
                      let p2 = 0;
                      let p3 = 0;
                      let p4 = 0;
                      let r1 = 0;
                      let r2 = 0;
                      let r3 = 0;
                      let r4 = 0;

                      reg[1].forEach((regel) => {
                        // if (regel["quarter"] === 1) {
                        //   q1 = q1 + regel[summarygroupby3];
                        // }
                        // if (regel["quarter"] === 2) {
                        //   q2 = q2 + regel[summarygroupby3];
                        // }
                        // if (regel["quarter"] === 3) {
                        //   q3 = q3 + regel[summarygroupby3];
                        // }
                        // if (regel["quarter"] === 4) {
                        //   q4 = q4 + regel[summarygroupby3];
                        // }
                        if (regel["quarter"] === 1) {
                          q1 = q1 + regel["quantity"];
                          p1 = p1 + regel["profit"];
                          r1 = r1 + regel["revenue"];
                        }
                        if (regel["quarter"] === 2) {
                          q2 = q2 + regel["quantity"];
                          p2 = p2 + regel["profit"];
                          r2 = r2 + regel["revenue"];
                        }
                        if (regel["quarter"] === 3) {
                          q3 = q3 + regel["quantity"];
                          p3 = p3 + regel["profit"];
                          r3 = r3 + regel["revenue"];
                        }
                        if (regel["quarter"] === 4) {
                          q4 = q4 + regel["quantity"];
                          p4 = p4 + regel["profit"];
                          r4 = r4 + regel["revenue"];
                        }
                        // let q1total = 0;
                        // q2total = 0;
                        // q3total = 0;
                        // q4total = 0;
                      });
                      return [
                        <Accordion className="bdgtacc" allowZeroExpanded={true}>
                          <AccordionItem style={{ border: "none" }}>
                            <AccordionItemHeading>
                              <AccordionItemButton className="bsummaccordion_button">
                                <li className="stblrow">
                                  <p className="stblcollarge">
                                    {reg[0] === "Latin America"
                                      ? "L. America"
                                      : reg[0] === "Dominican Republic"
                                      ? "Dom Rep"
                                      : reg[0]}
                                  </p>
                                  <p className="stblfig">
                                    {summarygroupby3 === "quantity"
                                      ? q1
                                          .toFixed(0)
                                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                      : summarygroupby3 === "profit"
                                      ? "$" +
                                        p1
                                          .toFixed(0)
                                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                      : p1 !== 0 &&
                                        q1 !== 0 &&
                                        summarygroupby3 === "avgprofit"
                                      ? "$" +
                                        (p1 / q1)
                                          .toFixed(0)
                                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                      : p1 !== 0 &&
                                        q1 !== 0 &&
                                        summarygroupby3 === "margin"
                                      ? ((p1 / r1) * 100)
                                          .toFixed(1)
                                          .replace(
                                            /\B(?=(\d{3})+(?!\d))/g,
                                            ","
                                          ) + "%"
                                      : "-"}
                                  </p>
                                  <p className="stblfig">
                                    {summarygroupby3 === "quantity"
                                      ? q2
                                          .toFixed(0)
                                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                      : summarygroupby3 === "profit"
                                      ? "$ " +
                                        p2
                                          .toFixed(0)
                                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                      : p2 !== 0 &&
                                        q2 !== 0 &&
                                        summarygroupby3 === "avgprofit"
                                      ? "$" +
                                        (p2 / q2)
                                          .toFixed(0)
                                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                      : p2 !== 0 &&
                                        q2 !== 0 &&
                                        summarygroupby3 === "margin"
                                      ? ((p2 / r2) * 100)
                                          .toFixed(1)
                                          .replace(
                                            /\B(?=(\d{3})+(?!\d))/g,
                                            ","
                                          ) + "%"
                                      : "-"}
                                  </p>
                                  <p className="stblfig">
                                    {summarygroupby3 === "quantity"
                                      ? q3
                                          .toFixed(0)
                                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                      : summarygroupby3 === "profit"
                                      ? "$ " +
                                        p3
                                          .toFixed(0)
                                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                      : p3 !== 0 &&
                                        q3 !== 0 &&
                                        summarygroupby3 === "avgprofit"
                                      ? "$" +
                                        (p3 / q3)
                                          .toFixed(0)
                                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                      : p3 !== 0 &&
                                        q3 !== 0 &&
                                        summarygroupby3 === "margin"
                                      ? ((p3 / r3) * 100)
                                          .toFixed(1)
                                          .replace(
                                            /\B(?=(\d{3})+(?!\d))/g,
                                            ","
                                          ) + "%"
                                      : "-"}
                                  </p>
                                  <p className="stblfig">
                                    {summarygroupby3 === "quantity"
                                      ? q4
                                          .toFixed(0)
                                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                      : summarygroupby3 === "profit"
                                      ? "$ " +
                                        p4
                                          .toFixed(0)
                                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                      : p4 !== 0 &&
                                        q4 !== 0 &&
                                        summarygroupby3 === "avgprofit"
                                      ? "$" +
                                        (p4 / q4)
                                          .toFixed(0)
                                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                      : p4 !== 0 &&
                                        q4 !== 0 &&
                                        summarygroupby3 === "margin"
                                      ? ((p4 / r4) * 100)
                                          .toFixed(1)
                                          .replace(
                                            /\B(?=(\d{3})+(?!\d))/g,
                                            ","
                                          ) + "%"
                                      : "-"}
                                  </p>
                                  <p className="stblfig stbltotal">
                                    {summarygroupby3 === "quantity"
                                      ? (q1 + q2 + q3 + q4)
                                          .toFixed(0)
                                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                      : summarygroupby3 === "profit"
                                      ? "$ " +
                                        (p1 + p2 + p3 + p4)
                                          .toFixed(0)
                                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                      : p1 + p2 + p3 + p4 !== 0 &&
                                        q1 + q2 + q3 + q4 !== 0 &&
                                        summarygroupby3 === "avgprofit"
                                      ? "$" +
                                        (
                                          (p1 + p2 + p3 + p4) /
                                          (q1 + q2 + q3 + q4)
                                        )
                                          .toFixed(0)
                                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                      : p1 + p2 + p3 + p4 !== 0 &&
                                        r1 + r2 + r3 + r4 !== 0 &&
                                        summarygroupby3 === "margin"
                                      ? (
                                          ((p1 + p2 + p3 + p4) /
                                            (r1 + r2 + r3 + r4)) *
                                          100
                                        )
                                          .toFixed(1)
                                          .replace(
                                            /\B(?=(\d{3})+(?!\d))/g,
                                            ","
                                          ) + "%"
                                      : "-"}
                                  </p>
                                </li>
                              </AccordionItemButton>
                            </AccordionItemHeading>
                            {
                              <AccordionItemPanel className="bdgtaccpanel">
                                {Object.entries(reg[1].groupBy(summarygroupby2))
                                  .sort(([, a], [, b]) => {
                                    if (
                                      summarygroupby3 === "quantity" ||
                                      summarygroupby3 === "profit"
                                    ) {
                                      return (
                                        sumvalues(b, summarygroupby3) -
                                        sumvalues(a, summarygroupby3)
                                      );
                                    }
                                    if (summarygroupby3 === "avgprofit") {
                                      return (
                                        calcavg(b, "profit", "quantity") -
                                        calcavg(a, "profit", "quantity")
                                      );
                                    }
                                    if (summarygroupby3 === "margin") {
                                      // console.log(calcavg(b, "revenue", "quantity"));
                                      return (
                                        calcavg(b, "profit", "revenue") -
                                        calcavg(a, "profit", "revenue")
                                      );
                                    }
                                  })
                                  .map((cty) => {
                                    let q21 = 0;
                                    let q22 = 0;
                                    let q23 = 0;
                                    let q24 = 0;
                                    let p21 = 0;
                                    let p22 = 0;
                                    let p23 = 0;
                                    let p24 = 0;
                                    let r21 = 0;
                                    let r22 = 0;
                                    let r23 = 0;
                                    let r24 = 0;
                                    cty[1].forEach((ctyel) => {
                                      // if (ctyel["quarter"] === 1) {
                                      //   q21 = q21 + ctyel[summarygroupby3];
                                      //   q1total =
                                      //     q1total + ctyel[summarygroupby3];
                                      // }
                                      // if (ctyel["quarter"] === 2) {
                                      //   q22 = q22 + ctyel[summarygroupby3];
                                      //   q2total =
                                      //     q2total + ctyel[summarygroupby3];
                                      // }
                                      // if (ctyel["quarter"] === 3) {
                                      //   q23 = q23 + ctyel[summarygroupby3];
                                      //   q3total =
                                      //     q3total + ctyel[summarygroupby3];
                                      // }
                                      // if (ctyel["quarter"] === 4) {
                                      //   q24 = q24 + ctyel[summarygroupby3];
                                      //   q4total =
                                      //     q4total + ctyel[summarygroupby3];
                                      // }

                                      if (ctyel["quarter"] === 1) {
                                        q21 = q21 + ctyel["quantity"];
                                        p21 = p21 + ctyel["profit"];
                                        r21 = r21 + ctyel["revenue"];
                                        q1total = q1total + ctyel["quantity"];
                                        p1total = p1total + ctyel["profit"];
                                        r1total = r1total + ctyel["revenue"];
                                      }
                                      if (ctyel["quarter"] === 2) {
                                        q22 = q22 + ctyel["quantity"];
                                        p22 = p22 + ctyel["profit"];
                                        r22 = r22 + ctyel["revenue"];

                                        q2total = q2total + ctyel["quantity"];
                                        p2total = p2total + ctyel["profit"];
                                        r2total = r2total + ctyel["revenue"];
                                      }
                                      if (ctyel["quarter"] === 3) {
                                        q23 = q23 + ctyel["quantity"];
                                        p23 = p23 + ctyel["profit"];
                                        r23 = r23 + ctyel["revenue"];

                                        q3total = q3total + ctyel["quantity"];
                                        p3total = p3total + ctyel["profit"];
                                        r3total = r3total + ctyel["revenue"];
                                      }
                                      if (ctyel["quarter"] === 4) {
                                        q24 = q24 + ctyel["quantity"];
                                        p24 = p24 + ctyel["profit"];
                                        r24 = r24 + ctyel["revenue"];

                                        q4total = q4total + ctyel["quantity"];
                                        p4total = p4total + ctyel["profit"];
                                        r4total = r4total + ctyel["revenue"];
                                      }
                                    });

                                    return (
                                      <li className="stblrow">
                                        <p className="stblcollarge">
                                          {cty[0] === "Dominican Republic"
                                            ? "Dom Rep"
                                            : cty[0] === "Latin America"
                                            ? "L. America"
                                            : cty[0]}
                                        </p>
                                        <p className="stblfig">
                                          {summarygroupby3 === "quantity"
                                            ? q21
                                                .toFixed(0)
                                                .replace(
                                                  /\B(?=(\d{3})+(?!\d))/g,
                                                  ","
                                                )
                                            : summarygroupby3 === "profit"
                                            ? "$ " +
                                              p21
                                                .toFixed(0)
                                                .replace(
                                                  /\B(?=(\d{3})+(?!\d))/g,
                                                  ","
                                                )
                                            : p21 !== 0 &&
                                              q21 !== 0 &&
                                              summarygroupby3 === "avgprofit"
                                            ? "$ " +
                                              (p21 / q21)
                                                .toFixed(0)
                                                .replace(
                                                  /\B(?=(\d{3})+(?!\d))/g,
                                                  ","
                                                )
                                            : p21 !== 0 &&
                                              r21 !== 0 &&
                                              summarygroupby3 === "margin"
                                            ? ((p21 / r21) * 100)
                                                .toFixed(1)
                                                .replace(
                                                  /\B(?=(\d{3})+(?!\d))/g,
                                                  ","
                                                ) + "%"
                                            : "-"}
                                        </p>
                                        <p className="stblfig">
                                          {summarygroupby3 === "quantity"
                                            ? q22
                                                .toFixed(0)
                                                .replace(
                                                  /\B(?=(\d{3})+(?!\d))/g,
                                                  ","
                                                )
                                            : summarygroupby3 === "profit"
                                            ? "$ " +
                                              p22
                                                .toFixed(0)
                                                .replace(
                                                  /\B(?=(\d{3})+(?!\d))/g,
                                                  ","
                                                )
                                            : p22 !== 0 &&
                                              q22 !== 0 &&
                                              summarygroupby3 === "avgprofit"
                                            ? "$ " +
                                              (p22 / q22)
                                                .toFixed(0)
                                                .replace(
                                                  /\B(?=(\d{3})+(?!\d))/g,
                                                  ","
                                                )
                                            : p22 !== 0 &&
                                              r22 !== 0 &&
                                              summarygroupby3 === "margin"
                                            ? ((p22 / r22) * 100)
                                                .toFixed(1)
                                                .replace(
                                                  /\B(?=(\d{3})+(?!\d))/g,
                                                  ","
                                                ) + "%"
                                            : "-"}
                                        </p>
                                        <p className="stblfig">
                                          {summarygroupby3 === "quantity"
                                            ? q23
                                                .toFixed(0)
                                                .replace(
                                                  /\B(?=(\d{3})+(?!\d))/g,
                                                  ","
                                                )
                                            : summarygroupby3 === "profit"
                                            ? "$ " +
                                              p23
                                                .toFixed(0)
                                                .replace(
                                                  /\B(?=(\d{3})+(?!\d))/g,
                                                  ","
                                                )
                                            : p23 !== 0 &&
                                              q23 !== 0 &&
                                              summarygroupby3 === "avgprofit"
                                            ? "$ " +
                                              (p23 / q23)
                                                .toFixed(0)
                                                .replace(
                                                  /\B(?=(\d{3})+(?!\d))/g,
                                                  ","
                                                )
                                            : p23 !== 0 &&
                                              r23 !== 0 &&
                                              summarygroupby3 === "margin"
                                            ? ((p23 / r23) * 100)
                                                .toFixed(1)
                                                .replace(
                                                  /\B(?=(\d{3})+(?!\d))/g,
                                                  ","
                                                ) + "%"
                                            : "-"}
                                        </p>
                                        <p className="stblfig">
                                          {summarygroupby3 === "quantity"
                                            ? q24
                                                .toFixed(0)
                                                .replace(
                                                  /\B(?=(\d{3})+(?!\d))/g,
                                                  ","
                                                )
                                            : summarygroupby3 === "profit"
                                            ? "$ " +
                                              p24
                                                .toFixed(0)
                                                .replace(
                                                  /\B(?=(\d{3})+(?!\d))/g,
                                                  ","
                                                )
                                            : p24 !== 0 &&
                                              q24 !== 0 &&
                                              summarygroupby3 === "avgprofit"
                                            ? "$ " +
                                              (p24 / q24)
                                                .toFixed(0)
                                                .replace(
                                                  /\B(?=(\d{3})+(?!\d))/g,
                                                  ","
                                                )
                                            : p24 !== 0 &&
                                              r24 !== 0 &&
                                              summarygroupby3 === "margin"
                                            ? ((p24 / r24) * 100)
                                                .toFixed(1)
                                                .replace(
                                                  /\B(?=(\d{3})+(?!\d))/g,
                                                  ","
                                                ) + "%"
                                            : "-"}
                                        </p>
                                        <p className="stblfig stbltotal">
                                          {summarygroupby3 === "quantity"
                                            ? (q21 + q22 + q23 + q24)
                                                .toFixed(0)
                                                .replace(
                                                  /\B(?=(\d{3})+(?!\d))/g,
                                                  ","
                                                )
                                            : summarygroupby3 === "profit"
                                            ? "$ " +
                                              (p21 + p22 + p23 + p24)
                                                .toFixed(0)
                                                .replace(
                                                  /\B(?=(\d{3})+(?!\d))/g,
                                                  ","
                                                )
                                            : p21 + p22 + p23 + p24 !== 0 &&
                                              q21 + q22 + q23 + q24 !== 0 &&
                                              summarygroupby3 === "avgprofit"
                                            ? "$ " +
                                              (
                                                (p21 + p22 + p23 + p24) /
                                                (q21 + q22 + q23 + q24)
                                              )
                                                .toFixed(0)
                                                .replace(
                                                  /\B(?=(\d{3})+(?!\d))/g,
                                                  ","
                                                )
                                            : p21 + p22 + p23 + p24 !== 0 &&
                                              r21 + r22 + r23 + r24 !== 0 &&
                                              summarygroupby3 === "margin"
                                            ? (
                                                ((p21 + p22 + p23 + p24) /
                                                  (r21 + r22 + r23 + r24)) *
                                                100
                                              )
                                                .toFixed(1)
                                                .replace(
                                                  /\B(?=(\d{3})+(?!\d))/g,
                                                  ","
                                                ) + "%"
                                            : "-"}
                                        </p>
                                      </li>
                                    );
                                  })}
                              </AccordionItemPanel>
                            }
                          </AccordionItem>
                        </Accordion>,
                      ];
                    })
                : ""}
              <li className="stblrow stblfooter">
                <p className="stblcollarge  stbltotal">TOTAL</p>
                <p className="stblfig stbltotal">
                  {summarygroupby3 === "quantity"
                    ? q1total.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    : summarygroupby3 === "profit"
                    ? "$ " +
                      p1total.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    : q1total !== 0 &&
                      p1total !== 0 &&
                      summarygroupby3 === "avgprofit"
                    ? "$" +
                      (p1total / q1total)
                        .toFixed(0)
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    : q1total !== 0 &&
                      r1total !== 0 &&
                      summarygroupby3 === "margin"
                    ? ((p1total / r1total) * 100)
                        .toFixed(1)
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "%"
                    : "-"}
                </p>
                <p className="stblfig stbltotal">
                  {summarygroupby3 === "quantity"
                    ? q2total.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    : summarygroupby3 === "profit"
                    ? "$ " +
                      p2total.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    : q2total !== 0 &&
                      p2total !== 0 &&
                      summarygroupby3 === "avgprofit"
                    ? "$" +
                      (p2total / q2total)
                        .toFixed(0)
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    : r2total !== 0 &&
                      p2total !== 0 &&
                      summarygroupby3 === "margin"
                    ? ((p2total / r2total) * 100)
                        .toFixed(1)
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "%"
                    : "-"}
                </p>
                <p className="stblfig stbltotal">
                  {summarygroupby3 === "quantity"
                    ? q3total.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    : summarygroupby3 === "profit"
                    ? "$ " +
                      p3total.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    : q3total !== 0 &&
                      p3total !== 0 &&
                      summarygroupby3 === "avgprofit"
                    ? "$" +
                      (p3total / q3total)
                        .toFixed(0)
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    : r3total !== 0 &&
                      p3total !== 0 &&
                      summarygroupby3 === "margin"
                    ? ((p3total / r3total) * 100)
                        .toFixed(1)
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "%"
                    : "-"}
                </p>
                <p className="stblfig stbltotal">
                  {summarygroupby3 === "quantity"
                    ? q4total.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    : summarygroupby3 === "profit"
                    ? "$ " +
                      p4total.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    : q4total !== 0 &&
                      p4total !== 0 &&
                      summarygroupby3 === "avgprofit"
                    ? "$" +
                      (p4total / q4total)
                        .toFixed(0)
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    : r4total !== 0 &&
                      p4total !== 0 &&
                      summarygroupby3 === "margin"
                    ? ((p4total / r4total) * 100)
                        .toFixed(1)
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "%"
                    : "-"}
                </p>
                <p className="stblfig stbltotal">
                  {summarygroupby3 === "quantity"
                    ? (q1total + q2total + q3total + q4total)
                        .toFixed(0)
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    : summarygroupby3 === "profit"
                    ? "$ " +
                      (p1total + p2total + p3total + p4total)
                        .toFixed(0)
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    : q1total + q2total + q3total + q4total !== 0 &&
                      p1total + p2total + p3total + p4total !== 0 &&
                      summarygroupby3 === "avgprofit"
                    ? "$" +
                      (
                        (p1total + p2total + p3total + p4total) /
                        (q1total + q2total + q3total + q4total)
                      )
                        .toFixed(0)
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    : r1total + r2total + r3total + r4total !== 0 &&
                      p1total + p2total + p3total + p4total !== 0 &&
                      summarygroupby3 === "margin"
                    ? (
                        ((p1total + p2total + p3total + p4total) /
                          (r1total + r2total + r3total + r4total)) *
                        100
                      )
                        .toFixed(1)
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "%"
                    : "-"}
                </p>
              </li>
            </div>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Budget2024a;
