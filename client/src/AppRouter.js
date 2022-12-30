import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import Welcome from "./components/Welcome";
import useAuth from "./hooks/useAuth";
import PersistLogin from "./components/PersistLogin";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Layout from "./components/Layout";
import Homepage from "./containers/Homepage";
import MyProjects from "./containers/MyProjects";
import ProjectForm from "./containers/ProjectForm";
import ProjectDetails from "./containers/ProjectDetails";
import UserComments from "./containers/UserComments";
import Search from "./components/Search";
import AuthorProjects from "./containers/AuthorProjects";
import ProjectsList from "./containers/ProjectsList";
import Logout from "./components/Logout";
import AdminUsers from "./containers/AdminUsers";
import AdminDataInput from "./containers/AdminDataInput";

// Define protected route wrapping routes by authentication and role based authorization

const ProtectedRoute = ({ isAllowed, redirectPath = "/welcome", children }) => {
  if (!isAllowed) {
    return <Navigate to={redirectPath} replace />;
  }
  return children ? children : <Outlet />;
};

function AppRouter() {
  const { authState } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Welcome />} />
        <Route path="welcome" element={<Welcome />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        <Route path="logout" element={<Logout />} />

        <Route element={<PersistLogin />}>
          <Route element={<Layout />}>
            <Route element={<ProtectedRoute isAllowed={!!authState.userId} />}>
              <Route path="home" element={<Homepage />} />
              <Route path="search" element={<Search />} />
              <Route path="user_comments" element={<UserComments />} />
              <Route path="projects_list" element={<ProjectsList />} />
              <Route path="project_details" element={<ProjectDetails />} />
              <Route path="author_projects" element={<AuthorProjects />} />
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
              <Route path="my_projects" element={<MyProjects />} />
              <Route path="project_form" element={<ProjectForm />} />
            </Route>

            <Route
              element={
                <ProtectedRoute
                  redirectPath="/home"
                  isAllowed={
                    !!authState.userId && !!authState.role.includes("admin")
                  }
                />
              }
            >
              <Route path="user_list" element={<AdminUsers />} />
              <Route path="admin_add" element={<AdminDataInput />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
