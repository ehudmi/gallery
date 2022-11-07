import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  faCheck,
  faTimes,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const NAME_REGEX = new RegExp("^[A-Z][A-z]{3,23}$");
const EMAIL_REGEX = new RegExp("^\\S+@\\S+\\.\\S+$");
const PWD_REGEX = new RegExp("^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,15}$");
const DATE_REGEX = new RegExp(
  "^[0-3][0-9]/[0-3][0-9]/(?:[0-9][0-9])?[0-9][0-9]$"
);

//User registration form

function Signup() {
  const navigate = useNavigate();

  const fNameRef = useRef();
  const errRef = useRef();

  const [data, setData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    role: "",
    birth_date: "",
    about: "",
  });

  const [validFName, setValidFName] = useState();
  const [fNameFocus, setFNameFocus] = useState(false);

  const [validLName, setValidLName] = useState();
  const [lNameFocus, setLNameFocus] = useState(false);

  const [validEmail, setValidEmail] = useState();
  const [emailFocus, setEmailFocus] = useState(false);

  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  const [matchPwd, setMatchPwd] = useState("");
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  const [validDate, setValidDate] = useState();
  const [dateFocus, setDateFocus] = useState(false);

  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fNameRef.current.focus();
  }, []);

  useEffect(() => {
    setValidFName(NAME_REGEX.test(data.first_name));
  }, [data.first_name]);

  useEffect(() => {
    setValidLName(NAME_REGEX.test(data.last_name));
  }, [data.last_name]);

  useEffect(() => {
    setValidEmail(EMAIL_REGEX.test(data.email));
  }, [data.email]);

  useEffect(() => {
    setValidPwd(PWD_REGEX.test(data.password));
    setValidMatch(data.password === matchPwd);
  }, [data.password, matchPwd]);

  useEffect(() => {
    setValidDate(DATE_REGEX.test(data.birth_date));
  }, [data.birth_date]);

  useEffect(() => {
    setErrMsg("");
  }, [data.first_name, data.password, matchPwd]);

  const handleChange = (event) => {
    data[event.target.name] = event.target.value;
    console.log(data[event.target.name]);
    setData(data);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const v1 = NAME_REGEX.test(data.first_name);
    const v2 = NAME_REGEX.test(data.last_name);
    const v3 = EMAIL_REGEX.test(data.email);
    const v4 = PWD_REGEX.test(data.password);
    if (!v1 || !v2 || !v3 || !v4) {
      setErrMsg("Invalid Entry");
      return;
    }
    try {
      const response = await fetch("/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const signIn = await response.json();
      if (signIn.msg === "Registered Successfully") {
        setSuccess(true);
        navigate("/login");
      } else {
        alert("Error in registration");
      }
    } catch (error) {
      if (!error?.response) {
        setErrMsg("No Server Response");
      } else if (error.response?.status === 409) {
        setErrMsg("Username Taken");
      } else {
        setErrMsg("Registration Failed");
      }
      errRef.current.focus();
    }
  };

  return (
    <>
      {success ? (
        <section>
          <h1>Success!</h1>
          <p>
            <a href="login">Sign In</a>
          </p>
        </section>
      ) : (
        <section>
          <p
            ref={errRef}
            className={errMsg ? "errMsg" : "offscreen"}
            aria-live="assertive"
          >
            {errMsg}
          </p>
          <form onSubmit={handleSubmit}>
            <label htmlFor="firstName">
              First Name:
              <FontAwesomeIcon
                icon={faCheck}
                className={validFName ? "valid" : "hide"}
              />
              <FontAwesomeIcon
                icon={faTimes}
                className={validFName || !data.first_name ? "hide" : "invalid"}
              />
            </label>
            <input
              type="text"
              id="firstName"
              name="first_name"
              placeholder="First Name"
              ref={fNameRef}
              autoComplete="off"
              onChange={handleChange}
              required
              aria-invalid={validFName ? "false" : "true"}
              aria-describedby="uidNote"
              onFocus={() => setFNameFocus(true)}
              onBlur={() => setFNameFocus(false)}
            />
            <p
              id="uidNote"
              className={
                fNameFocus && data.first_name && !validFName
                  ? "instructions"
                  : "offscreen"
              }
            >
              <FontAwesomeIcon icon={faInfoCircle} />
              4 to 24 characters.
              <br />
              Must begin with a Capital letter.
              <br />
              Only letters allowed.
            </p>

            <label htmlFor="lastName">
              Last Name:
              <FontAwesomeIcon
                icon={faCheck}
                className={validLName ? "valid" : "hide"}
              />
              <FontAwesomeIcon
                icon={faTimes}
                className={validLName || !data.last_name ? "hide" : "invalid"}
              />
            </label>
            <input
              type="text"
              id="lastName"
              name="last_name"
              placeholder="Last Name"
              autoComplete="off"
              onChange={handleChange}
              required
              aria-invalid={validLName ? "false" : "true"}
              aria-describedby="uidNote"
              onFocus={() => setLNameFocus(true)}
              onBlur={() => setLNameFocus(false)}
            />
            <p
              id="uidNote"
              className={
                lNameFocus && data.last_name && !validLName
                  ? "instructions"
                  : "offscreen"
              }
            >
              <FontAwesomeIcon icon={faInfoCircle} />
              4 to 24 characters.
              <br />
              Must begin with a Capital letter.
              <br />
              Only letters allowed.
            </p>

            <label htmlFor="email">
              Email:
              <FontAwesomeIcon
                icon={faCheck}
                className={validEmail ? "valid" : "hide"}
              />
              <FontAwesomeIcon
                icon={faTimes}
                className={validEmail || !data.email ? "hide" : "invalid"}
              />
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Email"
              autoComplete="off"
              onChange={handleChange}
              required
              aria-invalid={validEmail ? "false" : "true"}
              aria-describedby="uidNote"
              onFocus={() => setEmailFocus(true)}
              onBlur={() => setEmailFocus(false)}
            />
            <p
              id="uidNote"
              className={
                emailFocus && data.email && !validEmail
                  ? "instructions"
                  : "offscreen"
              }
            >
              <FontAwesomeIcon icon={faInfoCircle} />
              Must include the characters "@" and "."
              <br />
              Make sure the email is valid
            </p>

            <label htmlFor="password">
              Password:
              <FontAwesomeIcon
                icon={faCheck}
                className={validPwd ? "valid" : "hide"}
              />
              <FontAwesomeIcon
                icon={faTimes}
                className={validPwd || !data.password ? "hide" : "invalid"}
              />
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Password"
              autoComplete="off"
              onChange={handleChange}
              required
              aria-invalid={validPwd ? "false" : "true"}
              aria-describedby="uidNote"
              onFocus={() => setPwdFocus(true)}
              onBlur={() => setPwdFocus(false)}
            />
            <p
              id="uidNote"
              className={
                pwdFocus && data.last_name && !validPwd
                  ? "instructions"
                  : "offscreen"
              }
            >
              <FontAwesomeIcon icon={faInfoCircle} />
              4 to 24 characters.
              <br />
              Must begin with a Capital letter.
              <br />
              Only letters allowed.
            </p>

            <label htmlFor="confirm_pwd">
              Confirm Password:
              <FontAwesomeIcon
                icon={faCheck}
                className={validMatch && matchPwd ? "valid" : "hide"}
              />
              <FontAwesomeIcon
                icon={faTimes}
                className={validMatch || !matchPwd ? "hide" : "invalid"}
              />
            </label>
            <input
              type="password"
              id="confirm_pwd"
              onChange={(e) => setMatchPwd(e.target.value)}
              required
              aria-invalid={validMatch ? "false" : "true"}
              aria-describedby="confirmNote"
              onFocus={() => setMatchFocus(true)}
              onBlur={() => setMatchFocus(false)}
            />
            <p
              id="confirmNote"
              className={
                matchFocus && !validMatch ? "instructions" : "offscreen"
              }
            >
              <FontAwesomeIcon icon={faInfoCircle} />
              Must match the first password input field.
            </p>

            <label htmlFor="birthDate">
              Birth Date:
              <FontAwesomeIcon
                icon={faCheck}
                className={validDate ? "valid" : "hide"}
              />
              <FontAwesomeIcon
                icon={faTimes}
                className={validDate || !data.birth_date ? "hide" : "invalid"}
              />
            </label>
            <input
              type="date"
              id="birthDate"
              name="birth_date"
              placeholder="Birth Date"
              autoComplete="off"
              onChange={handleChange}
              aria-invalid={validDate ? "false" : "true"}
              aria-describedby="uidNote"
              onFocus={() => setDateFocus(true)}
              onBlur={() => setDateFocus(false)}
            />
            <p
              id="uidNote"
              className={
                dateFocus && data.birth_date && !validDate
                  ? "instructions"
                  : "offscreen"
              }
            >
              <FontAwesomeIcon icon={faInfoCircle} />
              4 to 24 characters.
              <br />
              Must begin with a Capital letter.
              <br />
              Only letters allowed.
            </p>

            <label htmlFor="about">About</label>
            <textarea
              name="about"
              placeholder="About"
              rows="4"
              cols="50"
              onChange={handleChange}
            ></textarea>
            <button
              disabled={
                !validFName ||
                !validLName ||
                !validEmail ||
                !validPwd ||
                !validMatch
                  ? true
                  : false
              }
            >
              Submit
            </button>
          </form>
          <p>
            Already registered?
            <br />
            <span className="line">
              {/*put router link here*/}
              <a href="login">Sign In</a>
            </span>
          </p>
        </section>
      )}
    </>
  );
}

export default Signup;
