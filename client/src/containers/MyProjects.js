import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/ListContainer.module.css";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useModal from "../hooks/useModal";
import ConfirmModal from "../components/ConfirmModal";

function MyProjects() {
  const [projects, setProjects] = useState([]);
  const [numProjects, setNumProjects] = useState(0);
  const countProj = useRef(0);

  const navigate = useNavigate();

  const {
    isShowing,
    toggle,
    message,
    selectedId,
    setSelectedId,
    setType,
    type,
  } = useModal();

  // Count number of projects authored by current user

  const getCountProjects = useCallback(async () => {
    try {
      const response = await fetch("/projects/count_my_projects", {
        method: "GET",
      });
      const json = await response.json();
      setNumProjects(json);
    } catch (error) {
      console.log(error);
    }
  }, []);

  // retrieve list of projects authored by current user

  const getMyProjects = useCallback(async (limit, offset) => {
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
      setProjects(json);
    } catch (error) {
      console.log(error);
    }
  }, []);

  // delete project from db

  const deleteProject = async (id) => {
    try {
      const response = await fetch("/projects/delete_project", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          project_id: [id],
        }),
      });
      const json = await response.json();
      console.log(json);
      toggle();
      getMyProjects(5, 0);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCountProjects();
  }, [getCountProjects]);

  useEffect(() => {
    getMyProjects(5, 0);
  }, [getMyProjects]);

  if (projects.length > 0) {
    return (
      <div className={styles.bigDaddy}>
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
                    return navigate("/project_details");
                  }}
                >
                  {item.project_name} - {item.description}
                  <span className={styles.spaceBetween}>
                    {" "}
                    <FontAwesomeIcon
                      icon={faTimes}
                      className="invalid"
                      onClick={() => {
                        setType("project");
                        setSelectedId(item.id);
                        toggle();
                      }}
                    />
                  </span>
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
                getMyProjects(5, countProj.current);
              }}
            >
              Previous
            </button>
            <button
              className={`${styles.btn} ${styles.nextButton} ${
                numProjects[0]?.count - countProj.current < 5
                  ? "btnHidden"
                  : "btnVisible"
              }`}
              id="next"
              name="next"
              onClick={() => {
                countProj.current = countProj.current + 5;
                getMyProjects(5, countProj.current);
              }}
            >
              Next
            </button>
          </div>
          <ConfirmModal
            isShowing={isShowing}
            hide={toggle}
            message={message}
            confirmModal={deleteProject}
            id={selectedId}
            type={type}
          />
        </div>
      </div>
    );
  } else if (projects.length === 0) {
    return <h3>You have no projects yet</h3>;
  } else {
    return <h3>Loading</h3>;
  }
}

export default MyProjects;
