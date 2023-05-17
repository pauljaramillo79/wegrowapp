import React, { useState, useEffect } from "react";
import "./SingleOperation.css";
import moment from "moment";

const SingleOperation = ({ operation, selectedTraffic }) => {
  const [todaydate, setTodaydate] = useState(moment());
  const [shipmentstart, setShipmentstart] = useState();
  const [shipmentend, setShipmentend] = useState();
  const timelinewidth = 400;
  const [timelinedays, setTimelinedays] = useState();
  const [dista, setDista] = useState(
    moment().diff(moment(operation.end), "days")
  );
  const [distb, setDistb] = useState(
    moment().diff(moment(operation.start), "days")
  );

  // const setdates = () => {
  //   return new Promise((resolve, reject) => {
  //     setShipmentstart(moment(operation.start));
  //     setShipmentend(moment(operation.end));
  //     resolve(true);
  //   });
  // };
  useEffect(() => {
    // setShipmentstart(moment(operation.start));
    // setShipmentend(moment(operation.end));
    // setDista(todaydate.diff(operation.end, "days"));
    // setDistb(todaydate.diff(operation.start, "days"));
  }, [selectedTraffic]);

  // useEffect(() => {

  // }, [shipmentend, shipmentstart]);

  useEffect(() => {
    // await setdates();
    // console.log(shipmentend.diff(todaydate, "days"));
    // console.log(shipmentend.diff(shipmentstart, "days"));
    // if (
    //   shipmentend.diff(todaydate, "days") >=
    //   shipmentend.diff(shipmentstart, "days")
    // ) {
    //   setTimelinedays(shipmentend.diff(todaydate, "days"));
    // } else {
    //   setTimelinedays(shipmentend.diff(shipmentstart, "days"));
    // }
    // let a = todaydate.diff(shipmentend, "days");
    // let b = todaydate.diff(shipmentstart, "days");

    // setDista(a);
    // setDistb(b);

    if (dista >= 0) {
      setTimelinedays(todaydate.diff(moment(operation.start), "days"));
    }
    if (dista < 0 && distb >= 0) {
      setTimelinedays(
        moment(operation.end).diff(moment(operation.start), "days")
      );
    }
    if (distb < 0) {
      setTimelinedays(moment(operation.end).diff(todaydate, "days"));
    }
    // console.log("End: " + shipmentend.format("MMM DD"));
    // console.log("Start: " + shipmentstart.format("MMM DD"));
    // console.log("Today: " + todaydate.format("MMM DD"));
    // console.log(a);
    // console.log(b);
    // console.log(timelinedays);
  }, [dista, distb]);

  // const timelinedays =
  //   shipmentend.diff(todaydate, "days") >=
  //   shipmentend.diff(shipmentstart, "days")
  //     ? shipmentend.diff(todaydate, "days")
  //     : shipmentend.diff(shipmentstart, "days");

  //   .format("YYYY-MM-DD")
  return (
    <div className="operation">
      <div className="opleftlabel">
        <h2>{operation.customer}</h2>
        <h3>{operation.abbreviation}</h3>
        <h4>{operation.quantity.toFixed(0)} mt</h4>
        <p>{operation.supplier}</p>
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
          {/* {shipmentstart.diff(todaydate, "days") > 0 ? (
            <>
              <div
                style={{
                  width:
                    (400 * Number(shipmentstart.diff(todaydate, "days"))) /
                      timelinedays +
                    "px",
                  minWidth: "25px",
                }}
                className="tlsegment"
              >
                <p>{todaydate.format("MMM d")}</p>
              </div>
              <div
                style={{
                  width:
                    (400 * Number(shipmentend.diff(shipmentstart, "days"))) /
                      timelinedays +
                    "px",
                  minWidth: "35px",
                  backgroundColor: "rgba(132,196,76,0.3",
                }}
                className="tlsegment"
              >
                <p>From: </p>
                <p>{shipmentstart.format("MMM d")}</p>
              </div>
            </>
          ) : (
            <>
              <div
                style={{
                  width:
                    (400 * Number(todaydate.diff(shipmentstart, "days"))) /
                    timelinedays,
                  minWidth: "25px",
                  backgroundColor: "rgba(132,196,76,0.3",
                }}
                className="tlsegment"
              >
                <p>From: </p>
                <p>{shipmentstart.format("MMM d")}</p>
              </div>
              <div
                style={{
                  width:
                    (400 * Number(shipmentend.diff(todaydate, "days"))) /
                      timelinedays +
                    "px",
                  minWidth: "35px",
                  backgroundColor: "rgba(132,196,76,0.3",
                }}
                className="tlsegment"
              >
                <p>{todaydate.format("MMM d")}</p>
              </div>
            </>
          )}
          <div
            style={
              {
                //   backgroundColor: "rgba(132,196,76,0.3",
              }
            }
            className="tlsegment"
          >
            <p>To: </p>
            <p>{shipmentend.format("MMM d")}</p>
          </div> */}
          {moment().diff(moment(operation.end), "days") > 0 ? (
            <>
              <div className="tlfsegment">
                <div>From</div>
                <div
                  style={{
                    width:
                      (400 *
                        moment(operation.end).diff(
                          moment(operation.start),
                          "days"
                        )) /
                      moment().diff(moment(operation.start), "days"),
                    minWidth: "38px",
                  }}
                  className="tlsegment"
                >
                  {moment(operation.start).format("MMM DD")}
                </div>
              </div>
              <div className="tlfsegment">
                <div>To</div>
                <div
                  style={{
                    width:
                      (400 * moment().diff(moment(operation.end), "days")) /
                      moment().diff(moment(operation.start), "days"),
                    minWidth: "38px",
                  }}
                  className="tlsegment"
                >
                  {moment(operation.end).format("MMM DD")}
                </div>
              </div>
              <div className="tlfsegment">
                <div>.</div>
                <div style={{ minWidth: "38px" }} className="tlsegment tlnow">
                  {todaydate.format("MMM DD")}
                </div>
              </div>
            </>
          ) : moment().diff(moment(operation.end), "days") <= 0 &&
            moment().diff(moment(operation.start), "days") > 0 ? (
            <>
              <div className="tlfsegment">
                <div>From</div>
                <div
                  style={{
                    width:
                      (400 * moment().diff(moment(operation.start), "days")) /
                      moment(operation.end).diff(
                        moment(operation.start),
                        "days"
                      ),
                    minWidth: "38px",
                  }}
                  className="tlsegment"
                >
                  {moment(operation.start).format("MMM DD")}
                </div>
              </div>
              <div className="tlfsegment">
                <div>.</div>
                <div
                  style={{
                    width:
                      (400 * moment(operation.end).diff(moment(), "days")) /
                      moment(operation.end).diff(
                        moment(operation.start),
                        "days"
                      ),
                    minWidth: "38px",
                  }}
                  className="tlsegment tlnow"
                >
                  {todaydate.format("MMM DD")}
                </div>
              </div>
              <div className="tlfsegment">
                <div>To</div>
                <div style={{ minWidth: "38px" }} className="tlsegment">
                  {moment(operation.end).format("MMM DD")}
                </div>
              </div>
            </>
          ) : moment().diff(moment(operation.start), "days") <= 0 ? (
            <>
              <div className="tlfsegment">
                <div>.</div>
                <div
                  style={{
                    width:
                      (400 * moment(operation.start).diff(moment(), "days")) /
                      moment(operation.end).diff(moment(), "days"),
                    minWidth: "38px",
                  }}
                  className="tlsegment tlnow"
                >
                  {todaydate.format("MMM DD")}
                </div>
              </div>
              <div className="tlfsegment">
                <div>From</div>
                <div
                  style={{
                    width:
                      (400 *
                        moment(operation.end).diff(
                          moment(operation.start),
                          "days"
                        )) /
                      moment(operation.end).diff(moment(), "days"),
                    minWidth: "38px",
                  }}
                  className="tlsegment"
                >
                  {moment(operation.start).format("MMM DD")}
                </div>
              </div>
              <div className="tlfsegment">
                <div>To</div>
                <div
                  style={{
                    minWidth: "38px",
                  }}
                  className="tlsegment"
                >
                  {moment(operation.end).format("MMM DD")}
                </div>
              </div>
            </>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
};

export default SingleOperation;
