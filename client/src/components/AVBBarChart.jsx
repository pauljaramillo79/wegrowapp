import React, { useState, useEffect } from "react";
import moment from "moment";
import Axios from "axios";
import "./AVBBarChart.css";
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

const AVBBarChart = ({
  groupcriteria,
  loadeddata,
  setGroupcriteria,
  filter1,
  setFilter1,
  filter2,
  setFilter2,
}) => {
  // let currentyear = moment().format("YYYY");

  // const [loadeddata, setLoadedData] = useState();

  // const [groupcriteria1, setGroupcriteria1] = useState("country");

  const [labels1, setLabels1] = useState();
  const [budgetdata, setBudgetdata] = useState();
  const [salesdata, setSalesdata] = useState();

  const [showcriteria1, setShowcriteria1] = useState("budget");
  const [show2criteria1, setShow2criteria1] = useState("sold");

  useEffect(() => {
    groupBy(groupcriteria, loadeddata, showcriteria1, show2criteria1);
  }, [loadeddata, groupcriteria, filter1, filter2]);

  const groupBy = (arg1, data, showcriteria, showcriteria2) => {
    if (data) {
      let datafiltered = [];
      if (filter1 !== "") {
        datafiltered = data.filter((item) => item["region"] === filter1);
        if (filter2 !== "") {
          datafiltered = datafiltered.filter(
            (item) => item["country"] === filter2
          );
        }
      } else {
        datafiltered = data;
      }

      console.log(data);
      let finalResult = [];
      datafiltered.forEach((item) => {
        let group = "";
        let index = 0;
        // console.log(item[arg1]);
        if (item[arg1] === "Dominican Republic") {
          group = "Dom Rep";
          index = finalResult.findIndex((it) => it[arg1] === "Dom Rep");
        } else {
          group = item[arg1];
          index = finalResult.findIndex((it) => it[arg1] === group);
        }

        if (index === -1) {
          finalResult.push({
            [arg1]: group,
            [showcriteria]: Number(item[showcriteria]),
            [showcriteria2]: Number(item[showcriteria2]),
          });
        } else {
          finalResult[index][showcriteria] += Number(item[showcriteria]);
          finalResult[index][showcriteria2] += Number(item[showcriteria2]);
        }
      });
      // console.log(finalResult);
      let sortedfinal = finalResult.sort((el1, el2) =>
        el1[showcriteria] < el2[showcriteria]
          ? 1
          : el1[showcriteria] > el2[showcriteria]
          ? -1
          : 0
      );
      let filteredfinal = sortedfinal.filter(
        (el) => el[showcriteria] > 0 || el[showcriteria2] > 0
      );
      let budgetdata = filteredfinal.map((el) => el[showcriteria]);
      let salesdata = filteredfinal.map((el) => el[showcriteria2]);
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
    // aspectRatio: 0.9 / 1.5,
    aspectRatio: 1.8 / 1.5,
    layout: {
      padding: 0,
    },
    onClick: (e) => {
      console.log(e.chart["tooltip"]["title"]);
      if (groupcriteria === "region") {
        setGroupcriteria("country");
        setFilter1(e.chart["tooltip"]["title"][0]);
      }
      if (groupcriteria === "country") {
        setGroupcriteria("prodCatName");
        setFilter2(e.chart["tooltip"]["title"][0]);
      }
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

  return (
    <>
      <Bar options={options} data={data} />
      <div className="AVBTable">
        <ul className="AVBTableHeaders">
          <li>{groupcriteria.toUpperCase()}</li>
          <li className="AVBTableFig">Budget</li>
          <li className="AVBTableFig">Sales YTD</li>
        </ul>
        {labels1
          ? labels1.map((item, i) => {
              return [
                <ul className="AVBTableRow">
                  <li>{item}</li>
                  <li className="AVBTableFig">
                    {showcriteria1 === "budgetprofit" ? "$ " : ""}
                    {budgetdata[i]
                      .toFixed(0)
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    {showcriteria1 === "budget" ? " mt" : ""}
                  </li>
                  <li className="AVBTableFig">
                    {showcriteria1 === "budgetprofit" ? "$ " : ""}
                    {salesdata[i]
                      .toFixed(0)
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    {showcriteria1 === "budget" ? " mt" : ""}
                  </li>
                </ul>,
              ];
            })
          : ""}
      </div>
    </>
  );
};

export default AVBBarChart;
