import React, { useState, useEffect } from "react";
import Axios from "axios";
import "./MyOperations.css";
import SingleOperation from "./SingleOperation";
import moment from "moment";

const MyOperations = () => {
  const role = JSON.parse(localStorage.getItem("role"));
  const usercode = JSON.parse(localStorage.getItem("WGusercode"));
  const [trafficmanagers, setTrafficmanagers] = useState();
  const [selectedTraffic, setSelectedTraffic] = useState();
  const [selectedTrafficID, setSelectedTrafficID] = useState();
  const [operations, setOperations] = useState();
  const [reloadops, setReloadops] = useState(false);

  // const loadmyoperations = () => {
  //   return new Promise((resolve, reject) => {
  //     Axios.post("/trafficmgrs").then((response) => {
  //       setTrafficmanagers(response.data);
  //       if (role === 4) {
  //         setSelectedTraffic(JSON.parse(localStorage.getItem("WGusercode")));
  //       } else {
  //         setSelectedTraffic(response.data[0].traffic);
  //       }
  //     });
  //     resolve(true);
  //   });
  // };
  useEffect(async () => {
    // await loadmyoperations();

    Axios.post("/trafficmgrs").then((response) => {
      setTrafficmanagers(response.data);

      // const gettrindex = (el) => el.traffic === selectedTraffic;

      if (role === 4) {
        setSelectedTraffic(JSON.parse(localStorage.getItem("WGusercode")));
        const gettrindex = (el) =>
          el.traffic === JSON.parse(localStorage.getItem("WGusercode"));
        let trafficindex = response.data.findIndex(gettrindex);
        setSelectedTrafficID(response.data[trafficindex].trafficID);
      } else {
        setSelectedTraffic(response.data[0].traffic);
        const gettrindex = (el) => el.traffic === response.data[0].traffic;
        let trafficindex = response.data.findIndex(gettrindex);
        console.log(trafficindex);
      }

      // (response.data[trafficindex].trafficID);
    });
  }, []);

  useEffect(() => {
    if (trafficmanagers && selectedTraffic) {
      const gettrindex = (el) => el.traffic === selectedTraffic;
      let trafficindex = trafficmanagers.findIndex(gettrindex);
      // console.log(selectedTraffic);
      // let trafficID = trafficmanagers[trafficindex].trafficID;
      setSelectedTrafficID(trafficmanagers[trafficindex].trafficID);
    }
  }, [trafficmanagers, selectedTraffic]);

  useEffect(() => {
    if (selectedTrafficID)
      Axios.post("/getmyoperations", { selectedTrafficID }).then(
        (response) => {
          setOperations(response.data);
          setFoperations(response.data);
        }
        // console.log(response.data)
      );
  }, [selectedTrafficID, reloadops]);

  const [filtertext, setFiltertext] = useState("");
  const [foperations, setFoperations] = useState();

  useEffect(() => {
    if (operations && operations.length > 0) {
      const results = operations.filter(
        (item) =>
          item.customer.toLowerCase().includes(filtertext.toLowerCase()) ||
          item.abbreviation.toLowerCase().includes(filtertext.toLowerCase()) ||
          item.supplier.toLowerCase().includes(filtertext.toLowerCase()) ||
          item.portOfDestination
            .toLowerCase()
            .includes(filtertext.toLowerCase()) ||
          item.portOfLoad.toLowerCase().includes(filtertext.toLowerCase()) ||
          item.KTS.includes(filtertext) ||
          item.KTP.includes(filtertext) ||
          item.QSID.toFixed().includes(filtertext) ||
          item.trader.toLowerCase().includes(filtertext.toLowerCase())
      );
      setFoperations(results);
      console.log(results);
    }

    // console.log(operations);
  }, [filtertext]);

  // const [timeline, setTimeline] = useState();

  return (
    <>
      <div className="opheader">
        <div className="trafficbuttons">
          {trafficmanagers
            ? trafficmanagers.map((trf) => {
                return trf.traffic !== "na" ? (
                  <>
                    <button
                      className={
                        selectedTraffic === trf.traffic ? "activetrfbtn" : ""
                      }
                      value={trf.traffic}
                      onClick={(e) => {
                        setSelectedTraffic(e.target.value);
                        setFiltertext("");
                      }}
                    >
                      {trf.traffic}
                    </button>
                  </>
                ) : (
                  ""
                );
              })
            : ""}
        </div>
        <div className="opsearchbar">
          <input
            type="text"
            placeholder="search"
            value={filtertext}
            onChange={(e) => setFiltertext(e.target.value)}
          />
          {filtertext !== "" ? (
            <button
              onClick={(e) => setFiltertext("")}
              className="opsearchclearbtn"
            >
              Clear
            </button>
          ) : (
            ""
          )}
        </div>
      </div>
      <div className="operations">
        {foperations && foperations.length > 0 ? (
          foperations.map((op) => {
            let itimeline = [
              { Date: moment().format("YYYY-MM-DD"), Detail: "Now" },
            ];
            if (op.start !== null) {
              itimeline.push({
                Date: moment(op.start).format("YYYY-MM-DD"),
                Detail: "From",
              });
            }
            if (op.end !== null) {
              itimeline.push({
                Date: moment(op.end).format("YYYY-MM-DD"),
                Detail: "To",
              });
            }
            if (op.ETS !== null) {
              itimeline.push({
                Date: moment(op.ETS).format("YYYY-MM-DD"),
                Detail: "ETD",
              });
            }
            if (op.ETA !== null) {
              itimeline.push({
                Date: moment(op.ETA).format("YYYY-MM-DD"),
                Detail: "ETA",
              });
            }
            itimeline.sort((a, b) => moment(a.Date) - moment(b.Date));
            let timelinelength = moment(itimeline.slice(-1)[0].Date).diff(
              itimeline[0].Date,
              "days"
            );
            let timeintervals = [];
            itimeline.forEach((el, i) => {
              if (i + 1 < itimeline.length) {
                timeintervals.push(
                  moment(itimeline[i + 1].Date).diff(itimeline[i].Date, "days")
                );
                // console.log("hi");
              }
            });
            timeintervals.push(0);
            // console.log(timeintervals);
            // setTimeline(itimeline);
            return (
              <SingleOperation
                operation={op}
                selectedTraffic={selectedTraffic}
                setReloadops={setReloadops}
                reloadops={reloadops}
                timeline={itimeline}
                timelinelength={timelinelength}
                timeintervals={timeintervals}
              />
            );
          })
        ) : (
          <div>No files assigned to this traffic manager at the moment.</div>
        )}
      </div>
    </>
  );
};

export default MyOperations;
