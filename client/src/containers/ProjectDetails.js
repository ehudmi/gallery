import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import ImageModal from "./ImageModal";
import ProjectComments from "./ProjectComments";
import styles from "../styles/ProjectDetails.module.css";

function ProjectDetails() {
  const { authState } = useAuth();

  const navigate = useNavigate();

  const [projectDetails, setProjectDetails] = useState();

  const [images, setImages] = useState([]);
  const countImages = useRef(0);

  const filesRef = useRef(null);
  const [files, setFiles] = useState();

  const currentIndex = useRef(null);
  const modalSrc = useRef(null);

  const [show, setShow] = useState(false);

  const openModal = (e, index) => {
    setShow(true);
    currentIndex.current = index;
    console.log(index);
    console.log(currentIndex.current);
    console.log(images[currentIndex.current].url);
    modalSrc.current = images[currentIndex.current].url;
  };

  const closeModal = (e) => {
    if (e !== undefined) {
      e.preventDefault();
    }
    currentIndex.current = null;
    setShow(false);
  };

  const findPrev = (e) => {
    if (e !== undefined) {
      e.preventDefault();
    }
    currentIndex.current = currentIndex - 1;
  };

  const findNext = (e) => {
    if (e !== undefined) {
      e.preventDefault();
    }
    currentIndex.current = currentIndex + 1;
  };

  // const renderImageContent=(src, index)=> {
  //   return (
  //     <div onClick={(e) => this.openModal(e, index)}>
  //       <img src={src} key={src} />
  //     </div>
  //   )
  // }

  // retrieve images from DB

  const getProjectDetails = async () => {
    // console.log(sessionStorage.getItem("project_id"));
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
      console.log(json);
      setProjectDetails(json);
      // console.log(countImages.current);
    } catch (error) {
      console.log(error);
    }
  };

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
      // console.log(json);
      setImages(json);
      countImages.current = json.length;
      // console.log(countImages.current);
    } catch (error) {
      console.log(error);
    }
  };

  // delete images from DB

  const deleteImage = async (uuid) => {
    try {
      // console.log(uuid);
      // console.log(authState.userId);
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
      // console.log(json);
      countImages.current = countImages.current - 1;
      getProjectImages();
    } catch (error) {
      console.log(error);
    }
  };

  const uploadFiles = async () => {
    // console.log(countImages.current);
    if (files.length > 3 - countImages.current) {
      console.log("too many files");
    }
    if (countImages.current >= 3) {
      alert("You already have 3 images for the project");
    } else {
      const data = new FormData();
      data.append("project_id", sessionStorage.getItem("project_id"));
      // console.log(files);
      data.append("file_count", files.length);
      for (const item of files) {
        data.append("images", item);
      }
      // console.log(data.get("project_id"));
      // console.log(data.get("file_count"));
      const response = await fetch("/projects/add_images", {
        method: "POST",
        body: data,
      });
      await response.json();
      getProjectImages();
    }
  };

  useEffect(
    () => {
      getProjectDetails();
      getProjectImages();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  if (authState.message === "failed") {
    window.location.href = "/welcome";
  } else if (projectDetails !== undefined) {
    return (
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
                    {/* {projectDetails.findIndex((value)=>{return value=authState.userId})>=0} */}
                    {projectDetails.findIndex((item) => {
                      return item.author_id === authState.userId;
                    }) >= 0 ? (
                      <button onClick={() => deleteImage(item.uuid)}>
                        Delete Image
                      </button>
                    ) : null}
                  </div>
                );
              })
            : null}
        </div>

        <ImageModal
          closeModal={closeModal}
          findPrev={findPrev}
          findNext={findNext}
          hasPrev={currentIndex > 0}
          hasNext={currentIndex + 1 < images.length}
          src={modalSrc.current}
          show={show}
        />
        {projectDetails.findIndex((item) => {
          return item.author_id === authState.userId;
        }) >= 0 ? (
          <div>
            <label htmlFor="addImages">
              <button component="span" onClick={() => filesRef.current.click()}>
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
            <button onClick={uploadFiles}>Upload Files</button>
          </div>
        ) : null}
        {projectDetails.length > 0
          ? projectDetails.map((item, index) => {
              return (
                <div className={styles.details} key={index}>
                  <p className={styles.projectTitle}>
                    Project {sessionStorage.getItem("project_id")}
                    {item.project_name}
                  </p>
                  <p
                    onClick={() => {
                      sessionStorage.setItem("author_id", item.author_id);
                      return navigate("/author_projects");
                    }}
                  >
                    {item.first_name} {item.last_name}
                  </p>
                </div>
              );
            })
          : null}
        <ProjectComments
          className={styles.commentsContainer}
          project_id={sessionStorage.getItem("project_id")}
        />
      </div>
    );
  } else {
    return <div>Loading</div>;
  }
}

export default ProjectDetails;
