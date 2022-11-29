import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Projects() {
  const [projects, setProjects] = useState();

  const navigate = useNavigate();

  // retrieve list of projects to display

  const getProjectsList = async () => {
    try {
      const response = await fetch("/projects/list_projects", {
        method: "GET",
      });
      const json = await response.json();
      // console.log(json);
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
          return (
            <div key={index}>
              <p
                onClick={() => {
                  sessionStorage.setItem("project_id", item.id);
                  sessionStorage.setItem("author_id", item.user_id);
                  console.log(sessionStorage.getItem("project_id"));
                  return navigate("/project_details");
                }}
              >
                Project Name {item.project_name}
              </p>
            </div>
          );
        })}
      </div>
    );
  } else {
    return <div>Loading</div>;
  }
}

export default Projects;
