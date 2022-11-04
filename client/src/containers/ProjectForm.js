import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../GlobalStates";
// import Input from "../components/Input";

function ProjectForm(props) {
  const [authState] = useContext(AuthContext);
  const [courseData, setCourseData] = useState();
  const [data, setData] = useState({
    project_name: "",
    course_id: "",
    description: "",
  });

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

  const handleChange = (event) => {
    data[event.target.name] = event.target.value;
    setData(data);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // console.log(JSON.stringify(data));
    const response = await fetch("/projects/add_project", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const projectAdd = await response.json();
    console.log(projectAdd);
    //   if (signIn.msg === "Registered Successfully") {
    //     navigate("/login");
    //   } else {
    //     alert("Error in registration");
    //   }
  };

  useEffect(() => {
    props.loadData();
    getCourseData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (authState !== "" && courseData !== undefined) {
    return (
      <div>
        <form onSubmit={handleSubmit}>
          <input
            type={"text"}
            name="project_name"
            placeholder="Project Name"
            onChange={handleChange}
          />
          <input
            list="courses"
            name="course_id"
            placeholder="Course"
            onChange={handleChange}
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
            onChange={handleChange}
          ></textarea>
          <button type="submit">Submit</button>
        </form>
      </div>
    );
  } else {
    return <div>Loading</div>;
  }
}

export default ProjectForm;
