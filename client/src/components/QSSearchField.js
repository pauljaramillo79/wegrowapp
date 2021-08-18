import React, { useState, useEffect, useRef } from "react";
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

  let listRefs = useRef([]);
  // const [listRefs, setListRefs] = useState([]);
  const productRef = useRef(null);
  const customerRef = useRef(null);
  const POLRef = useRef(null);
  const PODRef = useRef(null);
  const trafficRef = useRef(null);
  const paytermRef = useRef(null);

  // const [currentIndex, setCurrentIndex] = useState();

  let currentIndex;

  // useEffect(() => {
  //   console.log(searchID);
  //   // listRefs.current = [];
  // }, [searchTerm]);
  return (
    <>
      <input
        ref={
          searchID === "productID"
            ? productRef
            : searchID === "customerID"
            ? customerRef
            : searchID === "POLID"
            ? POLRef
            : searchID === "PODID"
            ? PODRef
            : searchID === "trafficID"
            ? trafficRef
            : paytermRef
        }
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
        onKeyDown={(e) => {
          if (searchResults) {
            if (searchResults.length > 0 && e.key === "ArrowRight") {
              e.preventDefault();
              // setCurrentIndex(0);
              currentIndex = 0;
              console.log(listRefs.current);
              console.log(listRefs.current[currentIndex]);
              // console.log(testref.current);
              if (currentIndex === 0) {
                listRefs.current[currentIndex].focus();
              } // testref.current.focus();
            }
          }
        }}
      />
      <div className="flexbreak"></div>
      <span className="QSsearchresults-container">
        <ul className={show ? "QSsearchresults" : "QSsearchresults-hide"}>
          {/* {searchID === "productID" ? (
            <li ref={testref} tabIndex={-1}>
              ...Add New Product
            </li>
          ) : (
            ""
          )} */}
          {/* 
          {searchID === "customerID" ? <li>...Add New Customer</li> : ""}
          {searchID === "POLID" ? <li>...Add New Loadport</li> : ""}
          {searchID === "PODID" ? <li>...Add New Disport</li> : ""}
          {searchID === "paytermID" ? <li>...Add New Payterm</li> : ""} */}

          {searchResults
            ? searchResults.map((item, index) => {
                //   Object.entries(item).map((i, key) => console.log(i[1]));
                //   console.log(item);
                //   console.log(Object.keys(item));
                if (otherID && otherName) {
                  return (
                    <>
                      <li
                        ref={(el) => (listRefs.current[index] = el)}
                        tabIndex={-1}
                        onKeyDown={(e) => {
                          if (e.key === "ArrowLeft") {
                            e.preventDefault();
                            // console.log(searchID);
                            // eslint-disable-next-line default-case
                            switch (searchID) {
                              case "productID":
                                productRef.current.focus();
                                break;
                              case "customerID":
                                customerRef.current.focus();
                                break;
                              case "POLID":
                                POLRef.current.focus();
                                break;
                              case "PODID":
                                PODRef.current.focus();
                                break;
                              case "trafficID":
                                trafficRef.current.focus();
                                break;
                              case "paytermID":
                                paytermRef.current.focus();
                                break;
                            }
                            // if (searchID === "productID") {
                            //   console.log("aga");
                            //   productRef.current.focus();
                            // } else if (searchID === "customerID") {
                            //   console.log("whtasup");
                            //   customerRef.current.focus();
                            // }
                          }
                          if (e.key === "ArrowDown") {
                            e.preventDefault();
                            if (listRefs.current[currentIndex + 1]) {
                              currentIndex = currentIndex + 1;
                              listRefs.current[currentIndex].focus();
                            }
                          }
                          if (e.key === "ArrowUp") {
                            e.preventDefault();
                            if (listRefs.current[currentIndex - 1]) {
                              currentIndex = currentIndex - 1;
                              listRefs.current[currentIndex].focus();
                            }
                          }
                          if (e.key === "Enter") {
                            e.preventDefault();
                            let selecteditem = e.target.innerText;
                            let ID1 = selecteditem.substring(
                              selecteditem.indexOf("(") + 1,
                              selecteditem.indexOf(")")
                            );
                            let name1 = selecteditem.substring(
                              selecteditem.indexOf(") ") + 2,
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
                          }
                        }}
                        onClick={(e) => {
                          let selecteditem = e.target.innerText;
                          let ID1 = selecteditem.substring(
                            selecteditem.indexOf("(") + 1,
                            selecteditem.indexOf(")")
                          );
                          let name1 = selecteditem.substring(
                            selecteditem.indexOf(") ") + 2,
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
                        ref={(el) => (listRefs.current[index] = el)}
                        tabIndex={-1}
                        onKeyDown={(e) => {
                          if (e.key === "ArrowLeft") {
                            e.preventDefault();
                            // console.log(searchID);
                            switch (searchID) {
                              case "productID":
                                productRef.current.focus();
                                break;
                              case "customerID":
                                customerRef.current.focus();
                                break;
                              case "POLID":
                                POLRef.current.focus();
                                break;
                              case "PODID":
                                PODRef.current.focus();
                                break;
                              case "trafficID":
                                trafficRef.current.focus();
                                break;
                              case "paytermID":
                                paytermRef.current.focus();
                                break;
                            }
                          }
                          if (e.key === "ArrowDown") {
                            e.preventDefault();
                            if (listRefs.current[currentIndex + 1]) {
                              currentIndex = currentIndex + 1;
                              listRefs.current[currentIndex].focus();
                            }
                          }
                          if (e.key === "ArrowUp") {
                            e.preventDefault();
                            if (listRefs.current[currentIndex - 1]) {
                              currentIndex = currentIndex - 1;
                              listRefs.current[currentIndex].focus();
                            }
                          }
                          if (e.key === "Enter") {
                            e.preventDefault();
                            let selecteditem = e.target.innerText;
                            let ID1 = selecteditem.substring(
                              selecteditem.indexOf("(") + 1,
                              selecteditem.indexOf(")")
                            );
                            let name1 = selecteditem.split(") - ")[1];

                            console.log(ID1, name1);
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
                          }
                        }}
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
