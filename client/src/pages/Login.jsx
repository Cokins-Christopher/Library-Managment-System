import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import validation from "../components/LoginValidation";
import axios from "axios";

function Login() {
  const [values, setValues] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const handleInput = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value, // Update from [e.target.value] to e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = validation(values);
    setErrors(newErrors);

    if (Object.keys(newErrors).some((key) => newErrors[key])) {
      return;
    }

    axios
      .post("http://localhost:8900/users", values)
      .then((res) => {
        if (res.data.status === "Success") {
          // Check if the user is an admin
          if (res.data.isAdmin) {
            navigate(`/home/${res.data.userID}`); // Replace with your admin page route
          } else {
            navigate(`/home/${res.data.userID}`);
          }
        } else {
          alert(res.data.message || "Login failed");
        }
      })
      .catch((err) => {
        console.error(err);
        alert("An error occurred during login");
      });
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Log-In</h2>
        <form onSubmit={handleSubmit}>
          <div className="">
            <label htmlFor="email">
              <strong>Email</strong>
            </label>
            <input
              type="email"
              placeholder="Enter Email"
              name="email"
              onChange={handleInput}
              className=""
            />
            {errors.email && (
              <span className="text-danger"> {errors.email}</span>
            )}
          </div>
          <div className="">
            <label htmlFor="password">
              <strong>Password</strong>
            </label>
            <input
              type="password"
              placeholder="Enter Password"
              name="password"
              onChange={handleInput}
              className=""
            />
            {errors.password && (
              <span className="text-danger"> {errors.password}</span>
            )}
          </div>
          <button type="submit" className="">
            Log in
          </button>
          <p>Agreeing to our terms and services</p>
          <Link to="/signup" className="">
            Create Account
          </Link>
        </form>
      </div>
    </div>
  );
}

export default Login;
