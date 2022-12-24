import { useState, useRef, useEffect } from "react";
import styles from "../styles/FormComponents.module.css";

function AddCourse() {
  const courseIdRef = useRef();
  const errRef = useRef();

  const [courseId, setCourseId] = useState("");

  const [courseName, setCourseName] = useState("");

  const [startDate, setStartDate] = useState("");

  const [city, setCity] = useState("");

  const [country, setCountry] = useState("");

  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    courseIdRef.current.focus();
  }, []);

  const submitCourse = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch("/users/add_course", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: courseId,
          name: courseName,
          start_date: startDate,
          city: city,
          country: country,
        }),
      });
      const result = await response.json();
      if (result.msg === "Added Successfully") {
        setSuccess(true);
        setCourseId("");
        setCourseName("");
        setStartDate("");
        setCity("");
        setCountry("");
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
          <h1>Course Added!</h1>
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
          <h1>Add Course</h1>
          <form className={styles.ActiveForm} onSubmit={submitCourse}>
            <label htmlFor="courseId">Course Id:</label>
            <input
              type="text"
              id="courseId"
              placeholder="Course Id"
              ref={courseIdRef}
              autoComplete="off"
              onChange={(e) => setCourseId(e.target.value)}
              value={courseId}
              required
            />
            <label htmlFor="courseName">Course Name:</label>
            <input
              type="text"
              id="courseName"
              placeholder="Course Name"
              autoComplete="off"
              onChange={(e) => setCourseName(e.target.value)}
              value={courseName}
              required
            />
            <label htmlFor="startDate">Start Date:</label>
            <input
              type="date"
              id="startDate"
              placeholder="Start Date"
              autoComplete="off"
              onChange={(e) => setStartDate(e.target.value)}
              value={startDate}
              required
            />
            <label htmlFor="city">City:</label>
            <input
              type="text"
              id="city"
              placeholder="City Name"
              autoComplete="off"
              onChange={(e) => setCity(e.target.value)}
              value={city}
              required
            />
            <label htmlFor="country">Country:</label>
            <input
              type="text"
              id="country"
              placeholder="Country Name"
              autoComplete="off"
              onChange={(e) => setCountry(e.target.value)}
              value={country}
              required
            />
            <button className={styles.FormSubmitBtn}>Submit</button>
          </form>
        </section>
      )}
    </>
  );
}

export default AddCourse;
