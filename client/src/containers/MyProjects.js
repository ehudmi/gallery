import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/ListContainer.module.css";

function MyProjects() {
  const [projects, setProjects] = useState();
  const countProj = useRef(0);

  const navigate = useNavigate();

  // retrieve list of projects authored by current user

  const getMyProjects = async (limit, offset) => {
    console.log(limit, offset);
    try {
      const response = await fetch("/projects/my_projects", {
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
    getMyProjects(3, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (projects !== undefined) {
    // console.log(projects);
    return (
      <div className={styles.listContainer}>
        <h1 className={styles.listHeader}>My Projects</h1>

        {projects.map((item, index) => {
          return (
            <div key={index}>
              <h3
                className={styles.listItem}
                onClick={() => {
                  sessionStorage.setItem("project_id", item.id);
                  sessionStorage.setItem("author_id", item.user_id);
                  console.log(item.user_id);
                  return navigate("/project_details");
                }}
              >
                Project Name {item.project_name}
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
              getMyProjects(3, countProj.current);
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
              getMyProjects(3, countProj.current);
            }}
          >
            Next
          </button>
        </div>

        <button onClick={() => navigate("/project_form")}>Add Project</button>
      </div>
    );
  } else {
    return <div>Loading</div>;
  }
}

export default MyProjects;
