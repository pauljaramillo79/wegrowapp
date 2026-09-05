import React, { useEffect, useState } from "react";
import Axios from "axios";
import SearchInput from "./SearchInput";

const EMPTY_FORM = {
  customerID: "",
  originCountryID: "",
  quantity: "",
};

const BudgetAllocationDrawer = ({ open, cell, readOnly, onClose, onAllocationChange }) => {
  const [details, setDetails] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [origins, setOrigins] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadDrawer = () => {
    if (!cell || !cell.budgetEntryID) {
      return;
    }

    setLoading(true);
    setError("");

    Promise.all([
      Axios.post("/budgetallocationdetails", {
        budgetEntryID: cell.budgetEntryID,
      }),
      Axios.post("/budgetallocationcustomers"),
      Axios.post("/budgeteligibleorigins", {
        prodNameID: cell.prodNameID,
      }),
    ])
      .then((responses) => {
        setDetails(responses[0].data);
        setCustomers(responses[1].data);
        setOrigins(responses[2].data);
        setLoading(false);
      })
      .catch((requestError) => {
        const response = requestError.response;
        const message = response && response.data && response.data.error;
        setError(message || "Unable to load allocation details.");
        setLoading(false);
      });
  };

  useEffect(() => {
    if (open && cell) {
      setForm(EMPTY_FORM);
      loadDrawer();
    }
  }, [open, cell]);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape" && open) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [open, onClose]);

  const handleFormChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setError("");
  };

  const editAllocation = (allocation) => {
    setForm({
      customerID: String(allocation.customerID),
      originCountryID: String(allocation.originCountryID),
      quantity: String(allocation.quantity),
    });
    setError("");
  };

  const saveAllocation = (event) => {
    event.preventDefault();

    if (!form.customerID || !form.originCountryID || Number(form.quantity) <= 0) {
      setError("Select a customer and origin, then enter a quantity greater than zero.");
      return;
    }

    setSaving(true);
    setError("");

    Axios.post("/savebudgetallocation", {
      budgetEntryID: cell.budgetEntryID,
      customerID: Number(form.customerID),
      originCountryID: Number(form.originCountryID),
      quantity: Number(form.quantity),
    })
      .then(() => {
        setForm(EMPTY_FORM);
        setSaving(false);
        loadDrawer();
        onAllocationChange();
      })
      .catch((requestError) => {
        const response = requestError.response;
        const data = response && response.data;
        let message = data && data.error;

        if (data && data.remainingQuantity !== undefined) {
          message += " Remaining quantity: " + Number(data.remainingQuantity).toLocaleString() + " mt.";
        }

        setError(message || "Unable to save the allocation.");
        setSaving(false);
      });
  };

  const deleteAllocation = (allocationID) => {
    setError("");

    Axios.post("/deletebudgetallocation", {
      allocationID: allocationID,
    })
      .then(() => {
        setForm(EMPTY_FORM);
        loadDrawer();
        onAllocationChange();
      })
      .catch((requestError) => {
        const response = requestError.response;
        const message = response && response.data && response.data.error;
        setError(message || "Unable to delete the allocation.");
      });
  };

  const summary = details && details.summary;
  const allocations = details && details.allocations ? details.allocations : [];

  return (
    <React.Fragment>
      <button
        type='button'
        className={open ? "allocation-drawer-backdrop allocation-drawer-backdrop--open" : "allocation-drawer-backdrop"}
        aria-label='Close budget allocations'
        onClick={onClose}
      />

      <aside
        className={open ? "allocation-drawer allocation-drawer--open" : "allocation-drawer"}
        aria-hidden={!open}
        aria-label='Budget allocation details'
      >
        <div className='allocation-drawer__header'>
          <div>
            <p className='allocation-drawer__eyebrow'>Customer and origin</p>
            <h3>{cell ? cell.product + " · " + cell.country + " · Q" + cell.quarter : "Budget allocation"}</h3>
          </div>
          <button type='button' className='allocation-drawer__close' onClick={onClose} aria-label='Close'>
            ×
          </button>
        </div>

        {loading ? <p className='allocation-drawer__message'>Loading allocations…</p> : null}

        {!loading && summary ? (
          <div className='allocation-summary'>
            <div>
              <span>Budget</span>
              <strong>{Number(summary.budgetQuantity).toLocaleString()} mt</strong>
            </div>
            <div>
              <span>Allocated</span>
              <strong>{Number(summary.allocatedQuantity).toLocaleString()} mt</strong>
            </div>
            <div className={Number(summary.remainingQuantity) < 0 ? "allocation-summary__warning" : ""}>
              <span>Remaining</span>
              <strong>{Number(summary.remainingQuantity).toLocaleString()} mt</strong>
            </div>
          </div>
        ) : null}

        {!loading && origins.length === 0 ? (
          <p className='allocation-drawer__notice'>No supplier origins are configured for this product.</p>
        ) : null}

        {!loading && details && readOnly ? (
          <p className='allocation-drawer__readonly'>This category has been submitted. Allocations are read-only.</p>
        ) : null}

        {!loading && details && !readOnly ? (
          <form className='allocation-form' onSubmit={saveAllocation} autoComplete='off'>
            <div className='allocation-form__field'>
              <span className='allocation-form__label'>Customer</span>
              <SearchInput
                options={customers}
                value={form.customerID}
                onChange={(customerID) => {
                  setForm({
                    ...form,
                    customerID: String(customerID),
                  });
                }}
                getOptionValue={(customer) => customer.customerID}
                getOptionLabel={(customer) => customer.companyCode}
                getOptionDescription={(customer) => {
                  return customer.companyName + (customer.country ? " · " + customer.country : "");
                }}
                placeholder='Search customers'
                ariaLabel='Search and select a customer'
              />
            </div>
            <div className='allocation-form__row'>
              <label>
                Origin
                <select name='originCountryID' value={form.originCountryID} onChange={handleFormChange}>
                  <option value=''>Select origin</option>
                  {origins.map((origin) => (
                    <option key={origin.countryID} value={origin.countryID}>
                      {origin.country}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Quantity (mt)
                <input
                  type='number'
                  name='quantity'
                  min='0.01'
                  step='0.01'
                  value={form.quantity}
                  onChange={handleFormChange}
                  placeholder='0'
                  autoComplete='off'
                />
              </label>
            </div>
            {error ? <p className='allocation-form__error'>{error}</p> : null}
            <div className='allocation-form__actions'>
              <button type='button' className='allocation-button allocation-button--secondary' onClick={resetForm}>
                Clear
              </button>
              <button
                type='submit'
                className='allocation-button allocation-button--primary'
                disabled={saving || origins.length === 0}
              >
                {saving ? "Saving…" : "Save allocation"}
              </button>
            </div>
          </form>
        ) : null}

        {!loading && details ? (
          <div className='allocation-list'>
            <div className='allocation-list__heading'>
              <h4>Current allocations</h4>
              <span>{allocations.length}</span>
            </div>

            {allocations.length === 0 ? (
              <p className='allocation-drawer__message'>No customer allocations have been added.</p>
            ) : (
              allocations.map((allocation) => (
                <div className='allocation-item' key={allocation.allocationID}>
                  <div className='allocation-item__details'>
                    <strong>{allocation.customer}</strong>
                    <span>{allocation.companyName}</span>
                    <small>{allocation.origin}</small>
                  </div>
                  <strong className='allocation-item__quantity'>
                    {Number(allocation.quantity).toLocaleString()} mt
                  </strong>
                  {!readOnly ? (
                    <div className='allocation-item__actions'>
                      <button type='button' onClick={() => editAllocation(allocation)}>
                        Edit
                      </button>
                      <button
                        type='button'
                        className='allocation-item__delete'
                        onClick={() => deleteAllocation(allocation.allocationID)}
                      >
                        Delete
                      </button>
                    </div>
                  ) : null}
                </div>
              ))
            )}
          </div>
        ) : null}
      </aside>
    </React.Fragment>
  );
};

export default BudgetAllocationDrawer;
