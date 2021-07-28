import React, { useState, useEffect } from "react";
import TraderCard from "./TraderCard";
import Axios from "axios";

const TradersList = ({
  searchcode,
  setSelectedTrader,
  addNewTrader,
  updateList,
  setShowedit,
  setShowadd,
}) => {
  const [listdata, setListdata] = useState([]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    await Axios.post(searchcode).then((response) => {
      setListdata(response.data);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateList]);

  const findTrader = (code) => {
    setSelectedTrader(listdata.find((el) => el.tCode === code));
    setShowedit(true);
    setShowadd(false);
  };
  return (
    <div className="traderlistresults">
      <TraderCard tName={"Add New"} findtrader={addNewTrader} />
      {listdata.map((item) => (
        <TraderCard
          tName={item.tName}
          tLastName={item.tLastName}
          active={item.active}
          role={item.role}
          email={item.userName}
          tCode={item.tCode}
          findtrader={findTrader}
          key={"trad" + item.traderID}
        />
      ))}
    </div>
  );
};

export default TradersList;
