// import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import styles from "./styles/Layout.module.css";

function Layout() {
  return (
    <div id={styles.layoutDiv}>
      <Navbar />
      <Outlet />
    </div>
  );
}

export default Layout;
