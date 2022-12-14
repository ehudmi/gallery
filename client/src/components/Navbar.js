import React from "react";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import styles from "../styles/Navbar.module.css";

function Navbar() {
  const { authState } = useAuth();

  if (authState.role === "user") {
    return (
      <div className={styles.navContainer}>
        <Link to="/" className={styles.logo}>
          Dragon Productions
        </Link>
        <ul>
          <li>
            <Link to="/home">Homepage</Link>
          </li>
          <li>
            <Link to="/user_comments">My Comments</Link>
          </li>
          <li>
            <Link to="/search">Search</Link>
          </li>
          <li>
            <Link to="/logout">Logout</Link>
          </li>
        </ul>
      </div>
    );
  } else if (authState.role === "author") {
    return (
      <div className={styles.navContainer}>
        <Link to="/" className={styles.logo}>
          Dragon Productions
        </Link>
        <ul>
          <li>
            <Link to="/home">Homepage</Link>
          </li>
          <li>
            <Link to="/my_projects">My Projects</Link>
          </li>
          <li>
            <Link to="/user_comments">My Comments</Link>
          </li>
          <li>
            <Link to="/project_form">Add A Project</Link>
          </li>
          <li>
            <Link to="/search">Search</Link>
          </li>
          <li>
            <Link to="/logout">Logout</Link>
          </li>
        </ul>
      </div>
    );
  }
}

export default Navbar;
