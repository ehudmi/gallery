import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserForm from "./containers/UserForm";
import LoginModal from "./containers/LoginModal";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="login" element={<LoginModal />} />
        <Route path="register" element={<UserForm />} />
        <Route path="logout" element={<Logout />} />
        <Route path="user_projects" element={<UserProjects />} />
        <Route path="project_list" element={<Projects />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
