import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

function Layout() {
  return (
    <div>
      <Navbar />
      <div>Layout</div>
      <Outlet />
    </div>
  );
}

export default Layout;
