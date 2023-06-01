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
  Interaction,
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
  groupcriteria2,
  groupcriteria3,
  groupcriteria4,
  loadeddata,
  setGroupcriteria,
  setGroupcriteria2,
  setGroupcriteria3,
  setGroupcriteria4,
  filter1,
  setFilter1,
  filter2,
  setFilter2,
  filter3,
  setFilter3,
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
  const [q1budgetprofit, setq1budgetprofit] = useState();
  const [q2budgetprofit, setq2budgetprofit] = useState();
  const [q3budgetprofit, setq3budgetprofit] = useState();
  const [q4budgetprofit, setq4budgetprofit] = useState();
  const [q1salesprofit, setq1salesprofit] = useState();
  const [q2salesprofit, setq2salesprofit] = useState();
  const [q3salesprofit, setq3salesprofit] = useState();
  const [q4salesprofit, setq4salesprofit] = useState();
  const [filteredfinal, setFilteredfinal] = useState();

  const [currentquarter, setCurrentquarter] = useState(moment().quarter());
  // const [currentquarter, setCurrentquarter] = useState(2);

  const [showcriteria1, setShowcriteria1] = useState("budget");
  const [show2criteria1, setShow2criteria1] = useState("sold");

  let initgroupbuttons = [
    "Region",
    "Country",
    "Product Group",
    "Product Category",
    "Product",
  ];

  const [groupbuttons, setGroupbuttons] = useState(initgroupbuttons);

  let initgroupings = [
    "region",
    "country",
    "productGroup",
    "productCategory",
    "product",
  ];

  const [groupings, setGroupings] = useState(initgroupings);

  useEffect(() => {
    // groupBy2(groupcriteria, loadeddata, showcriteria1, show2criteria1);
    groupBy3(
      groupcriteria,
      loadeddata,
      groupcriteria2,
      groupcriteria3
      // showcriteria1,
      // show2criteria1
    );
  }, [
    loadeddata,
    groupcriteria,
    filter1,
    filter2,
    filter3,
    groupcriteria2,
    groupcriteria3,
    groupcriteria4,
  ]);

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
    groupcriteria2,
    groupcriteria3
    // showcriteria1,
    // sho2criteria1
  ) => {
    if (loadeddata) {
      // console.log(loadeddata);
      let datafiltered = [];
      if (filter1 !== "") {
        datafiltered = loadeddata.filter(
          (item) => item[groupcriteria] === filter1
        );
        if (filter2 !== "") {
          datafiltered = datafiltered.filter(
            (item) => item[groupcriteria2] === filter2
          );
          if (filter3 !== "") {
            datafiltered = datafiltered.filter(
              (item) => item[groupcriteria3] === filter3
            );
          }
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
      let groupeddata = [];
      // if (groupcriteria2 !== "") {
      //   groupeddata = datafiltered.groupBy(groupcriteria2);
      // } else {
      groupeddata = datafiltered.groupBy(groupcriteria);
      if (groupcriteria2 !== "" && groupcriteria3 === "") {
        // console.log(groupcriteria2);
        groupeddata = datafiltered.groupBy(groupcriteria2);
      }
      if (groupcriteria3 !== "") {
        // console.log(groupcriteria2);
        groupeddata = datafiltered.groupBy(groupcriteria3);
      }
      if (filter3 !== "") {
        groupeddata = datafiltered.groupBy(groupcriteria4);
      }
      // }
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
        let qbp1 = 0;
        let qbp2 = 0;
        let qbp3 = 0;
        let qbp4 = 0;
        // let totalb = 0;
        let qsp1 = 0;
        let qsp2 = 0;
        let qsp3 = 0;
        let qsp4 = 0;
        for (const [key2, val2] of Object.entries(qgroupeddata)) {
          if (Number(key2) === 1) {
            val2.forEach((item) => {
              qb1 += item["budget"];
              qs1 += item["sold"];
              qbp1 += item["budgetprofit"];
              qsp1 += item["soldprofit"];
            });
            // quarter = key2;
          }
          if (Number(key2) === 2) {
            val2.forEach((item) => {
              qb2 += item["budget"];
              qs2 += item["sold"];
              qbp2 += item["budgetprofit"];
              qsp2 += item["soldprofit"];
            }); // quarter = key2;
          }
          if (Number(key2) === 3) {
            val2.forEach((item) => {
              qb3 += item["budget"];
              qs3 += item["sold"];
              qbp3 += item["budgetprofit"];
              qsp3 += item["soldprofit"];
            });
          }
          if (Number(key2) === 4) {
            val2.forEach((item) => {
              qb4 += item["budget"];
              qs4 += item["sold"];
              qbp4 += item["budgetprofit"];
              qsp4 += item["soldprofit"];
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
          totals: qs1 + qs2 + qs3 + qs4,
          qbp1: qbp1,
          qbp2: qbp2,
          qbp3: qbp3,
          qbp4: qbp4,
          totalbprofit: qbp1 + qbp2 + qbp3 + qbp4,
          qsp1: qsp1,
          qsp2: qsp2,
          qsp3: qsp3,
          qsp4: qsp4,
          totalsprofit: qsp1 + qsp2 + qsp3 + qsp4,
        };

        finaldata.push(quartergroupdata);
      }
      let sortedfinal = finaldata.sort((el1, el2) =>
        el1["totalbp"] < el2["totalb"]
          ? 1
          : el1["totalb"] > el2["totalb"]
          ? -1
          : 0
      );
      let filteredfinal = sortedfinal.filter(
        (el) => el["totalb"] > 0 || el["totals"] > 0
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
      let q1bprofit = filteredfinal.map((el) => el["qbp1"]);
      let q2bprofit = filteredfinal.map((el) => el["qbp2"]);
      let q3bprofit = filteredfinal.map((el) => el["qbp3"]);
      let q4bprofit = filteredfinal.map((el) => el["qbp4"]);
      let q1sprofit = filteredfinal.map((el) => el["qsp1"]);
      let q2sprofit = filteredfinal.map((el) => el["qsp2"]);
      let q3sprofit = filteredfinal.map((el) => el["qsp3"]);
      let q4sprofit = filteredfinal.map((el) => el["qsp4"]);

      setLabels1(labels);
      setq1budgetdata(q1bdata);
      setq2budgetdata(q2bdata);
      setq3budgetdata(q3bdata);
      setq4budgetdata(q4bdata);
      setq1salesdata(q1sdata);
      setq2salesdata(q2sdata);
      setq3salesdata(q3sdata);
      setq4salesdata(q4sdata);
      setq1budgetprofit(q1bprofit);
      setq2budgetprofit(q2bprofit);
      setq3budgetprofit(q3bprofit);
      setq4budgetprofit(q4bprofit);
      setq1salesprofit(q1sprofit);
      setq2salesprofit(q2sprofit);
      setq3salesprofit(q3sprofit);
      setq4salesprofit(q4sprofit);
      setFilteredfinal(filteredfinal);

      // console.log(labels, q1data, q2data, q3data, q4data);
    }
  };

  // const groupBy2 = (arg1, data, showcriteria, showcriteria2) => {
  //   if (data) {
  //     let datafiltered = [];
  //     if (filter1 !== "") {
  //       datafiltered = data.filter((item) => item["region"] === filter1);
  //       if (filter2 !== "") {
  //         datafiltered = datafiltered.filter(
  //           (item) => item["country"] === filter2
  //         );
  //       }
  //     } else {
  //       datafiltered = data;
  //     }

  //     let finalResult = [];

  //     console.log(datafiltered.groupBy("qq"));

  //     datafiltered.forEach((item) => {
  //       let group = "";
  //       let index = 0;
  //       if (item[arg1] === "Dominican Republic") {
  //         group = "Dom Rep";
  //         index = finalResult.findIndex((it) => it[arg1] === "Dom Rep");
  //       } else {
  //         group = item[arg1];
  //         index = finalResult.findIndex((it) => it[arg1] === group);
  //       }
  //       if (index === -1) {
  //         finalResult.push({
  //           [arg1]: group,
  //           [showcriteria]: Number(item[showcriteria]),
  //           [showcriteria2]: Number(item[showcriteria2]),
  //         });
  //       } else {
  //         finalResult[index][showcriteria] += Number(item[showcriteria]);
  //         finalResult[index][showcriteria2] += Number(item[showcriteria2]);
  //       }
  //     });
  //     let sortedfinal = finalResult.sort((el1, el2) =>
  //       el1[showcriteria] < el2[showcriteria]
  //         ? 1
  //         : el1[showcriteria] > el2[showcriteria]
  //         ? -1
  //         : 0
  //     );
  //     let filteredfinal = sortedfinal.filter(
  //       (el) => el[showcriteria] > 0 || el[showcriteria2] > 0
  //     );
  //     let budgetdata = filteredfinal.map((el) => el[showcriteria]);
  //     let salesdata = filteredfinal.map((el) => el[showcriteria2]);
  //     let labels = filteredfinal.map((el) => el[arg1]);
  //     // console.log(labels);
  //     setLabels1(labels);
  //     setBudgetdata(budgetdata);
  //     setSalesdata(salesdata);
  //   }
  // };

  // useEffect(() => {
  //   Axios.post("/loadcurrentbudget", { currentyear }).then((response) => {
  //     setLoadedData(response.data);
  //     groupBy(groupcriteria1, response.data);
  //   });
  // }, []);

  const options = {
    indexAxis: "y",
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    // aspectRatio: 0.9 / 1.5,
    aspectRatio: 2 / 1.5,
    layout: {
      padding: 0,
    },
    onClick: (e) => {
      if (groupcriteria2 === "") {
        setFilter1(e.chart["tooltip"]["title"][0]);
        groupbuttons.splice(clickedgroup, 1);
        groupings.splice(clickedgroup, 1);
        setGroupcriteria2(groupings[0]);
        setClickedgroup(0);
      }
      if (groupcriteria3 === "" && groupcriteria2 !== "") {
        // console.log(groupcriteria3);

        setFilter2(e.chart["tooltip"]["title"][0]);
        groupbuttons.splice(clickedgroup, 1);
        groupings.splice(clickedgroup, 1);
        setGroupcriteria3(groupings[0]);
        setClickedgroup(0);
      }
      // if (groupcriteria3 !== "" && groupcriteria2 !== "") {
      if (groupcriteria4 === "" && groupcriteria3 !== "") {
        setFilter3(e.chart["tooltip"]["title"][0]);
        groupbuttons.splice(clickedgroup, 1);
        groupings.splice(clickedgroup, 1);
        setGroupcriteria4(groupings[0]);
        setClickedgroup(0);
      }

      // console.log(e.chart["tooltip"]["title"]);
      // if (groupcriteria === "region") {
      //   setGroupcriteria("country");
      //   setFilter1(e.chart["tooltip"]["title"][0]);
      // }
      // if (groupcriteria === "productGroup") {
      //   setGroupcriteria("prodCatName");
      //   setFilter1(e.chart["tooltip"]["title"][0]);
      // }
      // if (groupcriteria === "country") {
      //   setGroupcriteria("prodCatName");
      //   setFilter2(e.chart["tooltip"]["title"][0]);
      // }
    },
  };
  const options2 = {
    indexAxis: "y",
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    // aspectRatio: 0.9 / 1.5,
    aspectRatio: 2 / 1.5,
    layout: {
      padding: 0,
    },
    scales: {
      x: {
        ticks: {
          // Include a dollar sign in the ticks
          callback: function(value, index, ticks) {
            return (
              "$" +
              value
                .toFixed(0)
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            );
          },
        },
      },
    },
    onClick: (e) => {
      if (groupcriteria2 === "") {
        setFilter1(e.chart["tooltip"]["title"][0]);
        groupbuttons.splice(clickedgroup, 1);
        groupings.splice(clickedgroup, 1);
        setGroupcriteria2(groupings[0]);
        setClickedgroup(0);
      }
      if (groupcriteria3 === "" && groupcriteria2 !== "") {
        // console.log(groupcriteria3);

        setFilter2(e.chart["tooltip"]["title"][0]);
        groupbuttons.splice(clickedgroup, 1);
        groupings.splice(clickedgroup, 1);
        setGroupcriteria3(groupings[0]);
        setClickedgroup(0);
      }
      if (groupcriteria3 !== "" && groupcriteria2 !== "") {
        setFilter3(e.chart["tooltip"]["title"][0]);
        groupbuttons.splice(clickedgroup, 1);
        groupings.splice(clickedgroup, 1);
        setGroupcriteria4(groupings[0]);
        setClickedgroup(0);
      }
      // console.log(e.chart["tooltip"]["title"]);
      // if (groupcriteria === "region") {
      //   setGroupcriteria("country");
      //   setFilter1(e.chart["tooltip"]["title"][0]);
      // }
      // if (groupcriteria === "productGroup") {
      //   setGroupcriteria("prodCatName");
      //   setFilter1(e.chart["tooltip"]["title"][0]);
      // }
      // if (groupcriteria === "country") {
      //   setGroupcriteria("prodCatName");
      //   setFilter2(e.chart["tooltip"]["title"][0]);
      // }
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
  const data2 = {
    labels: labels1,
    datasets: [
      {
        label: "Budget Q1",
        data: q1budgetprofit,
        backgroundColor: "rgba(68, 65, 162,1)",
        stack: "Stack 0",
      },
      {
        label: "Budget Q2",
        data: q2budgetprofit,
        backgroundColor: "rgba(68, 65, 162,0.7)",
        stack: "Stack 0",
      },
      {
        label: "Budget Q3",
        data: q3budgetprofit,
        backgroundColor: "rgba(68, 65, 162,0.4)",
        stack: "Stack 0",
      },
      {
        label: "Budget Q4",
        data: q4budgetprofit,
        backgroundColor: "rgba(68, 65, 162,0.25)",
        stack: "Stack 0",
      },
      {
        label: "Sales Q1",
        data: q1salesprofit,
        backgroundColor: "rgba(160, 182, 103,1)",
        stack: "Stack 1",
      },
      {
        label: "Sales Q2",
        data: q2salesprofit,
        backgroundColor: "rgba(160, 182, 103,0.7)",
        stack: "Stack 1",
      },
      {
        label: "Sales Q3",
        data: q3salesprofit,
        backgroundColor: "rgba(160, 182, 103,0.4)",
        stack: "Stack 1",
      },
      {
        label: "Sales Q4",
        data: q4salesprofit,
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

  const [clickedgroup, setClickedgroup] = useState(0);

  const handleAVBReset = () => {
    setFilter1("");
    setFilter2("");
    setFilter3("");
    setGroupcriteria2("");
    setGroupcriteria3("");
    setGroupcriteria4("");

    setGroupcriteria("region");
    setGroupbuttons(initgroupbuttons);
    setGroupings(initgroupings);
    setClickedgroup(0);
  };

  const handleAVBBack = () => {
    if (filter3 !== "") {
      setFilter3("");
      let index = initgroupings.indexOf(groupcriteria3);
      groupbuttons.push(initgroupbuttons[index]);
      groupings.push(initgroupings[index]);
      setClickedgroup(groupbuttons.indexOf(initgroupbuttons[index]));
      setGroupcriteria4("");
    } else if (filter2 !== "") {
      setFilter2("");
      let index = initgroupings.indexOf(groupcriteria2);
      groupbuttons.push(initgroupbuttons[index]);
      groupings.push(initgroupings[index]);
      setClickedgroup(groupbuttons.indexOf(initgroupbuttons[index]));
      setGroupcriteria3("");
    } else if (filter1 !== "") {
      setFilter1("");
      let index = initgroupings.indexOf(groupcriteria);
      groupbuttons.push(initgroupbuttons[index]);
      groupings.push(initgroupings[index]);
      setClickedgroup(groupbuttons.indexOf(initgroupbuttons[index]));
      setGroupcriteria2("");
    }
  };

  let qb1total = 0;
  let qb2total = 0;
  let qb3total = 0;
  let qb4total = 0;
  let qs1total = 0;
  let qs2total = 0;
  let qs3total = 0;
  let qs4total = 0;
  let totaltotalb = 0;
  let totaltotals = 0;

  let qb1totalp = 0;
  let qb2totalp = 0;
  let qb3totalp = 0;
  let qb4totalp = 0;
  let qs1totalp = 0;
  let qs2totalp = 0;
  let qs3totalp = 0;
  let qs4totalp = 0;
  let totaltotalbp = 0;
  let totaltotalsp = 0;

  return (
    <>
      <div className="AVBTitleArea">
        <div className="AVBTitle">
          <h2>
            {groupcriteria ? groupcriteria.toUpperCase() : ""}
            {filter1 ? " : " + filter1 : ""}
            {groupcriteria2 ? ", " + groupcriteria2.toUpperCase() : ""}
            {filter2 ? " : " + filter2 : ""}
            {groupcriteria3 ? ", " + groupcriteria3.toUpperCase() : ""}
            {filter3 ? " : " + filter3 : ""}
          </h2>
        </div>
        <div className="groupbuttons">
          <button className="AVBBackbutton" onClick={(e) => handleAVBBack()}>
            {"<< Back"}
          </button>
          <p>
            {filter3 !== ""
              ? "Level 4:"
              : filter2 !== ""
              ? "Level 3:"
              : filter1 !== ""
              ? "Level 2:"
              : "Level 1:"}
          </p>
          {groupbuttons
            ? groupbuttons.map((grp, i) => {
                return (
                  <button
                    key={i}
                    value={
                      grp === "Product Group"
                        ? "productGroup"
                        : grp === "Product Category"
                        ? "productCategory"
                        : grp.toLowerCase()
                    }
                    onClick={(e) => {
                      setClickedgroup(i);
                      if (filter1 === "") {
                        setGroupcriteria(e.target.value);
                      } else if (filter2 === "") {
                        setGroupcriteria2(e.target.value);
                      } else if (filter3 === "") {
                        setGroupcriteria3(e.target.value);
                      } else {
                        setGroupcriteria4(e.target.value);
                      }
                    }}
                    className={i === clickedgroup ? "activegroupbutton" : ""}
                  >
                    {grp}
                  </button>
                );
              })
            : ""}
          <button className="AVBReset" onClick={(e) => handleAVBReset()}>
            Reset
          </button>
        </div>
      </div>
      <div className="AVBCharts">
        <div className="AVBChart">
          <Bar options={options} data={data} />
        </div>
        <div className="AVBChart">
          <Bar options={options2} data={data2} />
        </div>
      </div>
      <div className="AVBTable">
        <ul className="AVBTableHeaders">
          <li className="AVBFirstCol">(in mt)</li>
          <li className="AVBTableFig">Q1</li>
          <li className="AVBTableFig"></li>
          <li className="AVBTableFig AVBGroupEnd"></li>
          <li className="AVBTableFig">Q2</li>
          <li className="AVBTableFig"></li>
          <li className="AVBTableFig AVBGroupEnd"></li>
          <li className="AVBTableFig">Q3</li>
          <li className="AVBTableFig"></li>
          <li className="AVBTableFig AVBGroupEnd"></li>
          <li className="AVBTableFig">Q4</li>
          <li className="AVBTableFig"></li>
          <li className="AVBTableFig AVBGroupEnd"></li>
          <li className="AVBTableFig">Totals</li>
          <li className="AVBTableFig"></li>
          <li className="AVBTableFig"></li>
          <li className="AVBTableFig"></li>
        </ul>
        <ul className="AVBTableHeaders">
          <li className="AVBFirstCol">
            {groupcriteria4 !== ""
              ? groupcriteria4.toUpperCase()
              : groupcriteria3 !== ""
              ? groupcriteria3.toUpperCase()
              : groupcriteria2 !== ""
              ? groupcriteria2.toUpperCase()
              : groupcriteria.toUpperCase()}
          </li>
          <li className="AVBTableFig">B</li>
          <li className="AVBTableFig">S</li>
          <li className="AVBTableFig AVBGroupEnd">VAR</li>
          <li className="AVBTableFig">B</li>
          <li className="AVBTableFig">S</li>
          <li className="AVBTableFig AVBGroupEnd">VAR</li>
          <li className="AVBTableFig">B</li>
          <li className="AVBTableFig">S</li>
          <li className="AVBTableFig AVBGroupEnd">VAR</li>
          <li className="AVBTableFig">B</li>
          <li className="AVBTableFig">S</li>
          <li className="AVBTableFig AVBGroupEnd">VAR</li>
          <li className="AVBTableFig">Total B</li>{" "}
          {currentquarter === 4 ? "" : <li className="AVBTableFig">YTD B</li>}
          <li className="AVBTableFig">YTD S</li>
          <li className="AVBTableFig">YTD VAR</li>
          {/* {currentquarter === 2
            ? [
                <li className="AVBTableFig">YTD B</li>,
                <li className="AVBTableFig">YTD S</li>,
              ]
            : currentquarter > 2
            ? [
                <li className="AVBTableFig">Q2 B</li>,
                <li className="AVBTableFig">Q2 S</li>,
              ]
            : ""}
          {currentquarter === 3
            ? [
                <li className="AVBTableFig">YTD B</li>,
                <li className="AVBTableFig">YTD S</li>,
              ]
            : currentquarter > 2
            ? [
                <li className="AVBTableFig">Q3 B</li>,
                <li className="AVBTableFig">Q3 S</li>,
              ]
            : ""}
          <li className="AVBTableFig">Total B</li>
          {currentquarter === 4 ? <li className="AVBTableFig">YTD S</li> : ""} */}
        </ul>
        {filteredfinal
          ? filteredfinal.map((item) => {
              qb1total += item.qb1;
              qb2total += item.qb2;
              qb3total += item.qb3;
              qb4total += item.qb4;
              qs1total += item.qs1;
              qs2total += item.qs2;
              qs3total += item.qs3;
              qs4total += item.qs4;
              totaltotalb += item.totalb;
              totaltotals += item.totals;
              console.log(qs1total + qs2total);
              console.log(qb1total + qb2total);
              return [
                <ul className="AVBTableRow">
                  <li className="AVBFirstCol">
                    {item.group === "Dominican Republic"
                      ? "DomRep"
                      : // : item.group === "Costa Rica"
                        // ? "C Rica"
                        item.group}
                  </li>
                  <li className="AVBTableFig">
                    {item.qb1
                      .toFixed(0)
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  </li>
                  <li className="AVBTableFig">
                    {item.qs1
                      .toFixed(0)
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  </li>
                  <li className="AVBTableFig AVBGroupEnd">
                    {item.qb1 > 0
                      ? ((item.qs1 / item.qb1) * 100).toFixed() + "%"
                      : "NB"}
                  </li>
                  <li className="AVBTableFig">
                    {item.qb2
                      .toFixed(0)
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  </li>
                  <li className="AVBTableFig">
                    {item.qs2
                      .toFixed(0)
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  </li>
                  <li className="AVBTableFig AVBGroupEnd">
                    {item.qb2 > 0
                      ? ((item.qs2 / item.qb2) * 100).toFixed() + "%"
                      : "NB"}
                  </li>
                  <li className="AVBTableFig">
                    {item.qb3
                      .toFixed(0)
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  </li>
                  <li className="AVBTableFig">
                    {item.qs3
                      .toFixed(0)
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  </li>
                  <li className="AVBTableFig AVBGroupEnd">
                    {item.qb3 > 0
                      ? ((item.qs3 / item.qb3) * 100).toFixed() + "%"
                      : "NB"}
                  </li>
                  <li className="AVBTableFig">
                    {item.qb4
                      .toFixed(0)
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  </li>
                  <li className="AVBTableFig">
                    {item.qs4
                      .toFixed(0)
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  </li>
                  <li className="AVBTableFig AVBGroupEnd">
                    {item.qb4 > 0
                      ? ((item.qs4 / item.qb4) * 100).toFixed() + "%"
                      : "NB"}
                  </li>
                  <li className="AVBTableFig">
                    {item.totalb
                      .toFixed(0)
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  </li>
                  {currentquarter === 4 ? (
                    ""
                  ) : (
                    <li className="AVBTableFig">
                      {currentquarter === 1
                        ? item.qb1
                            .toFixed(0)
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        : currentquarter === 2
                        ? (item.qb1 + item.qb2)
                            .toFixed(0)
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        : currentquarter === 3
                        ? (item.qb1 + item.qb2 + item.qb3)
                            .toFixed(0)
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        : ""}
                    </li>
                  )}

                  <li className="AVBTableFig">
                    {item.totals
                      .toFixed(0)
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  </li>
                  {currentquarter === 4 ? (
                    item.totalb > 0 ? (
                      <li className="AVBTableFig">
                        {((item.totals / item.totalb) * 100)
                          .toFixed(0)
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "%"}
                      </li>
                    ) : (
                      <li className="AVBTableFig"> "NB"</li>
                    )
                  ) : (
                    <li className="AVBTableFig">
                      {currentquarter === 1
                        ? item.qb1 > 0
                          ? ((item.qs1 / item.qb1) * 100).toFixed(0) + "%"
                          : "NB"
                        : currentquarter === 2
                        ? item.qb2 + item.qb1 > 0
                          ? (
                              ((item.qs1 + item.qs2) / (item.qb1 + item.qb2)) *
                              100
                            ).toFixed(0) + "%"
                          : "NB"
                        : currentquarter === 3
                        ? item.qb2 + item.qb1 + item.qb3 > 0
                          ? (
                              ((item.qs1 + item.qs2 + item.qs3) /
                                (item.qb1 + item.qb2 + item.qb3)) *
                              100
                            ).toFixed(0) + "%"
                          : "NB"
                        : ""}
                    </li>
                  )}
                </ul>,
              ];
            })
          : ""}{" "}
        <ul className="AVBTableTotals">
          <li className="AVBFirstCol">TOTAL</li>
          <li className="AVBTableFig">
            {qb1total
              .toFixed(0)
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          </li>
          <li className="AVBTableFig">
            {qs1total
              .toFixed(0)
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          </li>
          <li className="AVBTableFig AVBGroupEnd">
            {qb1total > 0
              ? ((qs1total / qb1total) * 100).toFixed() + "%"
              : "NB"}
          </li>
          <li className="AVBTableFig">
            {qb2total
              .toFixed(0)
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          </li>
          <li className="AVBTableFig">
            {qs2total
              .toFixed(0)
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          </li>
          <li className="AVBTableFig AVBGroupEnd">
            {qb2total > 0
              ? ((qs2total / qb2total) * 100).toFixed() + "%"
              : "NB"}
          </li>
          <li className="AVBTableFig">
            {qb3total
              .toFixed(0)
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          </li>
          <li className="AVBTableFig">
            {qs3total
              .toFixed(0)
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          </li>
          <li className=" AVBTableFig AVBGroupEnd">
            {qb3total > 0
              ? ((qs3total / qb3total) * 100).toFixed() + "%"
              : "NB"}
          </li>
          <li className="AVBTableFig">
            {qb4total
              .toFixed(0)
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          </li>
          <li className="AVBTableFig">
            {qs4total
              .toFixed(0)
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          </li>
          <li className="AVBTableFig AVBGroupEnd">
            {qb4total > 0
              ? ((qs4total / qb4total) * 100).toFixed() + "%"
              : "NB"}
          </li>
          <li className="AVBTableFig">
            {totaltotalb
              .toFixed(0)
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          </li>
          {currentquarter === 4 ? (
            ""
          ) : (
            <li className="AVBTableFig">
              {currentquarter === 1
                ? qb1total
                    .toFixed(0)
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                : currentquarter === 2
                ? (qb1total + qb2total)
                    .toFixed(0)
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                : currentquarter === 3
                ? (qb1total + qb2total + qb3total)
                    .toFixed(0)
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                : ""}
            </li>
          )}
          <li className="AVBTableFig">
            {totaltotals
              .toFixed(0)
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          </li>
          <li className="AVBTableFig">
            {currentquarter === 1
              ? qb1total > 0
                ? ((qs1total / qb1total) * 100).toFixed(0) + "%"
                : "NB"
              : currentquarter === 2
              ? qb1total + qb2total > 0
                ? (
                    ((qs1total + qs2total) / (qb1total + qb2total)) *
                    100
                  ).toFixed(0) + "%"
                : "NB"
              : currentquarter === 3
              ? qb1total + qb2total + qb3total > 0
                ? (
                    ((qs1total + qs2total + qs3total) /
                      (qb1total + qb2total + qb3total)) *
                    100
                  ).toFixed(0) + "%"
                : "NB"
              : currentquarter === 4
              ? totaltotalb > 0
                ? ((totaltotals / totaltotalb) * 100).toFixed(0) + "%"
                : "NB"
              : ""}
          </li>
        </ul>
      </div>
      <div className="AVBTable">
        <ul className="AVBTableHeaders">
          <li className="AVBFirstCol">(in '000 $)</li>
          <li className="AVBTableFig">Q1</li>
          <li className="AVBTableFig"></li>
          <li className="AVBTableFig AVBGroupEnd"></li>
          <li className="AVBTableFig">Q2</li>
          <li className="AVBTableFig"></li>
          <li className="AVBTableFig AVBGroupEnd"></li>
          <li className="AVBTableFig">Q3</li>
          <li className="AVBTableFig"></li>
          <li className="AVBTableFig AVBGroupEnd"></li>
          <li className="AVBTableFig">Q4</li>
          <li className="AVBTableFig"></li>
          <li className="AVBTableFig AVBGroupEnd"></li>
          <li className="AVBTableFig">Totals</li>
          <li className="AVBTableFig"></li>
          <li className="AVBTableFig"></li>
          <li className="AVBTableFig"></li>
        </ul>
        <ul className="AVBTableHeaders">
          <li className="AVBFirstCol">
            {" "}
            {groupcriteria4 !== ""
              ? groupcriteria4.toUpperCase()
              : groupcriteria3 !== ""
              ? groupcriteria3.toUpperCase()
              : groupcriteria2 !== ""
              ? groupcriteria2.toUpperCase()
              : groupcriteria.toUpperCase()}
          </li>
          <li className="AVBTableFig">B</li>
          <li className="AVBTableFig">S</li>
          <li className="AVBTableFig AVBGroupEnd">VAR</li>
          <li className="AVBTableFig">B</li>
          <li className="AVBTableFig">S</li>
          <li className="AVBTableFig AVBGroupEnd">VAR</li>
          <li className="AVBTableFig">B</li>
          <li className="AVBTableFig">S</li>
          <li className="AVBTableFig AVBGroupEnd">VAR</li>
          <li className="AVBTableFig">B</li>
          <li className="AVBTableFig">S</li>
          <li className="AVBTableFig AVBGroupEnd">VAR</li>
          <li className="AVBTableFig">Total B</li>{" "}
          {currentquarter === 4 ? "" : <li className="AVBTableFig">YTD B</li>}
          <li className="AVBTableFig">YTD S</li>{" "}
          <li className="AVBTableFig">YTD VAR</li>
          {/* {currentquarter === 2
            ? [
                <li className="AVBTableFig">YTD B</li>,
                <li className="AVBTableFig">YTD S</li>,
              ]
            : currentquarter > 2
            ? [
                <li className="AVBTableFig">Q2 B</li>,
                <li className="AVBTableFig">Q2 S</li>,
              ]
            : ""}
          {currentquarter === 3
            ? [
                <li className="AVBTableFig">YTD B</li>,
                <li className="AVBTableFig">YTD S</li>,
              ]
            : currentquarter > 2
            ? [
                <li className="AVBTableFig">Q3 B</li>,
                <li className="AVBTableFig">Q3 S</li>,
              ]
            : ""}
          <li className="AVBTableFig">Total B</li>
          {currentquarter === 4 ? <li className="AVBTableFig">YTD S</li> : ""} */}
        </ul>
        {filteredfinal
          ? filteredfinal.map((item) => {
              qb1totalp += item.qbp1;
              qb2totalp += item.qbp2;
              qb3totalp += item.qbp3;
              qb4totalp += item.qbp4;
              qs1totalp += item.qsp1;
              qs2totalp += item.qsp2;
              qs3totalp += item.qsp3;
              qs4totalp += item.qsp4;
              totaltotalbp += item.totalbprofit;
              totaltotalsp += item.totalsprofit;
              return [
                <ul className="AVBTableRow">
                  <li className="AVBFirstCol">
                    {item.group === "Dominican Republic"
                      ? "DomRep"
                      : // : item.group === "Costa Rica"
                        // ? "C Rica"
                        item.group}
                  </li>
                  <li className="AVBTableFig">
                    {"$" +
                      (item.qbp1 / 1000)
                        .toFixed(0)
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  </li>
                  <li className="AVBTableFig">
                    {"$" +
                      (item.qsp1 / 1000)
                        .toFixed(0)
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  </li>
                  <li className="AVBTableFig AVBGroupEnd">
                    {item.qbp1 > 0
                      ? ((item.qsp1 / item.qbp1) * 100).toFixed() + "%"
                      : "NB"}
                  </li>
                  <li className="AVBTableFig">
                    {"$" +
                      (item.qbp2 / 1000)
                        .toFixed(0)
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  </li>
                  <li className="AVBTableFig">
                    {"$" +
                      (item.qsp2 / 1000)
                        .toFixed(0)
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  </li>
                  <li className="AVBTableFig AVBGroupEnd">
                    {item.qbp2 > 0
                      ? ((item.qsp2 / item.qbp2) * 100).toFixed() + "%"
                      : "NB"}
                  </li>
                  <li className="AVBTableFig">
                    {"$" +
                      (item.qbp3 / 1000)
                        .toFixed(0)
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  </li>
                  <li className="AVBTableFig">
                    {"$" +
                      (item.qsp3 / 1000)
                        .toFixed(0)
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  </li>
                  <li className="AVBTableFig AVBGroupEnd">
                    {item.qbp3 > 0
                      ? ((item.qsp3 / item.qbp3) * 100).toFixed() + "%"
                      : "NB"}
                  </li>
                  <li className="AVBTableFig">
                    {"$" +
                      (item.qbp4 / 1000)
                        .toFixed(0)
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  </li>
                  <li className="AVBTableFig">
                    {"$" +
                      (item.qsp4 / 1000)
                        .toFixed(0)
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  </li>
                  <li className="AVBTableFig AVBGroupEnd">
                    {item.qbp4 > 0
                      ? ((item.qsp4 / item.qbp4) * 100).toFixed() + "%"
                      : "NB"}
                  </li>
                  <li className="AVBTableFig">
                    {"$" +
                      (item.totalbprofit / 1000)
                        .toFixed(0)
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  </li>
                  {currentquarter === 4 ? (
                    ""
                  ) : (
                    <li className="AVBTableFig">
                      {currentquarter === 1
                        ? "$" +
                          (item.qbp1 / 1000)
                            .toFixed(0)
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        : currentquarter === 2
                        ? "$" +
                          ((item.qbp1 + item.qbp2) / 1000)
                            .toFixed(0)
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        : currentquarter === 3
                        ? "$" +
                          ((item.qbp1 + item.qbp2 + item.qbp3) / 1000)
                            .toFixed(0)
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        : ""}
                    </li>
                  )}

                  <li className="AVBTableFig">
                    {"$" +
                      (item.totalsprofit / 1000)
                        .toFixed(0)
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  </li>
                  {currentquarter === 4 ? (
                    item.totalbprofit > 0 ? (
                      <li className="AVBTableFig">
                        {((item.totalsprofit / item.totalbprofit) * 100)
                          .toFixed(0)
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "%"}
                      </li>
                    ) : (
                      <li className="AVBTableFig"> "NB"</li>
                    )
                  ) : (
                    <li className="AVBTableFig">
                      {currentquarter === 1
                        ? item.qbp1 > 0
                          ? ((item.qsp1 / item.qbp1) * 100).toFixed(0) + "%"
                          : "NB"
                        : currentquarter === 2
                        ? item.qbp2 + item.qbp1 > 0
                          ? (
                              ((item.qsp1 + item.qsp2) /
                                (item.qbp1 + item.qbp2)) *
                              100
                            ).toFixed(0) + "%"
                          : "NB"
                        : currentquarter === 3
                        ? item.qbp2 + item.qbp1 + item.qbp3 > 0
                          ? (
                              ((item.qsp1 + item.qsp2 + item.qsp3) /
                                (item.qbp1 + item.qbp2 + item.qbp3)) *
                              100
                            ).toFixed(0) + "%"
                          : "NB"
                        : ""}
                    </li>
                  )}
                </ul>,
              ];
            })
          : ""}{" "}
        <ul className="AVBTableTotals">
          <li className="AVBFirstCol">TOTAL</li>
          <li className="AVBTableFig">
            {"$" +
              (qb1totalp / 1000)
                .toFixed(0)
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          </li>
          <li className="AVBTableFig">
            {"$" +
              (qs1totalp / 1000)
                .toFixed(0)
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          </li>
          <li className="AVBTableFig AVBGroupEnd">
            {qb1totalp > 0
              ? ((qs1totalp / qb1totalp) * 100).toFixed() + "%"
              : "NB"}
          </li>
          <li className="AVBTableFig">
            {"$" +
              (qb2totalp / 1000)
                .toFixed(0)
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          </li>
          <li className="AVBTableFig">
            {"$" +
              (qs2totalp / 1000)
                .toFixed(0)
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          </li>
          <li className="AVBTableFig AVBGroupEnd">
            {qb2totalp > 0
              ? ((qs2totalp / qb2totalp) * 100).toFixed() + "%"
              : "NB"}
          </li>
          <li className="AVBTableFig">
            {"$" +
              (qb3totalp / 1000)
                .toFixed(0)
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          </li>
          <li className="AVBTableFig">
            {"$" +
              (qs3totalp / 1000)
                .toFixed(0)
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          </li>
          <li className=" AVBTableFig AVBGroupEnd">
            {qb3totalp > 0
              ? ((qs3totalp / qb3totalp) * 100).toFixed() + "%"
              : "NB"}
          </li>
          <li className="AVBTableFig">
            {"$" +
              (qb4totalp / 1000)
                .toFixed(0)
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          </li>
          <li className="AVBTableFig">
            {"$" +
              (qs4totalp / 1000)
                .toFixed(0)
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          </li>
          <li className="AVBTableFig AVBGroupEnd">
            {qb4totalp > 0
              ? ((qs4totalp / qb4totalp) * 100).toFixed() + "%"
              : "NB"}
          </li>
          <li className="AVBTableFig">
            {"$" +
              (totaltotalbp / 1000)
                .toFixed(0)
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          </li>
          {currentquarter === 4 ? (
            ""
          ) : (
            <li className="AVBTableFig">
              {currentquarter === 1
                ? "$" +
                  (qb1totalp / 1000)
                    .toFixed(0)
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                : currentquarter === 2
                ? "$" +
                  ((qb1totalp + qb2totalp) / 1000)
                    .toFixed(0)
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                : currentquarter === 3
                ? "$" +
                  ((qb1totalp + qb2totalp + qb3totalp) / 1000)
                    .toFixed(0)
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                : ""}
            </li>
          )}
          <li className="AVBTableFig">
            {"$" +
              (totaltotalsp / 1000)
                .toFixed(0)
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          </li>
          <li className="AVBTableFig">
            {currentquarter === 1
              ? qb1totalp > 0
                ? ((qs1totalp / qb1totalp) * 100).toFixed(0) + "%"
                : "NB"
              : currentquarter === 2
              ? qb1totalp + qb2totalp > 0
                ? (
                    ((qs1totalp + qs2totalp) / (qb1totalp + qb2totalp)) *
                    100
                  ).toFixed(0) + "%"
                : "NB"
              : currentquarter === 3
              ? qb1totalp + qb2totalp + qb3totalp > 0
                ? (
                    ((qs1totalp + qs2totalp + qs3totalp) /
                      (qb1totalp + qb2totalp + qb3totalp)) *
                    100
                  ).toFixed(0) + "%"
                : "NB"
              : currentquarter === 4
              ? totaltotalbp > 0
                ? ((totaltotalsp / totaltotalbp) * 100).toFixed(0) + "%"
                : "NB"
              : ""}
          </li>
        </ul>
      </div>
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
