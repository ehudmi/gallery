import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";

function Projects() {
  const [projects, setProjects] = useState();

  const getProjectsList = async () => {
    try {
      const response = await fetch("/projects/list_projects", {
        method: "GET",
      });
      const json = await response.json();
      console.log(json);
      setProjects(json);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProjectsList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  if (projects !== undefined) {
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
