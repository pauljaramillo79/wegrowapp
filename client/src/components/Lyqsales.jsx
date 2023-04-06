import React, { useState, useEffect } from "react";
import "./AnalysisGrid.css";
import Axios from "axios";
import AnalysisLastYSales from "./AnalysisLastYSales";
import "../../node_modules/react-grid-layout/css/styles.css";
import "../../node_modules/react-resizable/css/styles.css";
import { Responsive, WidthProvider } from "react-grid-layout";

const ResponsiveGridLayout = WidthProvider(Responsive);

const Lyqsales = () => {
  const initlayout = {
    lg: [{ i: "a", x: 0, y: 0, w: 30, h: 14 }],
    md: [{ i: "a", x: 0, y: 0, w: 30, h: 14 }],
    sm: [{ i: "a", x: 0, y: 0, w: 30, h: 14 }],
    xs: [{ i: "a", x: 0, y: 0, w: 30, h: 14 }],
    xxs: [{ i: "a", x: 0, y: 0, w: 30, h: 14 }],
  };

  const getFromLS = (key) => {
    let ls = {};
    if (global.localStorage) {
      try {
        ls = JSON.parse(global.localStorage.getItem("rgl-analysis")) | {};
      } catch (e) {}
    }
    return ls[key];
  };
  const saveToLS = (key, value) => {
    if (global.localStorage) {
      global.localStorage.setItem(
        "rgl-analysis",
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
  const [lyuser, setLyuser] = useState(
    JSON.parse(localStorage.getItem("WGusercode"))
  );
  const [traders, setTraders] = useState();

  useEffect(() => {
    Axios.post("/traders").then((response) => {
      setTraders(response.data);
    });
  }, []);
  return (
    <div>
      {" "}
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
        <div id="lastyearsales" key="a">
          <div className="lystitlesection">
            <h3 className="lystitle">Last Year Sales and Indications</h3>
            <select onChange={(e) => setLyuser(e.target.value)}>
              <option value="all">All</option>
              {traders
                ? traders.map((trader) => {
                    if (trader.trader === lyuser) {
                      return (
                        <option selected value={trader.trader}>
                          {trader.trader}
                        </option>
                      );
                    } else {
                      return (
                        <option value={trader.trader}>{trader.trader}</option>
                      );
                    }
                  })
                : "reload"}
            </select>
          </div>
          <AnalysisLastYSales userID={lyuser} />
        </div>
      </ResponsiveGridLayout>
    </div>
  );
};

export default Lyqsales;
