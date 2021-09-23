import React, { useState } from "react";
import "../../node_modules/react-grid-layout/css/styles.css";
import "../../node_modules/react-resizable/css/styles.css";
import GridLayout from "react-grid-layout";
import "./Grid.css";
import Sales from "./Sales";
import SalesQS2 from "./SalesQS2";

import QSEditModal from "./QSEditModal";
import "./PositionsTableSort.css";

import { Responsive, WidthProvider } from "react-grid-layout";

const ResponsiveGridLayout = WidthProvider(Responsive);

const SalesGrid2 = () => {
  const initlayout = {
    lg: [
      { i: "a", x: 0, y: 13, w: 35, h: 6 },
      { i: "b", x: 0, y: 0, w: 29, h: 13 },
    ],
    md: [
      { i: "a", x: 0, y: 13, w: 35, h: 6 },
      { i: "b", x: 0, y: 0, w: 29, h: 13 },
    ],
    sm: [
      { i: "a", x: 0, y: 13, w: 35, h: 6 },
      { i: "b", x: 0, y: 0, w: 29, h: 13 },
    ],
    xs: [
      { i: "a", x: 0, y: 13, w: 35, h: 6 },
      { i: "b", x: 0, y: 0, w: 29, h: 13 },
    ],
    xxs: [
      { i: "a", x: 0, y: 13, w: 35, h: 6 },
      { i: "b", x: 0, y: 0, w: 29, h: 13 },
    ],
  };

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
  const onLayoutChange = (layout, layouts) => {
    saveToLS("layouts", layouts);
    setLayouts(layouts);
  };
  const originalLayout = getFromLS("layouts") || initlayout;
  const [layouts, setLayouts] = useState(originalLayout);
  //MODAL
  const [QSmodalState, setQSModalState] = useState(false);
  const [QStoedit, setQStoedit] = useState({});
  const showEditModal = (e, positem) => {
    // console.log(positem);
    setQSModalState(true);
    setQStoedit(positem);
  };
  const hideEditModal = () => {
    setQSModalState(false);
  };
  return (
    <>
      <div className="gridcontainer">
        <QSEditModal
          show={QSmodalState}
          handleClose={hideEditModal}
          QStoedit={QStoedit}
        />
        {/* <GridLayout
          className="layout"
          layout={layout}
          cols={36}
          rowHeight={30}
          width={1860}
          onLayoutChange={onLayoutChange}
          margin={[20, 20]}
          draggableCancel=".canceldrag"
        > */}
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
          <div id="sales1" key="a">
            <Sales
              showEditModal={showEditModal}
              hideEditModal={hideEditModal}
              QSmodalState={QSmodalState}
              QStoedit={QStoedit}
            />
          </div>
          <div id="sales2" key="b">
            <SalesQS2 />
          </div>

          {/* <div id="sales2" key="c"></div> */}
        </ResponsiveGridLayout>
        {/* </GridLayout> */}
      </div>
    </>
  );
};

export default SalesGrid2;
