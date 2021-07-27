import React from "react";

const TraderCard = ({
  tCode,
  tName,
  tLastName,
  active,
  role,
  email,
  findtrader,
}) => {
  return (
    <div
      style={{
        backgroundColor: active === "y" ? "" : "#D3D3D3",
      }}
      className="tradercard"
      name={tCode}
      onClick={() => findtrader(tCode)}
    >
      <h4>
        {tName} {tLastName}
      </h4>
      <p>{active === "y" ? "Active" : active === "n" ? "Inactive" : ""}</p>

      <p className="traderemail">{email}</p>
      <p className="traderrole">{role}</p>
    </div>
  );
};

export default TraderCard;
