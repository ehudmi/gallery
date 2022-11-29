import { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import ProjectComments from "./ProjectComments";

function ProjectDetails() {
  const { authState } = useAuth();

  const [images, setImages] = useState([]);

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
      console.log(json);
      setImages(json);
    } catch (error) {
      console.log(error);
    }
  };

  // delete images from DB

  const deleteImage = async (uuid) => {
    try {
      console.log(uuid);
      const response = await fetch("/projects/delete_images", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uuid: uuid,
        }),
      });
      const json = await response.json();
      console.log(json);
    } catch (error) {
      console.log(error);
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
                  {authState.userId === sessionStorage.getItem("author_id") ? (
                    <button onClick={() => deleteImage(item.uuid)}>
                      Delete Image
                    </button>
                  ) : null}
                </div>
              );
            })
          : null}
        <ProjectComments project_id={sessionStorage.getItem("project_id")} />
      </div>
    );
}

export default ProjectDetails;
