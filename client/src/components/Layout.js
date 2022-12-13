// import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import styles from "./styles/Layout.module.css";

function Layout() {
  const navigate = useNavigate();

  return (
    <div id={styles.layoutDiv}>
      <Navbar />
      <h1>Layout</h1>
      <button onClick={() => navigate("/logout")}>Logout</button>
      <Outlet />
    </div>
  );
}

export default Layout;
