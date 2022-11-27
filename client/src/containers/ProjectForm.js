import { useState, useEffect, useRef } from "react";
// import useAuth from "../hooks/useAuth";

function ProjectForm() {
  // const { authState } = useAuth();

  const [courseData, setCourseData] = useState();
  const [projectName, setProjectName] = useState("");
  const [projectId, setProjectId] = useState("");
  const [validProjectId, setValidProjectId] = useState(false);
  const [courseId, setCourseId] = useState("");
  const [description, setDescription] = useState("");
  const filesRef = useRef(null);
  const [files, setFiles] = useState();

  // check what courses are in the db to populate list of courses
  const getCourseData = async () => {
    const result = await fetch("/projects/read_course", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const json = await result.json();
    setCourseData(json);
    console.log(json);
  };

  // function to submit form
  const handleSubmit = async (event) => {
    event.preventDefault();
    const response = await fetch("/projects/add_project", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        project_name: projectName,
        course_id: courseId,
        description: description,
      }),
    });
    const projectAdd = await response.json();
    console.log(projectAdd);
    setProjectId(projectAdd[0].project_id);
  };

  // function to add image data to the db using fileInfo from Uploadcare

  const uploadFiles = async () => {
    const data = new FormData();
    data.append("project_id", projectId);
    // data.append("project_id", 65);
    console.log(files);
    if (files.length > 3) {
      console.log("too many files");
    } else {
      for (const item of files) {
        data.append("images", item);
      }
      console.log(data.get("project_id"));
      const response = await fetch("/projects/add_images", {
        method: "POST",
        body: data,
      });
      console.log(await response.json());
    }
  };

  useEffect(() => {
    getCourseData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    projectId !== "" ? setValidProjectId(true) : setValidProjectId(false);
  }, [projectId]);

  if (courseData !== undefined) {
    return (
      <div>
        <form onSubmit={handleSubmit}>
          <label htmlFor="project_name">Project Name</label>
          <input
            type={"text"}
            id="project_name"
            placeholder="Project Name"
            onChange={(e) => setProjectName(e.target.value)}
          />

          <input
            list="courses"
            id="course_id"
            placeholder="Course"
            onChange={(e) => setCourseId(e.target.value)}
          />
          <datalist id="courses">
            {courseData.map((item, index) => (
              <option key={index} value={item.id} />
            ))}
          </datalist>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            placeholder="Description"
            rows="4"
            cols="50"
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
          <button type="submit">Submit</button>

          {/* {!!validProjectId ? (
            <p>
              <label htmlFor="file">Your file:</label>{" "}
              <Widget
                publicKey="a8a3d493f7784d19923f"
                id="file"
                imagesOnly="true"
                previewStep="true"
                multiple="true"
                imageShrink="800X600"
                metadata={JSON.stringify({
                  userId: authState.userId,
                  projectName: projectName,
                  projectId: projectId,
                })}
                multipleMax="3"
                onDialogOpen={(dialog) => {
                  // fires when a user closes the widget's dialog (clicks Done)
                  dialog.done(async (group) => {
                    // get an array of file instances and fileInfo objects
                    const fileInfos = await Promise.all(group.files());
                    console.log(fileInfos);
                    const images = fileInfos.map((item) => {
                      return {
                        uuid: item.uuid,
                        url: item.cdnUrl,
                        project_id: projectId,
                        name: item.name,
                      };
                    });
                    setImageFiles(images);
                  });
                }}
              />
            </p>
          ) : null} */}
        </form>
        {!!validProjectId ? (
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
              // name="images"
              multiple
              type="file"
              onChange={(e) => {
                setFiles(e.target.files);
              }}
            />
            <button onClick={uploadFiles}>Upload Files</button>
          </>
        ) : null}
      </div>
    );
  } else {
    return <div>Loading</div>;
  }
}

export default ProjectForm;
