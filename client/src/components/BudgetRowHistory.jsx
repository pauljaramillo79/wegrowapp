import React, { useEffect, useMemo, useState } from "react";
import Axios from "axios";

const QUARTERS = ["Q1", "Q2", "Q3", "Q4"];
const compactNumber = (value) => {
  const number = Number(value) || 0;
  if (Math.abs(number) >= 1000000) return `${(number / 1000000).toFixed(1).replace(".0", "")}M`;
  if (Math.abs(number) >= 1000) return `${(number / 1000).toFixed(1).replace(".0", "")}K`;
  return number.toFixed(0);
};

const normalizeSeries = (series = []) =>
  series.map((item) => ({
    year: Number(item.year),
    quarters: QUARTERS.map((quarter) => {
      const nestedValue = item.quarters && item.quarters[quarter];
      const value = nestedValue !== undefined && nestedValue !== null ? nestedValue : item[quarter];
      return Number(value !== undefined && value !== null ? value : 0);
    }),
  }));

const HistoryChart = ({ title, subtitle, series, loading }) => {
  const allValues = series.reduce((values, item) => values.concat(item.quarters), []);
  const maxValue = Math.max.apply(null, [1].concat(allValues));
  if (loading) return <div className='history-chart history-chart--loading' aria-label={`Loading ${title}`} />;
  if (!series.length)
    return (
      <div className='history-chart history-chart--empty'>
        <h4>{title}</h4>
        <p>No quarterly history is available for this row yet.</p>
      </div>
    );

  return (
    <section className='history-chart' aria-label={title}>
      <div className='history-chart__heading'>
        <div>
          <h4>{title}</h4>
          <p>{subtitle}</p>
        </div>
        <div className='history-chart__legend'>
          {series.map((item, index) => (
            <span key={item.year} style={{ "--series-color": `var(--history-${index + 1})` }}>
              {item.year}
            </span>
          ))}
        </div>
      </div>
      <div className='history-chart__plot'>
        {QUARTERS.map((quarter, quarterIndex) => (
          <div className='history-chart__quarter' key={quarter}>
            <div className='history-chart__bars'>
              {series.map((item, seriesIndex) => {
                const value = item.quarters[quarterIndex];
                return (
                  <div
                    className='history-chart__bar'
                    key={`${item.year}-${quarter}`}
                    style={{
                      "--bar-height": `${Math.max(3, (value / maxValue) * 100)}%`,
                      "--bar-color": `var(--history-${seriesIndex + 1})`,
                    }}
                  >
                    <span className='history-chart__value'>{compactNumber(value)}</span>

                    <div className='history-chart__tooltip'>
                      <strong>
                        {item.year} {quarter}
                      </strong>

                      <span>{value.toLocaleString("en-US")} mt</span>
                    </div>
                  </div>
                );
              })}
            </div>
            <strong>{quarter}</strong>
          </div>
        ))}
      </div>
    </section>
  );
};

const toAnnualSeries = (series) =>
  series.map((item) => ({
    year: item.year,
    value: item.quarters.reduce((total, value) => total + value, 0),
  }));

const AnnualChart = ({ title, series, loading }) => {
  const annualSeries = toAnnualSeries(series);
  const maxValue = Math.max.apply(null, [1].concat(annualSeries.map((item) => item.value)));

  if (loading) return <div className='history-chart history-chart--loading' aria-label={`Loading ${title}`} />;

  if (!annualSeries.length)
    return (
      <div className='history-chart history-chart--empty'>
        <h4>{title}</h4>
        <p>No annual history is available for this row yet.</p>
      </div>
    );

  return (
    <section className='history-chart' aria-label={title}>
      <div className='history-chart__heading'>
        <div>
          <h4>{title}</h4>
          <p>Total quantity by completed year</p>
        </div>
      </div>
      <div className='annual-chart__plot'>
        {annualSeries.map((item, index) => (
          <div className='annual-chart__year' key={item.year}>
            <div className='annual-chart__bar-area'>
              <div
                className='annual-chart__bar'
                style={{
                  "--bar-height": `${Math.max(3, (item.value / maxValue) * 100)}%`,
                  "--bar-color": `var(--history-${index + 1})`,
                }}
              >
                <span className='annual-chart__value'>{compactNumber(item.value)}</span>
                <div className='history-chart__tooltip'>
                  <strong>{item.year}</strong>
                  <span>{item.value.toLocaleString("en-US")} mt</span>
                </div>
              </div>
            </div>
            <strong>{item.year}</strong>
          </div>
        ))}
      </div>
    </section>
  );
};

const CustomerChart = ({ customers, loading }) => {
  const maxValue = Math.max.apply(null, [1].concat(customers.map((item) => Number(item.quantity) || 0)));

  if (loading)
    return <div className='history-chart customer-chart history-chart--loading' aria-label='Loading customer sales' />;

  if (!customers.length)
    return (
      <div className='history-chart customer-chart history-chart--empty'>
        <h4>Sales by customer</h4>
        <p>No customer sales are available for this row yet.</p>
      </div>
    );

  return (
    <section className='history-chart customer-chart' aria-label='Sales by customer'>
      <div className='history-chart__heading'>
        <div>
          <h4>Sales by customer</h4>
          <p>Actual quantity across the last three completed years</p>
        </div>
      </div>
      <div className='customer-chart__list'>
        {customers.map((item) => {
          const value = Number(item.quantity) || 0;
          return (
            <div className='customer-chart__row' key={item.customer}>
              <span className='customer-chart__name' title={item.customer}>
                {item.customer}
              </span>
              <div className='customer-chart__track'>
                <div className='customer-chart__bar' style={{ "--bar-width": `${(value / maxValue) * 100}%` }}>
                  <div className='customer-chart__tooltip'>
                    <strong>{item.customer}</strong>
                    <div className='customer-chart__tooltip-years'>
                      {(item.years || []).map((yearItem) => (
                        <div key={yearItem.year}>
                          <span>{yearItem.year}</span>
                          <span>{Number(yearItem.quantity).toLocaleString("en-US")} mt</span>
                        </div>
                      ))}
                    </div>
                    <div className='customer-chart__tooltip-total'>
                      <span>Total</span>
                      <span>{value.toLocaleString("en-US")} mt</span>
                    </div>
                  </div>
                </div>
              </div>
              <strong>{compactNumber(value)}</strong>
            </div>
          );
        })}
      </div>
    </section>
  );
};

const BudgetRowHistory = ({ row, year, prodCatNameID }) => {
  const [history, setHistory] = useState({ budget: [], sales: [], customers: [] });
  const [activeView, setActiveView] = useState("quarterly");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!row) return undefined;
    let cancelled = false;
    setLoading(true);
    setError("");
    Axios.post("/budgetrowhistory", {
      year,
      prodcat: prodCatNameID,
      product: row.product,
      region: row.region,
      country: row.country,
      years: 3,
    })
      .then(({ data }) => {
        if (!cancelled) {
          setHistory({
            budget: normalizeSeries(data && data.budget),
            sales: normalizeSeries(data && data.sales),
            customers: data && Array.isArray(data.customers) ? data.customers : [],
          });
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setHistory({ budget: [], sales: [], customers: [] });
          setError("Historical data could not be loaded.");
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [prodCatNameID, row, year]);

  const rowLabel = useMemo(() => (row ? `${row.country} · ${row.product}` : "Selected budget row"), [row]);

  return (
    <aside className='budget-history' aria-live='polite'>
      <div className='budget-history__header'>
        <div>
          <span className='budget-history__eyebrow'>Historical guidance</span>
          <h3>{rowLabel}</h3>
          {row && <p>{row.region}</p>}
        </div>
        <span className='budget-history__unit'>Quantity (mt)</span>
      </div>
      <div className='budget-history__pills' role='tablist' aria-label='History view'>
        <button
          type='button'
          role='tab'
          aria-selected={activeView === "quarterly"}
          className={
            activeView === "quarterly" ? "budget-history__pill budget-history__pill--active" : "budget-history__pill"
          }
          onClick={() => setActiveView("quarterly")}
        >
          Quarterly
        </button>
        <button
          type='button'
          role='tab'
          aria-selected={activeView === "annual"}
          className={
            activeView === "annual" ? "budget-history__pill budget-history__pill--active" : "budget-history__pill"
          }
          onClick={() => setActiveView("annual")}
        >
          Annual
        </button>
        <button
          type='button'
          role='tab'
          aria-selected={activeView === "customers"}
          className={
            activeView === "customers" ? "budget-history__pill budget-history__pill--active" : "budget-history__pill"
          }
          onClick={() => setActiveView("customers")}
        >
          Customers
        </button>
      </div>
      {!row ? (
        <div className='budget-history__prompt'>
          <strong>Select a country row</strong>
          <span>Click any field to compare its history.</span>
        </div>
      ) : (
        <>
          {error && <p className='budget-history__error'>{error}</p>}
          {activeView === "quarterly" && (
            <div className='budget-history__charts'>
              <HistoryChart
                title='Budget history'
                subtitle='Last three completed years by quarter'
                series={history.budget}
                loading={loading}
              />
              <HistoryChart
                title='Actual sales history'
                subtitle='Last three completed years by quarter'
                series={history.sales}
                loading={loading}
              />
            </div>
          )}
          {activeView === "annual" && (
            <div className='budget-history__charts'>
              <AnnualChart title='Annual budget' series={history.budget} loading={loading} />
              <AnnualChart title='Annual actual sales' series={history.sales} loading={loading} />
            </div>
          )}
          {activeView === "customers" && (
            <div className='budget-history__charts'>
              <CustomerChart customers={history.customers} loading={loading} />
            </div>
          )}
        </>
      )}
    </aside>
  );
};

export default BudgetRowHistory;
