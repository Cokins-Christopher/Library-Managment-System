import React, { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";

export const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const userID = location.pathname.split("/")[2];

  return (
    <nav>
      <Link to={`/home/${userID}`} className="title">
        Library
      </Link>
      <div className="menu" onClick={() => setMenuOpen(!menuOpen)}>
        <span></span>
        <span></span>
        <span></span>
      </div>
      <ul className={menuOpen ? "open" : ""}>
        <li>
          <NavLink to={`/books/${userID}`}>Browse Books</NavLink>
        </li>
        <li>
          <NavLink to={`/reservations/${userID}`}>Reservations</NavLink>
        </li>
        <li>
          <NavLink to={`/account/${userID}`}>Account</NavLink>
        </li>
      </ul>
    </nav>
  );
};
