import { useEffect, useState, useRef } from "react";
import useAuth from "../hooks/useAuth";
import ProjectComments from "./ProjectComments";

function ProjectDetails() {
  const { authState } = useAuth();

  const [images, setImages] = useState([]);
  const countImages = useRef(0);

  const filesRef = useRef(null);
  const [files, setFiles] = useState();

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
      getProjectImages();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  if (authState.message === "failed") {
    window.location.href = "/welcome";
  } else
    return (
      <div>
        <p>Project</p>
        {sessionStorage.getItem("project_id")}
        {images.length > 0
          ? images.map((item, index) => {
              return (
                <div key={index}>
                  <img
                    alt="pic"
                    src={item.url}
                    id={item.uuid}
                    width={300}
                    height={300}
                  />
                  {authState.userId ===
                  Number(sessionStorage.getItem("author_id")) ? (
                    <button onClick={() => deleteImage(item.uuid)}>
                      Delete Image
                    </button>
                  ) : null}
                </div>
              );
            })
          : null}
        {authState.userId === Number(sessionStorage.getItem("author_id")) ? (
          <>
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
          </>
        ) : null}
        <ProjectComments project_id={sessionStorage.getItem("project_id")} />
      </div>
    );
}

export default ProjectDetails;
