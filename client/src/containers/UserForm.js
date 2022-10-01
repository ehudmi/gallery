import React from "react";
import { useState } from "react";
import Input from "../components/Input";

function UserForm() {
  const [data, setData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    role: "",
    birth_date: "",
    about: "",
  });

  const handleChange = (event) => {
    data[event.target.name] = event.target.value;
    setData(data);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(JSON.stringify(data));
    const response = await fetch("/write/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    console.log(await response.text());
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Input
          type={"text"}
          name="first_name"
          placeholder="First Name"
          inputChange={handleChange}
        />
        <Input
          type={"text"}
          name="last_name"
          placeholder="Last Name"
          inputChange={handleChange}
        />
        <Input
          type={"email"}
          name="email"
          placeholder="Email"
          inputChange={handleChange}
        />
        <br />
        <Input
          type={"password"}
          name="password"
          placeholder="Password"
          inputChange={handleChange}
        />
        <Input
          type={"date"}
          name="birth_date"
          placeholder="Birth Date"
          inputChange={handleChange}
        />
        <label htmlFor="about">About</label>
        <textarea
          name="about"
          placeholder="About"
          rows="4"
          cols="50"
          inputChange={handleChange}
        ></textarea>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default UserForm;
