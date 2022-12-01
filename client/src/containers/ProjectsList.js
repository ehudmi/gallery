import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

function ProjectsList() {
  const [projects, setProjects] = useState();
  const countProj = useRef(0);

  const navigate = useNavigate();

  // retrieve list of projects to display

  // const getProjectsList = async () => {
  //   try {
  //     const response = await fetch("/projects/projects_list", {
  //       method: "GET",
  //     });
  //     const json = await response.json();
  //     // console.log(json);
  //     setProjects(json);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const getProjectsList = async (limit, offset) => {
    try {
      const response = await fetch("/projects/projects_list", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          limit: limit,
          offset: offset,
        }),
      });
      const json = await response.json();
      // console.log(json);
      setProjects(json);
      // countProj.current = countProj.current + 3;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProjectsList(3, 0);

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
        <button
          id="previous"
          name="previous"
          onClick={() => {
            countProj.current = countProj.current - 3;
            getProjectsList(3, countProj.current);
          }}
        >
          Previous
        </button>
        <button
          id="next"
          name="next"
          onClick={() => {
            countProj.current = countProj.current + 3;
            getProjectsList(3, countProj.current);
            // countProj.current = countProj.current + 3;
          }}
        >
          Next
        </button>
      </div>
    );
  } else {
    return <div>Loading</div>;
  }
}

export default ProjectsList;
