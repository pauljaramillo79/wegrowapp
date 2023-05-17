import React, { useState, useEffect } from "react";
import Axios from "axios";
import "./MyOperations.css";
import SingleOperation from "./SingleOperation";

const MyOperations = () => {
  const role = JSON.parse(localStorage.getItem("role"));
  const usercode = JSON.parse(localStorage.getItem("WGusercode"));
  const [trafficmanagers, setTrafficmanagers] = useState();
  const [selectedTraffic, setSelectedTraffic] = useState();
  const [selectedTrafficID, setSelectedTrafficID] = useState();
  const [operations, setOperations] = useState();

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
        (response) => setOperations(response.data)
        // console.log(response.data)
      );
  }, [selectedTrafficID]);

  return (
    <>
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
      <div className="operations">
        {operations && operations.length > 0 ? (
          operations.map((op) => {
            return (
              <SingleOperation
                operation={op}
                selectedTraffic={selectedTraffic}
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
