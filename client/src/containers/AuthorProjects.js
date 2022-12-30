import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/ListContainer.module.css";

function AuthorProjects() {
  const [projects, setProjects] = useState([]);
  const countProj = useRef(0);

  const navigate = useNavigate();

  // retrieve list of projects authored by author

  const getAuthorProjects = useCallback(async (limit, offset) => {
    try {
      const response = await fetch("/projects/author_projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: sessionStorage.getItem("author_id"),
          limit: limit,
          offset: offset,
        }),
      });
      const json = await response.json();
      setProjects(json);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    getAuthorProjects(5, 0);
  }, [getAuthorProjects]);

  if (projects.length > 0) {
    return (
      <div className={styles.bigDaddy}>
        <h1 className={styles.listHeader}>Author Projects</h1>
        <div className={styles.listContainer}>
          {projects.map((item, index) => {
            return (
              <div className={styles.itemBigDaddy} key={index}>
                <h3
                  className={styles.listItem}
                  onClick={() => {
                    sessionStorage.setItem("project_id", item.id);
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
              className={`${styles.btn} ${styles.prevButton} ${
                countProj.current <= 0 ? "btnHidden" : "btnVisible"
              }`}
              id="previous"
              name="previous"
              onClick={() => {
                countProj.current = countProj.current - 5;
                getAuthorProjects(5, countProj.current);
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
                countProj.current = countProj.current + 5;
                getAuthorProjects(5, countProj.current);
              }}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    );
  } else {
    return <div>Loading</div>;
  }
}

export default AuthorProjects;
