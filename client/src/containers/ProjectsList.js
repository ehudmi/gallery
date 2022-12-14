import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../components/styles/ListContainer.module.css";

function ProjectsList() {
  const [projects, setProjects] = useState();
  const countProj = useRef(0);

  const navigate = useNavigate();

  // retrieve list of projects to display

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
      console.log(json);
      setProjects(json);
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
      <div className={styles.listContainer}>
        <h1 className={styles.listHeader}>List of Projects</h1>
        {projects.map((item, index) => {
          return (
            <div key={index}>
              <h3
                className={styles.listItem}
                onClick={() => {
                  sessionStorage.setItem("project_id", item.id);
                  sessionStorage.setItem("author_id", item.user_id);
                  // console.log(sessionStorage.getItem("project_id"));
                  return navigate("/project_details");
                }}
              >
                Project Name: {item.project_name}
              </h3>
            </div>
          );
        })}
        <div className={styles.btnContainer}>
          <button
            className={`${styles.btn} ${styles.prevButton}`}
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
            className={`${styles.btn} ${styles.nextButton}`}
            id="next"
            name="next"
            onClick={() => {
              countProj.current = countProj.current + 3;
              getProjectsList(3, countProj.current);
            }}
          >
            Next
          </button>
        </div>
      </div>
    );
  } else {
    return <div>Loading</div>;
  }
}

export default ProjectsList;
