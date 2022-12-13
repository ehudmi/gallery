import useAuth from "../hooks/useAuth";
import ProjectsList from "./ProjectsList";

function Homepage() {
  const { authState } = useAuth();

  if (authState.message === "failed") {
    window.location.href = "/welcome";
  } else {
    return (
      <div>
        <h1>
          Welcome<span> </span>
          {authState.first_name}
        </h1>
        <ProjectsList />
      </div>
    );
  }

  // if (authState.role === "user") {
  //   return (
  //     <div>
  //       <p>Homepage</p>
  //       Welcome
  //       {authState.email}
  //       <button onClick={() => navigate("/projects_list")}>
  //         List of Projects
  //       </button>
  //       <button onClick={() => navigate("/user_comments")}>My Comments</button>
  //       <button onClick={() => navigate("/search")}>Search</button>
  //     </div>
  //   );
  // } else if (authState.role === "author") {
  //   return (
  //     <div>
  //       {/* <p>Homepage</p> */}
  //       <h1>
  //         Welcome<span> </span>
  //         {authState.first_name}
  //       </h1>

  //       {/* <button onClick={() => navigate("/my_projects")}>My Projects</button>
  //       <button onClick={() => navigate("/user_comments")}>My Comments</button>
  //       <button onClick={() => navigate("/search")}>Search</button> */}
  //     </div>
  //   );
  // } else if (authState.message === "failed") {
  //   window.location.href = "/welcome";
  // }
}
export default Homepage;
