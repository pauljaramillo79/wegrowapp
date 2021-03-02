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
  setProdSupplier,
}) => {
  const [data, setData] = useState();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState();

  const loadData = () => {
    Axios.post(searchURL).then((response) => {
      setData(response.data);
      // console.log(response.data);
    });
  };
  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };
  useEffect(() => {
    if (data) {
      const results = data.filter((item) => {
        if (otherName && otherID) {
          return (
            item[searchName] +
            item[searchID] +
            item[otherName] +
            item[otherID]
          )
            .toLowerCase()
            .includes(searchTerm);
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
        value={searchTerm}
        onFocus={loadData}
        onChange={handleChange}
        onDoubleClick={(e) => {
          e.target.select();
        }}
        required
      />
      <div className="flexbreak"></div>
      <div className="presearchresults"></div>
      <ul className="searchresults">
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
                        setProdSupplier(item[searchID], item[otherID]);
                        setSearchTerm(
                          item[searchID] +
                            " - " +
                            item[searchName] +
                            " - " +
                            item[otherName]
                        );
                      }}
                    >
                      {item[searchID]} - {item[searchName]} - {item[otherName]}
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
    </>
  );
};

export default SearchField;
