import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

function RequestAdminButton() {
  const [userInfo, setUserInfo] = useState(null);
  const [requestSent, setRequestSent] = useState(false);
  const location = useLocation();
  const userID = location.pathname.split("/")[2]; // Assuming the userID is part of the URL

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

  const handleRequestAdmin = async () => {
    try {
      await axios.post(`http://localhost:8900/request-admin/${userID}`);
      setRequestSent(true);
    } catch (error) {
      console.error("Error sending admin request", error);
    }
  };

  if (!userInfo) {
    return <div className="request-admin-status">Loading...</div>;
  }

  if (userInfo.IsAdmin) {
    return (
      <div className="request-admin-status">You are already an admin.</div>
    );
  }

  return (
    <div className="request-admin-container">
      <button
        className="request-admin-button"
        onClick={handleRequestAdmin}
        disabled={requestSent}
      >
        {requestSent ? "Request Sent" : "Request Admin"}
      </button>
    </div>
  );
}

export default RequestAdminButton;