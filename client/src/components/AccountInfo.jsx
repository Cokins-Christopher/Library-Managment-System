import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

function AccountInfo() {
  const [userInfo, setUserInfo] = useState(null);
  const location = useLocation();
  const navigate = useNavigate(); // Use useHistory hook for navigation
  const userID = location.pathname.split("/")[2];

  useEffect(() => {
    fetchUserInfo();
  }, [userID]);

  const fetchUserInfo = async () => {
    try {
      const response = await axios.get(`http://localhost:8900/users/${userID}`);
      setUserInfo(response.data);
    } catch (error) {
      console.error("Error fetching user info", error);
    }
  };

  const navigateToUpdate = () => {
    navigate(`/update-info/${userID}`); // Navigate to update info page
  };

  if (!userInfo) {
    return <div>Loading...</div>;
  }

  return (
    <div className="account-info">
      <section>
        <h2>Profile Information</h2>
        <div className="account-info-details">
          <span>Name:</span> {userInfo.FirstName} {userInfo.LastName}
        </div>
        <div className="account-info-details">
          <span>Email:</span> {userInfo.Email}
        </div>
        <div className="account-info-details">
          <span>Username:</span> {userInfo.Username}
        </div>
        <button onClick={navigateToUpdate}>Update Information</button>
      </section>
    </div>
  );
}

export default AccountInfo;
