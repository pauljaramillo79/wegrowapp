import React, { useEffect, useState } from "react";
import Axios from "axios";

const getAuthConfig = () => {
  const possibleKeys = ["WGaccesstoken", "WGaccessToken", "accessToken", "accesstoken", "token"];
  let token = "";

  for (let index = 0; index < possibleKeys.length; index += 1) {
    const storedValue = localStorage.getItem(possibleKeys[index]);

    if (storedValue) {
      try {
        token = JSON.parse(storedValue);
      } catch (error) {
        token = storedValue;
      }

      if (token) break;
    }
  }

  if (!token) return {};

  return {
    headers: {
      Authorization: String(token).indexOf("Bearer ") === 0 ? token : "Bearer " + token,
    },
  };
};

const BudgetCategorySubmission = ({
  year,
  prodCatNameID,
  prodCatName,
  refreshKey,
  onOpenAllocation,
  onSubmittedChange,
}) => {
  const [submission, setSubmission] = useState(null);
  const [readiness, setReadiness] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [working, setWorking] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState("");

  const loadSubmission = () => {
    if (!year || !prodCatNameID) return;

    setLoading(true);
    setError("");

    Promise.all([
      Axios.post("/budgetcategorystatus", {
        year: year,
        prodCatNameID: prodCatNameID,
      }),
      Axios.post("/budgetcategoryreadiness", {
        year: year,
        prodCatNameID: prodCatNameID,
      }),
    ])
      .then((responses) => {
        const submissionData = responses[0].data;
        setSubmission(submissionData);
        setReadiness(responses[1].data);
        setLoading(false);
        onSubmittedChange(submissionData.status === "submitted");
      })
      .catch((requestError) => {
        const response = requestError.response;
        const message = response && response.data && response.data.error;
        setError(message || "Unable to load submission status.");
        setLoading(false);
      });
  };

  useEffect(() => {
    setOpen(false);
    setConfirming(false);
  }, [year, prodCatNameID]);

  useEffect(() => {
    loadSubmission();
  }, [year, prodCatNameID, refreshKey]);

  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
        setConfirming(false);
      }
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  const submitCategory = () => {
    setWorking(true);
    setError("");

    Axios.post(
      "/submitbudgetcategory",
      {
        year: year,
        prodCatNameID: prodCatNameID,
      },
      getAuthConfig(),
    )
      .then(() => {
        setWorking(false);
        setConfirming(false);
        loadSubmission();
      })
      .catch((requestError) => {
        const response = requestError.response;
        const message = response && response.data && response.data.error;
        setError(message || "Unable to submit this category.");
        setWorking(false);
        setConfirming(false);
        loadSubmission();
      });
  };

  const reopenCategory = () => {
    if (!window.confirm("Reopen this category and allow budget edits again?")) return;

    setWorking(true);
    setError("");

    Axios.post(
      "/reopenbudgetcategory",
      {
        year: year,
        prodCatNameID: prodCatNameID,
      },
      getAuthConfig(),
    )
      .then(() => {
        setWorking(false);
        loadSubmission();
      })
      .catch((requestError) => {
        const response = requestError.response;
        const message = response && response.data && response.data.error;
        setError(message || "Unable to reopen this category.");
        setWorking(false);
      });
  };

  if (!prodCatNameID) return null;

  const summary = readiness && readiness.summary;
  const submitted = submission && submission.status === "submitted";
  const reopened = submission && submission.status === "reopened";
  let displayStatus = "Draft";
  let statusClass = "draft";

  if (submitted) {
    displayStatus = "Submitted";
    statusClass = "submitted";
  } else if (reopened) {
    displayStatus = "Reopened";
    statusClass = "reopened";
  } else if (summary && summary.ready) {
    displayStatus = "Ready";
    statusClass = "ready";
  } else if (summary && summary.totalRequiredCells > 0) {
    displayStatus = "Incomplete";
    statusClass = "incomplete";
  }

  return (
    <React.Fragment>
      <div className='category-submission-control'>
        <span className={"category-status category-status--" + statusClass}>{displayStatus}</span>
        <button
          type='button'
          className='category-review-button'
          onClick={() => {
            setOpen(true);
            setConfirming(false);
            loadSubmission();
          }}
          disabled={loading}
        >
          {submitted ? "View submission" : "Review & Submit"}
        </button>
      </div>

      <button
        type='button'
        className={open ? "submission-backdrop submission-backdrop--open" : "submission-backdrop"}
        aria-label='Close submission review'
        onClick={() => setOpen(false)}
      />

      <aside
        className={open ? "submission-drawer submission-drawer--open" : "submission-drawer"}
        aria-hidden={!open}
        aria-label='Budget category submission review'
      >
        <div className='submission-drawer__header'>
          <div>
            <p>Budget submission</p>
            <h3>{year + " · " + (prodCatName || "Product category")}</h3>
          </div>
          <button type='button' onClick={() => setOpen(false)} aria-label='Close'>
            ×
          </button>
        </div>

        {loading ? <p className='submission-message'>Checking category…</p> : null}

        {!loading && summary ? (
          <div className='submission-progress'>
            <div>
              <strong>{summary.completeCells}</strong>
              <span>Complete</span>
            </div>
            <div>
              <strong>{summary.incompleteCells}</strong>
              <span>Incomplete</span>
            </div>
            <div>
              <strong>{summary.totalRequiredCells}</strong>
              <span>Required</span>
            </div>
          </div>
        ) : null}

        {!loading && submitted ? (
          <div className='submission-complete-card'>
            <span className='category-status category-status--submitted'>Submitted</span>
            <h4>This category is read-only</h4>
            <p>
              Submitted by {submission.submittedBy || "an authorized user"}
              {submission.submittedAt ? " on " + new Date(submission.submittedAt).toLocaleString() : ""}.
            </p>
            <button type='button' className='submission-secondary-button' disabled={working} onClick={reopenCategory}>
              {working ? "Reopening…" : "Reopen Category"}
            </button>
          </div>
        ) : null}

        {!loading && !submitted && summary && summary.incompleteCells > 0 ? (
          <div className='submission-incomplete'>
            <div className='submission-section-heading'>
              <div>
                <h4>Complete these allocations</h4>
                <p>Select a row to add its customer and origin details.</p>
              </div>
            </div>

            <div className='submission-cell-list'>
              {readiness.incompleteCells.map((cell) => (
                <button
                  type='button'
                  className='submission-cell'
                  key={cell.budgetEntryID}
                  onClick={() => onOpenAllocation(cell)}
                >
                  <div>
                    <strong>{cell.product + " · " + cell.country + " · Q" + cell.quarter}</strong>
                    <span>
                      {Number(cell.allocatedQuantity).toLocaleString() +
                        " of " +
                        Number(cell.budgetQuantity).toLocaleString() +
                        " mt allocated"}
                    </span>
                  </div>
                  <strong>{Number(cell.remainingQuantity).toLocaleString()} mt left</strong>
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {!loading && !submitted && summary && summary.ready ? (
          <div className='submission-ready-card'>
            <span className='category-status category-status--ready'>Ready</span>
            <h4>All required cells are fully allocated</h4>
            <p>Submitting will make this product category read-only until it is reopened.</p>

            {!confirming ? (
              <button type='button' className='submission-primary-button' onClick={() => setConfirming(true)}>
                Submit Category
              </button>
            ) : (
              <div className='submission-confirmation'>
                <strong>Confirm final submission?</strong>
                <div>
                  <button type='button' className='submission-secondary-button' onClick={() => setConfirming(false)}>
                    Cancel
                  </button>
                  <button
                    type='button'
                    className='submission-primary-button'
                    disabled={working}
                    onClick={submitCategory}
                  >
                    {working ? "Submitting…" : "Confirm Submission"}
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : null}

        {!loading && !submitted && summary && summary.totalRequiredCells === 0 ? (
          <p className='submission-notice'>This category has no positive budget quantities to submit.</p>
        ) : null}

        {error ? <p className='submission-error'>{error}</p> : null}
      </aside>
    </React.Fragment>
  );
};

export default BudgetCategorySubmission;
