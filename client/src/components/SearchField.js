import React, { useState, useEffect, useRef } from "react";
import Axios from "axios";
import "./SearchField.css";

const SearchField = ({
  searchURL,
  searchName,
  searchID,
  placeholder,
  otherName,
  otherID,
  thirdName,
  thirdID,
  setProdSupplier,
  resetfield,
  setResetfield,
  value,
  showAddProd,
  // vertical,
}) => {
  const [data, setData] = useState();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState();
  const [show, setShow] = useState(false);

  // Load Data
  const loadData = () => {
    Axios.post(searchURL).then((response) => {
      // console.log(response.data);
      setData(response.data);
    });
  };

  // Handle Change
  const handleChange = (e) => {
    setResetfield(false);
    setShow(true);
    setSearchTerm(e.target.value);
  };

  // Filter Use Effect
  useEffect(() => {
    if (data) {
      const results = data.filter((item) => {
        if (otherName && otherID && thirdID) {
          if (searchTerm && searchTerm !== "") {
            return (
              item[searchName] +
              item[searchID] +
              item[otherName] +
              item[otherID] +
              item[thirdName] +
              item[thirdID]
            )
              .toLowerCase()
              .includes(searchTerm.toLowerCase());
          } else {
            setShow(false);
          }
        }
        if (otherName && otherID && !thirdID) {
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
          }
        } else {
          if (searchTerm && searchTerm !== "") {
            return (item[searchName] + item[searchID])
              .toLowerCase()
              .includes(searchTerm.toLowerCase());
          } else {
            setShow(false);
          }
        }
      });
      setSearchResults(results);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  let QSModalRefs = useRef([]);

  const QSMproductRef = useRef(null);
  const QSMcustomerRef = useRef(null);
  const QSMPOLRef = useRef(null);
  const QSMPODRef = useRef(null);
  const QSMtrafficRef = useRef(null);
  const QSMpaytermRef = useRef(null);

  let QSMcurrentIndex;

  return (
    <>
      <input
        ref={
          searchID === "productID"
            ? QSMproductRef
            : searchID === "customerID"
            ? QSMcustomerRef
            : searchID === "POLID"
            ? QSMPOLRef
            : searchID === "PODID"
            ? QSMPODRef
            : searchID === "trafficID"
            ? QSMtrafficRef
            : QSMpaytermRef
        }
        placeholder={placeholder}
        type="text"
        value={resetfield ? "" : searchTerm || value}
        onFocus={loadData}
        onChange={handleChange}
        // onDoubleClick={(e) => {
        //   e.target.select();
        // }}
        required
        className="canceldrag"
        onKeyDown={(e) => {
          if (searchResults) {
            if (searchResults.length > 0 && e.key === "ArrowRight") {
              e.preventDefault();
              // setCurrentIndex(0);
              QSMcurrentIndex = 0;
              console.log(QSModalRefs.current);
              console.log(QSModalRefs.current[QSMcurrentIndex]);
              // console.log(testref.current);
              if (QSMcurrentIndex === 0) {
                QSModalRefs.current[QSMcurrentIndex].focus();
              } // testref.current.focus();
            }
          }
        }}
      />
      <div className={"flexbreak"}></div>
      <div className="presearchresults"></div>
      <span className="QSsearchresults-container">
        <ul className={show ? "searchresults" : "QSsearchresults-hide"}>
          {/* {searchID === "productID" ? (
            <li onClick={showAddProd}>...Add New Product</li>
          ) : (
            ""
          )} */}
          {searchResults
            ? searchResults.map((item, index) => {
                // console.log(item);
                //   Object.entries(item).map((i, key) => console.log(i[1]));
                //   console.log(item);
                //   console.log(Object.keys(item));
                if (otherID && otherName && thirdName && thirdID) {
                  return (
                    // <ul className={show ? "searchresults" : "QSsearchresults-hide"}>
                    <li
                      ref={(el) => (QSModalRefs.current[index] = el)}
                      tabIndex={-1}
                      onKeyDown={(e) => {
                        if (e.key === "ArrowLeft") {
                          e.preventDefault();
                          // console.log(searchID);
                          // eslint-disable-next-line default-case
                          switch (searchID) {
                            case "productID":
                              QSMproductRef.current.focus();
                              break;
                            case "customerID":
                              QSMcustomerRef.current.focus();
                              break;
                            case "POLID":
                              QSMPOLRef.current.focus();
                              break;
                            case "PODID":
                              QSMPODRef.current.focus();
                              break;
                            case "trafficID":
                              QSMtrafficRef.current.focus();
                              break;
                            case "paytermID":
                              QSMpaytermRef.current.focus();
                              break;
                          }
                        }
                        if (e.key === "ArrowDown") {
                          e.preventDefault();
                          if (QSModalRefs.current[QSMcurrentIndex + 1]) {
                            QSMcurrentIndex = QSMcurrentIndex + 1;
                            QSModalRefs.current[QSMcurrentIndex].focus();
                          }
                        }
                        if (e.key === "ArrowUp") {
                          e.preventDefault();
                          if (QSModalRefs.current[QSMcurrentIndex - 1]) {
                            QSMcurrentIndex = QSMcurrentIndex - 1;
                            QSModalRefs.current[QSMcurrentIndex].focus();
                          }
                        }
                        if (e.key === "Enter") {
                          setProdSupplier(
                            item[searchID],
                            item[searchName],
                            item[otherID],
                            item[otherName],
                            item[thirdID],
                            item[thirdName]
                          );
                          setSearchTerm(null);
                        }
                      }}
                      onClick={(e) => {
                        setProdSupplier(
                          item[searchID],
                          item[searchName],
                          item[otherID],
                          item[otherName],
                          item[thirdID],
                          item[thirdName]
                        );
                        // setSearchTerm(
                        //   item[searchID] +
                        //     " - " +
                        //     item[searchName] +
                        //     " - " +
                        //     item[otherName] +
                        //     " - " +
                        //     item[thirdName]
                        // );
                        setSearchTerm(null);
                      }}
                    >
                      {item[searchID]} - {item[searchName]} - {item[otherName]}
                    </li>
                    // </ul>
                  );
                }
                if (otherID && otherName && !thirdName && !thirdID) {
                  return (
                    // <ul className={show ? "searchresults" : "QSsearchresults-hide"}>
                    <li
                      ref={(el) => (QSModalRefs.current[index] = el)}
                      tabIndex={-1}
                      onKeyDown={(e) => {
                        if (e.key === "ArrowLeft") {
                          e.preventDefault();
                          // console.log(searchID);
                          // eslint-disable-next-line default-case
                          switch (searchID) {
                            case "productID":
                              QSMproductRef.current.focus();
                              break;
                            case "customerID":
                              QSMcustomerRef.current.focus();
                              break;
                            case "POLID":
                              QSMPOLRef.current.focus();
                              break;
                            case "PODID":
                              QSMPODRef.current.focus();
                              break;
                            case "trafficID":
                              QSMtrafficRef.current.focus();
                              break;
                            case "paytermID":
                              QSMpaytermRef.current.focus();
                              break;
                          }
                        }
                        if (e.key === "ArrowDown") {
                          e.preventDefault();
                          if (QSModalRefs.current[QSMcurrentIndex + 1]) {
                            QSMcurrentIndex = QSMcurrentIndex + 1;
                            QSModalRefs.current[QSMcurrentIndex].focus();
                          }
                        }
                        if (e.key === "ArrowUp") {
                          e.preventDefault();
                          if (QSModalRefs.current[QSMcurrentIndex - 1]) {
                            QSMcurrentIndex = QSMcurrentIndex - 1;
                            QSModalRefs.current[QSMcurrentIndex].focus();
                          }
                        }
                        if (e.key === "Enter") {
                          setProdSupplier(
                            item[searchID],
                            item[searchName],
                            item[otherID],
                            item[otherName]
                          );
                          setSearchTerm(null);
                        }
                      }}
                      onClick={(e) => {
                        setProdSupplier(
                          item[searchID],
                          item[searchName],
                          item[otherID],
                          item[otherName]
                        );
                        // setSearchTerm(
                        //   item[searchID] +
                        //     " - " +
                        //     item[searchName] +
                        //     " - " +
                        //     item[otherName]
                        // );
                        setSearchTerm(null);
                      }}
                    >
                      {item[searchID]} - {item[searchName]} - {item[otherName]}
                    </li>
                    // </ul>
                  );
                } else {
                  return (
                    // <>
                    <li
                      ref={(el) => (QSModalRefs.current[index] = el)}
                      tabIndex={-1}
                      onKeyDown={(e) => {
                        if (e.key === "ArrowLeft") {
                          e.preventDefault();
                          // console.log(searchID);
                          // eslint-disable-next-line default-case
                          switch (searchID) {
                            case "productID":
                              QSMproductRef.current.focus();
                              break;
                            case "customerID":
                              QSMcustomerRef.current.focus();
                              break;
                            case "POLID":
                              QSMPOLRef.current.focus();
                              break;
                            case "PODID":
                              QSMPODRef.current.focus();
                              break;
                            case "trafficID":
                              QSMtrafficRef.current.focus();
                              break;
                            case "paytermID":
                              QSMpaytermRef.current.focus();
                              break;
                          }
                        }
                        if (e.key === "ArrowDown") {
                          e.preventDefault();
                          if (QSModalRefs.current[QSMcurrentIndex + 1]) {
                            QSMcurrentIndex = QSMcurrentIndex + 1;
                            QSModalRefs.current[QSMcurrentIndex].focus();
                          }
                        }
                        if (e.key === "ArrowUp") {
                          e.preventDefault();
                          if (QSModalRefs.current[QSMcurrentIndex - 1]) {
                            QSMcurrentIndex = QSMcurrentIndex - 1;
                            QSModalRefs.current[QSMcurrentIndex].focus();
                          }
                        }
                        if (e.key === "Enter") {
                          setProdSupplier(item[searchID], item[searchName]);
                          setSearchTerm(null);
                        }
                      }}
                      onClick={async (e) => {
                        setProdSupplier(item[searchID], item[searchName]);
                        // setSearchTerm(
                        //   item[searchID] + " - " + item[searchName]
                        // );
                        setSearchTerm(null);
                      }}
                    >
                      {item[searchID]} - {item[searchName]}
                    </li>
                    // </>
                  );
                }
              })
            : ""}
        </ul>
      </span>
    </>
  );
};

export default SearchField;
