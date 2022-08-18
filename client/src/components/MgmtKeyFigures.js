import React, { useState, useEffect } from "react";
import "./MgmtKeyFigures.css";
import Axios from "axios";
import moment from "moment";

const MgmtKeyFigures = () => {
  const [data, setData] = useState();
  const [startdate, setStartdate] = useState(moment().format("YYYY-1-1"));
  const [enddate, setEnddate] = useState(moment().format("YYYY-M-D"));
  // console.log();
  useEffect(() => {
    if (startdate && enddate) {
      Axios.post("/keyfigures", {
        startdate: startdate,
        enddate: enddate,
      }).then((response) => {
        setData(response.data[0]);
        // console.log(data);
      });
    }
  }, [startdate, enddate]);
  return (
    <>
      <div className="keyfigures-buttons">
        From {moment(startdate).format("MMM D YYYY")} to{" "}
        {moment(enddate).format("MMM D YYYY")}:
        <div>
          <button
            onClick={(e) => {
              e.preventDefault();
              setStartdate(moment().format("YYYY-1-1"));
              setEnddate(moment().format("YYYY-M-D"));
            }}
          >
            YTD
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              setStartdate(moment().format("YYYY-M-1"));
              setEnddate(moment().format("YYYY-M-D"));
            }}
          >
            This Month
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              let thismonth = moment().month();
              let lastmonth = thismonth - 1;
              console.log(lastmonth);
              setStartdate(moment().format(`YYYY-${lastmonth}-D`));
              setEnddate(moment().format("YYYY-M-D"));
            }}
          >
            30 days
          </button>
        </div>
      </div>
      <div className="keyfigures-list">
        <div className="keyfigure-volume">
          <h1 className="kfig">
            {data
              ? data.Sales.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              : "reload"}
          </h1>
          <h4>Volume (mt)</h4>
        </div>
        <div className="keyfigure-revenue">
          <h1 className="kfig">
            {data
              ? "$" + (data.Revenue / 1000000).toFixed(2).toString() + "mio"
              : "reload"}
          </h1>
          <h4>Revenue</h4>
        </div>

        <div className="keyfigure-profit">
          <h1 className="kfig">
            {data
              ? "$" + (data.Margin / 1000).toFixed(0).toString() + "K"
              : "reload"}
          </h1>
          <h4>Profit</h4>
        </div>
        <div className="keyfigure-profitpmt">
          <h1 className="kfig">
            {data ? "$" + data.Profit.toFixed(2).toString() : "reload"}
          </h1>
          <h4>Avg. Profit (pmt)</h4>
        </div>
        <div className="keyfigure-profitpct">
          <h1 className="kfig">
            {data
              ? ((data.Margin / data.Revenue) * 100).toFixed(2).toString() + "%"
              : "reload"}
          </h1>
          <h4>Profit (%)</h4>
        </div>
      </div>
    </>
  );
};

export default MgmtKeyFigures;
