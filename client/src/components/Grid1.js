import React, { useState } from "react";
import "../../node_modules/react-grid-layout/css/styles.css";
import "../../node_modules/react-resizable/css/styles.css";
import GridLayout from "react-grid-layout";
import "./Grid.css";
import Home from "./Home";

const Grid1 = () => {
  const initlayout = [
    { i: "a", x: 0, y: 0, w: 10, h: 6 },
    { i: "b", x: 10, y: 0, w: 10, h: 6 },
    { i: "c", x: 20, y: 0, w: 10, h: 6 },
  ];
  const getFromLS = (key) => {
    let ls = {};
    if (global.localStorage) {
      try {
        ls = JSON.parse(global.localStorage.getItem("rgl-7")) || {};
      } catch (e) {}
    }
    return ls[key];
  };
  const saveToLS = (key, value) => {
    if (global.localStorage) {
      global.localStorage.setItem("rgl-7", JSON.stringify({ [key]: value }));
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
        >
          <div id="sales1" key="a">
            a
          </div>
          <div id="sales2" key="b">
            <Home />
          </div>
          <div id="sales2" key="c">
            c
          </div>
        </GridLayout>
      </div>
    </>
  );
};

export default Grid1;
