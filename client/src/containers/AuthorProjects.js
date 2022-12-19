import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
// import useAuth from "../hooks/useAuth";
import styles from "../styles/ListContainer.module.css";

function AuthorProjects() {
  // const { authState } = useAuth();
  const [projects, setProjects] = useState([]);
  const countProj = useRef(0);

  const navigate = useNavigate();

  // retrieve list of projects authored by author

  const getAuthorProjects = async (limit, offset) => {
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
      // console.log(json);
      setProjects(json);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAuthorProjects(3, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (projects.length > 0) {
    // console.log(projects);
    return (
      <div className={styles.listContainer}>
        <h1 className={styles.listHeader}>Author Projects</h1>
        {projects.map((item, index) => {
          return (
            <div key={index}>
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
              countProj.current = countProj.current - 3;
              getAuthorProjects(3, countProj.current);
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
              getAuthorProjects(3, countProj.current);
            }}
          >
            Next
          </button>
        </div>

        {/* {authState.userId === Number(sessionStorage.getItem("author_id")) ? (
          <button onClick={() => navigate("/project_form")}>Add Project</button>
        ) : null} */}
      </div>
    );
  } else {
    return <div>Loading</div>;
  }
}

export default AuthorProjects;
