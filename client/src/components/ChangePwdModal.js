import React, { useCallback, useState } from "react";
import "./ChangePwdModal.css";
import Axios from "axios";

const ChangePwdModal = ({
  confirmPwdChange,
  cancelPwdChange,
  show,
  name,
  oldpwd,
  username,
}) => {
  const initchangePwdData = {
    oldpassword: "",
    newpassword: "",
    cnewpassword: "",
  };
  const [changePwdData, setChangePwdData] = useState(initchangePwdData);
  const initchangePwdErrors = {
    oldpassword: "",
    newpassword: "",
    cnewpassword: "",
  };
  const [errorsCPwd, setErrorsPwd] = useState(initchangePwdErrors);

  //dynamically show or hide modal based on whether show prop is true or false. Show is a prop coming from Login.js
  const showHideClassName = show ? "modal display-block" : "modal display-none";

  // callback function to give focus to first input field when modal becomes visible
  const focusinput = useCallback((inputField) => {
    if (inputField && show && inputField.value === "") {
      inputField.focus();
    }
  });

  const handleChangePwdInputChange = (e) => {
    setChangePwdData({
      ...changePwdData,
      [e.target.name]: e.target.value,
    });
  };
  const handleCPValidation = (e) => {
    const field = e.target.name;
    const value = e.target.value;
    const validPasswordRegex = RegExp(
      //   "^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})"
      "^((?=.{8,})(?=.*[a-z])(?=.*[A-Z])(?=.*[0=9])(?=.*[@#$%^&+=]))"
    );
    switch (field) {
      case "oldpassword":
        setErrorsPwd({
          ...errorsCPwd,
          [field]:
            value !== oldpwd ? "Old password is incorrect. Please check." : "",
        });
        break;
      case "newpassword":
        setErrorsPwd({
          ...errorsCPwd,
          [field]: validPasswordRegex.test(value) ? (
            ""
          ) : (
            <>
              <p>must contain at least 1 lowercase</p>
              <p>at least 1 uppercase</p>
              <p>at least 1 numeric</p>
              <p>at least one symbol @#$%^&+=</p>
              <p> at least 8 characters long</p>
            </>
          ),
        });
        break;
      case "cnewpassword":
        setErrorsPwd({
          ...errorsCPwd,
          [field]:
            changePwdData.newpassword !== changePwdData.cnewpassword
              ? "Passwords don't match"
              : "",
        });
        break;
      default:
        break;
    }
  };
  const handlePwdChange = (e) => {
    e.preventDefault();
    // console.log("submitting");
    if (Object.values(errorsCPwd).every((x) => x === "")) {
      console.log(changePwdData.oldpassword);

      Axios.post("/changepassword", {
        oldpassword: changePwdData.oldpassword,
        newpassword: changePwdData.newpassword,
        username: username,
      }).then((response) => {
        console.log(response.data);
        //   //   console.log(response);
        //   // });
      });
      //   confirmPwdChange();
    }
  };
  return (
    <div className={showHideClassName}>
      <section className="modal-main">
        <h1>Welcome {name}!</h1>
        <h2>Seems like its the first time you are logging in.</h2>
        <p>Please take a minute to change your Password</p>
        <form onSubmit={handlePwdChange} className="changePwdModalForm">
          <div className="form-group">
            <label htmlFor="">Old Password</label>
            <input
              required
              type="password"
              name="oldpassword"
              id="oldpassword"
              value={changePwdData.oldpassword}
              onChange={handleChangePwdInputChange}
              onBlur={handleCPValidation}
              ref={focusinput}
            />
          </div>
          {<span className="cpwdinputerror">{errorsCPwd.oldpassword}</span>}
          <div className="form-group">
            <label htmlFor="">New Password</label>
            <input
              required
              type="password"
              name="newpassword"
              id="newpassword"
              value={changePwdData.newpassword}
              onChange={handleChangePwdInputChange}
              onBlur={handleCPValidation}
            />
          </div>
          {<span className="cpwdinputerror">{errorsCPwd.newpassword}</span>}

          <div className="form-group">
            <label htmlFor="">Confirm Password</label>
            <input
              required
              type="password"
              name="cnewpassword"
              id="cnewpassword"
              value={changePwdData.cnewpassword}
              onChange={handleChangePwdInputChange}
              onBlur={handleCPValidation}
            />
          </div>
          {<span className="cpwdinputerror">{errorsCPwd.cnewpassword}</span>}

          <button type="submit" className="confirmbutton">
            Confirm
          </button>
          <button className="cancelbutton" onClick={cancelPwdChange}>
            Cancel
          </button>
        </form>
      </section>
    </div>
  );
};

export default ChangePwdModal;
