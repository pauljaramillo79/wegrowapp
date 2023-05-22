import React, { useState, useEffect } from "react";
import OperationNotes from "./OperationNotes";
import "./OperationDetail.css";
import Axios from "axios";

const OperationDetail = ({ opToEdit, opToEditFull }) => {
  const [opNotes, setOpNotes] = useState();
  const [reloadnotes, setReloadnotes] = useState(false);

  useEffect(() => {
    Axios.post("/getopnotes", { QSID: opToEdit }).then((response) =>
      setOpNotes(response.data)
    );
  }, [opToEdit, reloadnotes]);

  return (
    <>
      <div className="opDetailHeader">
        {opToEditFull ? (
          <>
            <div className="opDetailQSID">
              <h2>QSID:</h2>
              <h2>{opToEditFull.QSID}</h2>
            </div>
            <div className="opDetailMainInfo">
              <div className="opDetailMIItem">
                <h3>Product:</h3> <h3>{opToEditFull.abbreviation}</h3>
              </div>
              <div className="opDetailMIItem">
                <h3>Quantity:</h3> <h3>{opToEditFull.quantity}</h3>
              </div>
            </div>
          </>
        ) : (
          ""
        )}
      </div>
      <div className="operationDetail">
        <OperationNotes
          opToEdit={opToEdit}
          opNotes={opNotes}
          setOpNotes={setOpNotes}
          reloadnotes={reloadnotes}
          setReloadnotes={setReloadnotes}
        />
      </div>
    </>
  );
};

export default OperationDetail;
