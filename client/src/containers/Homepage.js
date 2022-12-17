import useAuth from "../hooks/useAuth";
import ProjectsList from "./ProjectsList";

function Homepage() {
  const { authState } = useAuth();

  if (authState.message === "failed") {
    window.location.href = "/welcome";
  } else {
    return (
      <div>
        <h1 className="welcomeHeader">
          Welcome
          {" " + authState.first_name}
        </h1>
        <ProjectsList />
      </div>
    );
  }
}
export default Homepage;
