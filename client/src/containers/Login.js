import React, { useState, useContext } from "react";
import { AuthContext } from "../GlobalStates";

let regexPass = new RegExp("^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,15}$");

function Login() {
  const [authState, setauthState] = useContext(AuthContext);
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const handleChangeEmail = (e) => {
    console.log(e.target);
    setEmail(e.target.value);
  };

  const handleChangePassword = (e) => {
    if (e.target.value.match(regexPass) != null) {
      setPassword({ password: e.target.value });
    } else {
      alert(`1 Uppercase\n1 Lowercase\n1 Digit\n8-15 Characters`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let userLogin = {
      email: email,
      password: password.password,
    };
    console.log(userLogin);
    const response = await fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userLogin),
    });
    let userLoggedIn = await response.json();
    console.log(await userLoggedIn);
    // if (userLoggedIn.userId > 0) {
    //   // sessionStorage.setItem("userid", userLoggedIn.userId);
    // } else {
    //   alert(userLoggedIn.msg);
    // }
  };

  return (
    <div>
      <p>Login</p>
      <form onSubmit={handleSubmit}>
        <input
          type={"email"}
          name="email"
          placeholder="Email"
          onChange={handleChangeEmail}
        />
        <br />
        <input
          type={"password"}
          name="password"
          placeholder="Password"
          onBlur={handleChangePassword}
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default Login;
