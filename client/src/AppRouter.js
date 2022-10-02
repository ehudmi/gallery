import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserForm from "./containers/UserForm";
import Modal from "./containers/Modal";
import Homepage from "./containers/Homepage";
import UserProjects from "./containers/UserProjects";
import Projects from "./containers/Projects";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="login" element={<Modal />} />
        <Route path="register" element={<UserForm />} />
        <Route path="logout" element={<Modal />} />
        <Route path="user_projects" element={<UserProjects />} />
        <Route path="project_list" element={<Projects />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
