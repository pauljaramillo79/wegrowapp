import React, { useState, useEffect } from "react";
import "./Admin.css";
import Axios from "axios";
// import TraderCard from "./TraderCard";
// import CustomerCard from "./CustomerCard";
import TradersList from "./TradersList";
import CustomerList from "./CustomerList";
import ProducerList from "./ProducerList";
import ProdNamesList from "./ProdNamesList";
import GProdList from "./GProdList";
import SearchField from "./SearchField";

const Admin = () => {
  const [resetfield, setResetfield] = useState(true);

  const [selectedlist, setSelectedlist] = useState("/traderslist");
  //   const [listdata, setListdata] = useState([]);
  const [selectedtrader, setSelectedtrader] = useState();
  const [selectedcustomer, setSelectedcustomer] = useState();
  const [selectedproducer, setSelectedproducer] = useState();
  const [selectedgprods, setSelectedgprods] = useState([]);
  const [selectedprodgroup, setSelectedprodgroup] = useState();
  const [selectedprodgroup1, setSelectedprodgroup1] = useState();
  const [selectedprodcatname, setSelectedprodcatname] = useState();
  const [selectedprodname, setSelectedprodname] = useState([]);
  const [newtrader, setNewtrader] = useState({ role: "3" });
  const [newcustomer, setNewcustomer] = useState({});
  const [newproducer, setNewproducer] = useState({});
  const [newprodgroup, setNewprodgroup] = useState();
  const [newprodcatname, setNewprodcatname] = useState();
  const [newprodname, setNewprodname] = useState();
  const [deletecustomer, setDeletecustomer] = useState();
  const [deleteproducer, setDeleteproducer] = useState();
  const [updatelist, setUpdatelist] = useState(true);
  const [updatecustomerlist, setUpdatecustomerlist] = useState(true);
  const [updateproducerlist, setUpdateproducerlist] = useState(true);
  const [updateprodcatnameslist, setUpdateprodcatnameslist] = useState(true);
  const [updateprodnameslist, setUpdateprodnameslist] = useState(true);

  const [showedit, setShowedit] = useState(false);
  const [showadd, setShowadd] = useState(false);
  const [showaddcustomer, setShowaddcustomer] = useState(false);
  const [showeditcustomer, setShoweditcustomer] = useState(false);

  const [showaddproducer, setShowaddproducer] = useState(false);
  const [showeditproducer, setShoweditproducer] = useState(false);

  const [showaddprodgroup, setShowaddprodgroup] = useState(false);
  const [showeditprodgroup, setShoweditprodgroup] = useState(false);
  const [showaddprodcatname, setShowaddprodcatname] = useState(false);
  const [showeditprodcatname, setShoweditprodcatname] = useState(false);
  const [showeditprodname, setShoweditprodname] = useState(false);
  const [showaddprodname, setShowaddprodname] = useState(false);

  const [selectedprodgroupforced, setSelectedprodgroupforced] = useState("");
  const [selectedprodgroupforcedID, setSelectedprodgroupforcedID] = useState(
    ""
  );

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
  const showhideaddproducer = showaddproducer
    ? "editCustomer displayblock"
    : "editCustomer displaynone";
  const showhideeditproducer = showeditproducer
    ? "editCustomer displayblock"
    : "editCustomer displaynone";
  const showhideaddprodgroup = showaddprodgroup
    ? "editProdGroup displayblock"
    : "displaynone";
  const showhideeditprodgroup = showeditprodgroup
    ? "editProdGroup displayblock"
    : "displaynone";
  const showhideeditprodcatname = showeditprodcatname
    ? "editProdCatName displayblock"
    : "displaynone";
  const showhideaddprodcatname = showaddprodcatname
    ? "editProdCatName displayblock"
    : "displaynone";
  const showhideeditprodname = showeditprodname
    ? "editProdName displayblock"
    : "displaynone";
  const showhideaddprodname = showaddprodname
    ? "editProdName displayblock"
    : "displaynone";
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
    setShowaddproducer(false);
    setShoweditproducer(false);
    setShowaddprodgroup(false);
    setShoweditprodgroup(false);
    setShoweditprodcatname(false);
    setShowaddprodcatname(false);
    setShoweditprodname(false);
    setShowaddprodname(false);
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

  const handleProducerChange = (e, key) => {
    e.preventDefault();
    setSelectedproducer({
      ...selectedproducer,
      [key]: e.target.value,
    });
  };

  const handleProdGroupChange = (e, key) => {
    // console.log(key);
    setSelectedprodgroup1({
      ...selectedprodgroup1,
      [key]: e.target.value,
    });
  };

  const handleProdCatNameChange = (e, key) => {
    setSelectedprodcatname({
      ...selectedprodcatname,
      [key]: e.target.value,
    });
  };

  const handleProdNameChange = (e, key) => {
    setSelectedprodname({
      ...selectedprodname,
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

  const editProducer = (e) => {
    e.preventDefault();
    Axios.post("/updateproducer", { selectedproducer }).then((response) => {
      setUpdateproducerlist(!updateproducerlist);
    });
  };

  const editProdGroup = (e) => {
    e.preventDefault();
    Axios.post("/updateprodgroup", { selectedprodgroup1 }).then((response) => {
      setUpdateprodcatnameslist(!updateprodcatnameslist);
    });
  };

  const editProdCatName = (e) => {
    e.preventDefault();
    Axios.post("/updateprodcatname", { selectedprodcatname }).then(
      (response) => {
        setUpdateprodcatnameslist(!updateprodcatnameslist);
      }
    );
  };

  const editProdName = async (e) => {
    e.preventDefault();
    await Axios.post("/updateprodname", { selectedprodname }).then(
      (response) => {
        console.log(response.data.message);
        setUpdateprodnameslist(!updateprodnameslist);
      }
    );
  };

  const addNewTrader = () => {
    setShowedit(false);
    setShowadd(true);
  };

  const addNewCustomer = () => {
    setShoweditcustomer(false);
    setShowaddcustomer(true);
  };

  const addNewProducer = () => {
    setShoweditproducer(false);
    setShowaddproducer(true);
  };

  const addNewProdGroup = () => {
    setShowaddprodgroup(true);
    setShoweditprodgroup(false);
    setShoweditprodcatname(false);
    setShowaddprodcatname(false);
    setShoweditprodname(false);
    setShowaddprodname(false);
  };

  const addNewProdCatName = () => {
    setShowaddprodgroup(false);
    setShoweditprodgroup(false);
    setShoweditprodcatname(false);
    setShowaddprodcatname(true);
    setShoweditprodname(false);
    setShowaddprodname(false);
  };

  const addNewProdName = () => {
    setShowaddprodgroup(false);
    setShoweditprodgroup(false);
    setShoweditprodcatname(false);
    setShowaddprodcatname(false);
    setShoweditprodname(false);
    setShowaddprodname(true);
    setNewprodname({
      ...newprodname,
      prodCatNameID: selectedprodcatname.prodCatNameID,
      prodCatName: selectedprodcatname.prodCatName,
    });
  };

  const handleNewTraderChange = (e) => {
    e.preventDefault();
    setNewtrader({
      ...newtrader,
      [e.target.name]: e.target.value,
    });
  };

  const newcustomerInit = {
    companyCode: "",
    companyName: "",
    country: "",
    city: "",
    streetAddress: "",
    website: "",
  };
  const newproducerInit = {
    companyCode: "",
    companyName: "",
    country: "",
    city: "",
    streetAddress: "",
    website: "",
  };
  const handleNewCustomerChange = (e) => {
    e.preventDefault();
    setNewcustomer({
      ...newcustomer,
      [e.target.name]: e.target.value,
    });
  };
  const handleNewProducerChange = (e) => {
    e.preventDefault();
    setNewproducer({
      ...newproducer,
      [e.target.name]: e.target.value,
    });
  };
  const handleNewProdGroupChange = (e) => {
    e.preventDefault();
    setNewprodgroup({ ...newprodgroup, [e.target.name]: e.target.value });
  };
  const handleNewProdCatChange = (e) => {
    e.preventDefault();
    setNewprodcatname({ ...newprodcatname, [e.target.name]: e.target.value });
  };
  const handleNewProdChange = (e) => {
    e.preventDefault();
    setNewprodname({ ...newprodname, [e.target.name]: e.target.value });
  };
  const handleCustomerDeleteChange = (e) => {
    e.preventDefault();
    setDeletecustomer(e.target.value);
  };
  const handleProducerDeleteChange = (e) => {
    e.preventDefault();
    setDeleteproducer(e.target.value);
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
      // console.log(response);
      setUpdatecustomerlist(!updatecustomerlist);
    });
  };
  const addProducer = async (e) => {
    e.preventDefault();
    await Axios.post("/addNewProducer", { newproducer }).then((response) => {
      // console.log(response);
      setUpdateproducerlist(!updateproducerlist);
    });
  };
  const addProdGroup = async (e) => {
    e.preventDefault();
    await Axios.post("/addNewProdGroup", { newprodgroup }).then((response) => {
      // console.log(response);
      setUpdateprodcatnameslist(!updateprodcatnameslist);
      setNewprodgroup("");
    });
  };
  const addProdCatName = async (e) => {
    e.preventDefault();
    await Axios.post("/addNewProdCatName", { newprodcatname }).then(
      (response) => {
        setUpdateprodcatnameslist(!updateprodcatnameslist);
        setNewprodcatname("");
      }
    );
  };
  const addProdName = async (e) => {
    e.preventDefault();
    await Axios.post("/addnewProdName", { newprodname }).then((response) => {
      setUpdateprodnameslist(!updateprodnameslist);
      setNewprodname("");
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
  const deleteProducer = (e) => {
    e.preventDefault();
    Axios.post("/deleteProducer", { selectedproducer }).then((response) => {
      console.log(response);
      setUpdateproducerlist(!updateproducerlist);
      setDeleteproducer("");
    });
  };

  const handleProductClick = (prod) => {
    // console.log(prod);
    setSelectedprodgroup(prod);
    setShoweditprodcatname(true);
    setShowaddprodcatname(false);
    setShoweditprodgroup(false);
    setShowaddprodgroup(false);
    setShoweditprodname(false);
    setShowaddprodname(false);
    Axios.post("/selectedprodcatname", { prodcatname: prod }).then(
      (response) => {
        setSelectedprodcatname(response.data[0]);
      }
    );
    Axios.post("/selectgroupedprods", { selectedprod: prod }).then(
      (response) => {
        console.log(response);
        setSelectedgprods(response.data);
      }
    );
  };

  const handleProdGroupClick = (prodgroup) => {
    setShoweditprodgroup(true);
    setShowaddprodgroup(false);
    setShoweditprodcatname(false);
    setShowaddprodcatname(false);
    setShoweditprodname(false);
    setShowaddprodname(false);
    Axios.post("/selectprodgroup", { productGroup: prodgroup }).then(
      (response) => {
        // console.log(response);
        setSelectedprodgroup1(response.data[0]);
        setUpdateprodnameslist(!updateprodnameslist);
        setShoweditprodname(false);
      }
    );
    // console.log(prodgroup);
  };

  const handleProdNameClick = (prodnameID) => {
    setShoweditprodgroup(false);
    setShowaddprodgroup(false);
    setShoweditprodcatname(false);
    setShowaddprodcatname(false);
    setShoweditprodname(true);
    setShowaddprodname(false);
    Axios.post("/selectprodname", { prodnameID: prodnameID }).then(
      (response) => {
        setSelectedprodname(response.data[0]);
      }
    );
  };

  const setProdCatNameandID = (x, y) => {
    setSelectedprodname({
      ...selectedprodname,
      prodCatNameID: x,
      prodCatName: y,
    });
  };
  const setProductGroupandID = (x, y) => {
    setSelectedprodname({
      ...selectedprodname,
      prodGroupID: x,
      productGroup: y,
    });
  };
  const setProdCatNameandIDinNewProd = (x, y) => {
    setNewprodname({
      ...newprodname,
      prodCatNameID: x,
      prodCatName: y,
    });
  };
  const setBUandIDinNewProd = (x, y) => {
    setNewprodname({
      ...newprodname,
      BUID: x,
      bunit: y,
    });
  };
  const setIMOandIDinNewProd = (x, y) => {
    setNewprodname({
      ...newprodname,
      IMOID: x,
      IMO: y,
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
        <button name="producerlist" onClick={selectlist}>
          Producers
        </button>
        <button name="prodnameslist" onClick={selectlist}>
          Products
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

        {selectedlist === "/producerlist" ? (
          <ProducerList
            searchcode="/producerlist"
            updateList={updateproducerlist}
            setShowaddproducer={setShowaddproducer}
            setShoweditproducer={setShoweditproducer}
            setSelectedproducer={setSelectedproducer}
            addNewProducer={addNewProducer}
          />
        ) : (
          ""
        )}

        {selectedlist === "/prodnameslist"
          ? [
              <ProdNamesList
                searchcode="/prodnameslist"
                handleProductClick={handleProductClick}
                addNewProdGroup={addNewProdGroup}
                addNewProdCatName={addNewProdCatName}
                updateList={updateprodcatnameslist}
                updateList2={updateprodnameslist}
                handleProdGroupClick={handleProdGroupClick}
                setSelectedprodgroupforced={setSelectedprodgroupforced}
                setSelectedprodgroupforcedID={setSelectedprodgroupforcedID}
                setNewprodname={setNewprodname}
                newprodname={newprodname}
              />,
              <GProdList
                selectedgprods={selectedgprods}
                selectedprodgroup={selectedprodgroup}
                handleProdNameClick={handleProdNameClick}
                updateList={updateprodnameslist}
                addNewProdName={addNewProdName}
              />,
              // <p>{selectedgprods.map((item) => item.abbreviation)}</p>,
            ]
          : // <CustomerList
            //   searchcode="/customerlist"
            //   updateList={updatecustomerlist}
            //   setShowaddcustomer={setShowaddcustomer}
            //   setShoweditcustomer={setShoweditcustomer}
            //   setSelectedcustomer={setSelectedcustomer}
            //   addNewCustomer={addNewCustomer}
            // />
            ""}
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
            setNewcustomer(newcustomerInit);
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
                value={newcustomer.companyCode}
                required
              />
            </div>

            <div className="editcustomer-form-group">
              <label>companyName:</label>
              <textarea
                placeholder="...full company name"
                name="companyName"
                onChange={handleNewCustomerChange}
                value={newcustomer.companyName}
                required
              />
            </div>
            <div className="editcustomer-form-group">
              <label>country:</label>
              <input
                placeholder="...country"
                name="country"
                onChange={handleNewCustomerChange}
                value={newcustomer.country}
                required
              />
            </div>
            <div className="editcustomer-form-group">
              <label>city:</label>
              <input
                placeholder="...city"
                name="city"
                onChange={handleNewCustomerChange}
                value={newcustomer.city}
                required
              />
            </div>
            <div className="editcustomer-form-group">
              <label>streetAddress:</label>
              <textarea
                placeholder="...street address"
                name="streetAddress"
                onChange={handleNewCustomerChange}
                value={newcustomer.streetAddress}
                required
              />
            </div>
            <div className="editcustomer-form-group">
              <label>website:</label>
              <input
                placeholder="...website"
                name="website"
                onChange={handleNewCustomerChange}
                value={newcustomer.website}
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
            setShoweditcustomer(false);
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

        {/* ADD/EDIT PRODUCER FORMS*/}
        <form
          className={showhideeditproducer}
          onSubmit={(e) => {
            editProducer(e);
          }}
        >
          <fieldset>
            <legend>Edit Producer Info</legend>
            {selectedproducer
              ? Object.keys(selectedproducer).map((key, index) => {
                  if (key === "producerID") {
                    return (
                      <div className="editcustomer-form-group">
                        <label>{key}:</label>
                        <input value={selectedproducer[key]} readOnly />
                      </div>
                    );
                  } else if (key === "companyName" || key === "streetAddress") {
                    return (
                      <div className="editcustomer-form-group">
                        <label>{key}:</label>
                        <textarea
                          value={selectedproducer[key]}
                          onChange={(e) => handleProducerChange(e, key)}
                          required
                        />
                      </div>
                    );
                  } else {
                    return (
                      <div className="editcustomer-form-group">
                        <label>{key}:</label>
                        <input
                          value={selectedproducer[key]}
                          onChange={(e) => handleProducerChange(e, key)}
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
          className={showhideaddproducer}
          onSubmit={(e) => {
            addProducer(e);
            setNewproducer(newproducerInit);
          }}
        >
          <fieldset>
            <legend>Add New Producer</legend>
            <div className="editcustomer-form-group">
              <label>producerID:</label>
              <input placeholder="...Leave Blank" readOnly />
            </div>
            <div className="editcustomer-form-group">
              <label>companyCode:</label>
              <input
                placeholder="...short company name"
                name="companyCode"
                onChange={handleNewProducerChange}
                value={newproducer.companyCode}
                required
              />
            </div>
            <div className="editcustomer-form-group">
              <label>companyName:</label>
              <textarea
                placeholder="...full company name"
                name="companyName"
                onChange={handleNewProducerChange}
                value={newproducer.companyName}
                required
              />
            </div>
            <div className="editcustomer-form-group">
              <label>country:</label>
              <input
                placeholder="...country"
                name="country"
                onChange={handleNewProducerChange}
                value={newproducer.country}
                required
              />
            </div>
            <div className="editcustomer-form-group">
              <label>city:</label>
              <input
                placeholder="...city"
                name="city"
                onChange={handleNewProducerChange}
                value={newproducer.city}
                required
              />
            </div>
            <div className="editcustomer-form-group">
              <label>streetAddress:</label>
              <textarea
                placeholder="...street address"
                name="streetAddress"
                onChange={handleNewProducerChange}
                value={newproducer.streetAddress}
                required
              />
            </div>
            <div className="editcustomer-form-group">
              <label>website:</label>
              <input
                placeholder="...website"
                name="website"
                onChange={handleNewProducerChange}
                value={newproducer.website}
                required
              />
            </div>
            <button type="submit">Add New Producer</button>
          </fieldset>
        </form>

        <form
          className={showhideeditproducer}
          onSubmit={(e) => {
            deleteProducer(e);
            setShoweditproducer(false);
          }}
        >
          <fieldset>
            <legend>Delete Producer</legend>
            <div className="editcustomer-form-group">
              <label>companyCode:</label>
              {selectedproducer ? (
                <input
                  value={selectedproducer.companyCode}
                  onChange={handleNewProducerChange}
                  readOnly
                />
              ) : (
                ""
              )}
            </div>
            <div className="editcustomer-form-group">
              <label>reType:</label>
              <input
                value={deleteproducer}
                placeholder="retype company name to delete"
                onChange={handleProducerDeleteChange}
              />
            </div>
            {selectedproducer &&
            selectedproducer.companyCode === deleteproducer ? (
              <button type="submit">Delete Producer</button>
            ) : (
              ""
            )}
          </fieldset>
        </form>

        {/* EDIT/ADD PRODUCT GROUPS */}

        <form
          className={showhideeditprodgroup}
          onSubmit={(e) => {
            editProdGroup(e);
          }}
        >
          <fieldset>
            <legend>Edit Product Group</legend>
            <div className="editprodgroup-form-group">
              <label>prodGroupID:</label>
              <input
                readOnly
                type="text"
                onChange={(e) => {
                  e.preventDefault();
                  handleProdGroupChange(e, "prodGroupID");
                }}
                value={selectedprodgroup1 ? selectedprodgroup1.prodGroupID : ""}
              />
            </div>
            <div className="editprodgroup-form-group">
              <label>productGroup:</label>
              <input
                value={
                  selectedprodgroup1 ? selectedprodgroup1.productGroup : ""
                }
                onChange={(e) => {
                  e.preventDefault();
                  handleProdGroupChange(e, "productGroup");
                }}
                type="text"
              />
            </div>
            <button type="submit">Save Edits</button>
          </fieldset>
        </form>
        <form
          className={showhideaddprodgroup}
          onSubmit={(e) => {
            addProdGroup(e);
          }}
        >
          <fieldset>
            <legend>Add New Product Group:</legend>
            <div className="editprodgroup-form-group">
              <label>prodGroupID:</label>
              <input type="text" placeholder="...Leave Blank" readOnly />
            </div>
            <div className="editprodgroup-form-group">
              <label>productGroup:</label>
              <input
                name="productGroup"
                type="text"
                placeholder="...New Prod Group Name"
                value={newprodgroup ? newprodgroup.productGroup : ""}
                onChange={handleNewProdGroupChange}
                required
              />
            </div>
            <button type="submit">Add New Product Group</button>
          </fieldset>
        </form>

        {/* EDIT ADD PROD CAT NAME */}

        <form
          className={showhideeditprodcatname}
          onSubmit={(e) => {
            editProdCatName(e);
          }}
        >
          <fieldset>
            <legend>Edit Product Category Name:</legend>
            <div className="editprodcatname-form-group">
              <label>prodCatNameID:</label>
              <input
                value={
                  selectedprodcatname ? selectedprodcatname.prodCatNameID : ""
                }
                readOnly
              />
            </div>
            <div className="editprodcatname-form-group">
              <label>prodCatName:</label>
              <input
                value={
                  selectedprodcatname ? selectedprodcatname.prodCatName : ""
                }
                onChange={(e) => {
                  e.preventDefault();
                  handleProdCatNameChange(e, "prodCatName");
                }}
              />
            </div>
            <button type="submit">Save Edits</button>
          </fieldset>
        </form>
        <form
          className={showhideaddprodcatname}
          onSubmit={(e) => {
            addProdCatName(e);
          }}
        >
          <fieldset>
            <legend>Add New ProdCatName: </legend>
            <div className="editprodcatname-form-group">
              <label>prodCatNameID:</label>
              <input placeholder="...Leave Blank" readOnly />
            </div>
            <div className="editprodcatname-form-group">
              <label>prodCatName:</label>
              <input
                name="prodCatName"
                placeholder="...Type New Product Category Name"
                onChange={handleNewProdCatChange}
                value={newprodcatname ? newprodcatname.prodCatName : ""}
              />
            </div>
            <button type="submit">Add New Prod Cat Name</button>
          </fieldset>
        </form>

        <form
          className={showhideeditprodname}
          onSubmit={(e) => {
            editProdName(e);
          }}
        >
          <fieldset>
            <legend>Edit Product Name: </legend>
            <div className="editprodname-form-group">
              <label>prodNameID:</label>
              <input value={selectedprodname.prodNameID} readOnly />
            </div>
            <div className="editprodname-form-group">
              <label>abbreviation:</label>
              <input
                value={selectedprodname.abbreviation}
                required
                onChange={(e) => {
                  e.preventDefault();
                  handleProdNameChange(e, "abbreviation");
                }}
              />
            </div>
            <div className="editprodname-form-group">
              <label>prodName:</label>
              <input
                value={selectedprodname.prodName}
                required
                onChange={(e) => {
                  e.preventDefault();
                  handleProdNameChange(e, "prodName");
                }}
              />
            </div>
            <div className="editprodname-form-group">
              <label>prodCatName:</label>
              <div className="prodnamesearchv">
                <SearchField
                  // id="prodnamesearch"
                  // className="prodnamesearch"
                  // vertical={"vertical"}
                  searchURL={"/prodcatnameslist"}
                  searchName={"prodCatName"}
                  searchID={"prodCatNameID"}
                  setResetfield={setResetfield}
                  value={selectedprodname ? selectedprodname.prodCatName : ""}
                  setProdSupplier={setProdCatNameandID}
                />
              </div>
            </div>
            <div className="editprodname-form-group">
              <label>prodGroup:</label>
              <div className="prodnamesearchv">
                <SearchField
                  searchURL={"/prodgroups"}
                  searchName={"productGroup"}
                  searchID={"prodGroupID"}
                  setResetfield={setResetfield}
                  value={selectedprodname ? selectedprodname.productGroup : ""}
                  setProdSupplier={setProductGroupandID}
                />
              </div>
            </div>
            <button type="submit">Edit Product Name Details</button>
          </fieldset>
        </form>
        <form
          className={showhideaddprodname}
          onSubmit={(e) => {
            addProdName(e);
          }}
        >
          <fieldset>
            <legend>Add New Product Name:</legend>
            <div className="editprodcatname-form-group">
              <label>prodNameID:</label>
              <input placeholder="...Leave Blank" readOnly />
            </div>
            <div className="editprodcatname-form-group">
              <label>prodGroup:</label>
              <input
                placeholder="...Leave Blank"
                readOnly
                value={newprodname ? newprodname.productGroup : ""}
              />
            </div>
            <div className="editprodcatname-form-group">
              <label>prodCatName:</label>
              <div className="prodnamesearchv">
                <SearchField
                  searchURL={"/prodcatnameslist"}
                  searchName={"prodCatName"}
                  searchID={"prodCatNameID"}
                  setResetfield={setResetfield}
                  value={newprodname ? newprodname.prodCatName : ""}
                  setProdSupplier={setProdCatNameandIDinNewProd}
                />
              </div>
              {/* <input
                placeholder="...Leave Blank"
                readOnly
                value={newprodname ? newprodname.prodCatName : ""}
              /> */}
            </div>
            <div className="editprodcatname-form-group">
              <label>prodName:</label>
              <input
                name="prodName"
                placeholder="...Type New Product Name"
                onChange={handleNewProdChange}
                value={newprodname ? newprodname.prodName : ""}
              />
            </div>
            <div className="editprodcatname-form-group">
              <label>abbreviation:</label>
              <input
                name="abbreviation"
                placeholder="...Type New Product Abbreviation"
                onChange={handleNewProdChange}
                value={newprodname ? newprodname.abbreviation : ""}
              />
            </div>
            <div className="editprodcatname-form-group">
              <label>Business Unit:</label>
              <div className="prodnamesearchv">
                <SearchField
                  searchURL={"/bunitlist"}
                  searchName={"businessUnit"}
                  searchID={"BUID"}
                  setResetfield={setResetfield}
                  value={newprodname ? newprodname.bunit : ""}
                  setProdSupplier={setBUandIDinNewProd}
                />
              </div>
            </div>
            <div className="editprodcatname-form-group">
              <label>IMO Class:</label>
              <div className="prodnamesearchv">
                <SearchField
                  // style={{ flexDirection: "column" }}
                  searchURL={"/IMOlist"}
                  searchName={"IMO"}
                  searchID={"IMOID"}
                  setResetfield={setResetfield}
                  value={newprodname ? newprodname.IMO : ""}
                  setProdSupplier={setIMOandIDinNewProd}
                />
              </div>
            </div>
            <button type="submit">Add New Product Name</button>
          </fieldset>
        </form>
      </div>
    </div>
  );
};

export default Admin;
