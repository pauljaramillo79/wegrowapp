import Axios from "axios";
import React, { useState, useEffect } from "react";
import { ResponsivePie } from "@nivo/pie";

const NivoPie = () => {
  const [data, setData] = useState();
  const [data1, setData1] = useState();

  useEffect(async () => {
    await Axios.post("/donut").then((response) => {
      setData(response.data);
    });
    await Axios.post("/donutqty").then((response) => {
      setData1(response.data);
    });
  }, []);

  return (
    <>
      <h3 style={{ display: "sticky" }}>Profit and Volume, by Trader</h3>
      <div style={{ height: "100%", display: "flex" }}>
        {data && data1 ? (
          <>
            <ResponsivePie
              data={data}
              margin={{ top: 40, right: 0, bottom: 40, left: 20 }}
              innerRadius={0.5}
              padAngle={0.7}
              cornerRadius={3}
              colors={{ scheme: "blues" }}
              valueFormat=">-$,"
              startAngle={-90}
              endAngle={270}
              radialLabelsSkipAngle={10}
              sliceLabelsSkipAngle={10}
              sliceLabelsTextColor="white"
            />
            <ResponsivePie
              data={data1}
              margin={{ top: 40, right: 20, bottom: 40, left: 0 }}
              innerRadius={0.5}
              padAngle={0.7}
              cornerRadius={3}
              colors={{ scheme: "yellow_orange_red" }}
              valueFormat=">-,"
              startAngle={-90}
              endAngle={270}
              radialLabelsSkipAngle={10}
              sliceLabelsSkipAngle={10}
              sliceLabelsTextColor="white"
            />
          </>
        ) : (
          ""
        )}
        {/* <ResponsivePie
          data={data}
          margin={{ top: 40, right: 20, bottom: 40, left: 0 }}
          innerRadius={0.5}
          padAngle={0.7}
          cornerRadius={3}
          colors={{ scheme: "blues" }}
          valueFormat=">-$,"
          startAngle={-90}
          endAngle={270}
        /> */}
      </div>
    </>
  );
};
export default NivoPie;
