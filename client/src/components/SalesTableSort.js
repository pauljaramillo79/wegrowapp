// import { getAllByPlaceholderText } from "@testing-library/react";
import React, { useState, useEffect, useContext } from "react";
import Axios from "axios";
import _ from "lodash";
import "./css/screen.css";
import PositionModal from "./PositionModal";
import { AuthContext } from "../App";
import { RefreshPositionsContext } from "../contexts/RefreshPositionsProvider";
import moment from "moment";

import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import "./SalesTableSort.css";

const SalesTableSort = (props) => {
  const role = JSON.parse(localStorage.getItem("role"));

  const { state } = useContext(AuthContext);
  const { QSrefresh, toggleQSrefresh } = useContext(RefreshPositionsContext);
  // Get token values from UseContext and Local Storage
  // let accesstoken = state.accesstoken;
  let accesstoken = JSON.parse(localStorage.getItem("accesstoken"));
  let refreshtoken = JSON.parse(localStorage.getItem("refreshtoken"));
  // Declare custom axios calls for authorization and refreshing token
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
  // Define interceptor to handle error and refresh access token when appropriate
  authAxios.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      if (refreshtoken && error.response.status === 403) {
        const res = await refreshAxios.post("/refreshtoken");
        accesstoken = res.data.accesstoken;
        return await authAxios.post(
          "/sales",
          { userID: props.userID, limit: props.limit },
          {
            headers: {
              Authorization: `Bearer ${accesstoken}`,
            },
          }
        );
      }
      return Promise.reject(error.response);
    }
  );
  // const showEditModal = (e, positem) => {
  //   console.log(positem);
  //   setModalState(true);
  //   setPostoedit(positem);
  // };
  // const hideEditModal = () => {
  //   setModalState(false);
  // };
  // useState
  const [items, setItems] = useState([]);
  const [sort, setSort] = useState(
    props.config.sort || { column: "", order: "" }
  );
  // const [columns, setColumns] = useState(props.config.columns);
  const [columnNames, setColumnNames] = useState([]);
  // const [modalState, setModalState] = useState(false);
  // const [postoedit, setPostoedit] = useState({});
  // eslint-disable-next-line react-hooks/exhaustive-deps

  useState(() => {
    props.setColumns(props.config.columns);
  }, []);
  useEffect(async () => {
    // console.log(props.limit);
    await authAxios
      .post("/sales", { userID: props.userID, limit: props.limit })
      .then((result) => {
        setItems(result.data);
        if (props.columns) {
          setColumnNames(Object.keys(props.columns));
        }
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [QSrefresh, props.userID, props.limit]);

  const duplicateQS = (QSID) => {
    Axios.post("duplicateQS", {
      QSID: QSID,
      QSDate: moment().format("yyyy-MM-DD"),
    }).then(
      (response) => {
        toggleQSrefresh();
      }
      // toggleQSrefresh()
    );
  };

  const handleFilterTextChange = (e, column) => {
    props.setColumns({
      ...props.columns,
      [column]: { ...props.columns[column], filterText: e.target.value },
    });
  };

  const sortColumn = (column) => {
    return (event) => {
      var newSortOrder = sort.order === "asc" ? "desc" : "asc";
      if (sort.column !== column) {
        newSortOrder = props.columns[column].defaultSortOrder;
      }
      setSort({ column: column, order: newSortOrder });
    };
  };
  const sortClass = (column) => {
    var ascOrDesc = sort.order === "asc" ? "headerSortAsc" : "headerSortDesc";
    return sort.column === column ? ascOrDesc : "";
  };
  var operators = {
    "<": function (x, y) {
      return x < y;
    },
    "<=": function (x, y) {
      return x <= y;
    },
    ">": function (x, y) {
      return x > y;
    },
    ">=": function (x, y) {
      return x >= y;
    },
    "==": function (x, y) {
      return x === y;
    },
  };
  var rows = [];
  var filters = {};
  var operandRegex = /^((?:(?:[<>]=?)|==))\s?([-]?\d+(?:\.\d+)?)$/;

  columnNames.forEach((column) => {
    var filterText = props.columns[column].filterText;
    filters[column] = null;

    if (filterText.length > 0) {
      var operandMatch = operandRegex.exec(filterText);
      if (operandMatch && operandMatch.length === 3) {
        filters[column] = ((match) => {
          return (x) => {
            if (x) {
              return operators[match[1]](x, match[2]);
            }
          };
        })(operandMatch);
      } else {
        filters[column] = (x) => {
          if (x) {
            return (
              x.toString().toLowerCase().indexOf(filterText.toLowerCase()) > -1
            );
          }
        };
      }
    }
  });
  var filteredItems = _.filter(items, (item) => {
    return _.every(columnNames, (c) => {
      return !filters[c] || filters[c](item[c]);
    });
  });
  var sortedItems = _.sortBy(filteredItems, sort.column);
  if (sort.order === "desc") sortedItems.reverse();
  var cell = function (x) {
    return columnNames.map(function (c, i) {
      if (c === "quantity") {
        if (x[c]) {
          return (
            <td
              className="canceldrag"
              id={c + "-" + x.QSID}
              key={c + "-" + x.QSID}
            >
              {x[c].toFixed(2)}
            </td>
          );
        } else {
          return (
            <td
              className="canceldrag"
              id={c + "-" + x.QSID}
              key={c + "-" + x.QSID}
            >
              {"na"}
            </td>
          );
        }
      }
      if (
        c === "materialCost" ||
        c === "oFreight" ||
        c === "priceBeforeInterest" ||
        c === "tradingProfit" ||
        c === "tradingMargin" ||
        c === "netback"
      ) {
        if (x[c]) {
          return (
            <td
              className="canceldrag"
              id={c + "-" + x.QSID}
              key={c + "-" + x.QSID}
            >
              {"$" + x[c].toFixed(2)}
            </td>
          );
        } else {
          return (
            <td
              className="canceldrag"
              id={c + "-" + x.QSID}
              key={c + "-" + x.QSID}
            >
              {""}
            </td>
          );
        }
      }
      if (c === "percentageMargin") {
        if (x[c]) {
          return (
            <td
              className="canceldrag"
              id={c + "-" + x.QSID}
              key={c + "-" + x.QSID}
            >
              {x[c].toFixed(2) + "%"}
            </td>
          );
        } else {
          return (
            <td
              className="canceldrag"
              id={c + "-" + x.QSID}
              key={c + "-" + x.QSID}
            >
              {""}
            </td>
          );
        }
      } else {
        if (x[c]) {
          return (
            <td
              className="canceldrag"
              id={c + "-" + x.QSID}
              key={c + "-" + x.QSID}
            >
              {x[c]}
            </td>
          );
        } else {
          return (
            <td
              className="canceldrag"
              id={c + "-" + x.QSID}
              key={c + "-" + x.QSID}
            >
              {""}
            </td>
          );
        }
      }
    });
  };

  sortedItems.forEach((item, idx) => {
    rows.push(
      <tr id={idx} key={idx}>
        {cell(item)}
        <div className="crudbuttons">
          <button
            className="editbutton"
            onClick={(e) => {
              props.showEditModal(e, item);
            }}
          >
            Edit
          </button>
          <button
            className="editbutton"
            onClick={(e) => {
              e.preventDefault();
              duplicateQS(item.QSID);
            }}
          >
            Duplicate
          </button>
          {role === 1 || role === 2 ? (
            <button
              className="editbutton"
              onClick={(e) => {
                confirmAlert({
                  title: "Are you sure?",
                  message: `You are about to delete QS (${item.QSID}). This deletion is irreversible. Click Delete to continue or Cancel`,
                  buttons: [
                    {
                      label: "Cancel",
                      onClick: () => console.log("cancelled"),
                    },
                    {
                      label: "Delete",
                      onClick: async () => {
                        await Axios.delete("/deleteQS", {
                          data: { id: item.QSID },
                        })
                          .then((response) => toggleQSrefresh())
                          .catch((err) => console.log(err));
                      },
                    },
                  ],
                  closeOnClickOutside: true,
                  closeOnEscape: true,
                });
              }}
            >
              Delete
            </button>
          ) : (
            ""
          )}
        </div>
      </tr>
    );
  });
  const header = columnNames.map((c) => {
    return (
      <>
        <th
          onClick={sortColumn(c)}
          className={"header canceldrag " + sortClass(c)}
        >
          {props.columns[c].name}
        </th>
      </>
    );
  });

  const filterInputs = columnNames.map((c) => {
    return (
      <td className="sales-filter canceldrag">
        <input
          type="text"
          value={props.columns[c].filterText}
          onChange={(e) => {
            handleFilterTextChange(e, c);
          }}
        />
      </td>
    );
  });

  return (
    <div>
      {/* <PositionModal
        show={modalState}
        handleClose={hideEditModal}
        positiontoedit={postoedit}
      /> */}
      <table cellSpacing="0" className="tablesorter">
        <thead>
          <tr>
            {header}
            <th className="header lastheader"></th>
          </tr>
          <tr className="searchboxes">
            {filterInputs}
            <td></td>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    </div>
  );
};

export default SalesTableSort;
