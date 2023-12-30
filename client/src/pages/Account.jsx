import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import AccountInfo from "../components/AccountInfo";
import ReservationHistory from "../components/ReservationHistory";
import RequestAdminButton from "../components/RequestAdminButton";

function Account() {
  const [userInfo, setUserInfo] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const userID = location.pathname.split("/")[2];

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8900/users/${userID}`
        );
        setUserInfo(response.data);
      } catch (error) {
        console.error("Error fetching user info", error);
      }
    };

    fetchUserInfo();
  }, [userID]);

  const navigateToUpdate = () => {
    navigate(`/update-info/${userID}`);
  };

  if (!userInfo) {
    return (
      <div>
        <Navbar />
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="account-container">
      <Navbar />
      <h1>My Account</h1>
      {/* Your AccountInfo, ReservationHistory, and RequestAdminButton components */}
      <div className="account-info">
        <AccountInfo />
      </div>
      <div className="reservation-history">
        <ReservationHistory />
      </div>
      <div className="admin-request">
        <RequestAdminButton />
      </div>
    </div>
  );
}

export default Account;
