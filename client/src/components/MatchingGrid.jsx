import React, { useState } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import "./MatchingGrid.css";
import Axios from "axios";
import { useEffect } from "react";
import MatchingReport from "./MatchingReport";

const ResponsiveGridLayout = WidthProvider(Responsive);

const MatchingGrid = () => {
  const initlayout = {
    lg: [{ i: "h", x: 0, y: 0, w: 30, h: 14 }],
    md: [{ i: "h", x: 0, y: 0, w: 30, h: 14 }],
    sm: [{ i: "h", x: 0, y: 0, w: 30, h: 14 }],
    xs: [{ i: "h", x: 0, y: 0, w: 30, h: 14 }],
    xxs: [{ i: "h", x: 0, y: 0, w: 30, h: 14 }],
  };

  const getFromLS = (key) => {
    let ls = {};
    if (global.localStorage) {
      try {
        ls = JSON.parse(global.localStorage.getItem("rgl-matching")) || {};
      } catch (e) {}
    }
    return ls[key];
  };
  const saveToLS = (key, value) => {
    if (global.localStorage) {
      global.localStorage.setItem(
        "rgl-matching",
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

  const [positions, setPositions] = useState();
  const [matchingpossales, setMatchingpossales] = useState();

  useEffect(() => {
    Axios.post("/matchingposreport").then((response) => {
      setPositions(response.data);
      Axios.post("/poslist").then((res) => {
        console.log(res.data);
        const posl = [];

        res.data.forEach((x) => posl.push(x.USWGP));
        const posl1 = String(posl);
        console.log(posl1);
        Axios.post("/matchingpossales", { posl1 }).then((resp) => {
          setMatchingpossales(resp.data);
        });
      });
    });
  }, []);

  return (
    <>
      <ResponsiveGridLayout
        className="layout"
        style={{ left: "2px" }}
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
        <div id="matching" key="h">
          <div className="matchreporttitle">
            <h3>Matching Report</h3>
          </div>
          {/* {positions
            ? positions.map((item) => (
                <ul style={{ display: "flex" }}>
                  <li>USWGP: {item.USWGP}</li>
                  <li>Product: {item.abbreviation}</li>
                </ul>
              ))
            : ""} */}
          <MatchingReport
            posdata={positions}
            matchingpossales={matchingpossales}
          />
        </div>
      </ResponsiveGridLayout>
    </>
  );
};

export default MatchingGrid;
