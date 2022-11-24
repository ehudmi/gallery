import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";

function ProjectDetails() {
  const { authState } = useAuth();

  const location = useLocation();

  const [images, setImages] = useState();

  const getProjectImages = async () => {
    try {
      const response = await fetch("/projects/project_images", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          project_id: location.state.id,
        }),
      });
      const json = await response.json();
      console.log(json);
      setImages(json);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteImage = async (uuid) => {
    try {
      const responseAPI = await fetch(
        `https://api.uploadcare.com/files/${uuid}/storage/`,
        {
          method: "DELETE",
          headers: {
            Accept: "application/vnd.uploadcare-v0.7+json",
            Authorization:
              "Uploadcare.Simple a8a3d493f7784d19923f:7504d155b72e01f55dbf",
          },
        }
      );
      const jsonAPI = await responseAPI.json();
      console.log(jsonAPI);

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
      //   console.log(location.state);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  if (authState.role === "user") {
    return (
      <div>
        <p>Project</p>
        {location.state.id}
        {!!images
          ? images.map((item, index) => {
              return (
                <div key={index}>
                  <img alt="pic" src={item.url} id={item.uuid} />
                  <button onClick={() => deleteImage(item.uuid)}>
                    Delete Image
                  </button>
                </div>
              );
            })
          : null}
        {/* <button onClick={() => navigate("/project_list")}>
              List of Projects
            </button> */}
      </div>
    );
  } else if (authState.role === "author") {
    return (
      <div>
        <p>Project</p>
        Welcome
        {location.state.id}
        {/* <button onClick={() => navigate("/my_projects")}>My Projects</button> */}
      </div>
    );
  } else if (authState.message === "failed") {
    window.location.href = "/welcome";
  }
}

export default ProjectDetails;
