import React, { useContext, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { ProfitabilityContext } from "../contexts/ProfitabilityProvider";
import { useEffect } from "react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const PRBarChartProf = ({ profitreportgroupby }) => {
  const { prdata } = useContext(ProfitabilityContext);

  Array.prototype.groupBy = function (key) {
    return this.reduce(function (groups, item) {
      const val = item[key];
      groups[val] = groups[val] || [];
      groups[val].push(item);
      return groups;
    }, {});
  };

  const sumtotal = (data, param) => {
    let totalval = 0;
    for (var x of data) {
      totalval += x[param];
    }
    return totalval;
  };

  const [dat2, setDat2] = useState();

  const [labels, setLabels] = useState();

  useEffect(() => {
    if (prdata) {
      const dat1 = prdata.groupBy(profitreportgroupby);
      setLabels(Object.keys(dat1));
      setDat2(
        Object.entries(dat1).map((i, key) => {
          // return [i[1].map((x) => x.profit)];
          return sumtotal(i[1], "profit");
        })
      );
    }
  }, [prdata, profitreportgroupby]);

  const options = { responsive: true };
  const data = {
    labels,
    datasets: [
      {
        label: "Profit ($)",
        data: dat2,
        backgroundColor: "rgba(160, 182, 103, 0.7)",
      },
    ],
  };
  return <Bar options={options} data={data} />;
};

export default PRBarChartProf;
