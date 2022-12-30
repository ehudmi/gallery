import { useState, useRef, useEffect } from "react";
import {
  faCheck,
  faTimes,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "../styles/FormComponents.module.css";

const NAME_REGEX = new RegExp("^[A-Z][A-z]{1,23}$");
const EMAIL_REGEX = new RegExp("^\\S+@\\S+\\.\\S+$");

function AddStudent() {
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

  // append student to students tab in DB

  const submitStudent = async (event) => {
    event.preventDefault();
    const v1 = NAME_REGEX.test(fName);
    const v2 = NAME_REGEX.test(lName);
    const v3 = EMAIL_REGEX.test(email);
    if (!v1 || !v2 || !v3) {
      setErrMsg("Invalid Entry");
      return;
    }
    try {
      const response = await fetch("/users/add_student", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          first_name: fName,
          last_name: lName,
          email: email,
        }),
      });
      const result = await response.json();
      if (result.msg === "Added Successfully") {
        setSuccess(true);
        setFName("");
        setLName("");
        setEmail("");
      } else if (result.error) throw result.error;
    } catch (error) {
      console.log("error");
      setErrMsg(error);
      errRef.current.focus();
    }
  };

  return (
    <>
      {success ? (
        <section>
          <h1>Student Added!</h1>
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
          <h1>Add Student</h1>
          <form className={styles.ActiveForm} onSubmit={submitStudent}>
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
                <FontAwesomeIcon icon={faInfoCircle} />2 to 24 characters. Must
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
                <FontAwesomeIcon icon={faInfoCircle} />2 to 24 characters. Must
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
            <button
              className={styles.FormSubmitBtn}
              disabled={
                !validFName || !validLName || !validEmail ? true : false
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

export default AddStudent;
