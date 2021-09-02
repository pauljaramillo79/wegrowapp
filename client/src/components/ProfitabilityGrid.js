import React, { useState } from "react";
import "../../node_modules/react-grid-layout/css/styles.css";
import "../../node_modules/react-resizable/css/styles.css";
import { Responsive, WidthProvider } from "react-grid-layout";
import "./Grid.css";
import ProfitabilityReport from "./ProfitabilityReport";

const ResponsiveGridLayout = WidthProvider(Responsive);

const ProfitabilityGrid = () => {
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
  return (
    <>
      <ResponsiveGridLayout
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
          <ProfitabilityReport />
        </div>
        <div id="profitabilitychart" key="j"></div>
      </ResponsiveGridLayout>
    </>
  );
};

export default ProfitabilityGrid;
