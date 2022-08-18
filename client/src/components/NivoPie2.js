import Axios from "axios";
import React, { useState, useEffect } from "react";
import { ResponsivePie } from "@nivo/pie";

const NivoPie2 = () => {
  const [data, setData] = useState();
  const [data1, setData1] = useState();

  useEffect(async () => {
    await Axios.post("/pieprofitbycountry").then((response) => {
      setData(response.data);
    });
    await Axios.post("/pievolumebycountry").then((response) => {
      setData1(response.data);
    });
  }, []);

  return (
    <>
      <h3 style={{ display: "absolute", top: 0 }}>
        Profit and Volume, by Country
      </h3>
      <div style={{ height: "100%", display: "flex" }}>
        {data && data1 ? (
          <>
            <ResponsivePie
              data={data}
              id="country"
              value="profit"
              margin={{ top: 40, right: 20, bottom: 40, left: 40 }}
              innerRadius={0.5}
              padAngle={0.7}
              cornerRadius={3}
              colors={{ scheme: "blues" }}
              valueFormat=">-$,"
              startAngle={-90}
              endAngle={270}
              arcLinkLabelsSkipAngle={15}
              // radialLabelsSkipAngle={25}
              // sliceLabelsSkipAngle={25}
              sliceLabelsTextColor="white"
              enableArcLabels={false}
            />
            <ResponsivePie
              data={data1}
              id="country"
              value="quantity"
              margin={{ top: 40, right: 40, bottom: 40, left: 0 }}
              innerRadius={0.5}
              padAngle={0.7}
              cornerRadius={3}
              colors={{ scheme: "yellow_orange_red" }}
              valueFormat=">-,"
              startAngle={-90}
              endAngle={270}
              arcLinkLabelsSkipAngle={15}
              // radialLabelsSkipAngle={60}
              // arcLabelsSkipAngle={60}
              // sliceLabelsSkipAngle={60}
              sliceLabelsTextColor="white"
              enableArcLabels={false}
            />
          </>
        ) : (
          ""
        )}
      </div>
    </>
  );
};
export default NivoPie2;
