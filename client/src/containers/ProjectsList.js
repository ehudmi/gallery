import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useModal from "../hooks/useModal";
import ConfirmModal from "../components/ConfirmModal";
import styles from "../styles/ListContainer.module.css";

function ProjectsList() {
  const { authState } = useAuth();

  const [projects, setProjects] = useState([]);
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

  // retrieve list of projects to display

  const getProjectsList = useCallback(async (limit, offset) => {
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
      setProjects(json);
    } catch (error) {
      console.log(error);
    }
  }, []);

  // delete current project

  const deleteProject = async (id) => {
    try {
      const response = await fetch("/projects/delete_project", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: [id],
        }),
      });
      const json = await response.json();
      console.log(json);
      toggle();
      getProjectsList(3, 0);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProjectsList(3, 0);
  }, [getProjectsList]);

  if (projects.length > 0) {
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
                  return navigate("/project_details");
                }}
              >
                Project Name: {item.project_name}
              </h3>
              <FontAwesomeIcon
                icon={faTimes}
                className={authState.role === "admin" ? "invalid" : "hide"}
                onClick={() => {
                  setType("project");
                  setSelectedId(item.id);
                  toggle();
                }}
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
        <ConfirmModal
          isShowing={isShowing}
          hide={toggle}
          message={message}
          confirmModal={deleteProject}
          id={selectedId}
          type={type}
        />
      </div>
    );
  } else {
    return <div>Loading</div>;
  }
}

export default ProjectsList;
