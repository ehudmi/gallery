import React from "react";
import Input from "../components/Input";

function AuthorForm() {
  return (
    <div>
      <form onSubmit={this.props.handleSubmit}>
        <Input
          type={"text"}
          name="first_name"
          placeholder="First Name"
          inputChange={this.props.handleChange}
        />
        <Input
          type={"text"}
          name="last_name"
          placeholder="Last Name"
          inputChange={this.props.handleChange}
        />
        <Input
          type={"email"}
          name="email"
          placeholder="Email"
          inputChange={this.props.handleChange}
        />
        <br />
        <Input
          type={"date"}
          name="birth_date"
          placeholder="Birth Date"
          inputChange={this.props.handleChange}
        />
        <label htmlFor="about">About</label>
        <textarea
          name="about"
          placeholder="About"
          rows="4"
          cols="50"
          inputChange={this.props.handleChange}
        ></textarea>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default AuthorForm;
