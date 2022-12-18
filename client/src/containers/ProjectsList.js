import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import styles from "../styles/ListContainer.module.css";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function ProjectsList() {
  const { authState } = useAuth();

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
      // console.log(json);
      setProjects(json);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteProject = async (id) => {
    try {
      //   console.log(id);
      const response = await fetch("/projects/delete_project", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: id,
        }),
      });
      const json = await response.json();
      console.log(json);
      getProjectsList(3, 0);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProjectsList(3, 0);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (projects !== undefined) {
    // console.log(projects);
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
                  // sessionStorage.setItem("author_id", item.user_id);
                  // console.log(item.id);
                  return navigate("/project_details");
                }}
              >
                Project Name: {item.project_name}
              </h3>
              <FontAwesomeIcon
                icon={faTimes}
                className={authState.role === "admin" ? "invalid" : "hide"}
                onClick={() => deleteProject(item.id)}
              />
            </div>
          );
        })}
        <div className={styles.btnContainer}>
          <button
            className={`${styles.btn} ${styles.prevButton} ${
              countProj.current <= 0 ? "btnHidden" : "btnVisible"
            }`}
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
            className={`${styles.btn} ${styles.nextButton} ${
              projects.length === 0 ? "btnHidden" : "btnVisible"
            }`}
            // visibility={projects.length === 0 ? "visible" : "hidden"}
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
