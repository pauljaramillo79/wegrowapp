import React from "react";
import "./Register.css";
import { ReactComponent as Logo } from "../assets/_images/logo-web.svg";
import Axios from "axios";

const Register = () => {
  const initialState = {
    code: "",
    name: "",
    lastname: "",
    username: "",
    password: "",
    cpassword: "",
    isSubmitting: false,
    errorMessage: null,
  };
  const [data, setData] = React.useState(initialState);

  // Handlers
  const handleInputChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };
  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log(data);
  };
  return (
    <div className="Register">
      <form className="RegisterForm" onSubmit={handleFormSubmit}>
        <h2> Register </h2>
        <Logo className="Logo" />
        <input
          required
          type="text"
          value={data.code}
          placeholder="code"
          name="code"
          id="code"
          onChange={handleInputChange}
        />
        <input
          required
          type="text"
          value={data.name}
          placeholder="name"
          name="name"
          id="name"
          onChange={handleInputChange}
        />
        <input
          required
          type="text"
          value={data.lastname}
          placeholder="lastname"
          name="lastname"
          id="lastname"
          onChange={handleInputChange}
        />
        <input
          required
          type="text"
          value={data.username}
          placeholder="username"
          name="username"
          id="username"
          onChange={handleInputChange}
        />
        <input
          required
          type="password"
          value={data.password}
          placeholder="password"
          name="password"
          id="password"
          onChange={handleInputChange}
        />
        <input
          required
          type="password"
          value={data.cpassword}
          placeholder="confirmPassword"
          name="cpassword"
          id="cpassword"
          onChange={handleInputChange}
        />
        <button disabled={data.isSubmitting}>
          {data.isSubmitting ? "Loading..." : "Register"}
        </button>
        {data.errorMessage && (
          <span className="message">{data.errorMessage}</span>
        )}
      </form>
    </div>
  );
};

export default Register;
