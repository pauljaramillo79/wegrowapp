import React, { useState, useEffect } from "react";
import "./Admin.css";
import Axios from "axios";
import TraderCard from "./TraderCard";

const Admin = () => {
  const [selectedlist, setSelectedlist] = useState("/traderslist");
  const [listdata, setListdata] = useState([]);
  const [selectedtrader, setSelectedtrader] = useState();
  const [newtrader, setNewtrader] = useState({ role: "3" });
  const [updatelist, setUpdatelist] = useState(true);

  const [showedit, setShowedit] = useState(false);
  const [showadd, setShowadd] = useState(false);

  const showhideadd = showadd ? "editTrader displayblock" : "displaynone";
  const showhideedit = showedit
    ? "editTrader displayblock"
    : "editTrader displaynone";

  useEffect(() => {
    if (selectedlist) {
      Axios.post(selectedlist).then((response) => {
        setListdata(response.data);

        // console.log(response.data);
      });
      //   console.log(showtraders);
    }
  }, [selectedlist, updatelist]);

  const selectlist = (e) => {
    e.preventDefault();
    setSelectedlist("/" + e.target.name);
  };

  const findTrader = (code) => {
    setSelectedtrader(listdata.find((el) => el.tCode === code));
    setShowedit(true);
    setShowadd(false);
  };

  const handleChange = (e, key) => {
    e.preventDefault();
    setSelectedtrader({
      ...selectedtrader,
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

  const addNewTrader = () => {
    setShowedit(false);
    setShowadd(true);
  };

  const handleNewTraderChange = (e) => {
    e.preventDefault();
    setNewtrader({
      ...newtrader,
      [e.target.name]: e.target.value,
    });
  };

  const addTrader = (e) => {
    e.preventDefault();
    Axios.post("/addNewTrader", { newtrader }).then((response) => {
      console.log(response);
    });
  };

  return (
    <div className="adminpage">
      <div className="adminnav">
        <button name="traderslist" onClick={selectlist}>
          Traders
        </button>
        <button name="customerslist" onClick={selectlist}>
          Customers
        </button>
      </div>
      <div className="adminresults">
        <TraderCard tName={"Add New"} findtrader={addNewTrader} />
        {selectedlist === "/traderslist"
          ? listdata.map((item) => (
              <TraderCard
                tName={item.tName}
                tLastName={item.tLastName}
                active={item.active}
                role={item.role}
                email={item.userName}
                tCode={item.tCode}
                findtrader={findTrader}
                key={"trad" + item.traderID}
              />
            ))
          : ""}
      </div>
      <div className="adminedit">
        {/* ADD TRADER FORM*/}
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
            <legend>Edit Item</legend>
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
      </div>
    </div>
  );
};

export default Admin;
