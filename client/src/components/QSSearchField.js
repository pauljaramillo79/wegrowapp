import React, { useState, useEffect } from "react";
import Axios from "axios";
import "./QSSearchField.css";

const QSSearchField = ({
  searchURL,
  searchName,
  searchID,
  placeholder,
  otherName,
  otherID,
  setQSFields,
  resetfield,
  setResetfield,
  value,
}) => {
  const [data, setData] = useState();
  const [searchValue, setSearchValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState();
  const [border, setBorder] = useState(false);
  const [show, setShow] = useState(false);

  const loadData = () => {
    Axios.post(searchURL).then((response) => {
      setData(response.data);
    });
  };
  const handleChange = (e) => {
    setShow(true);
    setSearchValue(e.target.value);
    setSearchTerm(e.target.value);
    // setResetfield(false);
  };

  useEffect(() => {
    if (data) {
      const results = data.filter((item) => {
        if (otherName && otherID) {
          if (searchTerm && searchTerm !== "") {
            return (
              item[searchName] +
              item[searchID] +
              item[otherName] +
              item[otherID]
            )
              .toLowerCase()
              .includes(searchTerm.toLowerCase());
          } else {
            setShow(false);
            setQSFields("", "", searchName, otherName, "", "");
          }
        } else {
          if (searchTerm && searchTerm !== "") {
            return (item[searchName] + item[searchID])
              .toLowerCase()
              .includes(searchTerm.toLowerCase());
          } else {
            setShow(false);
            setQSFields("", "", searchName, "", "", "");
          }
        }
      });
      setSearchResults(results);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);
  return (
    <>
      <input
        // /className="searchfield"
        placeholder={placeholder}
        type="text"
        value={resetfield ? "" : searchValue || value}
        onFocus={loadData}
        onChange={handleChange}
        onDoubleClick={(e) => {
          e.target.select();
        }}
        className="canceldrag"
        required
      />
      <div className="flexbreak"></div>
      <span className="QSsearchresults-container">
        <ul className={show ? "QSsearchresults" : "QSsearchresults-hide"}>
          {searchID === "productID" ? <li>...Add New Product</li> : ""}
          {searchID === "customerID" ? <li>...Add New Customer</li> : ""}
          {searchID === "POLID" ? <li>...Add New Loadport</li> : ""}
          {searchID === "PODID" ? <li>...Add New Disport</li> : ""}
          {searchID === "paytermID" ? <li>...Add New Payterm</li> : ""}

          {searchResults
            ? searchResults.map((item) => {
                //   Object.entries(item).map((i, key) => console.log(i[1]));
                //   console.log(item);
                //   console.log(Object.keys(item));
                if (otherID && otherName) {
                  return (
                    <>
                      <li
                        onClick={(e) => {
                          let selecteditem = e.target.innerText;
                          let ID1 = selecteditem.substring(
                            selecteditem.indexOf("(") + 1,
                            selecteditem.indexOf(")")
                          );
                          let name1 = selecteditem.substring(
                            selecteditem.indexOf(") ") + 1,
                            selecteditem.indexOf(" -")
                          );
                          let ID2 = selecteditem.substring(
                            selecteditem.lastIndexOf("(") + 1,
                            selecteditem.lastIndexOf(")")
                          );
                          let name2 = selecteditem.substring(
                            selecteditem.lastIndexOf(") ") + 2
                          );
                          setQSFields(
                            Number(ID1),
                            Number(ID2),
                            searchName,
                            otherName,
                            name1,
                            name2
                            // item[searchID],
                            // item[otherID],
                            // item[searchName],
                            // item[otherName]
                          );
                          // setSearchValue(item[searchName]);
                          setSearchValue(null);
                          setSearchTerm(item[searchName]);
                          // setSearchTerm(null);

                          setShow(false);
                        }}
                      >
                        ({item[searchID]}) {item[searchName]} - ({item[otherID]}
                        ) {item[otherName]}
                      </li>
                    </>
                  );
                } else {
                  return (
                    <>
                      <li
                        onClick={(e) => {
                          let selecteditem = e.target.innerText;
                          let ID1 = selecteditem.substring(
                            selecteditem.indexOf("(") + 1,
                            selecteditem.indexOf(")")
                          );
                          let name1 = selecteditem.split(") - ")[1];

                          console.log(ID1, name1);
                          // setSearchTerm(
                          //   item[searchID] + " - " + item[searchName]
                          // );
                          setQSFields(
                            Number(ID1),
                            "",
                            searchName,
                            "",
                            name1,
                            ""
                            // item[searchID],
                            // item[otherID],
                            // item[searchName],
                            // item[otherName]
                          );
                          // setSearchValue(item[searchName]);
                          setSearchValue(null);

                          setSearchTerm(item[searchName]);
                          // setSearchTerm(null);
                          setShow(false);
                        }}
                      >
                        ({item[searchID]}) - {item[searchName]}
                      </li>
                    </>
                  );
                }
              })
            : ""}
        </ul>
      </span>
    </>
  );
};

export default QSSearchField;
