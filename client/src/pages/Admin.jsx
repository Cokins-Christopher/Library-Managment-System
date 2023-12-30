import React, { useState, useEffect } from "react";
import axios from "axios";
import { Navbar } from "../components/Navbar";

function Admin() {
  const [adminRequests, setAdminRequests] = useState([]);

  useEffect(() => {
    // Fetch the admin requests
    axios
      .get("http://localhost:8900/admin-requests")
      .then((response) => {
        setAdminRequests(response.data);
      })
      .catch((error) => {
        console.error("Error fetching admin requests", error);
      });
  }, []);

  const handleResponse = (userID, approve) => {
    // Send response to backend
    axios
      .post(`http://localhost:8900/handle-admin-request`, { userID, approve })
      .then((response) => {
        // Refresh the list or remove the user from the list
        setAdminRequests((prev) =>
          prev.filter((request) => request.UserID !== userID)
        );
      })
      .catch((error) => {
        console.error("Error handling admin request", error);
      });
  };

  return (
    <div className="admin-container">
      <Navbar />
      <h1>Admin Panel</h1>
      <div className="admin-requests-list">
        {adminRequests.length === 0 ? (
          <p>No admin requests pending.</p>
        ) : (
          adminRequests.map((request) => (
            <div className="admin-requests" key={request.UserID}>
              <p>Username: {request.Username}</p>
              <button
                className="admin-button"
                onClick={() => handleResponse(request.UserID, true)}
              >
                Allow
              </button>
              <button
                className="admin-button deny"
                onClick={() => handleResponse(request.UserID, false)}
              >
                Deny
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Admin;
