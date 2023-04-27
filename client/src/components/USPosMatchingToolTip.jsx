import React, { useEffect, useState } from "react";
import Axios from "axios";

const USPosMatchingToolTip = ({ usposnumber, usposmatchnumber }) => {
  const showHidePosTooltip =
    usposnumber === usposmatchnumber ? "postooltip" : "postooltip display-none";

  const [usposmatchdata, setUSPosmatchdata] = useState();

  useEffect(() => {
    if (usposnumber === usposmatchnumber) {
      Axios.post("/usposmatching", { usposnumber: usposnumber }).then(
        (response) => {
          setUSPosmatchdata(response.data);
        }
      );
    }
  }, [usposmatchnumber]);

  return (
    <span className={showHidePosTooltip}>
      <h4>Matching Sales for Lot {usposnumber}</h4>
      <ul>
        <li className="posmatchitem">
          <h4>WGS</h4>
          <h4>Trader</h4>
          <h4>Customer</h4>
          <h4>Qty (mt)</h4>
          <h4>Qty (pallets)</h4>
          <h4>Sales Price (/mt)</h4>
          <h4>Profit (pmt)</h4>
          <h4>Shipment Date</h4>
        </li>
        {usposmatchdata
          ? usposmatchdata.map((item) => (
              <li className="posmatchitem">
                <p>{item.KTS}</p>
                <p>{item.tCode}</p>
                <p>{item.companyCode}</p>
                <p>{item.quantity}</p>
                <p>{item.quantitypallets}</p>
                <p>{"$" + item.priceAfterInterest}</p>
                <p>{"$" + item.tradingProfit}</p>
                <p>{item.whexit}</p>
              </li>
            ))
          : "No matching sales found"}
      </ul>
    </span>
  );
};

export default USPosMatchingToolTip;
