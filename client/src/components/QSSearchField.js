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
  };

  useEffect(() => {
    if (data) {
      const results = data.filter((item) => {
        if (otherName && otherID) {
          if (searchTerm !== "") {
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
          return (item[searchName] + item[searchID])
            .toLowerCase()
            .includes(searchTerm);
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
        value={searchValue}
        onFocus={loadData}
        onChange={handleChange}
        onDoubleClick={(e) => {
          e.target.select();
        }}
        required
      />
      <div className="flexbreak"></div>
      <span className="QSsearchresults-container">
        <ul className={show ? "QSsearchresults" : "QSsearchresults-hide"}>
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
                          let name2 = selecteditem.split(") ")[2];
                          console.log(name2);
                          setQSFields(
                            ID1,
                            ID2,
                            searchName,
                            otherName,
                            name1,
                            name2
                            // item[searchID],
                            // item[otherID],
                            // item[searchName],
                            // item[otherName]
                          );
                          setSearchValue(item[searchName]);
                          setSearchTerm(item[searchName]);
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
                          setSearchTerm(
                            item[searchID] + " - " + item[searchName]
                          );
                        }}
                      >
                        {item[searchID]} - {item[searchName]}
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
