// import React from "react";
import React, { useContext } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  // Navigate,
  // Outlet,
} from "react-router-dom";
import { AuthContext } from "./GlobalStates";
import isAuthenticated from "./Helpers/Authentication";
import UserForm from "./containers/UserForm";
import Modal from "./containers/Modal";
import Homepage from "./containers/Homepage";
import UserProjects from "./containers/UserProjects";
import Projects from "./containers/Projects";
import Login from "./containers/Login";
import Welcome from "./containers/Welcome";

// const ProtectedRoute = ({ isAllowed, redirectPath = "/landing", children }) => {
//   if (!isAllowed) {
//     return <Navigate to={redirectPath} replace />;
//   }

//   return children ? children : <Outlet />;
// };

function AppRouter() {
  const [authState, setAuthState] = useContext(AuthContext);

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
        <Route path="home" element={<Homepage loadData={loadData} />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<UserForm />} />
        <Route path="logout" element={<Modal />} />
        <Route
          path="my_projects"
          element={<UserProjects loadData={loadData} />}
        />
        <Route path="project_list" element={<Projects loadData={loadData} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
