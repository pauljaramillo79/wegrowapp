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

  const [q1budgetdata, setq1budgetdata] = useState();
  const [q2budgetdata, setq2budgetdata] = useState();
  const [q3budgetdata, setq3budgetdata] = useState();
  const [q4budgetdata, setq4budgetdata] = useState();
  const [q1salesdata, setq1salesdata] = useState();
  const [q2salesdata, setq2salesdata] = useState();
  const [q3salesdata, setq3salesdata] = useState();
  const [q4salesdata, setq4salesdata] = useState();

  const [showcriteria1, setShowcriteria1] = useState("budget");
  const [show2criteria1, setShow2criteria1] = useState("sold");

  useEffect(() => {
    // groupBy2(groupcriteria, loadeddata, showcriteria1, show2criteria1);
    groupBy3(groupcriteria, loadeddata, showcriteria1, show2criteria1);
  }, [loadeddata, groupcriteria, filter1, filter2]);

  Array.prototype.groupBy = function(key) {
    return this.reduce(function(groups, item) {
      const val = item[key];
      groups[val] = groups[val] || [];
      groups[val].push(item);
      return groups;
    }, {});
  };

  const groupBy3 = (
    groupcriteria,
    loadeddata,
    showcriteria1,
    sho2criteria1
  ) => {
    if (loadeddata) {
      let datafiltered = [];
      if (filter1 !== "") {
        datafiltered = loadeddata.filter((item) => item["region"] === filter1);
        if (filter2 !== "") {
          datafiltered = datafiltered.filter(
            (item) => item["country"] === filter2
          );
        }
      } else {
        datafiltered = loadeddata;
      }
      // let labels = [];
      // let q1data = [];
      // let q2data = [];
      // let q3data = [];
      // let q4data = [];
      let quartergroupdata = [];
      let finaldata = [];
      let groupeddata = datafiltered.groupBy(groupcriteria);
      for (const [key1, val1] of Object.entries(groupeddata)) {
        quartergroupdata = { group: key1 };
        // labels.push(key1);
        let qgroupeddata = val1.groupBy("qq");
        // console.log(qgroupeddata);
        let quarter = "";
        let qb1 = 0;
        let qb2 = 0;
        let qb3 = 0;
        let qb4 = 0;
        // let totalb = 0;
        let qs1 = 0;
        let qs2 = 0;
        let qs3 = 0;
        let qs4 = 0;
        // let totals = 0;
        for (const [key2, val2] of Object.entries(qgroupeddata)) {
          if (Number(key2) === 1) {
            val2.forEach((item) => {
              qb1 += item["budget"];
              qs1 += item["sold"];
            });
            // quarter = key2;
          }
          if (Number(key2) === 2) {
            val2.forEach((item) => {
              qb2 += item["budget"];
              qs2 += item["sold"];
            }); // quarter = key2;
          }
          if (Number(key2) === 3) {
            val2.forEach((item) => {
              qb3 += item["budget"];
              qs3 += item["sold"];
            });
          }
          if (Number(key2) === 4) {
            val2.forEach((item) => {
              qb4 += item["budget"];
              qs4 += item["sold"];
            });
          }
        }
        quartergroupdata = {
          ...quartergroupdata,
          qb1: qb1,
          qb2: qb2,
          qb3: qb3,
          qb4: qb4,
          totalb: qb1 + qb2 + qb3 + qb4,
          qs1: qs1,
          qs2: qs2,
          qs3: qs3,
          qs4: qs4,
          totals: qb1 + qb2 + qb3 + qb4,
        };
        // console.log(quartergroupdata);
        // q1data.push(q1);
        // q2data.push(q2);
        // q3data.push(q3);
        // q4data.push(q4);
        finaldata.push(quartergroupdata);
      }
      let sortedfinal = finaldata.sort((el1, el2) =>
        el1["totalb"] < el2["totalb"]
          ? 1
          : el1["totalb"] > el2["totalb"]
          ? -1
          : 0
      );
      let filteredfinal = sortedfinal.filter(
        (el) => el["totalb"] > 0 || el["totalb"] > 0
      );
      // console.log(sortedfinal);
      let labels = filteredfinal.map((el) => el["group"]);
      let q1bdata = filteredfinal.map((el) => el["qb1"]);
      let q2bdata = filteredfinal.map((el) => el["qb2"]);
      let q3bdata = filteredfinal.map((el) => el["qb3"]);
      let q4bdata = filteredfinal.map((el) => el["qb4"]);
      let q1sdata = filteredfinal.map((el) => el["qs1"]);
      let q2sdata = filteredfinal.map((el) => el["qs2"]);
      let q3sdata = filteredfinal.map((el) => el["qs3"]);
      let q4sdata = filteredfinal.map((el) => el["qs4"]);

      setLabels1(labels);
      setq1budgetdata(q1bdata);
      setq2budgetdata(q2bdata);
      setq3budgetdata(q3bdata);
      setq4budgetdata(q4bdata);
      setq1salesdata(q1sdata);
      setq2salesdata(q2sdata);
      setq3salesdata(q3sdata);
      setq4salesdata(q4sdata);

      // console.log(labels, q1data, q2data, q3data, q4data);
    }
  };

  const groupBy2 = (arg1, data, showcriteria, showcriteria2) => {
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

      let finalResult = [];

      console.log(datafiltered.groupBy("qq"));

      datafiltered.forEach((item) => {
        let group = "";
        let index = 0;
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
      if (groupcriteria === "productGroup") {
        setGroupcriteria("prodCatName");
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
        label: "Budget Q1",
        data: q1budgetdata,
        backgroundColor: "rgba(68, 65, 162,1)",
        stack: "Stack 0",
      },
      {
        label: "Budget Q2",
        data: q2budgetdata,
        backgroundColor: "rgba(68, 65, 162,0.7)",
        stack: "Stack 0",
      },
      {
        label: "Budget Q3",
        data: q3budgetdata,
        backgroundColor: "rgba(68, 65, 162,0.4)",
        stack: "Stack 0",
      },
      {
        label: "Budget Q4",
        data: q4budgetdata,
        backgroundColor: "rgba(68, 65, 162,0.25)",
        stack: "Stack 0",
      },
      {
        label: "Sales Q1",
        data: q1salesdata,
        backgroundColor: "rgba(160, 182, 103,1)",
        stack: "Stack 1",
      },
      {
        label: "Sales Q2",
        data: q2salesdata,
        backgroundColor: "rgba(160, 182, 103,0.7)",
        stack: "Stack 1",
      },
      {
        label: "Sales Q3",
        data: q3salesdata,
        backgroundColor: "rgba(160, 182, 103,0.4)",
        stack: "Stack 1",
      },
      {
        label: "Sales Q4",
        data: q4salesdata,
        backgroundColor: "rgba(160, 182, 103,0.25)",
        stack: "Stack 1",
      },
      // {
      //   // label: "YTD",
      //   // data: salesdata,
      //   // backgroundColor: "blue",
      //   // stack: "Stack 0",
      // },
    ],
  };

  return (
    <>
      <Bar options={options} data={data} />
      {/* <div className="AVBTable">
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
      </div> */}
    </>
  );
};

export default AVBBarChart;
