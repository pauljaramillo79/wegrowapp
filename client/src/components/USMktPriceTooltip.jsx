import React, { useState, useContext } from "react";
import Axios from "axios";
import { ProfRepContext } from "../contexts/ProfRepProvider";

const USMktPriceTooltip = ({ usqsid, usqsidmatch, setUsqsidmatch }) => {
  const { setMktpricedata } = useContext(ProfRepContext);

  const showHideUSMktPriceTooltip =
    usqsid === usqsidmatch
      ? "mktpriceupdatemenu"
      : "mktpriceupdatemenu display-none";

  const [mktprice, setMktprice] = useState();

  const handleMktPriceSubmit = (e) => {
    e.preventDefault();
    Axios.post("/addusmktprice", { mktprice, usqsid }).then(() => {
      Axios.post("/usmktpriceupdates").then((response) => {
        setMktpricedata(response.data);
        setUsqsidmatch(0);
        setMktprice("");
      });
      //   console.log(response);
    });
  };

  const handleMktPriceChange = (e) => {
    const isdecimalnumber = RegExp("^[0-9.]+$");
    if (isdecimalnumber.test(e.target.value) || e.target.value === "") {
      setMktprice(e.target.value);
    }
  };
  return (
    <div className={showHideUSMktPriceTooltip}>
      <form
        onSubmit={(e) => {
          handleMktPriceSubmit(e);
        }}
      >
        <input
          value={mktprice}
          onChange={(e) => {
            handleMktPriceChange(e);
          }}
          onDoubleClick={(e) => {
            e.target.select();
          }}
          required
        />
        <button type="submit">Update</button>
      </form>
    </div>
  );
};

export default USMktPriceTooltip;
