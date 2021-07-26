import React, { useState, useEffect } from "react";
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
  return (
    <>
      <input
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
      />
      <div className="flexbreak"></div>
      <div className="presearchresults"></div>
      <span className="QSsearchresults-container">
        <ul className={show ? "searchresults" : "QSsearchresults-hide"}>
          {searchID === "productID" ? (
            <li onClick={showAddProd}>...Add New Product</li>
          ) : (
            ""
          )}
          {searchResults
            ? searchResults.map((item) => {
                // console.log(item);
                //   Object.entries(item).map((i, key) => console.log(i[1]));
                //   console.log(item);
                //   console.log(Object.keys(item));
                if (otherID && otherName && thirdName && thirdID) {
                  return (
                    // <ul className={show ? "searchresults" : "QSsearchresults-hide"}>
                    <li
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
