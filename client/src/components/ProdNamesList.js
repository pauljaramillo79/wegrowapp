import React, { useState, useEffect } from "react";
import Axios from "axios";
import ProdNamesCard from "./ProdNamesCard";

const ProdNamesList = ({
  searchcode,
  handleProductClick,
  addNewProdGroup,
  addNewProdCatName,
  updateList,
  updateList2,
  handleProdGroupClick, // setSelectedgprods,
}) => {
  const [listdata, setListdata] = useState([]);
  // eslint-disable-next-line react-hooks/exhaustive-deps

  // eslint-disable-next-line no-extend-native
  Array.prototype.groupBy = function (key) {
    return this.reduce(function (groups, item) {
      const val = item[key];
      groups[val] = groups[val] || [];
      groups[val].push(item);
      return groups;
    }, {});
  };
  const [gdata, setGdata] = useState({});
  var group = "";
  var prodcatname = {};

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    await Axios.post(searchcode).then((response) => {
      setListdata(response.data);
      const rep = response.data.groupBy("productGroup");

      setGdata(rep);
      console.log("called this too");
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateList, updateList2]);

  // const handleProductClick = (prod) => {
  //   // console.log(prod);
  //   Axios.post("/selectgroupedprods", { selectedprod: prod }).then(
  //     (response) => {
  //       console.log(response);
  //     }
  //   );
  // };
  return (
    <div className="prodgroupcards">
      {Object.entries(gdata).map((i, key) => {
        // console.log(i[1]);
        group = Object.keys(gdata)[key];
        prodcatname = gdata[group].groupBy("prodCatName");
        return [
          <ProdNamesCard
            group={group}
            data={prodcatname}
            handleProductClick={handleProductClick}
            handleProdGroupClick={handleProdGroupClick}
            // setSelectedgprods={setSelectedgprods}
          />,
        ];
      })}
      <div className="prodgroupcard prodaddcard">
        <p onClick={addNewProdGroup}>+ Add New Group</p>
        <p onClick={addNewProdCatName}>+ Add New ProdCatName</p>
      </div>
    </div>
  );
};

// ,
//           <h4>{group}</h4>,
//           Object.entries(prodcatname).map((j, k) => {
//             return [<p>{Object.keys(prodcatname)[k]}</p>];
//           }),
export default ProdNamesList;
