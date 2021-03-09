import Axios from "axios";
import React, { useState, useEffect } from "react";
import * as d3 from "d3";
import PieSVG from "./PieSVG";

const Donut = () => {
  const [data, setData] = useState();

  useEffect(async () => {
    await Axios.post("/donut").then((response) => setData(response.data));
  }, []);
  return (
    <div>
      <span className="label">SVG Elements</span>
      <PieSVG
        data={data ? data : ""}
        width={400}
        height={400}
        innerRadius={90}
        outerRadius={160}
      />
    </div>
  );
};

export default Donut;
