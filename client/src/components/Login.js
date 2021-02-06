import React, { useContext, useState } from "react";
import "./Login.css";
import Axios from "axios";
import { AuthContext } from "../App";
import { ReactComponent as Logo } from "../assets/_images/logo-web.svg";

const Login = () => {
  const { dispatch } = useContext(AuthContext);
  const initialState = {
    username: "",
    password: "",
  };
  const [data, setData] = useState(initialState);
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
        console.log(response);
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
      })
      .catch((error) => {
        console.log(error);
        setData({
          ...data,
          password: "",
          errorMessage: error.message || error.statusText,
        });
      });
  };
  return (
    <div className="Login">
      <form className="LoginForm" onSubmit={handleFormSubmit}>
        <h2> Login </h2>
        <Logo className="Logo" />
        <input
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
          <span className="message">{data.errorMessage}</span>
        )}
      </form>
    </div>
  );
};

export default Login;
