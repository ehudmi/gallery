import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function MyProjects() {
  const [projects, setProjects] = useState();

  const navigate = useNavigate();

  // retrieve list of projects authored by current user

  const getMyProjects = async () => {
    try {
      const response = await fetch("/projects/my_projects", {
        method: "GET",
      });
      const json = await response.json();
      setProjects(json);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getMyProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (projects !== undefined) {
    console.log(projects);
    return (
      <div>
        <div>
          My Projects
          {projects.map((item, index) => {
            return (
              <div key={index}>
                <p
                  onClick={() => {
                    sessionStorage.setItem("project_id", item.id);
                    navigate("/project_details");
                  }}
                >
                  Project Name {item.project_name}
                </p>
              </div>
            );
          })}
        </div>
        <button onClick={() => navigate("/project_form")}>Add Project</button>
      </div>
    );
  } else {
    return <div>Loading</div>;
  }
}

export default MyProjects;
