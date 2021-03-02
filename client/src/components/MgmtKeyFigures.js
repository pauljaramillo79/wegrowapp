import React, { useState, useEffect } from "react";
import "./MgmtKeyFigures.css";
import Axios from "axios";

const MgmtKeyFigures = () => {
  const [data, setData] = useState();
  useEffect(() => {
    Axios.post("/keyfigures").then((response) => {
      setData(response.data);
      console.log(data);
    });
  }, []);
  return (
    <div className="keyfigures-list">
      <div className="keyfigure-volume">
        <h1 className="kfig">
          {data
            ? data[1].Sales.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            : "reload"}
        </h1>
        <h4>Volume (mt)</h4>
      </div>
      <div className="keyfigure-revenue">
        <h1 className="kfig">
          {data
            ? "$" + (data[1].Revenue / 1000000).toFixed(2).toString() + "mio"
            : "reload"}
        </h1>
        <h4>Revenue</h4>
      </div>

      <div className="keyfigure-profit">
        <h1 className="kfig">
          {data
            ? "$" + (data[1].Margin / 1000).toFixed(0).toString() + "K"
            : "reload"}
        </h1>
        <h4>Profit</h4>
      </div>
      <div className="keyfigure-profitpmt">
        <h1 className="kfig">
          {data ? "$" + data[1].Profit.toFixed(2).toString() : "reload"}
        </h1>
        <h4>Profit (pmt)</h4>
      </div>
      <div className="keyfigure-profitpct">
        <h1 className="kfig">
          {data
            ? ((data[1].Margin / data[1].Revenue) * 100).toFixed(2).toString() +
              "%"
            : "reload"}
        </h1>
        <h4>Profit (%)</h4>
      </div>
    </div>
  );
};

export default MgmtKeyFigures;
