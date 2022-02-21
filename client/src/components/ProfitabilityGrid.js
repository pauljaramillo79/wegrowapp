import React, { useState, useEffect, useContext } from "react";
import Axios from "axios";
import "../../node_modules/react-grid-layout/css/styles.css";
import "../../node_modules/react-resizable/css/styles.css";
import { Responsive, WidthProvider } from "react-grid-layout";
import "./Grid.css";
import "./ProfitabilityGrid.css";
import ProfitabilityReport from "./ProfitabilityReport";
import WaterfallChart from "./WaterFall";
import moment from "moment";
import { ProfitabilityContext } from "../contexts/ProfitabilityProvider";

const ResponsiveGridLayout = WidthProvider(Responsive);

const ProfitabilityGrid = () => {
  const {
    prdata,
    setPrdata,
    setPrcustomers,
    setPrcustomerfilter,
    prcustomerfilter,
    setPrcustomerchecks,
  } = useContext(ProfitabilityContext);

  const sumtotal = (data, param) => {
    let totalval = 0;
    for (const x of data) {
      if (prcustomerfilter && prcustomerfilter.includes(x["customer"])) {
        totalval += x[param];
      }
    }
    return totalval;
    // console.log(data[0]);
  };

  const sumprod = (data, param1, param2) => {
    let totalprod = 0;
    for (const x of data) {
      if (prcustomerfilter && prcustomerfilter.includes(x["customer"])) {
        totalprod += x[param1] * x[param2];
      }
    }
    return totalprod;
  };

  const currencify = (val, symbol = "$", decim = 2) => {
    return (
      symbol + " " + val.toFixed(decim).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    );
  };
  // sumtotal(prdata, "quantity");
  // console.log(prdata);

  const [data1, setData1] = useState();
  let accesstoken = JSON.parse(localStorage.getItem("accesstoken"));
  let refreshtoken = JSON.parse(localStorage.getItem("refreshtoken"));
  const [prstats, setPrstats] = useState({
    quantity: 0,
    revenue: 0,
    profit: 0,
    avgprofit: 0,
    pctprofit: 0,
  });

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
  const initlayout = {
    lg: [
      { i: "h", x: 0, y: 0, w: 30, h: 14 },
      { i: "j", x: 30, y: 14, w: 10, h: 14 },
    ],
    md: [
      { i: "h", x: 0, y: 0, w: 30, h: 14 },
      { i: "j", x: 30, y: 14, w: 10, h: 14 },
    ],
    sm: [
      { i: "h", x: 0, y: 0, w: 30, h: 14 },
      { i: "j", x: 30, y: 14, w: 10, h: 14 },
    ],
    xs: [
      { i: "h", x: 0, y: 0, w: 30, h: 14 },
      { i: "j", x: 30, y: 14, w: 10, h: 14 },
    ],
    xxs: [
      { i: "h", x: 0, y: 0, w: 30, h: 14 },
      { i: "j", x: 30, y: 14, w: 10, h: 14 },
    ],
  };
  const getFromLS = (key) => {
    let ls = {};
    if (global.localStorage) {
      try {
        ls = JSON.parse(global.localStorage.getItem("rgl-profitability")) || {};
      } catch (e) {}
    }
    return ls[key];
  };
  const saveToLS = (key, value) => {
    if (global.localStorage) {
      global.localStorage.setItem(
        "rgl-profitability",
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

  const periodfilters = [
    "This month",
    "Last 3 months",
    "This year",
    "Last 12 months",
    "Custom",
  ];

  const groupbyfilters = [
    "Month",
    "Customer",
    "Product Group",
    "Product Category",
    "Product",
    "Trader",
  ];
  const groupbyfiltervalues = [
    "month",
    "customer",
    "productGroup",
    "prodCatName",
    "product",
    "tCode",
  ];

  const [clickedId, setClickedId] = useState(0);
  const [clickedGroupID, setClickedGroupID] = useState(0);

  let currentyear = moment().format("YYYY");
  let currentmonth = moment().format("MM");
  let currentday = moment().format("DD");
  let currentdate = moment().format("YYYY-MM-DD");
  let startofcurrentmonth = moment()
    .year(currentyear)
    .month(Number(currentmonth) - 1)
    .date(1)
    .format("YYYY-MM-DD");

  // const [reportdate, setReportdate] = useState(
  //   currentyear + "-0" + currentmonth
  // );
  const [reportstartdate, setReportstartdate] = useState(startofcurrentmonth);
  const [reportenddate, setReportenddate] = useState(
    moment().add(1, "years").format("YYYY-MM-DD")
  );
  const [showcustomedates, setShowcustomdates] = useState(false);
  const [refreshreport, setRefreshreport] = useState(false);

  const handleClick = (event, id) => {
    setClickedId(id);
    if (id === 0) {
      setShowcustomdates(false);
      setReportstartdate(startofcurrentmonth);
      setRefreshreport(!refreshreport);
    }
    if (id === 1) {
      setShowcustomdates(false);
      setReportstartdate(moment().subtract(3, "months").format("YYYY-MM-DD"));
      setRefreshreport(!refreshreport);
    }
    if (id === 2) {
      setShowcustomdates(false);
      setReportstartdate(
        moment().year(currentyear).month(0).date(1).format("YYYY-MM-DD")
      );
      setRefreshreport(!refreshreport);
    }
    if (id === 3) {
      setShowcustomdates(false);
      setReportstartdate(moment().subtract(12, "months").format("YYYY-MM-DD"));
      setRefreshreport(!refreshreport);
    }
    if (id === 4) {
      setShowcustomdates(true);
    }
  };

  const [profitreportgroupby, setProfitreportroupby] = useState("month");

  const handleGroupbyClick = (e, i) => {
    e.preventDefault();
    setClickedGroupID(i);
    setProfitreportroupby(e.target.name);
    setRefreshreport(!refreshreport);
  };
  // const [prdata, setPrdata] = useState();

  useEffect(() => {
    Axios.post("/profitabilityreport", { reportstartdate, reportenddate }).then(
      (response) => {
        setPrdata(response.data);
        const customers = [
          ...new Set(response.data.map((item) => item.customer)),
        ].sort();
        setPrcustomers(customers);
        setPrcustomerfilter(customers);
        setPrcustomerchecks(new Array(customers.length).fill(true));
      }
    );
  }, [refreshreport]);

  return (
    <>
      <ResponsiveGridLayout
        style={{ left: "2px" }}
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
        <div id="profitability" key="h">
          <h3>Profitability Report</h3>

          <div className="periodfilter">
            <div className="periodfilterbuttons">
              <p>Period:</p>
              {periodfilters.map((buttonlabel, i) => (
                <button
                  key={i}
                  name={buttonlabel}
                  onClick={(event) => handleClick(event, i)}
                  className={
                    i === clickedId
                      ? "periodfilterbutton active"
                      : "periodfilterbutton"
                  }
                >
                  {buttonlabel}
                </button>
              ))}
            </div>
            <div className="customdateinputs">
              {showcustomedates
                ? [
                    <label>From:</label>,
                    <input
                      value={reportstartdate}
                      className="check"
                      type="date"
                      onChange={(e) => {
                        e.preventDefault();
                        setReportstartdate(e.target.value);
                      }}
                    />,
                    <label>To:</label>,
                    <input
                      value={reportenddate}
                      className="check2"
                      type="date"
                    />,
                    <button
                      onClick={(e) => {
                        setRefreshreport(!refreshreport);
                      }}
                      className="periodfilterbutton"
                    >
                      Go
                    </button>,
                  ]
                : ""}
            </div>
          </div>
          <div className="prgroupby">
            <p>Group By:</p>
            {groupbyfilters.map((buttonlabel, i) => (
              <button
                key={i}
                name={groupbyfiltervalues[i]}
                onClick={(event) => handleGroupbyClick(event, i)}
                className={
                  i === clickedGroupID
                    ? "periodfilterbutton active"
                    : "periodfilterbutton"
                }
              >
                {buttonlabel}
              </button>
            ))}
          </div>
          <div className="prsummarystats">
            <div className="prstatgroup">
              <p>
                {prdata ? currencify(sumtotal(prdata, "quantity"), "", 0) : ""}
              </p>
              <h4>Quantity</h4>
            </div>
            <div className="prstatgroup">
              <p>
                {prdata
                  ? currencify(sumprod(prdata, "quantity", "price"), "$", 0)
                  : ""}
              </p>
              <h4>Revenue</h4>
            </div>
            <div className="prstatgroup">
              <p>
                {prdata ? currencify(sumtotal(prdata, "profit"), "$", 0) : ""}
              </p>
              <h4>Profit</h4>
            </div>
            <div className="prstatgroup">
              <p>
                {prdata
                  ? currencify(
                      sumtotal(prdata, "profit") / sumtotal(prdata, "quantity"),
                      "$",
                      2
                    )
                  : ""}
              </p>
              <h4>Average Profit</h4>
            </div>
            <div className="prstatgroup">
              <p>
                {prdata
                  ? (
                      (sumtotal(prdata, "profit") /
                        sumprod(prdata, "quantity", "price")) *
                      100
                    ).toFixed(2) + "%"
                  : ""}
              </p>
              <h4>Margin</h4>
            </div>
          </div>
          {/* ((<label>From:</label>),
                  (<input className="check" type="date" />),
                  (<label>To:</label>),
                  (<input className="check2" type="date" />)) */}
          <ProfitabilityReport
            key="profitabilityreport"
            reportstartdate={reportstartdate}
            reportenddate={reportenddate}
            refreshreport={refreshreport}
            profitreportgroupby={profitreportgroupby}
          />
        </div>
        <div id="profitabilitychart" key="j">
          <h3>Profit Waterfall Chart, 2020</h3>
          <WaterfallChart key="waterfallchart" data={data1 ? data1 : ""} />
        </div>
      </ResponsiveGridLayout>
    </>
  );
};

export default ProfitabilityGrid;
