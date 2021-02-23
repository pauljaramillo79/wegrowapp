import React, { useState } from "react";
import "../../node_modules/react-grid-layout/css/styles.css";
import "../../node_modules/react-resizable/css/styles.css";
import _ from "lodash";
// import GridLayout from "react-grid-layout";
import { WidthProvider, Responsive } from "react-grid-layout";
import "./Grid.css";
import Home from "./Home";
const ResponsiveReactGridLayout = WidthProvider(Responsive);

const Grid = () => {
  const [cols] = useState({ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 });
  const inititems = [0, 1, 2, 3, 4].map((i, key, list) => {
    return {
      i: i.toString(),
      x: i * 2,
      y: 0,
      w: 2,
      h: 2,
      //   add: i === list.length - 1,
    };
  });
  const [items, setItems] = useState(inititems);
  //   console.log(items);

  const [counter, setCounter] = useState(0);
  const initlayout = [
    { i: "a", x: 0, y: 0, w: 1, h: 6 },
    { i: "b", x: 1, y: 0, w: 3, h: 6 },
    { i: "c", x: 4, y: 0, w: 1, h: 6 },
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
  const createElement = (el) => {
    const removeStyle = {
      position: "absolute",
      right: "2px",
      top: 0,
      cursor: "pointer",
    };
    const i = el.i;
    return (
      <div key={i} data-grid={el}>
        <span className="text">{<Home />}</span>
        <span
          className="remove"
          style={removeStyle}
          onClick={() => onRemoveItem(i)}
        >
          Close
        </span>
      </div>
    );
  };
  const onAddItem = () => {
    console.log("adding", "n" + counter);
    console.log(items.length);
    setItems([
      ...items,
      {
        i: "n" + counter,
        x: (items.length * 2) % 12,
        y: Infinity,
        w: 2,
        h: 2,
      },
    ]);
    setCounter(counter + 1);
  };
  const onRemoveItem = (i) => {
    console.log("removing", i);
    setItems(_.reject(items, { i: i }));
  };
  return (
    <>
      <div className="gridcontainer">
        <button onClick={onAddItem}>Add Item</button>
        <ResponsiveReactGridLayout
          onLayoutChange={onLayoutChange}
          className="layout"
          layout={layout}
          cols={cols}
          rowHeight={100}
        >
          {_.map(items, (el) => createElement(el))}
        </ResponsiveReactGridLayout>
        {/* <GridLayout
          className="layout"
          layout={layout}
          cols={cols}
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
        </GridLayout> */}
      </div>
    </>
  );
};

export default Grid;
