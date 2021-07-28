import React from "react";

const CustomerCard = ({
  companyName,
  companyCode,
  country,
  findCustomer,
  city,
  street,
  website,
}) => {
  return (
    <div className="customercard" onClick={() => findCustomer(companyCode)}>
      <div className="customercardtopline">
        <h4>{companyCode} </h4>
        <p className="customercountry"> {country}</p>
      </div>
      {/* <p>{companyName}</p> */}

      <ul>
        <li>
          <p className="addresslabel">Name:</p>
          <p className="addressfield">{companyName}</p>
        </li>
        <li>
          <p className="addresslabel">Street:</p>
          <p className="addressfield">{street}</p>
        </li>
        <li>
          <p className="addresslabel">City:</p>
          <p className="addressfield">{city}</p>
        </li>
        {/* <li>
          <p className="addresslabel">Website:</p>
          <p className="addressfield">{website}</p>
        </li> */}
        {/* <li>
          <p className="addresslabel">Country:</p>
          <p className="addressfield">{country}</p>
        </li> */}
      </ul>
      {/* <p className="customercountry">{country}</p> */}
    </div>
  );
};

export default CustomerCard;
