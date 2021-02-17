import React, { useState } from "react";
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
    successMessage: null,
  };
  const [data, setData] = useState(initialState);
  const initErrors = {
    code: "",
    username: "",
    password: "",
    cpassword: "",
  };
  const [errors, setErrors] = useState(initErrors);
  // Handlers
  const handleValidation = (e) => {
    const field = e.target.name;
    const value = e.target.value;
    const validCode = RegExp("([A-Z]{3,3})");
    const validEmailRegex = RegExp(
      /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
    );
    const validPasswordRegex = RegExp(
      // "^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})"
      "^((?=.{8,})(?=.*[a-z])(?=.*[A-Z])(?=.*[0=9])(?=.*[@#$%^&+=]))"
    );
    switch (field) {
      case "code":
        setErrors({
          ...errors,
          // [field]: value.length != 3 ? "must be exactly 3 characters" : "",
          [field]:
            validCode.test(value) && value.length === 3
              ? ""
              : "must be all CAPS and 3 exactly characters",
        });
        break;
      case "username":
        setErrors({
          ...errors,
          [field]: validEmailRegex.test(value)
            ? ""
            : "must be valid email format",
        });
        break;
      case "password":
        setErrors({
          ...errors,
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
      default:
        break;
    }
  };
  const handleInputChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (data.password !== data.cpassword) {
      setData({
        ...data,
        errorMessage: "passwords do not match",
      });
      console.log(Object.values(errors).every((x) => x == ""));
    } else {
      setData({
        ...data,
        errorMessage: "",
      });
      if (Object.values(errors).every((x) => x == "")) {
        Axios.post("/register", {
          username: data.username,
          password: data.password,
          code: data.code,
          tname: data.name,
          tlastname: data.lastname,
        })
          .then((response) => {
            setData({
              ...data,
              successMessage: `${response.data.message} ${response.data.username}`,
              errorMessage: "",
            });
          })
          .catch((error) => {
            setData({
              ...data,
              errorMessage: error.message || error.statusText,
            });
          });
      }
    }
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
          placeholder="user id (3 letters)"
          name="code"
          id="code"
          onChange={handleInputChange}
          onBlur={handleValidation}
        />
        {<span className="inputerror">{errors.code}</span>}

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
          placeholder="username (wegrow email)"
          name="username"
          id="username"
          onChange={handleInputChange}
          onBlur={handleValidation}
        />
        {<span className="inputerror">{errors.username}</span>}

        <input
          required
          type="password"
          value={data.password}
          placeholder="password"
          name="password"
          id="password"
          onChange={handleInputChange}
          onBlur={handleValidation}
        />
        {<span className="inputerror">{errors.password}</span>}

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
          <span className="errormessage">{data.errorMessage}</span>
        )}
        <span className="successmessage">{data.successMessage}</span>
      </form>
    </div>
  );
};

export default Register;
