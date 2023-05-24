import React, { useState, useEffect, useContext } from "react";
import OperationNotes from "./OperationNotes";
import "./OperationDetail.css";
import Axios from "axios";
import Chat from "./Chat";
import { LogisticsContext } from "../contexts/LogisticsProvider";

const OperationDetail = ({
  // opToEdit,
  opToEditFull,
  setOpToEditFull,
  socket,
}) => {
  const { opToEdit, setOpToEdit, opNotes, setOpNotes } = useContext(
    LogisticsContext
  );

  // const [opNotes, setOpNotes] = useState();
  const [reloadnotes, setReloadnotes] = useState(false);

  // useEffect(() => {
  //   Axios.post("/getopnotes", { QSID: opToEdit }).then((response) =>
  //     setOpNotes(response.data)
  //   );
  // }, [opToEdit, reloadnotes]);

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
        <div className="opDetailSupplyside">
          {opToEditFull ? (
            <>
              <div className="opDetailItem">
                <p>WGP:</p>
                <input
                  type="text"
                  value={opToEditFull.KTP}
                  onChange={(e) => {
                    setOpToEditFull({ ...opToEditFull, KTP: e.target.value });
                  }}
                />
              </div>
              <div className="opDetailItem">
                <p>Supplier:</p>
                <p className="opDItext">{opToEditFull.supplier}</p>
              </div>
            </>
          ) : (
            ""
          )}
        </div>
        <div className="opDetailDemandside">
          {opToEditFull ? (
            <>
              <div className="opDetailItem">
                <p>WGS:</p>
                <input
                  type="text"
                  value={opToEditFull.KTS}
                  onChange={(e) => {
                    setOpToEditFull({ ...opToEditFull, KTS: e.target.value });
                  }}
                />
              </div>
              <div className="opDetailItem">
                <p>Customer:</p>
                <p className="opDItext">{opToEditFull.customer}</p>
              </div>
            </>
          ) : (
            ""
          )}
        </div>
        <OperationNotes
          // opToEdit={opToEdit}
          // opNotes={opNotes}
          // setOpNotes={setOpNotes}
          reloadnotes={reloadnotes}
          setReloadnotes={setReloadnotes}
          socket={socket}
        />
      </div>
    </>
  );
};

export default OperationDetail;
