import React, { useState, useEffect } from "react";
import "../../node_modules/react-grid-layout/css/styles.css";
import "../../node_modules/react-resizable/css/styles.css";
import { Responsive, WidthProvider } from "react-grid-layout";
import AVBBarChart from "./AVBBarChart";
import AVBBarChartContainer from "./AVBBarChartContainer";
import moment from "moment";
import Axios from "axios";

const ResponsiveGridLayout = WidthProvider(Responsive);

const AVBGrid = () => {
  const initlayout = {
    lg: [
      { i: "h", x: 0, y: 0, w: 10, h: 8 },
      { i: "j", x: 10, y: 8, w: 10, h: 8 },
    ],
    md: [
      { i: "h", x: 0, y: 0, w: 10, h: 8 },
      { i: "j", x: 10, y: 8, w: 10, h: 8 },
    ],
    sm: [
      { i: "h", x: 0, y: 0, w: 10, h: 8 },
      { i: "j", x: 10, y: 8, w: 10, h: 8 },
    ],
    xs: [
      { i: "h", x: 0, y: 0, w: 10, h: 8 },
      { i: "j", x: 10, y: 8, w: 10, h: 8 },
    ],
    xxs: [
      { i: "h", x: 0, y: 0, w: 10, h: 8 },
      { i: "j", x: 10, y: 8, w: 10, h: 8 },
    ],
  };
  const getFromLS = (key) => {
    let ls = {};
    if (global.localStorage) {
      try {
        ls = JSON.parse(global.localStorage.getItem("rgl-avb")) || {};
      } catch (e) {}
    }
    return ls[key];
  };
  const saveToLS = (key, value) => {
    if (global.localStorage) {
      global.localStorage.setItem("rgl-avb", JSON.stringify({ [key]: value }));
    }
  };
  const onLayoutChange = (layout, layouts) => {
    saveToLS("layouts", layouts);
    setLayouts(layouts);
  };
  const originalLayout = getFromLS("layouts") || initlayout;
  const [layouts, setLayouts] = useState(originalLayout);

  let currentyear = moment().format("YYYY");
  const [loadeddata, setLoadedData] = useState();
  const [groupcriteria1, setGroupcriteria1] = useState("country");
  const [groupcriteria2, setGroupcriteria2] = useState("country");

  useEffect(() => {
    Axios.post("/loadcurrentbudget", { currentyear }).then((response) => {
      setLoadedData(response.data);
    });
  }, []);

  return (
    <div>
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
        <div id="avbbarchart" key="h">
          <select
            onChange={(e) => {
              setGroupcriteria1(e.target.value);
            }}
            name="groupcriteria"
            id="groupcriteria"
          >
            <option value="country">Country</option>
            <option value="prodCatName">ProdCatName</option>
          </select>
          <AVBBarChart groupcriteria={groupcriteria1} loadeddata={loadeddata} />
        </div>
        <div id="avbbarchart2" key="j">
          <AVBBarChart groupcriteria={groupcriteria2} loadeddata={loadeddata} />
        </div>
      </ResponsiveGridLayout>
    </div>
  );
};

export default AVBGrid;
