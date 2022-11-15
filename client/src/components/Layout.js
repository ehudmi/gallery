// import React from "react";
import { Outlet } from "react-router-dom";
// import Navbar from "./Navbar";

function Layout() {
  return (
    <div>
      {/* <Navbar /> */}
      <h1>Layout</h1>
      <Outlet />
    </div>
  );
}

export default Layout;
