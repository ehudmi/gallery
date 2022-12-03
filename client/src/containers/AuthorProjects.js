import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

function AuthorProjects() {
  const { authState } = useAuth();
  const [projects, setProjects] = useState();

  const navigate = useNavigate();

  // retrieve list of projects authored by author

  const getAuthorProjects = async () => {
    try {
      const response = await fetch("/projects/author_projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: sessionStorage.getItem("author_id"),
        }),
      });
      const json = await response.json();
      console.log(json);
      setProjects(json);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAuthorProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (projects !== undefined) {
    // console.log(projects);
    return (
      <div>
        <div>
          Author Projects
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
        {authState.userId === Number(sessionStorage.getItem("author_id")) ? (
          <button onClick={() => navigate("/project_form")}>Add Project</button>
        ) : null}
      </div>
    );
  } else {
    return <div>Loading</div>;
  }
}

export default AuthorProjects;
