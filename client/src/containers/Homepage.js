import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

function Homepage() {
  const navigate = useNavigate();
  const { authState } = useAuth();

  if (authState.role === "user") {
    return (
      <div>
        <p>Homepage</p>
        Welcome
        {authState.email}
        <button onClick={() => navigate("/project_list")}>
          List of Projects
        </button>
        <button onClick={() => navigate("/user_comments")}>My Comments</button>
        <button onClick={() => navigate("/search")}>Search</button>
      </div>
    );
  } else if (authState.role === "author") {
    return (
      <div>
        <p>Homepage</p>
        Welcome
        {authState.email}
        <button onClick={() => navigate("/my_projects")}>My Projects</button>
        <button onClick={() => navigate("/user_comments")}>My Comments</button>
        <button onClick={() => navigate("/search")}>Search</button>
      </div>
    );
  } else if (authState.message === "failed") {
    window.location.href = "/welcome";
  }
}
export default Homepage;
