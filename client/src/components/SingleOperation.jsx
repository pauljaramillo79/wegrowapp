import React, { useState, useEffect, useContext, useRef } from "react";
import "./SingleOperation.css";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { faMinusCircle } from "@fortawesome/free-solid-svg-icons";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import { faTruck } from "@fortawesome/free-solid-svg-icons";
import { faShip } from "@fortawesome/free-solid-svg-icons";
import { faTrailer } from "@fortawesome/free-solid-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";

import Axios from "axios";
import { LogisticsContext } from "../contexts/LogisticsProvider";
import UseMediaQuery from "./UseMediaQuery";

const SingleOperation = ({
  operation,
  selectedTraffic,
  setReloadops,
  reloadops,
  timeline,
  timelinelength,
  timeintervals,
  setToggleOpDetail,
  toggleOpDetail,
  // setOpToEdit,
  socket,
}) => {
  const isLaptop = UseMediaQuery("(max-width:1440px)");

  const {
    updateScores,
    setUpdateScores,
    setOpToEdit,
    opToEdit,
    opsWithNewNotes,
    setOpsWithNewNotes,
    opsWithNewNotes1,
    setOpsWithNewNotes1,
  } = useContext(LogisticsContext);

  const [todaydate, setTodaydate] = useState(moment());
  // const [shipmentstart, setShipmentstart] = useState();
  // const [shipmentend, setShipmentend] = useState();
  // const timelinewidth = tlscale;
  // const [timelinedays, setTimelinedays] = useState();
  const [dista, setDista] = useState(
    moment().diff(moment(operation.end), "days")
  );
  const [distb, setDistb] = useState(
    moment().diff(moment(operation.start), "days")
  );
  const [editmode, setEditmode] = useState(false);

  const user = JSON.parse(localStorage.getItem("WGusercode"));
  const userID = JSON.parse(localStorage.getItem("WGuserID"));

  const initvalues = {
    SCCompleteBool: operation.SCComplete,
    SCComplete:
      operation.SCComplete === null || operation.SCComplete === 0
        ? false
        : true,
    PCCompleteBool: operation.PCComplete,
    PCComplete:
      operation.PCComplete === null || operation.PCComplete === 0
        ? false
        : true,
    bookingCompleteBool: operation.bookingComplete,
    bookingComplete:
      operation.bookingComplete === null || operation.bookingComplete === 0
        ? false
        : true,
    bookingnumber: operation.bookingnumber,
    vesselName: operation.vesselName,
    freightCompany: operation.freightCompany,
    incoterms: operation.incoterms,
    pincoterms: operation.pincoterms,
    incoterms: operation.incoterms,
    ETS: operation.ETS ? moment(operation.ETS).format("YYYY-MM-DD") : "",
    ETA: operation.ETA ? moment(operation.ETA).format("YYYY-MM-DD") : "",
  };
  const [opedits, setOpedits] = useState(initvalues);

  function isEqual(obj1, obj2) {
    var props1 = Object.getOwnPropertyNames(obj1);
    var props2 = Object.getOwnPropertyNames(obj2);
    if (props1.length != props2.length) {
      return false;
    }
    for (var i = 0; i < props1.length; i++) {
      let val1 = obj1[props1[i]];
      let val2 = obj2[props1[i]];
      let isObjects = isObject(val1) && isObject(val2);
      if (
        (isObjects && !isEqual(val1, val2)) ||
        (!isObjects && val1 !== val2)
      ) {
        return false;
      }
    }
    return true;
  }
  function isObject(object) {
    return object != null && typeof object === "object";
  }

  const handleSave = (id) => {
    setEditmode(false);
    if (!isEqual(initvalues, opedits)) {
      Axios.post("/saveopedits", { id: id, opedits: opedits }).then(
        (response) => {
          console.log(response);
          setReloadops(!reloadops);
          setUpdateScores(!updateScores);
        }
      );
    }
  };

  const joinRoom = (QSID) => {
    socket.emit("leaveroom", opToEdit);
    if (user !== "" && QSID !== "") {
      socket.emit("joinroom", QSID);
    }
  };

  // console.log(
  //   opsWithNewNotes1.filter((item) => item.QSID == operation.QSID)[0]
  //     ? opsWithNewNotes1.filter((item) => item.QSID == operation.QSID)[0][
  //         "unreadusers"
  //       ]
  //     : ""
  // );

  return (
    <div className="operation">
      {editmode === false ? (
        <FontAwesomeIcon
          icon={faPenToSquare}
          className="opeditbutton"
          onClick={(e) => {
            setEditmode(true);
          }}
        />
      ) : (
        <div className="editbuttons">
          <button
            className="opsavebutton"
            onClick={(e) => {
              handleSave(operation.QSID);
            }}
          >
            Save
          </button>
          <button
            className="opsavebutton opcancelbutton"
            onClick={(e) => {
              setEditmode(false);
            }}
          >
            Cancel
          </button>
        </div>
      )}
      <p className="optrader">{operation.trader}</p>
      <p className="optraffic">{operation.traffic}</p>
      <div
        onClick={(e) => {
          setToggleOpDetail(true);
          setOpToEdit(operation.QSID);
          joinRoom(operation.QSID);

          // let newopswithnewnotes = opsWithNewNotes.filter(
          //   (el) => el != operation.QSID
          // );
          // setOpsWithNewNotes(newopswithnewnotes);

          let objIndex = opsWithNewNotes1.findIndex(
            (obj) => obj.QSID === operation.QSID
          );
          if (objIndex !== -1) {
            if (opsWithNewNotes1[objIndex].unreadusers === userID + user) {
              opsWithNewNotes1.splice(objIndex, 1);
              Axios.post("/removeQSfromNewmsglist", {
                QSID: operation.QSID,
              });
            } else {
              if (
                opsWithNewNotes1[objIndex].unreadusers.includes(userID + user)
              ) {
                opsWithNewNotes1[objIndex].unreadusers = opsWithNewNotes1[
                  objIndex
                ].unreadusers.replace(userID + user, "");
                Axios.post("/removeUnreaduser", {
                  QSID: operation.QSID,
                  unreadusers: opsWithNewNotes1[objIndex].unreadusers,
                });
              }
            }
          }
        }}
        className="opleftlabel"
      >
        <h2>{operation.customer}</h2>
        <h3>{operation.abbreviation}</h3>
        <h4>{operation.quantity.toFixed(3)} mt</h4>
        <div className="opleftlabelbottom">
          <p>{operation.supplier}</p>
          {operation.shipmentTypeID === 1 ? (
            <FontAwesomeIcon className="fa-2x" icon={faTrailer} />
          ) : operation.shipmentTypeID === 2 ? (
            <FontAwesomeIcon className="fa-2x" icon={faShip} />
          ) : operation.shipmentTypeID === 3 ? (
            <FontAwesomeIcon className="fa-2x" icon={faTruck} />
          ) : (
            ""
          )}
        </div>
        {// opsWithNewNotes.includes(operation.QSID)
        opsWithNewNotes1.filter((item) => item.QSID == operation.QSID)[0] &&
        opsWithNewNotes1
          .filter((item) => item.QSID == operation.QSID)[0]
          ["unreadusers"].includes(userID + user) ? (
          <div className="iconopwithmsg-wrapper">
            <FontAwesomeIcon className="iconopwithmsg" icon={faEnvelope} />
          </div>
        ) : (
          ""
        )}
      </div>
      <div className="opnumberlabel">
        <p>WGS: {operation.KTS}</p>
        <p>WGP: {operation.KTP}</p>
        <p>QSID: {operation.QSID}</p>
      </div>
      <div className="opprogress">
        <div className="oporigindestination">
          <ul>
            <li>{operation.portOfLoad}</li>
            <li>{operation.portOfDestination}</li>
          </ul>
        </div>

        <div className="optimeline">
          {timeline
            ? timeline.map((el, i) => {
                let tlscale = isLaptop ? 200 : 300;
                return (
                  <div className="tlfsegment">
                    <div>{el.Detail}</div>
                    <div
                      style={{
                        width: (tlscale * timeintervals[i]) / timelinelength,
                        minWidth: 38,
                      }}
                      className={
                        el.Detail === "Now" ? "tlsegment tlnow" : "tlsegment"
                      }
                    >
                      {moment(el.Date).format("MMM DD")}
                    </div>
                  </div>
                );
              })
            : ""}
        </div>
      </div>
      <div className="opchecklistsnapshot">
        <div className="opchecklist">
          <div className="checklistitem">
            {editmode === false ? (
              operation.SCComplete === 1 ? (
                <FontAwesomeIcon
                  icon={faCheckCircle}
                  className="opgreencheck"
                />
              ) : (
                <FontAwesomeIcon icon={faMinusCircle} />
              )
            ) : (
              <input
                type="checkbox"
                checked={
                  opedits["SCComplete"] === null
                    ? operation.SCComplete === 1
                      ? true
                      : false
                    : opedits["SCComplete"]
                }
                onClick={(e) => {
                  if (opedits["SCComplete"] !== null) {
                    setOpedits({
                      ...opedits,
                      SCComplete: !opedits["SCComplete"],
                      SCCompleteBool: opedits["SCComplete"] === true ? 0 : 1,
                    });
                  } else if (operation.SCComplete === 1) {
                    setOpedits({
                      ...opedits,
                      SCComplete: false,
                      SCCompleteBool: 0,
                    });
                  } else if (
                    operation.SCComplete === 0 ||
                    operation.SCComplete == null
                  ) {
                    setOpedits({
                      ...opedits,
                      SCComplete: true,
                      SCCompleteBool: 1,
                    });
                  }
                }}
              />
            )}
            <p className="opcontract">Sales Contract</p>
          </div>

          <div className="checklistitem">
            {editmode === false ? (
              operation.PCComplete === 1 ? (
                <FontAwesomeIcon
                  icon={faCheckCircle}
                  className="opgreencheck"
                />
              ) : (
                <FontAwesomeIcon icon={faMinusCircle} />
              )
            ) : (
              <input
                type="checkbox"
                checked={
                  opedits["PCComplete"] === null
                    ? operation.PCComplete === 1
                      ? true
                      : false
                    : opedits["PCComplete"]
                }
                onClick={(e) => {
                  if (opedits["PCComplete"] !== null) {
                    setOpedits({
                      ...opedits,
                      PCComplete: !opedits["PCComplete"],
                      PCCompleteBool: opedits["PCComplete"] === true ? 0 : 1,
                    });
                  } else if (operation.PCComplete === 1) {
                    setOpedits({
                      ...opedits,
                      PCComplete: false,
                      PCCompleteBool: 0,
                    });
                  } else if (
                    operation.PCComplete === 0 ||
                    operation.PCComplete == null
                  ) {
                    setOpedits({
                      ...opedits,
                      PCComplete: true,
                      PCCompleteBool: 1,
                    });
                  }
                }}
              />
            )}
            <p className="opcontract">Purchase Contract</p>
          </div>
          <p style={{ marginTop: "1rem" }}>INCOTERMS</p>
          <div className="checklistitem incoitem">
            <p>Purchase: </p>
            {editmode === true ? (
              <input
                className="opincoterms"
                type="text"
                value={opedits.pincoterms}
                onChange={(e) =>
                  setOpedits({ ...opedits, pincoterms: e.target.value })
                }
              />
            ) : (
              <p>{operation.pincoterms}</p>
            )}
          </div>
          <div className="checklistitem incoitem">
            <p>Sales: </p>
            {editmode === true ? (
              <input
                className="opincoterms"
                type="text"
                value={opedits.incoterms}
                onChange={(e) =>
                  setOpedits({ ...opedits, incoterms: e.target.value })
                }
              />
            ) : (
              <p>{operation.incoterms}</p>
            )}
          </div>
        </div>
        <div className="opchecklist">
          <div className="checklistitem">
            {editmode === false ? (
              operation.bookingComplete === 1 ? (
                <FontAwesomeIcon
                  icon={faCheckCircle}
                  className="opgreencheck"
                />
              ) : (
                <FontAwesomeIcon icon={faMinusCircle} />
              )
            ) : (
              <input
                type="checkbox"
                checked={
                  opedits["bookingComplete"] === null
                    ? operation.bookingComplete === 1
                      ? true
                      : false
                    : opedits["bookingComplete"]
                }
                onClick={(e) => {
                  if (opedits["bookingComplete"] !== null) {
                    setOpedits({
                      ...opedits,
                      bookingComplete: !opedits["bookingComplete"],
                      bookingCompleteBool:
                        opedits["bookingComplete"] === true ? 0 : 1,
                    });
                  } else if (operation.bookingComplete === 1) {
                    setOpedits({
                      ...opedits,
                      bookingComplete: false,
                      bookingCompleteBool: 0,
                    });
                  } else if (
                    operation.bookingComplete === 0 ||
                    operation.bookingComplete == null
                  ) {
                    setOpedits({
                      ...opedits,
                      bookingComplete: true,
                      bookingCompleteBool: 1,
                    });
                  }
                }}
              />
            )}
            <p>Booking</p>
          </div>
          {editmode === true && opedits.bookingComplete === true ? (
            <div className="bookinginputs">
              {" "}
              <input
                type="text"
                className="bookinginfo"
                placeholder="booking#"
                value={opedits.bookingnumber}
                onChange={(e) =>
                  setOpedits({ ...opedits, bookingnumber: e.target.value })
                }
              />
              <input
                type="text"
                className="bookinginfo"
                placeholder="vesselName"
                value={opedits.vesselName}
                onChange={(e) =>
                  setOpedits({ ...opedits, vesselName: e.target.value })
                }
              />
              <input
                type="text"
                className="bookinginfo"
                placeholder="freightCompany"
                value={opedits.freightCompany}
                onChange={(e) =>
                  setOpedits({ ...opedits, freightCompany: e.target.value })
                }
              />
            </div>
          ) : (
            <>
              {" "}
              <p className="setbookinginfo">{operation.bookingnumber}</p>
              <p className="setbookinginfo">{operation.vesselName}</p>
              <p className="setbookinginfo">{operation.freightCompany}</p>
            </>
          )}
          <div className="opETDETA">
            <div
              className={
                editmode === false
                  ? "checklistitem opETDETAitem"
                  : "checklistitem opETDETAitem1"
              }
            >
              <p>ETD: </p>
              {editmode === true && opedits.bookingComplete === true ? (
                <input
                  type="date"
                  value={opedits.ETS}
                  className="bookingdateinfo"
                  onChange={(e) => {
                    setOpedits({ ...opedits, ETS: e.target.value });
                  }}
                />
              ) : (
                <p>
                  {operation.ETS ? moment(operation.ETS).format("MMM DD") : ""}
                </p>
              )}
            </div>
            <div
              className={
                editmode === false
                  ? "checklistitem opETDETAitem"
                  : "checklistitem opETDETAitem1"
              }
            >
              <p>ETA: </p>
              {editmode === true && opedits.bookingComplete === true ? (
                <input
                  type="date"
                  value={opedits.ETA}
                  className="bookingdateinfo"
                  onChange={(e) => {
                    setOpedits({ ...opedits, ETA: e.target.value });
                  }}
                />
              ) : (
                <p>
                  {operation.ETA ? moment(operation.ETA).format("MMM DD") : ""}
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="opchecklist">
          <div className="checklistitem">Insurance</div>
          <div className="checklistitem">Inspection</div>
        </div>
      </div>
    </div>
  );
};

export default SingleOperation;
