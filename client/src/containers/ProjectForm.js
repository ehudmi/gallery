import React from "react";
import Input from "../components/Input";

let data;
const getData = async () => {
  const result = await fetch("/read_course", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const json = result.json();
  data = json;
};

function ProjectForm() {
  return (
    <div>
      <form onSubmit={this.props.handleSubmit}>
        <Input
          type={"text"}
          name="project_name"
          placeholder="Project Name"
          inputChange={this.props.handleChange}
        />
        <Input
          list="courses"
          name="Course"
          placeholder="Course"
          inputChange={this.props.handleChange}
        />
        <datalist id="data">
          {data.map((item, key) => (
            <option key={key} value={item.displayValue} />
          ))}
        </datalist>
        <label htmlFor="description">Description</label>
        <textarea
          name="description"
          placeholder="Description"
          rows="4"
          cols="50"
          inputChange={this.props.handleChange}
        ></textarea>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default ProjectForm;
