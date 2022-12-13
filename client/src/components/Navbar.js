import React from "react";
import { Link } from "react-router-dom";
import styles from "./styles/Navbar.module.css";

function Navbar() {
  return (
    <div className={styles.navContainer}>
      <Link to="/" className={styles.logo}>
        Dragon Productions
      </Link>
      <ul>
        <li>
          <Link to="/plan">My Plans</Link>
        </li>
        <li>
          <Link to="/profile">Equipment & Purpose</Link>
        </li>
        <li>
          <Link to="/logout">Logout</Link>
        </li>
      </ul>
    </div>
  );
}

export default Navbar;
