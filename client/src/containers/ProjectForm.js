import { useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import { Widget } from "@uploadcare/react-widget";

function ProjectForm() {
  const { authState } = useAuth();

  const [courseData, setCourseData] = useState();
  const [projectName, setProjectName] = useState("");
  const [projectId, setProjectId] = useState("");
  const [validProjectId, setValidProjectId] = useState(false);
  const [courseId, setCourseId] = useState("");
  const [description, setDescription] = useState("");
  const [imageFiles, setImageFiles] = useState([]);

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
  const insertImages = async () => {
    const response = await fetch("/projects/add_images", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(imageFiles),
    });
    console.log(await response.json());
  };

  useEffect(() => {
    getCourseData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    projectId !== "" ? setValidProjectId(true) : setValidProjectId(false);
  }, [projectId]);

  useEffect(() => {
    console.log(imageFiles);
    if (imageFiles.length > 0) {
      insertImages();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageFiles]);

  if (courseData !== undefined) {
    return (
      <div>
        <form onSubmit={handleSubmit}>
          <input
            type={"text"}
            name="project_name"
            placeholder="Project Name"
            onChange={(e) => setProjectName(e.target.value)}
          />
          <input
            list="courses"
            name="course_id"
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
            name="description"
            placeholder="Description"
            rows="4"
            cols="50"
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
          <button type="submit">Submit</button>
          {!!validProjectId ? (
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
          ) : null}
        </form>
      </div>
    );
  } else {
    return <div>Loading</div>;
  }
}

export default ProjectForm;
