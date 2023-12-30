import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import updateValidation from "../components/UpdateValidation"; // Import the validation function

function UpdateInfo() {
  const [userInfo, setUserInfo] = useState({
    FirstName: "",
    LastName: "",
    Email: "",
    Username: "",
    UserPassword: "",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const location = useLocation();
  const userID = location.pathname.split("/")[2];

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8900/users/${userID}`
        );
        setUserInfo({ ...response.data, UserPassword: "" }); // Omit the password
      } catch (error) {
        console.error("Error fetching user info", error);
      }
    };

    fetchUserInfo();
  }, [userID]);

  const handleInputChange = (event) => {
    setUserInfo({ ...userInfo, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const newErrors = updateValidation(userInfo);
    setErrors(newErrors);

    if (Object.keys(newErrors).some((key) => newErrors[key])) {
      // If there are errors, don't proceed with the update
      return;
    }

    // No errors, proceed with user info update
    axios
      .put(`http://localhost:8900/users/${userID}`, userInfo)
      .then(() => navigate(`/account/${userID}`))
      .catch((err) => console.error("Error updating user info", err));
  };

  return (
    <div>
      <Navbar />
      <div className="update-info-container">
        <h1>Update Information</h1>
        <form onSubmit={handleSubmit}>
          {/* First Name Field */}
          <div>
            <label>First Name:</label>
            <input
              type="text"
              name="FirstName"
              value={userInfo.FirstName}
              onChange={handleInputChange}
              className="form-control rounded-0"
            />
            {errors.FirstName && (
              <span className="text-danger">{errors.FirstName}</span>
            )}
          </div>

          {/* Last Name Field */}
          <div>
            <label>Last Name:</label>
            <input
              type="text"
              name="LastName"
              value={userInfo.LastName}
              onChange={handleInputChange}
              className="form-control rounded-0"
            />
            {errors.LastName && (
              <span className="text-danger">{errors.LastName}</span>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label>Email:</label>
            <input
              type="email"
              name="Email"
              value={userInfo.Email}
              onChange={handleInputChange}
              className="form-control rounded-0"
            />
            {errors.Email && (
              <span className="text-danger">{errors.Email}</span>
            )}
          </div>

          {/* Username Field */}
          <div>
            <label>Username:</label>
            <input
              type="text"
              name="Username"
              value={userInfo.Username}
              onChange={handleInputChange}
              className="form-control rounded-0"
            />
            {errors.Username && (
              <span className="text-danger">{errors.Username}</span>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label>Password:</label>
            <input
              type="password"
              name="UserPassword"
              value={userInfo.UserPassword}
              onChange={handleInputChange}
              placeholder="Enter new password"
              className="form-control rounded-0"
            />
            {errors.UserPassword && (
              <span className="text-danger">{errors.UserPassword}</span>
            )}
          </div>

          {/* Submit Button */}
          <button type="submit" className="btn btn-success w-100 rounded-0">
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}

export default UpdateInfo;
