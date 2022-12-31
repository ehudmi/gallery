import { useState, useEffect, useRef } from "react";
import {
  faCheck,
  faTimes,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "../styles/FormComponents.module.css";

const NAME_REGEX = new RegExp("^[A-Z][A-z]{3,23}$");
const EMAIL_REGEX = new RegExp("^\\S+@\\S+\\.\\S+$");
const PWD_REGEX = new RegExp("^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,15}$");

//User registration form

function Signup() {
  const fNameRef = useRef();
  const errRef = useRef();

  const [fName, setFName] = useState("");
  const [validFName, setValidFName] = useState();
  const [fNameFocus, setFNameFocus] = useState(false);

  const [lName, setLName] = useState("");
  const [validLName, setValidLName] = useState();
  const [lNameFocus, setLNameFocus] = useState(false);

  const [email, setEmail] = useState("");
  const [validEmail, setValidEmail] = useState();
  const [emailFocus, setEmailFocus] = useState(false);

  const [password, setPwd] = useState("");
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  const [matchPwd, setMatchPwd] = useState("");
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  const [bDate, setBDate] = useState("");

  const [about, setAbout] = useState("");

  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fNameRef.current.focus();
  }, []);

  useEffect(() => {
    setValidFName(NAME_REGEX.test(fName));
  }, [fName]);

  useEffect(() => {
    setValidLName(NAME_REGEX.test(lName));
  }, [lName]);

  useEffect(() => {
    setValidEmail(EMAIL_REGEX.test(email));
  }, [email]);

  useEffect(() => {
    setValidPwd(PWD_REGEX.test(password));
    setValidMatch(password === matchPwd);
  }, [password, matchPwd]);

  useEffect(() => {
    setErrMsg("");
  }, [fName, password, matchPwd]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const v1 = NAME_REGEX.test(fName);
    const v2 = NAME_REGEX.test(lName);
    const v3 = EMAIL_REGEX.test(email);
    const v4 = PWD_REGEX.test(password);
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
        body: JSON.stringify({
          first_name: fName,
          last_name: lName,
          email: email,
          password: password,
          birth_date: bDate,
          about: about,
        }),
      });
      const signIn = await response.json();
      if (signIn.msg === "Registered Successfully") {
        setSuccess(true);
        setFName("");
        setLName("");
        setEmail("");
        setPwd("");
        setMatchPwd("");
        setBDate("");
        setAbout("");
      } else if (signIn.error) throw signIn.error;
    } catch (error) {
      console.log("error");
      setErrMsg(error);
      errRef.current.focus();
    }
  };

  return (
    <>
      {success ? (
        <section className={styles.FormContainer}>
          <h1>Success!</h1>
          <p>
            <a href="login">Sign In</a>
          </p>
        </section>
      ) : (
        <section className={styles.FormContainer}>
          <p
            ref={errRef}
            className={errMsg ? "errMsg" : "offscreen"}
            aria-live="assertive"
          >
            {errMsg}
          </p>
          <div className={styles.alreadyReg}>
            Already registered?
            <span className="line">
              <a href="login">Sign In</a>
            </span>
          </div>

          <h1>Sign Up</h1>
          <form className={styles.ActiveForm} onSubmit={handleSubmit}>
            <label htmlFor="firstName">
              First Name:
              <FontAwesomeIcon
                icon={faCheck}
                className={validFName ? "valid" : "hide"}
              />
              <FontAwesomeIcon
                icon={faTimes}
                className={validFName || !fName ? "hide" : "invalid"}
              />
              <p
                id="uidNote"
                className={
                  fNameFocus && fName && !validFName
                    ? "instructions"
                    : "offscreen"
                }
              >
                <FontAwesomeIcon icon={faInfoCircle} />4 to 24 characters. Must
                begin with a Capital letter. Only letters allowed.
              </p>
            </label>
            <input
              type="text"
              id="firstName"
              placeholder="First Name"
              ref={fNameRef}
              autoComplete="off"
              onChange={(e) => setFName(e.target.value)}
              value={fName}
              required
              aria-invalid={validFName ? "false" : "true"}
              aria-describedby="uidNote"
              onFocus={() => setFNameFocus(true)}
              onBlur={() => setFNameFocus(false)}
            />

            <label htmlFor="lastName">
              Last Name:
              <FontAwesomeIcon
                icon={faCheck}
                className={validLName ? "valid" : "hide"}
              />
              <FontAwesomeIcon
                icon={faTimes}
                className={validLName || !lName ? "hide" : "invalid"}
              />
              <p
                id="uidNote"
                className={
                  lNameFocus && lName && !validLName
                    ? "instructions"
                    : "offscreen"
                }
              >
                <FontAwesomeIcon icon={faInfoCircle} />4 to 24 characters. Must
                begin with a Capital letter. Only letters allowed.
              </p>
            </label>
            <input
              type="text"
              id="lastName"
              placeholder="Last Name"
              autoComplete="off"
              onChange={(e) => setLName(e.target.value)}
              value={lName}
              required
              aria-invalid={validLName ? "false" : "true"}
              aria-describedby="uidNote"
              onFocus={() => setLNameFocus(true)}
              onBlur={() => setLNameFocus(false)}
            />

            <label htmlFor="email">
              Email:
              <FontAwesomeIcon
                icon={faCheck}
                className={validEmail ? "valid" : "hide"}
              />
              <FontAwesomeIcon
                icon={faTimes}
                className={validEmail || !email ? "hide" : "invalid"}
              />
              <p
                id="uidNote"
                className={
                  emailFocus && email && !validEmail
                    ? "instructions"
                    : "offscreen"
                }
              >
                <FontAwesomeIcon icon={faInfoCircle} />
                Must include the characters "@" and "." Make sure the email is
                valid
              </p>
            </label>
            <input
              type="email"
              id="email"
              placeholder="Email"
              autoComplete="off"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
              aria-invalid={validEmail ? "false" : "true"}
              aria-describedby="uidNote"
              onFocus={() => setEmailFocus(true)}
              onBlur={() => setEmailFocus(false)}
            />

            <label htmlFor="password">
              Password:
              <FontAwesomeIcon
                icon={faCheck}
                className={validPwd ? "valid" : "hide"}
              />
              <FontAwesomeIcon
                icon={faTimes}
                className={validPwd || !password ? "hide" : "invalid"}
              />
              <p
                id="uidNote"
                className={
                  pwdFocus && lName && !validPwd ? "instructions" : "offscreen"
                }
              >
                <FontAwesomeIcon icon={faInfoCircle} />8 to 15 characters. Must
                include uppercase, lowercase and digits.
              </p>
            </label>
            <input
              type="password"
              id="password"
              placeholder="Password"
              autoComplete="off"
              onChange={(e) => setPwd(e.target.value)}
              value={password}
              required
              aria-invalid={validPwd ? "false" : "true"}
              aria-describedby="uidNote"
              onFocus={() => setPwdFocus(true)}
              onBlur={() => setPwdFocus(false)}
            />

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
              <p
                id="confirmNote"
                className={
                  matchFocus && !validMatch ? "instructions" : "offscreen"
                }
              >
                <FontAwesomeIcon icon={faInfoCircle} />
                Must match the first password input field.
              </p>
            </label>
            <input
              type="password"
              id="confirm_pwd"
              placeholder="Confirm Password"
              onChange={(e) => setMatchPwd(e.target.value)}
              required
              aria-invalid={validMatch ? "false" : "true"}
              aria-describedby="confirmNote"
              onFocus={() => setMatchFocus(true)}
              onBlur={() => setMatchFocus(false)}
            />

            <label htmlFor="birthDate">Birth Date:</label>
            <input
              type="date"
              id="birthDate"
              placeholder="Birth Date"
              autoComplete="off"
              onChange={(e) => setBDate(e.target.value)}
              value={bDate}
            />

            <label htmlFor="about">About</label>
            <textarea
              id="about"
              placeholder="About"
              // rows="3"
              // cols="38"
              onChange={(e) => setAbout(e.target.value)}
              value={about}
            ></textarea>
            <button
              className={styles.FormSubmitBtn}
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
        </section>
      )}
    </>
  );
}

export default Signup;
