import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import validation from "./SignupValidation";
import axios from "axios";

function Singup() {
  const [values, setValues] = useState({
    firstName: "",
    lastName: "",
    username: "",
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

    // Check if there are any errors
    if (Object.keys(newErrors).some((key) => newErrors[key])) {
      // If there are errors, don't proceed with the signup
      return;
    }

    // No errors, proceed with signup
    axios
      .post("http://localhost:8900/signup", values)
      .then((res) => {
        navigate("/");
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="d-flex justify-content-center align-items-center bg-primary vh-100">
      <div className="bg-white p-3 rounded w-25">
        <h2>Sign-Up</h2>
        <form action="" onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="First Name">
              <strong>First Name</strong>
            </label>
            <input
              type="text"
              onChange={handleInput}
              name="firstName"
              placeholder="Enter First Name"
              className="form-control rounded-0"
            />
            {errors.firstName && (
              <span className="text-danger"> {errors.firstName}</span>
            )}
          </div>
          <div className="mb-3">
            <label htmlFor="Last Name">
              <strong>Last Name</strong>
            </label>
            <input
              type="text"
              name="lastName"
              onChange={handleInput}
              placeholder="Enter Last Name"
              className="form-control rounded-0"
            />
            {errors.lastName && (
              <span className="text-danger"> {errors.lastName}</span>
            )}
          </div>
          <div className="mb-3">
            <label htmlFor="Username">
              <strong>Username</strong>
            </label>
            <input
              type="username"
              name="username"
              onChange={handleInput}
              placeholder="Enter Username"
              className="form-control rounded-0"
            />
            {errors.username && (
              <span className="text-danger"> {errors.username}</span>
            )}
          </div>
          <div className="mb-3">
            <label htmlFor="email">
              <strong>Email</strong>
            </label>
            <input
              type="email"
              name="email"
              onChange={handleInput}
              placeholder="Enter Email"
              className="form-control rounded-0"
            />
            {errors.email && (
              <span className="text-danger"> {errors.email}</span>
            )}
          </div>
          <div className="mb-3">
            <label htmlFor="password">
              <strong>Password</strong>
            </label>
            <input
              type="password"
              name="password"
              onChange={handleInput}
              placeholder="Enter Password"
              className="form-control rounded-0"
            />
            {errors.password && (
              <span className="text-danger"> {errors.password}</span>
            )}
          </div>
          <button type="submit" className="btn btn-success w-100 rounded-0">
            Sign up
          </button>
          <p>Agreeing to our terms and services</p>
          <Link
            to="/"
            className="btn btn-default border w-100 bg-light rounded-0 text-decoration-none"
          >
            Log in
          </Link>
        </form>
      </div>
    </div>
  );
}

export default Singup;
