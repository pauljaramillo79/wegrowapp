import Axios from "axios";
import React, { useState, useEffect } from "react";
import { ResponsiveBar } from "@nivo/bar";
import { axisBottom } from "d3";

const NivoBar = () => {
  const [data, setData] = useState();
  const [data1, setData1] = useState([
    {
      country: "AD",
      "hot dog": 66,
      "hot dogColor": "hsl(334, 70%, 50%)",
      burger: 132,
      burgerColor: "hsl(57, 70%, 50%)",
      sandwich: 17,
      sandwichColor: "hsl(142, 70%, 50%)",
      kebab: 57,
      kebabColor: "hsl(244, 70%, 50%)",
      fries: 56,
      friesColor: "hsl(26, 70%, 50%)",
      donut: 172,
      donutColor: "hsl(222, 70%, 50%)",
    },
    {
      country: "AE",
      "hot dog": 155,
      "hot dogColor": "hsl(8, 70%, 50%)",
      burger: 166,
      burgerColor: "hsl(169, 70%, 50%)",
      sandwich: 75,
      sandwichColor: "hsl(194, 70%, 50%)",
      kebab: 56,
      kebabColor: "hsl(136, 70%, 50%)",
      fries: 161,
      friesColor: "hsl(18, 70%, 50%)",
      donut: 142,
      donutColor: "hsl(254, 70%, 50%)",
    },
    {
      country: "AF",
      "hot dog": 137,
      "hot dogColor": "hsl(308, 70%, 50%)",
      burger: 121,
      burgerColor: "hsl(178, 70%, 50%)",
      sandwich: 100,
      sandwichColor: "hsl(83, 70%, 50%)",
      kebab: 87,
      kebabColor: "hsl(1, 70%, 50%)",
      fries: 99,
      friesColor: "hsl(202, 70%, 50%)",
      donut: 94,
      donutColor: "hsl(359, 70%, 50%)",
    },
    {
      country: "AG",
      "hot dog": 169,
      "hot dogColor": "hsl(112, 70%, 50%)",
      burger: 76,
      burgerColor: "hsl(113, 70%, 50%)",
      sandwich: 18,
      sandwichColor: "hsl(244, 70%, 50%)",
      kebab: 165,
      kebabColor: "hsl(21, 70%, 50%)",
      fries: 167,
      friesColor: "hsl(199, 70%, 50%)",
      donut: 5,
      donutColor: "hsl(290, 70%, 50%)",
    },
    {
      country: "AI",
      "hot dog": 102,
      "hot dogColor": "hsl(92, 70%, 50%)",
      burger: 151,
      burgerColor: "hsl(147, 70%, 50%)",
      sandwich: 136,
      sandwichColor: "hsl(123, 70%, 50%)",
      kebab: 2,
      kebabColor: "hsl(223, 70%, 50%)",
      fries: 196,
      friesColor: "hsl(145, 70%, 50%)",
      donut: 63,
      donutColor: "hsl(134, 70%, 50%)",
    },
    {
      country: "AL",
      "hot dog": 76,
      "hot dogColor": "hsl(169, 70%, 50%)",
      burger: 111,
      burgerColor: "hsl(243, 70%, 50%)",
      sandwich: 108,
      sandwichColor: "hsl(21, 70%, 50%)",
      kebab: 170,
      kebabColor: "hsl(200, 70%, 50%)",
      fries: 15,
      friesColor: "hsl(68, 70%, 50%)",
      donut: 104,
      donutColor: "hsl(55, 70%, 50%)",
    },
    {
      country: "AM",
      "hot dog": 128,
      "hot dogColor": "hsl(169, 70%, 50%)",
      burger: 25,
      burgerColor: "hsl(86, 70%, 50%)",
      sandwich: 187,
      sandwichColor: "hsl(185, 70%, 50%)",
      kebab: 144,
      kebabColor: "hsl(48, 70%, 50%)",
      fries: 1,
      friesColor: "hsl(273, 70%, 50%)",
      donut: 44,
      donutColor: "hsl(300, 70%, 50%)",
    },
  ]);

  useEffect(async () => {
    await Axios.post("/barsalesperyear").then((response) => {
      setData(response.data);
      console.log(response.data);
    });
  }, []);
  return (
    <>
      <h3 style={{ display: "sticky" }}>Volume Sales per Year</h3>
      <div style={{ height: "100%", display: "flex" }}>
        {data1
          ? ""
          : // <ResponsiveBar
            //   data={data1}
            //   keys={["hot dog", "burger", "sandwich", "kebab", "fries", "donut"]}
            //   indexBy="country"
            //   margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
            //   padding={0.3}
            //   valueScale={{ type: "linear" }}
            //   indexScale={{ type: "band", round: true }}
            //   colors={{ scheme: "nivo" }}
            //   defs={[
            //     {
            //       id: "dots",
            //       type: "patternDots",
            //       background: "inherit",
            //       color: "#38bcb2",
            //       size: 4,
            //       padding: 1,
            //       stagger: true,
            //     },
            //     {
            //       id: "lines",
            //       type: "patternLines",
            //       background: "inherit",
            //       color: "#eed312",
            //       rotation: -45,
            //       lineWidth: 6,
            //       spacing: 10,
            //     },
            //   ]}
            //   fill={[
            //     {
            //       match: {
            //         id: "fries",
            //       },
            //       id: "dots",
            //     },
            //     {
            //       match: {
            //         id: "sandwich",
            //       },
            //       id: "lines",
            //     },
            //   ]}
            //   borderColor={{
            //     from: "color",
            //     modifiers: [["darker", 1.6]],
            //   }}
            //   axisTop={null}
            //   axisRight={null}
            //   axisBottom={{
            //     tickSize: 5,
            //     tickPadding: 5,
            //     tickRotation: 0,
            //     legend: "country",
            //     legendPosition: "middle",
            //     legendOffset: 32,
            //   }}
            //   axisLeft={{
            //     tickSize: 5,
            //     tickPadding: 5,
            //     tickRotation: 0,
            //     legend: "food",
            //     legendPosition: "middle",
            //     legendOffset: -40,
            //   }}
            //   labelSkipWidth={12}
            //   labelSkipHeight={12}
            //   labelTextColor={{
            //     from: "color",
            //     modifiers: [["darker", 1.6]],
            //   }}
            //   legends={[
            //     {
            //       dataFrom: "keys",
            //       anchor: "bottom-right",
            //       direction: "column",
            //       justify: false,
            //       translateX: 120,
            //       translateY: 0,
            //       itemsSpacing: 2,
            //       itemWidth: 100,
            //       itemHeight: 20,
            //       itemDirection: "left-to-right",
            //       itemOpacity: 0.85,
            //       symbolSize: 20,
            //       effects: [
            //         {
            //           on: "hover",
            //           style: {
            //             itemOpacity: 1,
            //           },
            //         },
            //       ],
            //     },
            //   ]}
            //   role="application"
            //   ariaLabel="Nivo bar chart demo"
            //   barAriaLabel={function(e) {
            //     return (
            //       e.id + ": " + e.formattedValue + " in country: " + e.indexValue
            //     );
            //   }}
            // />
            // <ResponsiveBar
            //   data={data1}
            //   margin={{ top: 50, right: 0, bottom: 50, left: 60 }}
            //   indexBy="year"
            //   keys={["quantity"]}
            //   padding={0.3}
            //   valueScale={{ type: "linear" }}
            //   indexScale={{ type: "band", round: true }}
            //   colors={{ scheme: "nivo" }}
            //   axisBottom={{ tickSize: 5, tickPadding: 5 }}
            //   // colors={{ scheme: "blues" }}
            //   // colors="rgb(68,65,162)"
            //   // colors="rgb(160,183,103)"
            //   labelTextColor="white"
            //   labelFormat=">-,"
            //   tooltipFormat={(value) => `${Number(value).toLocaleString()}`}
            // />
            ""}
      </div>
    </>
  );
};

export default NivoBar;
