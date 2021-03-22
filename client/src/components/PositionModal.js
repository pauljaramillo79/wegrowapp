import React, { useState, useEffect, useContext } from "react";
import "./PositionModal.css";
import Axios from "axios";
import moment from "moment";
import { RefreshPositionsContext } from "../contexts/RefreshPositionsProvider";
import SearchField from "./SearchField";

const PositionModal = ({ handleClose, show, positiontoedit }) => {
  const { posrefresh, togglePosrefresh } = useContext(RefreshPositionsContext);

  const showHideClassName = show ? "modal display-block" : "modal display-none";

  const positionid = positiontoedit.WGP;
  const [posEditInit, setPosEditInit] = useState();
  const [posOriginal, setPosOriginal] = useState();
  const [posChanges, setPosChanges] = useState();
  const [resetfield, setResetfield] = useState(false);

  useEffect(() => {
    if (positionid && show) {
      Axios.post("/positiontoedit", { id: positionid }).then((response) => {
        setPosEditInit(response.data[0]);
        setPosOriginal(response.data[0]);
        setPosChanges({
          id: response.data[0].positionID,
          WGP: response.data[0].WGP,
        });
        // console.log(response.data[0]);
      });
    }
  }, [show]);
  // const postoeditinit = {
  //   WGP: positiontoedit.WGP,
  //   supplier: positiontoedit.abbreviation,
  //   companyCode: positiontoedit.companyCode,
  //   quantity: positiontoedit.quantity,
  //   FOB: positiontoedit.FOB,
  // };
  // const [postoedit, setPostoedit] = useState({});

  // useEffect(() => {
  //   setPostoedit(postoeditinit);

  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [show]);

  const handleInputChange = (e) => {
    e.preventDefault();
    setPosEditInit({
      ...posEditInit,
      [e.target.name]: e.target.value,
    });
  };
  const handleLocalClose = (e) => {
    e.preventDefault();
    handleClose(e);
    setPosChanges({});
  };
  const compareObjects = (obj1, obj2) => {
    for (let key of Object.keys(obj1)) {
      if (obj1[key] !== obj2[key]) {
        setPosChanges({
          ...posChanges,
          [key]: obj1[key],
        });
        console.log(posChanges);
      }
    }
  };
  useEffect(() => {
    if (posEditInit && posOriginal) {
      compareObjects(posEditInit, posOriginal);
    }
  }, [posEditInit]);

  const cleanup = async () => {
    await setPosChanges({});
    await togglePosrefresh();
  };

  const handleProductChange = (id1, name1, id2, name2, id3, name3) => {
    setPosEditInit({
      ...posEditInit,
      product: name1,
      supplier: name2,
      productGroup: name3,
    });
    setPosChanges({
      ...posChanges,
      productID: id1,
      supplierID: id2,
      productGroupID: id3,
    });
  };

  const updatePosition = async (e) => {
    e.preventDefault();
    handleClose(e);
    await Axios.post("/positionupdate", {
      poschanges: posChanges,
    }).then((response) => cleanup());
  };
  return (
    <div className={showHideClassName}>
      <section className="modal-main">
        <form className="positionModalForm" onSubmit={updatePosition}>
          <h2>Edit Position</h2>
          <div className="form-group">
            <label htmlFor="">WGP:</label>
            <input
              name="WGP"
              type="text"
              value={posEditInit ? posEditInit.WGP || "" : ""}
              onChange={handleInputChange}
              className="canceldrag"
            />
          </div>
          <div className="form-group">
            <label htmlFor="">Product:</label>
            <SearchField
              className="searchfield canceldrag"
              searchURL={"/productlist"}
              searchName={"abbreviation"}
              searchID={"productID"}
              otherName={"supplier"}
              otherID={"supplierID"}
              thirdName={"productGroup"}
              thirdID={"prodGroupID"}
              resetfield={resetfield}
              setResetfield={setResetfield}
              value={posEditInit ? posEditInit.product || "" : ""}
              setProdSupplier={handleProductChange}
            />
            {/* <input
              name="product"
              type="text"
              value={posEditInit ? posEditInit.product || "" : ""}
              onChange={handleInputChange}
              className="canceldrag"
            /> */}
          </div>
          <div className="form-group">
            <label htmlFor="">Supplier:</label>
            <input
              name="supplier"
              type="text"
              value={posEditInit ? posEditInit.supplier || "" : ""}
              className="canceldrag"
              readOnly
            />
          </div>
          <div className="form-group">
            <label htmlFor="">ProdGroup:</label>
            <input
              name="productgroup"
              type="text"
              value={posEditInit ? posEditInit.productGroup || "" : ""}
              className="canceldrag"
              readOnly
            />
          </div>
          <div className="form-group">
            <label htmlFor="">QuantityL:</label>
            <input
              name="quantityLow"
              type="text"
              value={posEditInit ? posEditInit.quantityLow || "" : ""}
              onChange={handleInputChange}
              className="canceldrag"
            />
          </div>
          <div className="form-group">
            <label htmlFor="">QuantityH:</label>
            <input
              name="quantityHigh"
              type="text"
              value={posEditInit ? posEditInit.quantityHigh || "" : ""}
              onChange={handleInputChange}
              className="canceldrag"
            />
          </div>
          <div className="form-group">
            <label htmlFor="">FOB:</label>
            <input
              name="FOBCost"
              type="text"
              value={posEditInit ? posEditInit.FOBCost || "" : ""}
              onChange={handleInputChange}
              className="canceldrag"
            />
          </div>

          <div className="form-group">
            <label>From:</label>
            <input
              name="shipmentStart"
              type="date"
              value={
                posEditInit
                  ? moment(posEditInit.shipmentStart).format("YYYY-MM-DD") || ""
                  : ""
              }
              onChange={handleInputChange}
              className="canceldrag"
            />
          </div>
          <div className="form-group">
            <label>To:</label>
            <input
              name="shipmentEnd"
              type="date"
              value={
                posEditInit
                  ? moment(posEditInit.shipmentEnd).format("YYYY-MM-DD") || ""
                  : ""
              }
              onChange={handleInputChange}
              className="canceldrag"
            />
          </div>
          <div className="form-group">
            <label htmlFor="">Notes:</label>
            <textarea
              name="notes"
              className="canceldrag"
              value={posEditInit ? posEditInit.notes || "" : ""}
              onChange={handleInputChange}
              className="canceldrag"
            ></textarea>
          </div>

          <button
            className="confirmbutton"
            type="submit"
            // onSubmit={(e) => updatePosition(e)}
          >
            Save Edits
          </button>
          <button className="cancelbutton" onClick={handleLocalClose}>
            Cancel
          </button>
        </form>
      </section>
    </div>
  );
};

export default PositionModal;
