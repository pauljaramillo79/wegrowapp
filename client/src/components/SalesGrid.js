import React, { useState } from "react";
import "../../node_modules/react-grid-layout/css/styles.css";
import "../../node_modules/react-resizable/css/styles.css";
import GridLayout from "react-grid-layout";
import "./Grid.css";
import Sales from "./Sales";
import SalesQS from "./SalesQS";

import QSEditModal from "./QSEditModal";
import "./PositionsTableSort.css";

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
  //MODAL
  const [QSmodalState, setQSModalState] = useState(false);
  const [QStoedit, setQStoedit] = useState({});
  const showEditModal = (e, positem) => {
    console.log(positem);
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
        <GridLayout
          className="layout"
          layout={layout}
          cols={36}
          rowHeight={30}
          width={1860}
          onLayoutChange={onLayoutChange}
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
            <SalesQS />
          </div>
          {/* <div id="sales2" key="c"></div> */}
        </GridLayout>
      </div>
    </>
  );
};

export default SalesGrid;
