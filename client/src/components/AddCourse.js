import { useState, useRef, useEffect } from "react";
import Dropdown from "./Dropdown";
import styles from "../styles/FormComponents.module.css";

function AddCourse() {
  const courseIdRef = useRef();
  const errRef = useRef();

  const [courseId, setCourseId] = useState("");

  const [courseName, setCourseName] = useState("");

  const [startDate, setStartDate] = useState("");

  const [data, setData] = useState([]);

  const [country, setCountry] = useState("");

  const [city, setCity] = useState("");

  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  // retrieve list of countries and cities from API

  const getData = async () => {
    try {
      const response = await fetch(
        "https://countriesnow.space/api/v0.1/countries",
        { method: "GET" }
      );
      const json = await response.json();
      json?.msg === "countries and cities retrieved"
        ? setData(json.data)
        : setData([]);
    } catch (error) {
      console.log("error");
      setErrMsg(error);
    }
  };

  // append course to courses tab in DB

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
          city: city.name,
          country: country.name,
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

  useEffect(() => {
    courseIdRef.current.focus();
  }, []);

  useEffect(() => {
    getData();
  }, []);

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
            {data?.length > 0 ? (
              <div style={{ width: "200px" }}>
                <Dropdown
                  options={data.map((item, index) => ({
                    name: item.country,
                    id: index,
                  }))}
                  id="id"
                  label="name"
                  userPrompt="Select Country..."
                  value={country}
                  onChange={(val) => {
                    setCountry(val);
                  }}
                />
              </div>
            ) : null}
            {country?.name !== undefined ? (
              <div style={{ width: "200px" }}>
                <Dropdown
                  options={data
                    .filter((item) => {
                      return (
                        item.country.toLowerCase() ===
                        country.name.toLowerCase()
                      );
                    })
                    .map((item) => [...item.cities])
                    .flat()
                    .map((val, index) => ({ name: val, id: index }))}
                  id="id"
                  label="name"
                  userPrompt="Select City..."
                  value={city}
                  onChange={(val) => setCity(val)}
                />
              </div>
            ) : null}
            <button className={styles.FormSubmitBtn}>Submit</button>
          </form>
        </section>
      )}
    </>
  );
}

export default AddCourse;
