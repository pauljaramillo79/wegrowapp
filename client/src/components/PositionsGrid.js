import React, { useState } from "react";
import "../../node_modules/react-grid-layout/css/styles.css";
import "../../node_modules/react-resizable/css/styles.css";
import GridLayout from "react-grid-layout";
import "./Grid.css";
import Home from "./Home";
import PositionReport from "./PositionReport";
import Positions from "./Positions";
import PositionAdd from "./PositionAdd";
import PositionModal from "./PositionModal";
import "./PositionsTableSort.css";

import { Responsive, WidthProvider } from "react-grid-layout";

const ResponsiveGridLayout = WidthProvider(Responsive);

const PositionsGrid = () => {
  const initlayout = {
    lg: [
      { i: "a", x: 0, y: 0, w: 21, h: 12 },
      { i: "b", x: 21, y: 0, w: 10, h: 12 },
      { i: "c", x: 0, y: 12, w: 21, h: 8 },
    ],
    md: [
      { i: "a", x: 0, y: 0, w: 21, h: 12 },
      { i: "b", x: 21, y: 0, w: 10, h: 12 },
      { i: "c", x: 0, y: 12, w: 21, h: 8 },
    ],
    sm: [
      { i: "a", x: 0, y: 0, w: 21, h: 12 },
      { i: "b", x: 21, y: 0, w: 10, h: 12 },
      { i: "c", x: 0, y: 12, w: 21, h: 8 },
    ],
    xs: [
      { i: "a", x: 0, y: 0, w: 21, h: 12 },
      { i: "b", x: 21, y: 0, w: 10, h: 12 },
      { i: "c", x: 0, y: 12, w: 21, h: 8 },
    ],
    xxs: [
      { i: "a", x: 0, y: 0, w: 21, h: 12 },
      { i: "b", x: 21, y: 0, w: 10, h: 12 },
      { i: "c", x: 0, y: 12, w: 21, h: 8 },
    ],
  };
  // const [layouts, setLayouts] = useState(originalLayout);
  const getFromLS = (key) => {
    let ls = {};
    if (global.localStorage) {
      try {
        ls = JSON.parse(global.localStorage.getItem("rgl-positions")) || {};
      } catch (e) {}
    }
    return ls[key];
  };
  const saveToLS = (key, value) => {
    if (global.localStorage) {
      global.localStorage.setItem(
        "rgl-positions",
        JSON.stringify({ [key]: value })
      );
    }
  };
  const onLayoutChange = (layout, layouts) => {
    console.log(layout, layouts);
    saveToLS("layouts", layouts);
    setLayouts(layouts);
  };
  const originalLayout = getFromLS("layouts") || initlayout;
  const [layouts, setLayouts] = useState(originalLayout);

  //MODAL
  const [modalState, setModalState] = useState(false);
  const [postoedit, setPostoedit] = useState({});
  const showEditModal = (e, positem) => {
    console.log(positem);
    setModalState(true);
    setPostoedit(positem);
  };
  const hideEditModal = () => {
    setModalState(false);
  };
  return (
    <>
      <div className="gridcontainer">
        <PositionModal
          show={modalState}
          handleClose={hideEditModal}
          positiontoedit={postoedit}
        />
        <ResponsiveGridLayout
          className="layout"
          breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
          layouts={layouts}
          cols={{ lg: 36, md: 36, sm: 36, xs: 36, xxs: 2 }}
          // cols={36}
          rowHeight={30}
          // width={1860}
          onLayoutChange={(layout, layouts) => {
            onLayoutChange(layout, layouts);
          }}
          margin={[20, 20]}
          draggableCancel=".canceldrag"
        >
          <div id="sales1" key="a">
            <PositionReport />
          </div>
          <div id="sales2" key="b">
            <PositionAdd />
          </div>
          <div id="sales2" key="c">
            <Positions
              showEditModal={showEditModal}
              hideEditModal={hideEditModal}
              modalState={modalState}
              postoedit={postoedit}
            />
          </div>
        </ResponsiveGridLayout>
      </div>
    </>
  );
};

export default PositionsGrid;
