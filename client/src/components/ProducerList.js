import React, { useState, useEffect } from "react";
import Axios from "axios";
import ProducerCard from "./ProducerCard";

const ProducerList = ({
  searchcode,
  updateList,
  setShowaddproducer,
  setShoweditproducer,
  setSelectedproducer,
  addNewProducer,
}) => {
  const [listdata, setListdata] = useState([]);
  const [filtereddata, setFiltereddata] = useState([]);
  const [searchTerm, setSearchTerm] = useState();

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
          }
        });
        setFiltereddata(results);
      } else {
        setFiltereddata(listdata);
      }
    }
  }, [searchTerm]);

  const findProducer = (code) => {
    setSelectedproducer(filtereddata.find((el) => el.companyCode === code));
    setShoweditproducer(true);
    setShowaddproducer(false);
  };
  return (
    <div>
      <input
        className="adminsearchbar"
        placeholder="...Search"
        onChange={handleFilter}
      />
      <div className="customerlistresults">
        <ProducerCard companyCode={"Add New"} findProducer={addNewProducer} />
        {filtereddata.map((item) => (
          <ProducerCard
            companyName={item.companyName}
            companyCode={item.companyCode}
            country={item.country}
            street={item.streetAddress}
            city={item.city}
            website={item.website}
            key={"prod" + item.producerID}
            findProducer={findProducer}
          />
        ))}
      </div>
    </div>
  );
};

export default ProducerList;
