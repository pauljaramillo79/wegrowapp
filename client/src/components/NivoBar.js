import Axios from "axios";
import React, { useState, useEffect } from "react";
import { ResponsiveBar } from "@nivo/bar";
import { axisBottom } from "d3";

const NivoBar = () => {
  const [data, setData] = useState();

  useEffect(async () => {
    await Axios.post("/barsalesperyear").then((response) =>
      setData(response.data)
    );
  }, []);
  return (
    <>
      <h3 style={{ display: "sticky" }}>Volume Sales per Year</h3>
      <div style={{ height: "100%", display: "flex" }}>
        {data ? (
          <ResponsiveBar
            data={data}
            margin={{ top: 50, right: 0, bottom: 50, left: 60 }}
            indexBy="year"
            keys={["quantity"]}
            axisBottom={{ tickSize: 5, tickPadding: 5 }}
            // colors={{ scheme: "blues" }}
            // colors="rgb(68,65,162)"
            colors="rgb(160,183,103)"
            labelTextColor="white"
            labelFormat=">-,"
            tooltipFormat={(value) => `${Number(value).toLocaleString()}`}
          />
        ) : (
          ""
        )}
      </div>
    </>
  );
};

export default NivoBar;
