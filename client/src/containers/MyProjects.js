import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/ListContainer.module.css";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function MyProjects() {
  const [projects, setProjects] = useState();
  const countProj = useRef(0);

  const navigate = useNavigate();

  // retrieve list of projects authored by current user

  const getMyProjects = async (limit, offset) => {
    // console.log(limit, offset);
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
      // console.log(json);
      setProjects(json);
      // !json.error ? setProjects(json) : setProjects(undefined);
    } catch (error) {
      console.log(error);
    }
  };

  // delete user from db

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
      getMyProjects(3, 0);
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
                  // console.log(item.user_id);
                  return navigate("/project_details");
                }}
              >
                Project Name {item.project_name}
              </h3>
              {
                <FontAwesomeIcon
                  icon={faTimes}
                  className="invalid"
                  onClick={() => deleteProject(item.id)}
                />
              }
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
              getMyProjects(3, countProj.current);
            }}
          >
            Previous
          </button>
          <button
            className={`${styles.btn} ${styles.nextButton} ${
              projects.length === 0 ? "btnHidden" : "btnVisible"
            }`}
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
      </div>
    );
  } else {
    return <div>Loading</div>;
  }
}

export default MyProjects;
