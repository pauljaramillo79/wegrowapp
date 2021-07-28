import React, { useState, useEffect } from "react";
import "./Admin.css";
import Axios from "axios";
// import TraderCard from "./TraderCard";
// import CustomerCard from "./CustomerCard";
import TradersList from "./TradersList";
import CustomerList from "./CustomerList";

const Admin = () => {
  const [selectedlist, setSelectedlist] = useState("/traderslist");
  //   const [listdata, setListdata] = useState([]);
  const [selectedtrader, setSelectedtrader] = useState();
  const [selectedcustomer, setSelectedcustomer] = useState();
  const [newtrader, setNewtrader] = useState({ role: "3" });
  const [newcustomer, setNewcustomer] = useState({});
  const [deletecustomer, setDeletecustomer] = useState();
  const [updatelist, setUpdatelist] = useState(true);
  const [updatecustomerlist, setUpdatecustomerlist] = useState(true);

  const [showedit, setShowedit] = useState(false);
  const [showadd, setShowadd] = useState(false);

  const [showaddcustomer, setShowaddcustomer] = useState(false);
  const [showeditcustomer, setShoweditcustomer] = useState(false);

  const showhideadd = showadd ? "editTrader displayblock" : "displaynone";
  const showhideedit = showedit
    ? "editTrader displayblock"
    : "editTrader displaynone";

  const showhideaddcustomer = showaddcustomer
    ? "editCustomer displayblock"
    : "editCustomer displaynone";
  const showhideeditcustomer = showeditcustomer
    ? "editCustomer displayblock"
    : "editCustomer displaynone";

  // eslint-disable-next-line react-hooks/exhaustive-deps
  //   useEffect(async () => {
  //     if (selectedlist) {
  //       await Axios.post(selectedlist).then((response) => {
  //         setListdata(response.data);

  //         // console.log(response.data);
  //       });
  //       //   console.log(showtraders);
  //     }
  //   }, [selectedlist, updatelist]);

  const selectlist = (e) => {
    e.preventDefault();
    setSelectedlist("/" + e.target.name);
    setShowadd(false);
    setShowedit(false);
    setShowaddcustomer(false);
    setShoweditcustomer(false);
  };

  const handleChange = (e, key) => {
    e.preventDefault();
    setSelectedtrader({
      ...selectedtrader,
      [key]: e.target.value,
    });
  };
  const handleCustomerChange = (e, key) => {
    e.preventDefault();
    setSelectedcustomer({
      ...selectedcustomer,
      [key]: e.target.value,
    });
  };

  const [roles, setRoles] = useState([]);

  useEffect(() => {
    Axios.post("/roles").then((response) => {
      setRoles(response.data);
    });
  }, []);

  const editTrader = (e) => {
    e.preventDefault();
    Axios.post("/updatetrader", { selectedtrader }).then((response) => {
      setUpdatelist(!updatelist);
    });
  };

  const editCustomer = (e) => {
    e.preventDefault();
    Axios.post("/updatecustomer", { selectedcustomer }).then((response) => {
      setUpdatecustomerlist(!updatecustomerlist);
    });
  };

  const addNewTrader = () => {
    setShowedit(false);
    setShowadd(true);
  };

  const addNewCustomer = () => {
    setShoweditcustomer(false);
    setShowaddcustomer(true);
  };

  const handleNewTraderChange = (e) => {
    e.preventDefault();
    setNewtrader({
      ...newtrader,
      [e.target.name]: e.target.value,
    });
  };
  const handleNewCustomerChange = (e) => {
    e.preventDefault();
    setNewcustomer({
      ...newcustomer,
      [e.target.name]: e.target.value,
    });
  };
  const handleCustomerDeleteChange = (e) => {
    e.preventDefault();
    setDeletecustomer(e.target.value);
  };

  const addTrader = (e) => {
    e.preventDefault();
    Axios.post("/addNewTrader", { newtrader }).then((response) => {
      console.log(response);
    });
  };
  const addCustomer = async (e) => {
    e.preventDefault();
    await Axios.post("/addNewCustomer", { newcustomer }).then((response) => {
      console.log(response);
      setUpdatecustomerlist(!updatecustomerlist);
    });
  };

  const deleteCustomer = (e) => {
    e.preventDefault();
    Axios.post("/deleteCustomer", { selectedcustomer }).then((response) => {
      console.log(response);
      setUpdatecustomerlist(!updatecustomerlist);
      setDeletecustomer("");
    });
  };

  return (
    <div className="adminpage">
      <div className="adminnav">
        <button name="traderslist" onClick={selectlist}>
          Traders
        </button>
        <button name="customerlist" onClick={selectlist}>
          Customers
        </button>
      </div>
      <div className="adminresults">
        {selectedlist === "/traderslist" ? (
          <TradersList
            searchcode="/traderslist"
            setSelectedTrader={setSelectedtrader}
            setShowedit={setShowedit}
            setShowadd={setShowadd}
            addNewTrader={addNewTrader}
            updateList={updatelist}
          />
        ) : (
          ""
        )}

        {selectedlist === "/customerlist" ? (
          <CustomerList
            searchcode="/customerlist"
            updateList={updatecustomerlist}
            setShowaddcustomer={setShowaddcustomer}
            setShoweditcustomer={setShoweditcustomer}
            setSelectedcustomer={setSelectedcustomer}
            addNewCustomer={addNewCustomer}
          />
        ) : (
          ""
        )}
      </div>

      <div className="adminedit">
        {/* ADD/EDIT TRADER FORMS*/}
        <form
          className={showhideadd}
          onSubmit={(e) => {
            addTrader(e);
          }}
        >
          <fieldset>
            <legend>Add Item</legend>
            <div className="edittrader-form-group">
              <label>traderID:</label>
              <input placeholder="...Leave Blank" readOnly />
            </div>
            <div className="edittrader-form-group">
              <label>tCode:</label>
              <input
                placeholder="...Three Letter Code (in CAPS)"
                name="tCode"
                onChange={handleNewTraderChange}
                required
              />
            </div>
            <div className="edittrader-form-group">
              <label>tName:</label>
              <input
                placeholder="...Trader Name"
                name="tName"
                onChange={handleNewTraderChange}
                required
              />
            </div>
            <div className="edittrader-form-group">
              <label>tLastName:</label>
              <input
                placeholder="...Trader Last Name"
                name="tLastName"
                onChange={handleNewTraderChange}
                required
              />
            </div>
            <div className="edittrader-form-group">
              <label>userName:</label>
              <input
                placeholder="...Email (weGrow)"
                name="userName"
                onChange={handleNewTraderChange}
                required
              />
            </div>
            <div className="edittrader-form-group">
              <label>Active:</label>
              <input
                name="active"
                className="activeradio"
                type="radio"
                // checked={true}
                onClick={(e) =>
                  setNewtrader({
                    ...newtrader,
                    active: "y",
                  })
                }
                required
              />
              <label htmlFor="">Yes</label>
              <input
                name="active"
                className="activeradio"
                type="radio"
                onClick={(e) =>
                  setNewtrader({
                    ...newtrader,
                    active: "n",
                  })
                }
                required
              />
              <label htmlFor="">No</label>
            </div>
            <div className="edittrader-form-group">
              <label>Role:</label>
              <select
                onChange={(e) =>
                  setNewtrader({
                    ...newtrader,
                    role: e.target.value,
                  })
                }
                required
              >
                {roles
                  ? roles.map((role, i) => {
                      if (role.role === "sales") {
                        // console.log("they match");
                        return (
                          <option selected={true} value={i + 1}>
                            {role.role}
                          </option>
                        );
                      } else {
                        // console.log(role.role, selectedtrader[key]);
                        return <option value={i + 1}>{role.role}</option>;
                      }
                    })
                  : ""}
              </select>
            </div>

            <button type="submit">Add New Trader</button>
          </fieldset>
        </form>
        <form
          className={showhideedit}
          onSubmit={(e) => {
            editTrader(e);
          }}
        >
          <fieldset>
            <legend>Edit Trader Info</legend>
            {selectedtrader
              ? Object.keys(selectedtrader).map((key, index) => {
                  if (key === "traderID") {
                    return (
                      <div className="edittrader-form-group">
                        <label>{key}:</label>
                        <input value={selectedtrader[key]} readOnly />
                      </div>
                    );
                  } else if (key === "active") {
                    return (
                      <div className="edittrader-form-group">
                        <label>{key}:</label>
                        <input
                          name="active"
                          className="activeradio"
                          type="radio"
                          checked={
                            selectedtrader[key] === "y" ? true || "" : false
                          }
                          onClick={(e) =>
                            setSelectedtrader({
                              ...selectedtrader,
                              [key]: "y",
                            })
                          }
                        />
                        <label htmlFor="">Yes</label>
                        <input
                          name="active"
                          className="activeradio"
                          type="radio"
                          checked={
                            selectedtrader[key] === "n" ? true || "" : false
                          }
                          onClick={(e) =>
                            setSelectedtrader({
                              ...selectedtrader,
                              [key]: "n",
                            })
                          }
                        />
                        <label htmlFor="">No</label>
                      </div>
                    );
                  } else if (key === "role") {
                    return (
                      <div className="edittrader-form-group">
                        <label>{key}:</label>
                        <select
                          // onClick={loadRoles}
                          onChange={(e) =>
                            setSelectedtrader({
                              ...selectedtrader,
                              [key]: e.target.value,
                            })
                          }
                          // value={selectedtrader[key]}
                        >
                          {/* <option>{selectedtrader[key]}</option> */}
                          {roles
                            ? roles.map((role, i) => {
                                if (role.role === selectedtrader[key]) {
                                  // console.log("they match");
                                  return (
                                    <option selected={true} value={i + 1}>
                                      {role.role}
                                    </option>
                                  );
                                } else {
                                  // console.log(role.role, selectedtrader[key]);
                                  return (
                                    <option value={i + 1}>{role.role}</option>
                                  );
                                }
                              })
                            : ""}
                        </select>
                      </div>
                    );
                  } else {
                    return (
                      <div className="edittrader-form-group">
                        <label>{key}:</label>
                        <input
                          value={selectedtrader[key]}
                          onChange={(e) => handleChange(e, key)}
                        />
                      </div>
                    );
                  }
                })
              : ""}
            <button type="submit">Save Edits</button>
          </fieldset>
        </form>
        {/* ADD/EDIT CUSTOMER FORMS*/}
        <form
          className={showhideeditcustomer}
          onSubmit={(e) => {
            editCustomer(e);
          }}
        >
          <fieldset>
            <legend>Edit Customer Info</legend>
            {selectedcustomer
              ? Object.keys(selectedcustomer).map((key, index) => {
                  if (key === "customerID") {
                    return (
                      <div className="editcustomer-form-group">
                        <label>{key}:</label>
                        <input value={selectedcustomer[key]} readOnly />
                      </div>
                    );
                  } else if (key === "companyName" || key === "streetAddress") {
                    return (
                      <div className="editcustomer-form-group">
                        <label>{key}:</label>
                        <textarea
                          value={selectedcustomer[key]}
                          onChange={(e) => handleCustomerChange(e, key)}
                          required
                        />
                      </div>
                    );
                  } else {
                    return (
                      <div className="editcustomer-form-group">
                        <label>{key}:</label>
                        <input
                          value={selectedcustomer[key]}
                          onChange={(e) => handleCustomerChange(e, key)}
                          required
                        />
                      </div>
                    );
                  }
                })
              : ""}
            <button type="submit">Save Edits</button>
          </fieldset>
        </form>
        <form
          className={showhideaddcustomer}
          onSubmit={(e) => {
            addCustomer(e);
          }}
        >
          <fieldset>
            <legend>Add New Customer</legend>
            <div className="editcustomer-form-group">
              <label>customerID:</label>
              <input placeholder="...Leave Blank" readOnly />
            </div>
            <div className="editcustomer-form-group">
              <label>companyCode:</label>
              <input
                placeholder="...short company name"
                name="companyCode"
                onChange={handleNewCustomerChange}
                required
              />
            </div>

            <div className="editcustomer-form-group">
              <label>companyName:</label>
              <textarea
                placeholder="...full company name"
                name="companyName"
                onChange={handleNewCustomerChange}
                required
              />
            </div>
            <div className="editcustomer-form-group">
              <label>country:</label>
              <input
                placeholder="...country"
                name="country"
                onChange={handleNewCustomerChange}
                required
              />
            </div>
            <div className="editcustomer-form-group">
              <label>city:</label>
              <input
                placeholder="...city"
                name="city"
                onChange={handleNewCustomerChange}
                required
              />
            </div>
            <div className="editcustomer-form-group">
              <label>streetAddress:</label>
              <textarea
                placeholder="...street address"
                name="streetAddress"
                onChange={handleNewCustomerChange}
                required
              />
            </div>
            <div className="editcustomer-form-group">
              <label>website:</label>
              <input
                placeholder="...website"
                name="website"
                onChange={handleNewCustomerChange}
                required
              />
            </div>
            <button type="submit">Add New Customer</button>
          </fieldset>
        </form>
        <form
          className={showhideeditcustomer}
          onSubmit={(e) => {
            deleteCustomer(e);
          }}
        >
          <fieldset>
            <legend>Delete Customer</legend>
            <div className="editcustomer-form-group">
              <label>companyCode:</label>
              {selectedcustomer ? (
                <input
                  value={selectedcustomer.companyCode}
                  onChange={handleNewCustomerChange}
                  readOnly
                />
              ) : (
                ""
              )}
            </div>
            <div className="editcustomer-form-group">
              <label>reType:</label>
              <input
                value={deletecustomer}
                placeholder="retype company name to delete"
                onChange={handleCustomerDeleteChange}
              />
            </div>
            {selectedcustomer &&
            selectedcustomer.companyCode === deletecustomer ? (
              <button type="submit">Delete Customer</button>
            ) : (
              ""
            )}
          </fieldset>
        </form>
      </div>
    </div>
  );
};

export default Admin;
