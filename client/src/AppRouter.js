import React, { useContext } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { AuthContext } from "./GlobalStates";
import isAuthenticated from "./Helpers/Authentication";
import Signup from "./containers/Signup";
import Modal from "./containers/Modal";
import Homepage from "./containers/Homepage";
import UserProjects from "./containers/UserProjects";
import Projects from "./containers/Projects";
import Login from "./containers/Login";
import Welcome from "./containers/Welcome";
import ProjectForm from "./containers/ProjectForm";
import Layout from "./components/Layout";

const ProtectedRoute = ({ isAllowed, redirectPath = "/welcome", children }) => {
  if (!isAllowed) {
    return <Navigate to={redirectPath} replace />;
  }
  return children ? children : <Outlet />;
};

function AppRouter() {
  const [authState, setAuthState] = useContext(AuthContext);

  // check authentication status and set context if authenticated to use with routes and protected routes

  const loadData = async () => {
    try {
      let userAuth = await isAuthenticated();
      console.log(await userAuth);
      if (userAuth.userId > 0) {
        setAuthState({
          ...authState,
          userId: userAuth.userId,
          first_name: userAuth.first_name,
          last_name: userAuth.last_name,
          email: userAuth.email,
          role: userAuth.role,
        });
      } else {
        setAuthState({ ...authState, message: "failed" });
        console.log(authState.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Welcome />} />
        <Route path="welcome" element={<Welcome />} />
        <Route element={<Layout />}>
          <Route element={<ProtectedRoute isAllowed={!!authState.userId} />}>
            <Route path="home" element={<Homepage loadData={loadData} />} />
            <Route
              path="project_list"
              element={<Projects loadData={loadData} />}
            />
          </Route>
        </Route>
        <Route
          element={
            <ProtectedRoute
              redirectPath="/home"
              isAllowed={
                !!authState.userId && !!authState.role.includes("author")
              }
            />
          }
        >
          <Route
            path="user_projects"
            element={<UserProjects loadData={loadData} />}
          />
          <Route
            path="project_form"
            element={<ProjectForm loadData={loadData} />}
          />
        </Route>
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        <Route path="logout" element={<Modal />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
