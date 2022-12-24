import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import ImageModal from "../components/ImageModal";
import ProjectComments from "./ProjectComments";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useModal from "../hooks/useModal";
import ConfirmModal from "../components/ConfirmModal";
import styles from "../styles/ProjectDetails.module.css";

function ProjectDetails() {
  const { authState } = useAuth();

  const navigate = useNavigate();

  const [projectDetails, setProjectDetails] = useState([]);

  const [images, setImages] = useState([]);
  const countImages = useRef(0);

  const filesRef = useRef(null);
  const [files, setFiles] = useState();

  const currentIndex = useRef(null);
  const modalSrc = useRef(null);

  const [show, setShow] = useState(false);

  const {
    isShowing,
    toggle,
    message,
    selectedId,
    setSelectedId,
    setType,
    type,
  } = useModal();

  // functions to open and close ImageModal
  const openModal = (e, index) => {
    setShow(true);
    currentIndex.current = index;
    modalSrc.current = images[currentIndex.current].url;
  };
  const closeModal = (e) => {
    if (e !== undefined) {
      e.preventDefault();
    }
    currentIndex.current = null;
    setShow(false);
  };

  // retrieve project details from DB

  const getProjectDetails = async () => {
    try {
      const response = await fetch("/projects/project_details", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          project_id: sessionStorage.getItem("project_id"),
        }),
      });
      const json = await response.json();
      setProjectDetails(json);
    } catch (error) {
      console.log(error);
    }
  };

  // retrieve images from DB

  const getProjectImages = async () => {
    try {
      const response = await fetch("/projects/project_images", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          project_id: sessionStorage.getItem("project_id"),
        }),
      });
      const json = await response.json();
      setImages(json);
      countImages.current = json.length;
    } catch (error) {
      console.log(error);
    }
  };

  // delete selected image from DB

  const deleteImage = async (uuid) => {
    try {
      const response = await fetch("/projects/delete_images", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uuid: uuid,
        }),
      });
      await response.json();
      countImages.current = countImages.current - 1;
      toggle();
      getProjectImages();
    } catch (error) {
      console.log(error);
    }
  };

  // upload image files to DB

  const uploadFiles = async () => {
    if (files.length > 3 - countImages.current) {
      console.log("too many files");
    }
    if (countImages.current >= 3) {
      alert("You already have 3 images for the project");
    } else {
      const data = new FormData();
      data.append("project_id", sessionStorage.getItem("project_id"));
      data.append("file_count", files.length);
      for (const item of files) {
        data.append("images", item);
      }
      const response = await fetch("/projects/add_images", {
        method: "POST",
        body: data,
      });
      await response.json();
      getProjectImages();
    }
  };

  useEffect(() => {
    getProjectDetails();
    getProjectImages();
  }, []);

  if (authState.message === "failed") {
    window.location.href = "/welcome";
  } else if (projectDetails.length > 0) {
    return (
      <>
        <div className={styles.descriptionContainer}>
          <h2 className={styles.bigProjectTitle}>
            Project {sessionStorage.getItem("project_id")} -{" "}
            {projectDetails[0].project_name}
          </h2>
        </div>
        <div className={styles.descriptionContainer}>
          <h3 className={styles.prjDescription}>
            Description - {projectDetails[0].description}
          </h3>
          <h3>Link - {projectDetails[0].link}</h3>
          <div>
            <h3>Additional Authors:</h3>
            {projectDetails.map((item, index) => {
              return (
                <div key={index}>
                  <h3
                    className={styles.listItem}
                    onClick={() => {
                      sessionStorage.setItem("author_id", item.author_id);
                      return navigate("/author_projects");
                    }}
                  >
                    {item.first_name} {item.last_name}
                  </h3>
                </div>
              );
            })}
          </div>
        </div>
        <div className={styles.masterContainer}>
          <div className={styles.picContainer}>
            {images.length > 0
              ? images.map((item, index) => {
                  return (
                    <div key={index} onClick={(e) => openModal(e, index)}>
                      <img
                        className={styles.image}
                        alt="pic"
                        src={item.url}
                        id={item.uuid}
                      />
                      {projectDetails.findIndex((item) => {
                        return item.author_id === authState.userId;
                      }) >= 0 ? (
                        <FontAwesomeIcon
                          icon={faTimes}
                          className="invalid"
                          onClick={() => {
                            setType("image");
                            setSelectedId(item.uuid);
                            toggle();
                          }}
                        />
                      ) : null}
                    </div>
                  );
                })
              : null}
          </div>
          <ImageModal
            closeModal={closeModal}
            src={modalSrc.current}
            show={show}
          />
          <ConfirmModal
            isShowing={isShowing}
            hide={toggle}
            message={message}
            confirmModal={deleteImage}
            id={selectedId}
            type={type}
          />
          {projectDetails.findIndex((item) => {
            return item.author_id === authState.userId;
          }) >= 0 ? (
            <div>
              <label htmlFor="addImages">
                <button
                  component="span"
                  className="btn"
                  onClick={() => filesRef.current.click()}
                >
                  <span>Select Images</span>
                </button>
              </label>
              <input
                ref={filesRef}
                accept=".jpg, .jpeg, .png, .gif"
                style={{ display: "none" }}
                id="addImages"
                name="images"
                multiple
                type="file"
                onChange={(e) => {
                  setFiles(e.target.files);
                }}
              />
              <button className="btn" onClick={uploadFiles}>
                Upload Files
              </button>
            </div>
          ) : null}
          <ProjectComments
            className={styles.commentsContainer}
            project_id={sessionStorage.getItem("project_id")}
          />
        </div>
      </>
    );
  } else if (projectDetails.length === 0) {
    return (
      // <div className={styles.masterContainer}>
      //   <ProjectComments
      //     // className={styles.commentsContainer}
      //     project_id={sessionStorage.getItem("project_id")}
      //   />
      // </div>
      <p>Loading</p>
    );
  }
}

export default ProjectDetails;
