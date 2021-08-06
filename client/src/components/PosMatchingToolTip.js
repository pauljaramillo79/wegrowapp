import React, { useEffect, useState } from "react";
import Axios from "axios";

const PosMatchingToolTip = ({ posnumber, posmatchnumber }) => {
  const showHidePosTooltip =
    posnumber === posmatchnumber ? "postooltip" : "postooltip display-none";

  const [posmatchdata, setPosmatchdata] = useState();

  useEffect(() => {
    Axios.post("/posmatching", { posnumber: posnumber }).then((response) => {
      setPosmatchdata(response.data);
    });
  }, []);

  return (
    <span className={showHidePosTooltip}>
      <h4>Matching Sales for Position {posnumber}</h4>
      <ul>
        <li className="posmatchitem">
          <h4>Trader</h4>
          <h4>KTS</h4>
          <h4>Customer</h4>
          <h4>Quantity (mt)</h4>
          <h4>Profit (pmt)</h4>
        </li>
        {posmatchdata
          ? posmatchdata.map((item) => (
              <li className="posmatchitem">
                <p>{item.tCode}</p>
                <p>{item.KTS}</p>
                <p>{item.companyCode}</p>
                <p>{item.quantity}</p>
                <p>{item.tradingProfit}</p>
              </li>
            ))
          : ""}
      </ul>
    </span>
  );
};

export default PosMatchingToolTip;
