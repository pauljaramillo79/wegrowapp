import React, { useState, useEffect } from "react";
import Axios from "axios";
import CustomerCard from "./CustomerCard";

const CustomerList = ({
  searchcode,
  updateList,
  setShowaddcustomer,
  setShoweditcustomer,
  setSelectedcustomer,
  addNewCustomer,
}) => {
  const [listdata, setListdata] = useState([]);
  const [filtereddata, setFiltereddata] = useState([]);
  const [searchTerm, setSearchTerm] = useState();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    await Axios.post(searchcode).then((response) => {
      setListdata(response.data);
      setFiltereddata(response.data);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateList]);

  const handleFilter = (e) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    if (listdata) {
      if (searchTerm && searchTerm !== "") {
        const results = listdata.filter((item) => {
          if (searchTerm && searchTerm !== "") {
            return (
              item.companyName
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
              item.companyCode
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
              item.country.toLowerCase().includes(searchTerm.toLowerCase())
            );
            // return (item.prodName).includes(searchTerm.toLowerCase())
          }
        });
        setFiltereddata(results);
      } else {
        setFiltereddata(listdata);
      }
    }
  }, [searchTerm]);

  const findCustomer = (code) => {
    setSelectedcustomer(filtereddata.find((el) => el.companyCode === code));
    setShoweditcustomer(true);
    setShowaddcustomer(false);
  };

  return (
    <div>
      <input
        className="adminsearchbar"
        placeholder="...Search"
        onChange={handleFilter}
      />
      <div className="customerlistresults">
        <CustomerCard companyCode={"Add New"} findCustomer={addNewCustomer} />
        {filtereddata.map((item) => (
          <CustomerCard
            companyName={item.companyName}
            companyCode={item.companyCode}
            country={item.country}
            street={item.streetAddress}
            city={item.city}
            website={item.website}
            key={"cust" + item.customerID}
            findCustomer={findCustomer}
          />
        ))}
      </div>
    </div>
  );
};

export default CustomerList;
