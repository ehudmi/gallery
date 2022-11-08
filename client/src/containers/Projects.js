import React, { useContext, useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/GlobalStates";

function Projects(props) {
  const [authState] = useContext(AuthContext);
  const [projects, setProjects] = useState();

  const getProjectsList = async () => {
    try {
      const response = await fetch("/projects/list_projects", {
        method: "GET",
      });
      const json = await response.json();
      console.log(json);
      setProjects(json);
      // console.log(projects.hello);
      // return projects;
      // const userProjects = response.json();
      // return userProjects;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    props.loadData();
    getProjectsList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // console.log(props);
  if (authState !== "" && projects !== undefined) {
    // getUserProjects();
    // console.log(userProjects);
    console.log(projects);
    return (
      <div>
        List of Projects
        {projects.map((item, index) => {
          return <div key={index}>Project Name {item.project_name}</div>;
        })}
      </div>
    );
  } else {
    return <div>Loading</div>;
  }
}

export default Projects;
