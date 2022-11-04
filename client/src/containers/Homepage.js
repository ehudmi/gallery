import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../GlobalStates";

function Homepage(props) {
  const navigate = useNavigate();
  const [authState] = useContext(AuthContext);

  useEffect(() => {
    props.loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (authState.userId !== "" && authState.role === "author") {
    return (
      <div>
        <p>Homepage</p>
        Welcome
        {authState.email}
        <button onClick={() => navigate("/my_projects")}>User Projects</button>
      </div>
    );
  } else if (authState.userId !== "" && authState.role === "user") {
    return (
      <div>
        <p>Homepage</p>
        Welcome
        {authState.email}
        <button onClick={() => navigate("/project_list")}>
          List of Projects
        </button>
      </div>
    );
  } else if (authState.message === "failed") {
    window.location.href = "/welcome";
  }
}
export default Homepage;
