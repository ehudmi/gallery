import React, { useContext, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
import { AuthContext } from "../GlobalStates";

function Projects(props) {
  const [authState] = useContext(AuthContext);

  useEffect(() => {
    props.loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // console.log(props);
  return <div>Projects {authState.userId} </div>;
}

export default Projects;
