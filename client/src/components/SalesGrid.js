import React, { useState } from "react";
import "../../node_modules/react-grid-layout/css/styles.css";
import "../../node_modules/react-resizable/css/styles.css";
import GridLayout from "react-grid-layout";
import "./Grid.css";
import Sales from "./Sales";

const SalesGrid = () => {
  const initlayout = [
    { i: "a", x: 0, y: 0, w: 21, h: 12 },
    { i: "b", x: 21, y: 0, w: 10, h: 12 },
    // { i: "c", x: 0, y: 12, w: 21, h: 8 },
  ];
  const getFromLS = (key) => {
    let ls = {};
    if (global.localStorage) {
      try {
        ls = JSON.parse(global.localStorage.getItem("rgl-sales")) || {};
      } catch (e) {}
    }
    return ls[key];
  };
  const saveToLS = (key, value) => {
    if (global.localStorage) {
      global.localStorage.setItem(
        "rgl-sales",
        JSON.stringify({ [key]: value })
      );
    }
  };
  const onLayoutChange = (layout) => {
    saveToLS("layout", layout);
    setLayout(layout);
  };
  const originalLayout = getFromLS("layout") || initlayout;
  const [layout, setLayout] = useState(originalLayout);

  return (
    <>
      <div className="gridcontainer">
        <GridLayout
          className="layout"
          layout={layout}
          cols={36}
          rowHeight={30}
          width={1860}
          onLayoutChange={onLayoutChange}
          margin={[20, 20]}
        >
          <div id="sales1" key="a">
            <Sales />
          </div>
          <div id="sales2" key="b">
            Sales Quotation Sheet
          </div>
          {/* <div id="sales2" key="c"></div> */}
        </GridLayout>
      </div>
    </>
  );
};

export default SalesGrid;
