import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import useAuth from "./hooks/useAuth";
import Signup from "./components/Signup";
// import Modal from "./containers/Modal";
import Homepage from "./containers/Homepage";
import MyProjects from "./containers/MyProjects";
import Projects from "./containers/Projects";
import Login from "./components/Login";
import Welcome from "./components/Welcome";
import ProjectForm from "./containers/ProjectForm";
import Layout from "./components/Layout";
import PersistLogin from "./components/PersistLogin";
import ProjectDetails from "./containers/ProjectDetails";
import ProjectComments from "./containers/ProjectComments";
import UserComments from "./containers/UserComments";
import Search from "./components/Search";
import AuthorProjects from "./containers/AuthorProjects";

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
        {/* <Route path="logout" element={<Modal />} /> */}

        <Route element={<PersistLogin />}>
          <Route element={<Layout />}>
            <Route element={<ProtectedRoute isAllowed={!!authState.userId} />}>
              <Route path="home" element={<Homepage />} />
              <Route path="search" element={<Search />} />
              <Route path="user_comments" element={<UserComments />} />
              <Route path="project_list" element={<Projects />} />
              <Route path="project_details" element={<ProjectDetails />} />
              <Route path="project_comments" element={<ProjectComments />} />
              <Route path="author_projects" element={<AuthorProjects />} />
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
            <Route path="my_projects" element={<MyProjects />} />
            <Route path="project_form" element={<ProjectForm />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
