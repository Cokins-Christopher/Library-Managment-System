import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import axios from "axios";

function Home() {
  const [userInfo, setUserInfo] = useState(null);
  const location = useLocation();
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

  if (!userInfo) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Navbar />

      <div className="home-container">
        <Link to={`/books/${userID}`} className="box">
          Browse Books
        </Link>
        <Link to={`/reservations/${userID}`} className="box">
          My Reservations
        </Link>
        <Link to={`/account/${userID}`} className="box">
          My Account
        </Link>
      </div>

      {userInfo.IsAdmin ? (
        <div className="home-container">
          <Link to={`/admin/${userID}`} className="box">
            Admin Panel
          </Link>
        </div>
      ) : null}
    </div>
  );
}

export default Home;
