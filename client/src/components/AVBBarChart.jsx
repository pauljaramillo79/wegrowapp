import React, { useState, useEffect } from "react";
import moment from "moment";
import Axios from "axios";
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const AVBBarChart = ({ groupcriteria, loadeddata }) => {
  // let currentyear = moment().format("YYYY");

  // const [loadeddata, setLoadedData] = useState();

  // const [groupcriteria1, setGroupcriteria1] = useState("country");

  const [labels1, setLabels1] = useState();
  const [budgetdata, setBudgetdata] = useState();
  const [salesdata, setSalesdata] = useState();

  useEffect(() => {
    groupBy(groupcriteria, loadeddata);
  }, [loadeddata, groupcriteria]);

  const groupBy = (arg1, data) => {
    if (data) {
      console.log(data);
      let finalResult = [];
      data.forEach((item) => {
        let group = item[arg1];
        let index = finalResult.findIndex((it) => it[arg1] === group);

        if (index === -1) {
          finalResult.push({
            [arg1]: group,
            budget: item.budget,
            sold: item.sold,
          });
        } else {
          finalResult[index].budget += item.budget;
          finalResult[index].sold += item.sold;
        }
      });
      // console.log(finalResult);
      let sortedfinal = finalResult.sort((el1, el2) =>
        el1.budget < el2.budget ? 1 : el1.budget > el2.budget ? -1 : 0
      );
      let filteredfinal = sortedfinal.filter(
        (el) => el.budget > 0 || el.sold > 0
      );
      let budgetdata = filteredfinal.map((el) => el.budget);
      let salesdata = filteredfinal.map((el) => el.sold);
      let labels = filteredfinal.map((el) => el[arg1]);
      // console.log(labels);
      setLabels1(labels);
      setBudgetdata(budgetdata);
      setSalesdata(salesdata);
    }
  };

  // useEffect(() => {
  //   Axios.post("/loadcurrentbudget", { currentyear }).then((response) => {
  //     setLoadedData(response.data);
  //     groupBy(groupcriteria1, response.data);
  //   });
  // }, []);

  const options = {
    indexAxis: "y",
    responsive: true,
    aspectRatio: 0.9 / 1.5,
    layout: {
      padding: 0,
    },
  };
  const data = {
    labels: labels1,
    datasets: [
      {
        label: "Budget",
        data: budgetdata,
        backgroundColor: "red",
      },
      { label: "YTD", data: salesdata, backgroundColor: "blue" },
    ],
  };

  return <Bar options={options} data={data} />;
};

export default AVBBarChart;
