import React, { useState, useEffect } from "react";
import Axios from "axios";
import "../../node_modules/react-grid-layout/css/styles.css";
import "../../node_modules/react-resizable/css/styles.css";
import { Responsive, WidthProvider } from "react-grid-layout";
import "./Grid.css";
import "./ProfitabilityGrid.css";
import ProfitabilityReport from "./ProfitabilityReport";
import WaterfallChart from "./WaterFall";

const ResponsiveGridLayout = WidthProvider(Responsive);

const ProfitabilityGrid = () => {
  const [data1, setData1] = useState();
  let accesstoken = JSON.parse(localStorage.getItem("accesstoken"));
  let refreshtoken = JSON.parse(localStorage.getItem("refreshtoken"));

  const authAxios = Axios.create({
    headers: {
      Authorization: `Bearer ${accesstoken}`,
    },
  });
  const refreshAxios = Axios.create({
    headers: {
      Authorization: `Bearer ${refreshtoken}`,
    },
  });
  authAxios.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      if (refreshtoken && error.response.status === 403) {
        const res = await refreshAxios.post(".refreshtoken");
        accesstoken = res.data.accesstoken;
        return await authAxios.post(
          "/waterfallprofit",
          {},
          { headers: { Authorization: `Bearer ${accesstoken}` } }
        );
      }
      return Promise.reject(error.response);
    }
  );
  useEffect(() => {
    authAxios.post("/waterfallprofit").then((response) => {
      setData1(response.data);
      // console.log(response.data);
    });
  }, []);
  const initlayout = {
    lg: [
      { i: "h", x: 0, y: 0, w: 30, h: 14 },
      { i: "j", x: 30, y: 14, w: 10, h: 14 },
    ],
    md: [
      { i: "h", x: 0, y: 0, w: 30, h: 14 },
      { i: "j", x: 30, y: 14, w: 10, h: 14 },
    ],
    sm: [
      { i: "h", x: 0, y: 0, w: 30, h: 14 },
      { i: "j", x: 30, y: 14, w: 10, h: 14 },
    ],
    xs: [
      { i: "h", x: 0, y: 0, w: 30, h: 14 },
      { i: "j", x: 30, y: 14, w: 10, h: 14 },
    ],
    xxs: [
      { i: "h", x: 0, y: 0, w: 30, h: 14 },
      { i: "j", x: 30, y: 14, w: 10, h: 14 },
    ],
  };
  const getFromLS = (key) => {
    let ls = {};
    if (global.localStorage) {
      try {
        ls = JSON.parse(global.localStorage.getItem("rgl-profitability")) || {};
      } catch (e) {}
    }
    return ls[key];
  };
  const saveToLS = (key, value) => {
    if (global.localStorage) {
      global.localStorage.setItem(
        "rgl-profitability",
        JSON.stringify({ [key]: value })
      );
    }
  };
  const onLayoutChange = (layout, layouts) => {
    saveToLS("layouts", layouts);
    setLayouts(layouts);
  };
  const originalLayout = getFromLS("layouts") || initlayout;
  const [layouts, setLayouts] = useState(originalLayout);

  const periodfilters = [
    "This month",
    "Last 3 months",
    "This year",
    "Last 12 months",
    "Custom",
  ];

  const [clickedId, setClickedId] = useState(0);

  const handleClick = (event, id) => {
    setClickedId(id);
  };

  return (
    <>
      <ResponsiveGridLayout
        style={{ left: "2px" }}
        className="layout"
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        layouts={layouts}
        cols={{ lg: 36, md: 36, sm: 36, xs: 36, xxs: 2 }}
        rowHeight={30}
        onLayoutChange={(layout, layouts) => {
          onLayoutChange(layout, layouts);
        }}
        margin={[20, 20]}
        draggableCancel=".canceldrag"
      >
        <div id="profitability" key="h">
          <h3>Profitability Report</h3>
          <div className="periodfilter">
            <p>Period:</p>
            {periodfilters.map((buttonlabel, i) => (
              <button
                key={i}
                name={buttonlabel}
                onClick={(event) => handleClick(event, i)}
                className={
                  i === clickedId
                    ? "periodfilterbutton active"
                    : "periodfilterbutton"
                }
              >
                {buttonlabel}
              </button>
            ))}
            {/* <button>This month</button>
            <button>Last 3 months</button>
            <button>This year</button>
            <button>Last 12 months</button>
            <p>Custom:</p> */}
          </div>
          <ProfitabilityReport />
        </div>
        <div id="profitabilitychart" key="j">
          <h3>Profit Waterfall Chart, 2020</h3>
          <WaterfallChart data={data1 ? data1 : ""} />
        </div>
      </ResponsiveGridLayout>
    </>
  );
};

export default ProfitabilityGrid;
