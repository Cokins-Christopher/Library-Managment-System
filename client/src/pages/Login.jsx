import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import validation from "./LoginValidation";
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

    // Check if there are any errors
    if (Object.keys(newErrors).some((key) => newErrors[key])) {
      // If there are errors, don't proceed with the login
      return;
    }

    // No errors, proceed with login
    axios
      .post("http://localhost:8900/users", values)
      .then((res) => {
        if (res.data.status === "Success") {
          navigate(`/home/${res.data.userID}`);
        } else {
          alert("User not found");
        }
      })
      .catch((err) => console.log(err));
  };


  return (
    <div className="d-flex justify-content-center align-items-center bg-primary vh-100">
      <div className="bg-white p-3 rounded w-25">
        <h2>Log-In</h2>
        <form action="" onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email">
              <strong>Email</strong>
            </label>
            <input
              type="email"
              placeholder="Enter Email"
              name="email"
              onChange={handleInput}
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
              placeholder="Enter Password"
              name="password"
              onChange={handleInput}
              className="form-control rounded-0"
            />
            {errors.password && (
              <span className="text-danger"> {errors.password}</span>
            )}
          </div>
          <button type="submit" className="btn btn-success w-100 rounded-0">
            Log in
          </button>
          <p>Agreeing to our terms and services</p>
          <Link
            to="/signup"
            className="btn btn-default border w-100 bg-light rounded-0 text-decoration-none"
          >
            Create Account
          </Link>
        </form>
      </div>
    </div>
  );
}

export default Login;
