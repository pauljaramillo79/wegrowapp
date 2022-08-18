import React, { useState, useEffect } from "react";
import "../../node_modules/react-grid-layout/css/styles.css";
import "../../node_modules/react-resizable/css/styles.css";
import GridLayout from "react-grid-layout";
import "./Grid.css";
import MgmtKeyFigures from "./MgmtKeyFigures";
import Donut from "./Donut";
import NivoPie from "./NivoPie";
import NivoBar from "./NivoBar";
import NivoBar2 from "./NivoBar2";
import NivoPie2 from "./NivoPie2";
import Axios from "axios";
// import WaterfallChart from "./WaterFall";
import "./ManagementGrid.css";

const KeyFigures = () => {
  const [data1, setData1] = useState();
  let accesstoken = JSON.parse(localStorage.getItem("accesstoken"));
  let refreshtoken = JSON.parse(localStorage.getItem("refreshtoken"));

  const authAxios = Axios.create({
    headers: {
      Authorization: `Bearer ${accesstoken}`,
    },
  });
  const refreshAxios = Axios.create({
    headers: {
      Authorization: `Bearer ${refreshtoken}`,
    },
  });
  authAxios.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      if (refreshtoken && error.response.status === 403) {
        const res = await refreshAxios.post(".refreshtoken");
        accesstoken = res.data.accesstoken;
        return await authAxios.post(
          "/waterfallprofit",
          {},
          { headers: { Authorization: `Bearer ${accesstoken}` } }
        );
      }
      return Promise.reject(error.response);
    }
  );
  useEffect(() => {
    authAxios.post("/waterfallprofit").then((response) => {
      setData1(response.data);
      // console.log(response.data);
    });
  }, []);
  const initlayout = [
    { i: "a", x: 2, y: 0, w: 28, h: 4, isDraggable: true, isResizable: false },
    { i: "b", x: 2, y: 4, w: 14, h: 7, isDraggable: true, isResizable: false },
    { i: "c", x: 16, y: 4, w: 14, h: 7, isDraggable: true, isResizable: false },
    {
      i: "d",
      x: 16,
      y: 11,
      w: 14,
      h: 7,
      isDraggable: true,
      isResizable: false,
    },
    { i: "e", x: 2, y: 11, w: 14, h: 7, isDraggable: true, isResizable: false },
    { i: "f", x: 2, y: 18, w: 14, h: 7, isDraggable: true, isResizable: false },
    {
      i: "g",
      x: 2,
      y: 25,
      w: 28,
      h: 20,
      isDraggable: true,
      isResizable: false,
    },
    // { i: "c", x: 0, y: 12, w: 21, h: 8 },
  ];
  const getFromLS = (key) => {
    let ls = {};
    if (global.localStorage) {
      try {
        ls = JSON.parse(global.localStorage.getItem("rgl-mgmt")) || {};
      } catch (e) {}
    }
    return ls[key];
  };
  const saveToLS = (key, value) => {
    if (global.localStorage) {
      global.localStorage.setItem("rgl-mgmt", JSON.stringify({ [key]: value }));
    }
  };
  const onLayoutChange = (layout) => {
    saveToLS("layout", layout);
    setLayout(layout);
  };
  const originalLayout = getFromLS("layout") || initlayout;
  const [layout, setLayout] = useState(originalLayout);

  return (
    <div>
      <GridLayout
        className="layout"
        layout={layout}
        cols={36}
        rowHeight={30}
        width={1900}
        onLayoutChange={onLayoutChange}
        margin={[20, 20]}
      >
        <div id="keyfigures" key="a">
          <MgmtKeyFigures />
        </div>
        <div className="mgmtchart" id="graph" key="b">
          <NivoPie />
        </div>
        <div className="mgmtchart" id="graph1" key="c">
          {/* <NivoBar /> */}
        </div>
        <div className="mgmtchart" id="graph2" key="d">
          {/* <NivoBar2 /> */}
        </div>
        <div className="mgmtchart" id="graph3" key="e">
          <NivoPie2 />
        </div>
        <div className="mgmtchart" id="graph4" key="f">
          <h3>Profit Waterfall Chart, 2020</h3>
          {/* <NivoPie2 /> */}
          {/* <WaterfallChart data={data1 ? data1 : ""} /> */}
        </div>
        {/* <div className="mgmtchart" id="graph5" key="g">
            <h3>Sunburst Chart</h3>
            <SunburstData />
          </div> */}
        {/* <div id="sales2" key="c"></div> */}
      </GridLayout>
    </div>
  );
};

export default KeyFigures;
