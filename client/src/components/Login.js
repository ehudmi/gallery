import React, { useState, useRef, useEffect, useContext } from "react";
import { AuthContext } from "../GlobalStates";
import { useNavigate } from "react-router-dom";

// Login page functions and render - as form

function Login() {
  const [authState, setAuthState] = useContext(AuthContext);

  const emailRef = useRef();
  const errRef = useRef();

  const [email, setEmail] = useState("");
  const [password, setPwd] = useState("");

  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    emailRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [email, password]);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/users/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email, password: password }),
      });
      let userLoggedIn = await response.json();
      // console.log(userLoggedIn);
      setEmail("");
      setPwd("");
      if (userLoggedIn.userId) {
        setAuthState({
          ...authState,
          userId: userLoggedIn.userId,
          first_name: userLoggedIn.first_name,
          last_name: userLoggedIn.last_name,
          email: userLoggedIn.email,
          role: userLoggedIn.role,
        });
        navigate("/home");
      } else if (userLoggedIn.error) throw userLoggedIn.error;
    } catch (error) {
      setErrMsg(error);
      console.log(error);
      errRef.current.focus();
    }
  };

  return (
    <section>
      <p
        ref={errRef}
        className={errMsg ? "errMsg" : "offscreen"}
        aria-live="assertive"
      >
        {errMsg}
      </p>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email:</label>
        <input
          type={"email"}
          id="email"
          placeholder="Email"
          ref={emailRef}
          autoComplete="off"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          required
        />
        <label htmlFor="password">Password:</label>
        <input
          type={"password"}
          id="password"
          placeholder="Password"
          onChange={(e) => setPwd(e.target.value)}
          value={password}
          required
        />

        <button>Log In</button>
      </form>
      <p>
        Need an account?
        <br />
        <span className="line">
          <a href="signup">Sign Up</a>
        </span>
      </p>
    </section>
  );
}

export default Login;
