import React, { useState, useContext } from "react";
import "../../node_modules/react-grid-layout/css/styles.css";
import "../../node_modules/react-resizable/css/styles.css";
import GridLayout from "react-grid-layout";
import "./Grid.css";
import Home from "./Home";
import PositionReport from "./PositionReport";
import Positions from "./Positions";
import PositionAdd from "./PositionAdd";
import PositionModal from "./PositionModal";
import AddProductModal from "./AddProductModal";
import "./PositionsTableSort.css";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { ReactComponent as RefreshIcon } from "../assets/_images/refreshicon.svg";
import { RefreshPositionsContext } from "../contexts/RefreshPositionsProvider";
import { ProfRepProvider } from "../contexts/ProfRepProvider";

import { Responsive, WidthProvider } from "react-grid-layout";
import USPositionReport from "./USPositionReport";

const ResponsiveGridLayout = WidthProvider(Responsive);

const PositionsGrid = () => {
  const { posrefresh, togglePosrefresh } = useContext(RefreshPositionsContext);

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
    // console.log(layout, layouts);
    saveToLS("layouts", layouts);
    setLayouts(layouts);
  };
  const originalLayout = getFromLS("layouts") || initlayout;
  const [layouts, setLayouts] = useState(originalLayout);

  //MODALS
  const [modalState, setModalState] = useState(false);
  const [addprodmodalstate, setAddprodmodalstate] = useState(false);
  const [postoedit, setPostoedit] = useState({});
  const showEditModal = (e, positem) => {
    // console.log(positem);
    setModalState(true);
    setPostoedit(positem);
  };
  const showAddProdModal = (e) => {
    setAddprodmodalstate(true);
  };
  const hideEditModal = (e) => {
    e.preventDefault();
    setModalState(false);
  };
  const hideAddProdModal = (e) => {
    e.preventDefault();
    setAddprodmodalstate(false);
  };
  return (
    <>
      <div className="gridcontainer">
        <AddProductModal
          showAddProd={addprodmodalstate}
          handleClose={hideAddProdModal}
        />
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
          <div id="positions1" key="a">
            <div className="positionreporttitleline">
              <h3 className="positionreporttitle">Position Report</h3>
              <RefreshIcon
                className="refreshicon"
                onClick={(e) => {
                  togglePosrefresh();
                }}
              />
            </div>
            <ProfRepProvider>
              <Tabs>
                <TabList>
                  <Tab>Global</Tab>
                  <Tab>USA Distribution</Tab>
                </TabList>
                <TabPanel>
                  <PositionReport key="positionreport" />
                </TabPanel>
                {/* <TabPanel>USA Position Report Here</TabPanel> */}
                <TabPanel>
                  <USPositionReport key="usapositionreport" />
                </TabPanel>
              </Tabs>
            </ProfRepProvider>
          </div>
          <div id="positions2" key="b">
            <PositionAdd key="positionadd" showAddProd={showAddProdModal} />
          </div>
          <div id="positions2" key="c">
            <Positions
              showEditModal={showEditModal}
              hideEditModal={hideEditModal}
              modalState={modalState}
              postoedit={postoedit}
              key="positions"
            />
          </div>
        </ResponsiveGridLayout>
      </div>
    </>
  );
};

export default PositionsGrid;
