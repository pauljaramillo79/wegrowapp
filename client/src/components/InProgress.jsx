import React, { useState, useEffect, useContext } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import Axios from "axios";
import "./InProgress.css";
import { LogisticsContext } from "../contexts/LogisticsProvider";

const ResponsiveGridLayout = WidthProvider(Responsive);

const InProgress = () => {
  const { updateScores, setUpdateScores } = useContext(LogisticsContext);

  const initlayout = {
    lg: [{ i: "h", x: 0, y: 0, w: 30, h: 14 }],
    md: [{ i: "h", x: 0, y: 0, w: 30, h: 14 }],
    sm: [{ i: "h", x: 0, y: 0, w: 30, h: 14 }],
    xs: [{ i: "h", x: 0, y: 0, w: 30, h: 14 }],
    xxs: [{ i: "h", x: 0, y: 0, w: 30, h: 14 }],
  };

  const getFromLS = (key) => {
    let ls = {};
    if (global.localStorage) {
      try {
        ls = JSON.parse(global.localStorage.getItem("rgl-inprogress")) || {};
      } catch (e) {}
    }
    return ls[key];
  };
  const saveToLS = (key, value) => {
    if (global.localStorage) {
      global.localStorage.setItem(
        "rgl-inprogress",
        JSON.stringify({ [key]: value })
      );
    }
  };
  const onLayoutChange = (layout, layouts) => {
    saveToLS("layouts", layouts);
    setLayouts(layouts);
  };
  const originalLayout = getFromLS("layouts") || initlayout;
  const [layouts, setLayouts] = useState(originalLayout);

  const [inprogresslist, setInprogresslist] = useState();
  const [assignedlist, setAssignedlist] = useState();
  const [trafficmgrs, setTrafficmgrs] = useState();

  const [assignments1, setAssignments1] = useState([]);
  const [assignments2, setAssignments2] = useState([]);

  const [assignedmsg, setAssignedmsg] = useState();

  const [updateassignments, setUpdateassignments] = useState(false);

  useEffect(() => {
    Axios.post("/trafficmgrs").then((response) => {
      setTrafficmgrs(response.data);
    });
  }, []);

  useEffect(() => {
    Axios.post("/salesinprogress").then((response) => {
      setInprogresslist(response.data);
      console.log(response.data[0]);
    });
    Axios.post("/salesinprogressassigned").then((response) => {
      setAssignedlist(response.data);
    });
  }, [updateScores]);

  const saveAssignment = (qsid, tmc) => {
    Axios.post("/saveassignment", {
      qsid: qsid,
      datapacket: assignments1[qsid],
    }).then((response) => {
      setAssignedmsg(response.data);
      setUpdateScores(!updateScores);
      // setUpdateassignments(!updateassignments);
    });
  };

  const [editing, setEditing] = useState([]);

  const addChange = (e, QSID) => {
    setAssignments1({
      ...assignments1,
      [QSID]: {
        ...assignments1[QSID],
        [e.target.name]: e.target.value,
      },
    });
  };

  return (
    <ResponsiveGridLayout
      className="layout"
      style={{ left: "2px" }}
      breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
      layouts={layouts}
      cols={{ lg: 36, md: 36, sm: 36, xs: 36, xxs: 2 }}
      rowHeight={30}
      onLayoutChange={(layout, layouts) => {
        onLayoutChange(layout, layouts);
      }}
      margin={[20, 20]}
      draggableCancel=".canceldrag"
    >
      <div id="inprogress" key="h">
        <div className="matchreporttitle">
          <h3>Operations In Progress</h3>
        </div>
        <ul className="inprogresslist">
          <h4>Unassigned</h4>
          <li className="inprogresslist-header">
            <p>QSID</p>
            <p>Trader</p>
            <p>WGS</p>
            <p>WGP</p>
            <p className="inprogress-lrg-p">Product</p>
            <p className="inprogress-lrg-p">Customer</p>
            <p>Quantity</p>
            <p>P Inco</p>
            <p>S Inco</p>
            <p className="inprog-center">Inspec.</p>
            <p className="inprog-center">LC</p>
            <p className="inprog-center">WH</p>
            <p>Score</p>

            <p>TMC</p>
          </li>
          {inprogresslist
            ? inprogresslist.map((item) => {
                let x = 0;
                if (item.pincoterms === "CPT" || item.pincoterms === "CFR") {
                  x += 1;
                } else if (
                  item.pincoterms === "FOB" ||
                  item.pincoterms === "CIP" ||
                  item.pincoterms === "CIF"
                ) {
                  x += 2;
                }
                if (item.incoterms === "DAP") {
                  x += 1;
                }
                if (item.hasInspection === "yes") {
                  x += 1;
                }
                if (item.hasPromisory === "yes") {
                  x += 1;
                }
                if (item.hasWH === "yes") {
                  x += 1;
                }

                return (
                  <li>
                    <p>{item.QSID}</p>
                    <p>{item.trader}</p>
                    {editing.includes(String(item.QSID)) ? (
                      <p>
                        <input
                          className="canceldrag"
                          name="KTS"
                          type="text"
                          onChange={(e) => {
                            addChange(e, item.QSID);
                          }}
                          value={
                            (assignments1[item.QSID] &&
                              assignments1[item.QSID]["KTS"]) ||
                            (assignments1[item.QSID] &&
                              assignments1[item.QSID]["KTS"] === "")
                              ? assignments1[item.QSID]["KTS"]
                              : item.KTS
                          }
                        />
                      </p>
                    ) : (
                      <p>{item.KTS}</p>
                    )}
                    {editing.includes(String(item.QSID)) ? (
                      <p>
                        <input
                          className="canceldrag"
                          name="KTP"
                          type="text"
                          onChange={(e) => {
                            addChange(e, item.QSID);
                          }}
                          value={
                            (assignments1[item.QSID] &&
                              assignments1[item.QSID]["KTP"]) ||
                            (assignments1[item.QSID] &&
                              assignments1[item.QSID]["KTP"] === "")
                              ? assignments1[item.QSID]["KTP"]
                              : item.KTP
                          }
                        />
                      </p>
                    ) : (
                      <p>{item.KTP}</p>
                    )}

                    <p className="inprogress-lrg-p">{item.abbreviation}</p>
                    <p className="inprogress-lrg-p">{item.companyCode}</p>
                    <p>{item.quantity}</p>
                    {editing.includes(String(item.QSID)) ? (
                      <p>
                        <input
                          className="canceldrag"
                          name="pincoterms"
                          type="text"
                          onChange={(e) => {
                            addChange(e, item.QSID);
                          }}
                          value={
                            (assignments1[item.QSID] &&
                              assignments1[item.QSID]["pincoterms"]) ||
                            (assignments1[item.QSID] &&
                              assignments1[item.QSID]["pincoterms"] === "")
                              ? assignments1[item.QSID]["pincoterms"]
                              : item.pincoterms
                          }
                        />
                      </p>
                    ) : (
                      <p>{item.pincoterms}</p>
                    )}
                    {editing.includes(String(item.QSID)) ? (
                      <p>
                        <input
                          className="canceldrag"
                          name="incoterms"
                          type="text"
                          onChange={(e) => {
                            addChange(e, item.QSID);
                          }}
                          value={
                            (assignments1[item.QSID] &&
                              assignments1[item.QSID]["incoterms"]) ||
                            (assignments1[item.QSID] &&
                              assignments1[item.QSID]["incoterms"] === "")
                              ? assignments1[item.QSID]["incoterms"]
                              : item.incoterms
                          }
                        />
                      </p>
                    ) : (
                      <p>{item.incoterms}</p>
                    )}
                    {editing.includes(String(item.QSID)) ? (
                      <p className="inprog-center">
                        <input
                          type="checkbox"
                          checked={
                            !assignments1[item.QSID]
                              ? item.hasInspection === "yes"
                                ? true
                                : false
                              : assignments1[item.QSID]["hasInspectionBool"]
                          }
                          onClick={(e) => {
                            if (
                              assignments1[item.QSID] &&
                              assignments1[item.QSID]["hasInspection"]
                            ) {
                              if (
                                assignments1[item.QSID]["hasInspection"] ===
                                "yes"
                              ) {
                                console.log("heyyy");
                                setAssignments1({
                                  ...assignments1,
                                  [item.QSID]: {
                                    ...assignments1[item.QSID],
                                    ["hasInspection"]: "no",
                                    ["hasInspectionBool"]: false,
                                  },
                                });
                              } else {
                                console.log("hooo");
                                setAssignments1({
                                  ...assignments1,
                                  [item.QSID]: {
                                    ...assignments1[item.QSID],
                                    ["hasInspection"]: "yes",
                                    ["hasInspectionBool"]: true,
                                  },
                                });
                              }
                            } else {
                              if (item.hasInspection === "yes") {
                                setAssignments1({
                                  ...assignments1,
                                  [item.QSID]: {
                                    ...assignments1[item.QSID],
                                    ["hasInspection"]: "no",
                                    ["hasInspectionBool"]: false,
                                  },
                                });
                              } else {
                                setAssignments1({
                                  ...assignments1,
                                  [item.QSID]: {
                                    ...assignments1[item.QSID],
                                    ["hasInspection"]: "yes",
                                    ["hasInspectionBool"]: true,
                                  },
                                });
                              }
                            }
                          }}
                        />
                      </p>
                    ) : (
                      <p className="inprog-center">{item.hasInspection}</p>
                    )}
                    {editing.includes(String(item.QSID)) ? (
                      <p className="inprog-center">
                        <input
                          type="checkbox"
                          checked={
                            !assignments1[item.QSID]
                              ? item.hasPromisory === "yes"
                                ? true
                                : false
                              : assignments1[item.QSID]["hasPromisoryBool"]
                          }
                          onClick={(e) => {
                            if (
                              assignments1[item.QSID] &&
                              assignments1[item.QSID]["hasPromisory"]
                            ) {
                              if (
                                assignments1[item.QSID]["hasPromisory"] ===
                                "yes"
                              ) {
                                console.log("heyyy");
                                setAssignments1({
                                  ...assignments1,
                                  [item.QSID]: {
                                    ...assignments1[item.QSID],
                                    ["hasPromisory"]: "no",
                                    ["hasPromisoryBool"]: false,
                                  },
                                });
                              } else {
                                console.log("hooo");
                                setAssignments1({
                                  ...assignments1,
                                  [item.QSID]: {
                                    ...assignments1[item.QSID],
                                    ["hasPromisory"]: "yes",
                                    ["hasPromisoryBool"]: true,
                                  },
                                });
                              }
                            } else {
                              if (item.hasPromisory === "yes") {
                                setAssignments1({
                                  ...assignments1,
                                  [item.QSID]: {
                                    ...assignments1[item.QSID],
                                    ["hasPromisory"]: "no",
                                    ["hasPromisoryBool"]: false,
                                  },
                                });
                              } else {
                                setAssignments1({
                                  ...assignments1,
                                  [item.QSID]: {
                                    ...assignments1[item.QSID],
                                    ["hasPromisory"]: "yes",
                                    ["hasPromisoryBool"]: true,
                                  },
                                });
                              }
                            }
                          }}
                        />
                      </p>
                    ) : (
                      <p className="inprog-center">{item.hasPromisory}</p>
                    )}
                    {editing.includes(String(item.QSID)) ? (
                      <p className="inprog-center">
                        <input
                          type="checkbox"
                          checked={
                            !assignments1[item.QSID]
                              ? item.hasWH === "yes"
                                ? true
                                : false
                              : assignments1[item.QSID]["hasWHBool"]
                          }
                          onClick={(e) => {
                            if (
                              assignments1[item.QSID] &&
                              assignments1[item.QSID]["hasWH"]
                            ) {
                              if (assignments1[item.QSID]["hasWH"] === "yes") {
                                console.log("heyyy");
                                setAssignments1({
                                  ...assignments1,
                                  [item.QSID]: {
                                    ...assignments1[item.QSID],
                                    ["hasWH"]: "no",
                                    ["hasWHBool"]: false,
                                  },
                                });
                              } else {
                                console.log("hooo");
                                setAssignments1({
                                  ...assignments1,
                                  [item.QSID]: {
                                    ...assignments1[item.QSID],
                                    ["hasWH"]: "yes",
                                    ["hasWHBool"]: true,
                                  },
                                });
                              }
                            } else {
                              if (item.hasWH === "yes") {
                                setAssignments1({
                                  ...assignments1,
                                  [item.QSID]: {
                                    ...assignments1[item.QSID],
                                    ["hasWH"]: "no",
                                    ["hasWHBool"]: false,
                                  },
                                });
                              } else {
                                setAssignments1({
                                  ...assignments1,
                                  [item.QSID]: {
                                    ...assignments1[item.QSID],
                                    ["hasWH"]: "yes",
                                    ["hasWHBool"]: true,
                                  },
                                });
                              }
                            }
                          }}
                        />
                      </p>
                    ) : (
                      <p className="inprog-center">{item.hasWH}</p>
                    )}
                    <p>{x.toFixed(1)}</p>
                    {editing.includes(String(item.QSID)) ? (
                      <select
                        className="inprogress-med-p"
                        name={item.QSID}
                        onChange={(e) => {
                          setAssignments1({
                            ...assignments1,
                            [e.target.name]: {
                              ...assignments1[e.target.name],
                              trafficID: Number(e.target.value),
                            },
                          });
                        }}
                        value={
                          (assignments1[item.QSID] &&
                            assignments1[item.QSID]["trafficID"]) ||
                          (assignments1[item.QSID] &&
                            assignments1[item.QSID]["trafficID"] === 0)
                            ? assignments1[item.QSID]["trafficID"]
                            : item.trafficID
                        }
                      >
                        <option>Select...</option>
                        {trafficmgrs
                          ? trafficmgrs.map((item1) => {
                              return (
                                <option selected={"na"} value={item1.trafficID}>
                                  {item1.trafficID} - {item1.traffic}
                                </option>
                              );
                            })
                          : ""}
                      </select>
                    ) : (
                      <p className="inprogress-med-p">{item.traffic}</p>
                    )}
                    {editing.includes(String(item.QSID)) ? (
                      ""
                    ) : (
                      <button
                        name={item.QSID}
                        onClick={(e) =>
                          editing.includes(e.target.name)
                            ? ""
                            : setEditing([...editing, e.target.name])
                        }
                      >
                        Edit
                      </button>
                    )}
                    {/* {Object.keys(assignments1).includes(String(item.QSID))
                     */}
                    {editing.includes(String(item.QSID))
                      ? [
                          <button
                            className="inprogsavebtn"
                            name={item.QSID}
                            onClick={(e) => {
                              e.preventDefault();
                              saveAssignment(
                                e.target.name,
                                assignments1[e.target.name]
                              );
                              const assig1 = assignments1;
                              delete assig1[e.target.name];
                              setAssignments1({ ...assig1 });
                              const ind = editing.indexOf(
                                String(e.target.name)
                              );
                              setEditing([
                                ...editing.slice(0, ind),
                                ...editing.slice(ind + 1, editing.length),
                              ]);
                            }}
                          >
                            Save
                          </button>,
                          <button
                            className="inprogcancelbtn"
                            name={item.QSID}
                            onClick={(e) => {
                              const assig1 = assignments1;
                              delete assig1[e.target.name];
                              setAssignments1({ ...assig1 });
                              const ind = editing.indexOf(
                                String(e.target.name)
                              );
                              setEditing([
                                ...editing.slice(0, ind),
                                ...editing.slice(ind + 1, editing.length),
                              ]);
                            }}
                          >
                            Cancel
                          </button>,
                        ]
                      : ""}
                  </li>
                );
              })
            : ""}
          <h4>Assigned</h4>
          <li className="inprogresslist-header">
            <p>QSID</p>
            <p>Trader</p>
            <p>WGS</p>
            <p>WGP</p>
            <p className="inprogress-lrg-p">Product</p>
            <p className="inprogress-lrg-p">Customer</p>
            <p>Quantity</p>
            <p>P Inco</p>
            <p>S Inco</p>
            <p className="inprog-center">Inspec.</p>
            <p className="inprog-center">LC</p>
            <p className="inprog-center">WH</p>
            <p>Score</p>

            <p>TMC</p>
          </li>
          {assignedlist
            ? assignedlist.map((item) => {
                let x = 0;
                if (item.pincoterms === "CPT" || item.pincoterms === "CFR") {
                  x += 1;
                } else if (
                  item.pincoterms === "FOB" ||
                  item.pincoterms === "CIP" ||
                  item.pincoterms === "CIF"
                ) {
                  x += 2;
                }
                if (item.incoterms === "DAP") {
                  x += 1;
                }
                if (item.hasInspection === "yes") {
                  x += 1;
                }
                if (item.hasPromisory === "yes") {
                  x += 1;
                }
                if (item.hasWH === "yes") {
                  x += 1;
                }
                return (
                  <li>
                    <p>{item.QSID}</p>
                    <p>{item.trader}</p>
                    {editing.includes(String(item.QSID)) ? (
                      <p>
                        <input
                          className="canceldrag"
                          name="KTS"
                          type="text"
                          onChange={(e) => {
                            addChange(e, item.QSID);
                          }}
                          value={
                            (assignments1[item.QSID] &&
                              assignments1[item.QSID]["KTS"]) ||
                            (assignments1[item.QSID] &&
                              assignments1[item.QSID]["KTS"] === "")
                              ? assignments1[item.QSID]["KTS"]
                              : item.KTS
                          }
                        />
                      </p>
                    ) : (
                      <p>{item.KTS}</p>
                    )}
                    {editing.includes(String(item.QSID)) ? (
                      <p>
                        <input
                          className="canceldrag"
                          name="KTP"
                          type="text"
                          onChange={(e) => {
                            addChange(e, item.QSID);
                          }}
                          value={
                            (assignments1[item.QSID] &&
                              assignments1[item.QSID]["KTP"]) ||
                            (assignments1[item.QSID] &&
                              assignments1[item.QSID]["KTP"] === "")
                              ? assignments1[item.QSID]["KTP"]
                              : item.KTP
                          }
                        />
                      </p>
                    ) : (
                      <p>{item.KTP}</p>
                    )}

                    <p className="inprogress-lrg-p">{item.abbreviation}</p>
                    <p className="inprogress-lrg-p">{item.companyCode}</p>
                    <p>{item.quantity}</p>
                    {editing.includes(String(item.QSID)) ? (
                      <p>
                        <input
                          className="canceldrag"
                          name="pincoterms"
                          type="text"
                          onChange={(e) => {
                            addChange(e, item.QSID);
                          }}
                          value={
                            (assignments1[item.QSID] &&
                              assignments1[item.QSID]["pincoterms"]) ||
                            (assignments1[item.QSID] &&
                              assignments1[item.QSID]["pincoterms"] === "")
                              ? assignments1[item.QSID]["pincoterms"]
                              : item.pincoterms
                          }
                        />
                      </p>
                    ) : (
                      <p>{item.pincoterms}</p>
                    )}
                    {editing.includes(String(item.QSID)) ? (
                      <p>
                        <input
                          className="canceldrag"
                          name="incoterms"
                          type="text"
                          onChange={(e) => {
                            addChange(e, item.QSID);
                          }}
                          value={
                            (assignments1[item.QSID] &&
                              assignments1[item.QSID]["incoterms"]) ||
                            (assignments1[item.QSID] &&
                              assignments1[item.QSID]["incoterms"] === "")
                              ? assignments1[item.QSID]["incoterms"]
                              : item.incoterms
                          }
                        />
                      </p>
                    ) : (
                      <p>{item.incoterms}</p>
                    )}
                    {editing.includes(String(item.QSID)) ? (
                      <p className="inprog-center">
                        <input
                          type="checkbox"
                          checked={
                            !assignments1[item.QSID]
                              ? item.hasInspection === "yes"
                                ? true
                                : false
                              : assignments1[item.QSID]["hasInspectionBool"]
                          }
                          onClick={(e) => {
                            if (
                              assignments1[item.QSID] &&
                              assignments1[item.QSID]["hasInspection"]
                            ) {
                              if (
                                assignments1[item.QSID]["hasInspection"] ===
                                "yes"
                              ) {
                                console.log("heyyy");
                                setAssignments1({
                                  ...assignments1,
                                  [item.QSID]: {
                                    ...assignments1[item.QSID],
                                    ["hasInspection"]: "no",
                                    ["hasInspectionBool"]: false,
                                  },
                                });
                              } else {
                                console.log("hooo");
                                setAssignments1({
                                  ...assignments1,
                                  [item.QSID]: {
                                    ...assignments1[item.QSID],
                                    ["hasInspection"]: "yes",
                                    ["hasInspectionBool"]: true,
                                  },
                                });
                              }
                            } else {
                              if (item.hasInspection === "yes") {
                                setAssignments1({
                                  ...assignments1,
                                  [item.QSID]: {
                                    ...assignments1[item.QSID],
                                    ["hasInspection"]: "no",
                                    ["hasInspectionBool"]: false,
                                  },
                                });
                              } else {
                                setAssignments1({
                                  ...assignments1,
                                  [item.QSID]: {
                                    ...assignments1[item.QSID],
                                    ["hasInspection"]: "yes",
                                    ["hasInspectionBool"]: true,
                                  },
                                });
                              }
                            }
                          }}
                        />
                      </p>
                    ) : (
                      <p className="inprog-center">{item.hasInspection}</p>
                    )}
                    {editing.includes(String(item.QSID)) ? (
                      <p className="inprog-center">
                        <input
                          type="checkbox"
                          checked={
                            !assignments1[item.QSID]
                              ? item.hasPromisory === "yes"
                                ? true
                                : false
                              : assignments1[item.QSID]["hasPromisoryBool"]
                          }
                          onClick={(e) => {
                            if (
                              assignments1[item.QSID] &&
                              assignments1[item.QSID]["hasPromisory"]
                            ) {
                              if (
                                assignments1[item.QSID]["hasPromisory"] ===
                                "yes"
                              ) {
                                console.log("heyyy");
                                setAssignments1({
                                  ...assignments1,
                                  [item.QSID]: {
                                    ...assignments1[item.QSID],
                                    ["hasPromisory"]: "no",
                                    ["hasPromisoryBool"]: false,
                                  },
                                });
                              } else {
                                console.log("hooo");
                                setAssignments1({
                                  ...assignments1,
                                  [item.QSID]: {
                                    ...assignments1[item.QSID],
                                    ["hasPromisory"]: "yes",
                                    ["hasPromisoryBool"]: true,
                                  },
                                });
                              }
                            } else {
                              if (item.hasPromisory === "yes") {
                                setAssignments1({
                                  ...assignments1,
                                  [item.QSID]: {
                                    ...assignments1[item.QSID],
                                    ["hasPromisory"]: "no",
                                    ["hasPromisoryBool"]: false,
                                  },
                                });
                              } else {
                                setAssignments1({
                                  ...assignments1,
                                  [item.QSID]: {
                                    ...assignments1[item.QSID],
                                    ["hasPromisory"]: "yes",
                                    ["hasPromisoryBool"]: true,
                                  },
                                });
                              }
                            }
                          }}
                        />
                      </p>
                    ) : (
                      <p className="inprog-center">{item.hasPromisory}</p>
                    )}
                    {editing.includes(String(item.QSID)) ? (
                      <p className="inprog-center">
                        <input
                          type="checkbox"
                          checked={
                            !assignments1[item.QSID]
                              ? item.hasWH === "yes"
                                ? true
                                : false
                              : assignments1[item.QSID]["hasWHBool"]
                          }
                          onClick={(e) => {
                            if (
                              assignments1[item.QSID] &&
                              assignments1[item.QSID]["hasWH"]
                            ) {
                              if (assignments1[item.QSID]["hasWH"] === "yes") {
                                console.log("heyyy");
                                setAssignments1({
                                  ...assignments1,
                                  [item.QSID]: {
                                    ...assignments1[item.QSID],
                                    ["hasWH"]: "no",
                                    ["hasWHBool"]: false,
                                  },
                                });
                              } else {
                                console.log("hooo");
                                setAssignments1({
                                  ...assignments1,
                                  [item.QSID]: {
                                    ...assignments1[item.QSID],
                                    ["hasWH"]: "yes",
                                    ["hasWHBool"]: true,
                                  },
                                });
                              }
                            } else {
                              if (item.hasWH === "yes") {
                                setAssignments1({
                                  ...assignments1,
                                  [item.QSID]: {
                                    ...assignments1[item.QSID],
                                    ["hasWH"]: "no",
                                    ["hasWHBool"]: false,
                                  },
                                });
                              } else {
                                setAssignments1({
                                  ...assignments1,
                                  [item.QSID]: {
                                    ...assignments1[item.QSID],
                                    ["hasWH"]: "yes",
                                    ["hasWHBool"]: true,
                                  },
                                });
                              }
                            }
                          }}
                        />
                      </p>
                    ) : (
                      <p className="inprog-center">{item.hasWH}</p>
                    )}
                    <p>{x.toFixed(1)}</p>
                    {editing.includes(String(item.QSID)) ? (
                      <select
                        className="inprogress-med-p"
                        name={item.QSID}
                        onChange={(e) => {
                          setAssignments1({
                            ...assignments1,
                            [e.target.name]: {
                              ...assignments1[e.target.name],
                              trafficID: Number(e.target.value),
                            },
                          });
                        }}
                        value={
                          (assignments1[item.QSID] &&
                            assignments1[item.QSID]["trafficID"]) ||
                          (assignments1[item.QSID] &&
                            assignments1[item.QSID]["trafficID"] === 0)
                            ? assignments1[item.QSID]["trafficID"]
                            : item.trafficID
                        }
                      >
                        <option>Select...</option>
                        {trafficmgrs
                          ? trafficmgrs.map((item1) => {
                              return (
                                <option selected={"na"} value={item1.trafficID}>
                                  {item1.trafficID} - {item1.traffic}
                                </option>
                              );
                            })
                          : ""}
                      </select>
                    ) : (
                      <p className="inprogress-med-p">{item.traffic}</p>
                    )}
                    {editing.includes(String(item.QSID)) ? (
                      ""
                    ) : (
                      <button
                        name={item.QSID}
                        onClick={(e) =>
                          editing.includes(e.target.name)
                            ? ""
                            : setEditing([...editing, e.target.name])
                        }
                      >
                        Edit
                      </button>
                    )}
                    {/* {Object.keys(assignments1).includes(String(item.QSID))
                     */}
                    {editing.includes(String(item.QSID))
                      ? [
                          <button
                            className="inprogsavebtn"
                            name={item.QSID}
                            onClick={(e) => {
                              e.preventDefault();
                              saveAssignment(
                                e.target.name,
                                assignments1[e.target.name]
                              );
                              const assig1 = assignments1;
                              delete assig1[e.target.name];
                              setAssignments1({ ...assig1 });
                              const ind = editing.indexOf(
                                String(e.target.name)
                              );
                              setEditing([
                                ...editing.slice(0, ind),
                                ...editing.slice(ind + 1, editing.length),
                              ]);
                            }}
                          >
                            Save
                          </button>,
                          <button
                            className="inprogcancelbtn"
                            name={item.QSID}
                            onClick={(e) => {
                              const assig1 = assignments1;
                              delete assig1[e.target.name];
                              setAssignments1({ ...assig1 });
                              const ind = editing.indexOf(
                                String(e.target.name)
                              );
                              setEditing([
                                ...editing.slice(0, ind),
                                ...editing.slice(ind + 1, editing.length),
                              ]);
                            }}
                          >
                            Cancel
                          </button>,
                        ]
                      : ""}
                  </li>
                );
              })
            : ""}
          {/* <h4>Assigned</h4>
          <li className="inprogresslist-header">
            <p>QSID</p>
            <p>Trader</p>
            <p>WGS</p>
            <p>WGP</p>
            <p>Product</p>
            <p>Customer</p>
            <p>Quantity</p>
            <p>TMC</p>
            <p>Re-Assign</p>
          </li>
          {assignedlist
            ? assignedlist.map((item) => (
                <li>
                  <p>{item.QSID}</p>
                  <p>{item.trader}</p>
                  <p>{item.KTS}</p>
                  <p>{item.KTP}</p>
                  <p>{item.abbreviation}</p>
                  <p>{item.companyCode}</p>
                  <p>{item.quantity}</p>
                  <p>{item.traffic}</p>
                  <select
                    name={item.QSID}
                    onChange={(e) => {
                      setAssignments1({
                        ...assignments1,
                        [e.target.name]: [{ tmc: Number(e.target.value) }],
                      });
                    }}
                  >
                    <option>Select...</option>
                    {trafficmgrs
                      ? trafficmgrs.map((item) => {
                          return (
                            <option value={item.trafficID}>
                              {item.trafficID} - {item.traffic}
                            </option>
                          );
                        })
                      : ""}
                  </select>
                  {Object.keys(assignments1).includes(String(item.QSID)) ? (
                    <button
                      name={item.QSID}
                      onClick={(e) => {
                        e.preventDefault();
                        saveAssignment(
                          e.target.name,
                          assignments1[e.target.name]
                        );
                        const assig1 = assignments1;
                        delete assig1[e.target.name];
                        setAssignments1({ ...assig1 });
                      }}
                    >
                      Assign
                    </button>
                  ) : (
                    ""
                  )}
                </li>
              ))
            : ""} */}
        </ul>
      </div>
    </ResponsiveGridLayout>
  );
};

export default InProgress;
