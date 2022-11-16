import { useState, useEffect } from "react";
import ImageForm from "./ImageForm";

function ProjectForm() {
  const [courseData, setCourseData] = useState();

  const [projectName, setProjectName] = useState("");
  const [validProjName, setValidProjName] = useState(false);

  const [courseId, setCourseId] = useState("");

  const [description, setDescription] = useState("");

  const getCourseData = async () => {
    const result = await fetch("/projects/read_course", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const json = await result.json();
    setCourseData(json);
    console.log(courseData);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // console.log(JSON.stringify(data));
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
  };

  useEffect(() => {
    getCourseData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    !!projectName ? setValidProjName(true) : setValidProjName(false);
  }, [projectName]);

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
          {!!validProjName ? (
            <div>
              <ImageForm projectName={projectName} />
            </div>
          ) : null}
        </form>
      </div>
    );
  } else {
    return <div>Loading</div>;
  }
}

export default ProjectForm;
