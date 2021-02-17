import React, { useContext, useState } from "react";
import "./Login.css";
import Axios from "axios";
import { AuthContext } from "../App";
import { ReactComponent as Logo } from "../assets/_images/logo-web.svg";
import ChangePwdModal from "./ChangePwdModal";
import axios from "axios";

const Login = () => {
  const { dispatch } = useContext(AuthContext);
  const initialState = {
    username: "",
    password: "",
  };
  const [name, setName] = useState();
  const [oldpwd, setOldpwd] = useState();
  const [cpwdsuccessmsg, setCpwdsuccessmsg] = useState();
  const [data, setData] = useState(initialState);
  const [modalState, setModalState] = useState(false);
  const changePassword = (e) => {
    setModalState(false);
  };
  const cancelChangePassword = (e) => {
    e.preventDefault();
    setModalState(false);
  };
  const handleInputChange = (e) => {
    e.preventDefault();
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };
  const handleFormSubmit = (e) => {
    e.preventDefault();
    Axios.post("/login", {
      username: data.username,
      password: data.password,
    })
      .then((response) => {
        if (response.data.firstlogin === "y") {
          setName(response.data.user);
          setModalState(true);
          setOldpwd(data.password);
        } else {
          setData({
            ...data,
            errorMessage: response.data.message,
          });
          if (response.data.success) {
            dispatch({
              type: "LOGIN",
              payload: response.data,
            });
          }
        }
      })
      .catch((error) => {
        console.log(error);
        setData({
          ...data,
          password: "",
          errorMessage: error.message || error.statusText,
        });
      });
    setData({
      ...data,
      password: "",
    });
  };
  return (
    <>
      <ChangePwdModal
        show={modalState}
        confirmPwdChange={changePassword}
        cancelPwdChange={cancelChangePassword}
        name={name}
        oldpwd={oldpwd}
        username={data.username}
        setCpwdsuccessmsg={setCpwdsuccessmsg}
      />
      <div className="Login">
        <form className="LoginForm" onSubmit={handleFormSubmit}>
          <h2> Login </h2>
          <Logo className="Logo" />
          <input
            autoFocus
            type="text"
            placeholder="username"
            name="username"
            id="username"
            value={data.username}
            onChange={handleInputChange}
          />
          <input
            type="password"
            placeholder="password"
            name="password"
            id="password"
            value={data.password}
            onChange={handleInputChange}
          />
          <button>Login</button>
          {data.errorMessage && (
            <span className="errormessage">{data.errorMessage}</span>
          )}
          <span className="successmessage">{cpwdsuccessmsg}</span>
        </form>
      </div>
    </>
  );
};

export default Login;
