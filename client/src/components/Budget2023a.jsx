import React, { useEffect, useState, useRef, useCallback } from "react";
import Axios from "axios";
import { gsap } from "gsap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { faMinusCircle } from "@fortawesome/free-solid-svg-icons";

const Budget2023 = () => {
  const refresmsg = useRef(null);
  const [showmsg, setShowmsg] = useState(false);

  const onComplete = () => {
    setBdgtresponsemsg("");
  };

  const [bdgtyear, setBdgtyear] = useState(2022);

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
      console.log(response);
      setUpdatebuttons(!updatebuttons);
    });
    setShowprodnamefilter(false);
  };

  useEffect(() => {
    Axios.post("/budgetfilterbtns", { year: bdgtyear }).then((resp) => {
      setBudgetbtns(resp.data);
      // console.log(resp.data);
      setProdgroupsbtn([...new Set(resp.data.map((x) => x.productGroup))]);
    });
  }, [updatebuttons]);

  const [numRows, setNumRows] = useState(19);
  const [numCols, setNumCols] = useState(4);

  // const [numRows, numCols] = [19, 4]; // No magic numbers
  const [activeIndex, setActiveIndex] = useState(-1); // Track which cell to highlight
  const [isNavigating, setIsNavigating] = useState(false); // Track navigation
  const [isEditing, setIsEditing] = useState(false); // Track editing
  const [values, setValues] = useState([]); // Track input values
  const boardRef = useRef(); // For setting/ unsetting navigation
  const inputRefs = useRef([]); // For setting / unsetting input focus

  const handleChange1 = (e, prod, reg, cty, qtr) => {
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
  };

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

  const handleKeyDown = useCallback((e) => {
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

  const [clickedProdGroup, setClickedProdGroup] = useState();

  const [selectedPG, setSelectedPG] = useState();

  const handleProdGroupClick = (e, i, item) => {
    e.preventDefault();
    setClickedProdGroup(i);
    setSelectedPG(item);
  };

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
    // console.log(Object.keys(allvalues));
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
            quantity: Number(ctyel["quantity"]),
            avgprice: Number(ctyel["avgprice"]),
            avgprofit: Number(ctyel["avgprofit"]),
          };
        });
        reglevel[regind] = ctylevel;
        ctylevel = {};
      });
      prodlevel[prodind] = reglevel;
      reglevel = {};
    });
    return prodlevel;
  };

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
      });
      Axios.post("/budgetlyearsales", {
        year: bdgtyear,
        prodcat: activePCatName,
      }).then((response) => {
        // setBdgtlyearsales(response.data);
        setBdgtlyearsales(formatsaleslastyeardata(response.data));
      });
    }
  }, [activePCatName, reloadbdgdata]);

  const handleProdCatClick = (e, i, item) => {
    e.preventDefault();
    setClickedProdCat(i);
    // setSelectedPN(item.prodCatName);
    setActivePCatName(item.prodCatNameID);
  };

  let ind = 0;
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

  useEffect(() => {
    Axios.post("/yearbudgetdata", { year: bdgtyear }).then((response) => {
      setYearbudgetdata(response.data);
    });
  }, []);

  return (
    <div>
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
                        <label for={item.prodNameID}>{item.abbreviation}</label>
                      </div>,
                    ];
                  })
                : "loading"}
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
      <div className="budgetfilterbuttons">
        <div className="pgroupfbtns">
          <p>Product Groups:</p>
          {prodgroupsbtn
            ? prodgroupsbtn.map((item, i) => {
                return (
                  <button
                    key={i}
                    onClick={(e) => handleProdGroupClick(e, i, item)}
                    className={
                      i === clickedProdGroup
                        ? "budgetfilterbutton budgetfilterbuttonactive"
                        : "budgetfilterbutton"
                    }
                  >
                    {item}
                  </button>
                );
              })
            : "Loading"}
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
                      {item.prodCatName}
                    </button>
                  );
                }
              })
            : "Loading"}
        </div>
      </div>
      <div className="budgetprepdata">
        <div className="budgettablesandresponse">
          <div className="budgettables" ref={boardRef}>
            {formatedData
              ? Object.keys(formatedData).map((prod, key) => {
                  let q1prodtotal = 0;
                  let q2prodtotal = 0;
                  let q3prodtotal = 0;
                  let q4prodtotal = 0;
                  return [
                    <div className="bdgtpnametable">
                      <div className="bdgtpnametabletitle">
                        <h3>{prod}</h3>
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
                                            setProdcountriestoadd((current) => {
                                              const copy = {
                                                ...current,
                                              };
                                              delete copy[prod][
                                                ctyel.countryID
                                              ];
                                              return copy;
                                            });
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
                            </tr>
                          </thead>
                          <tbody>
                            {Object.keys(formatedData[prod]).map(
                              (reg, key1) => {
                                let q1reg = 0;
                                let q2reg = 0;
                                let q3reg = 0;
                                let q4reg = 0;

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
                                  }
                                );
                                q1prodtotal = q1prodtotal + q1reg;
                                q2prodtotal = q2prodtotal + q2reg;
                                q3prodtotal = q3prodtotal + q3reg;
                                q4prodtotal = q4prodtotal + q4reg;

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
                                            ? loadregcties[reg][0].map((el) => (
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
                                                        setProdcountriestoadd({
                                                          ...prodcountriestoadd,
                                                          [prod]: {
                                                            ...prodcountriestoadd[
                                                              prod
                                                            ],
                                                            [el.countryID]:
                                                              el.country,
                                                          },
                                                        });
                                                      } else {
                                                        setProdcountriestoadd(
                                                          (current) => {
                                                            const copy = {
                                                              ...current,
                                                            };
                                                            delete copy[prod][
                                                              el.countryID
                                                            ];
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
                                              ))
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
                                                  [reg]: !showaddcty[prod][reg],
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
                                  </tr>,
                                  Object.keys(formatedData[prod][reg]).map(
                                    (cty) => {
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
                                              <td className="bdgtdatacol">
                                                <div
                                                  className={`tile ${
                                                    activeIndex === index
                                                      ? "active"
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
                                                    className="cell-input"
                                                    onFocus={(e) => {
                                                      setActiveIndex(index);
                                                      e.target.select();
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
                                                  />
                                                </div>
                                              </td>,
                                            ];
                                          })}
                                          <td className="bdgtcountrytotals">
                                            {formatedData[prod][reg][cty]["0"] +
                                              formatedData[prod][reg][cty][
                                                "1"
                                              ] +
                                              formatedData[prod][reg][cty][
                                                "2"
                                              ] +
                                              formatedData[prod][reg][cty]["3"]}
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
                                              showdelctybtns[prod][reg][cty] ===
                                                true
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
                        Object.keys(formatedData[prod][reg]).forEach((ctry) => {
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
                                bdgtlyearsales[prod][reg][ctry]["avgprofit"];
                          }
                        });
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
                                    ? bdgtlyearsales[prod][reg][cty]["quantity"]
                                    : 0}
                                </td>
                                <td className="lyeardata">
                                  {bdgtlyearsales &&
                                  bdgtlyearsales[prod] &&
                                  bdgtlyearsales[prod][reg] &&
                                  bdgtlyearsales[prod][reg][cty] &&
                                  bdgtlyearsales[prod][reg][cty]["avgprice"]
                                    ? "$ " +
                                      bdgtlyearsales[prod][reg][cty]["avgprice"]
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
                        <td className="lyearcountrycolttl">Total</td>
                        <td className="lyeardatattl">{lyearqtytotal}</td>
                        <td className="lyeardatattl">
                          {"$ " + (lyearpricetotal / lyearqtytotal).toFixed(0)}
                        </td>
                        <td className="lyeardatattl">
                          {"$ " + (lyearprofittotal / lyearqtytotal).toFixed(0)}
                        </td>
                      </tr>
                    </tbody>
                  </table>,
                ];
              })
            : ""}
        </div>
        <div className="budgetbyprod">
          <h4>{bdgtyear} Budget Summary</h4>
          {yearbudgetdata
            ? yearbudgetdata.map((ybd) => (
                <li>
                  <p>{ybd.prodCatName}</p>
                  <p>{ybd.quantity}</p>
                </li>
              ))
            : ""}
        </div>
      </div>
      {/* <div className="board" ref={boardRef}>
        <table>
          <tbody>{rows}</tbody>
        </table>
      </div> */}
    </div>
  );
};

export default Budget2023;