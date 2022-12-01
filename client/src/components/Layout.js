// import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
// import Navbar from "./Navbar";

function Layout() {
  const navigate = useNavigate();

  return (
    <div>
      {/* <Navbar /> */}
      <h1>Layout</h1>
      <button onClick={() => navigate("/logout")}>Logout</button>
      <Outlet />
    </div>
  );
}

export default Layout;
