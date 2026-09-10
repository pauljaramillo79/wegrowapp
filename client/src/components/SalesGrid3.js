import React, { useEffect, useState } from "react";
import "./SalesGrid3.css";
import Sales from "./Sales";
import SalesQS3 from "./SalesQS3";
import QSEditModal from "./QSEditModal";
import "./PositionsTableSort.css";

const SalesGrid3 = () => {
  const [isSalesDrawerOpen, setIsSalesDrawerOpen] = useState(false);
  const [QSmodalState, setQSModalState] = useState(false);
  const [QStoedit, setQStoedit] = useState({});

  const showEditModal = (e, positem) => {
    setQSModalState(true);
    setQStoedit(positem);
  };

  const hideEditModal = () => setQSModalState(false);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") setIsSalesDrawerOpen(false);
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  return (
    <div className='sales-workspace'>
      <QSEditModal show={QSmodalState} handleClose={hideEditModal} QStoedit={QStoedit} />

      <main className='sales-workspace__quotation' aria-label='Quotation sheet'>
        <SalesQS3 />
      </main>

      {!isSalesDrawerOpen && (
        <button
          className='sales-drawer-tab'
          type='button'
          aria-expanded='false'
          aria-controls='sales-drawer'
          onClick={() => setIsSalesDrawerOpen(true)}
        >
          <span className='sales-drawer-tab__handle' aria-hidden='true' />
          Sales
        </button>
      )}

      {isSalesDrawerOpen && (
        <div className='sales-drawer-backdrop' role='presentation' onMouseDown={() => setIsSalesDrawerOpen(false)}>
          <aside
            id='sales-drawer'
            className='sales-drawer'
            aria-label='Sales list'
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button
              className='sales-drawer__close-tab'
              type='button'
              aria-label='Close sales list'
              aria-expanded='true'
              aria-controls='sales-drawer'
              onClick={() => setIsSalesDrawerOpen(false)}
            >
              <span className='sales-drawer-tab__handle' aria-hidden='true' />
              Sales
            </button>

            <div className='sales-drawer__content'>
              <Sales
                showEditModal={showEditModal}
                hideEditModal={hideEditModal}
                QSmodalState={QSmodalState}
                QStoedit={QStoedit}
              />
            </div>
          </aside>
        </div>
      )}
    </div>
  );
};

export default SalesGrid3;
