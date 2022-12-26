import { useState, useRef, useEffect } from "react";
import Dropdown from "./Dropdown";
import styles from "../styles/FormComponents.module.css";

function AddCourse() {
  const courseIdRef = useRef();
  const errRef = useRef();

  const [courseId, setCourseId] = useState("");

  const [courseName, setCourseName] = useState("");

  const [startDate, setStartDate] = useState("");

  const [countries, setCountries] = useState([]);

  const [country, setCountry] = useState("");

  const [cities, setCities] = useState([]);
  const [city, setCity] = useState("");

  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  const getCountries = async () => {
    try {
      const response = await fetch(
        "https://countriesnow.space/api/v0.1/countries/capital",
        { method: "GET" }
      );
      const json = await response.json();
      // const test = json.data.map((item) => ({ name: item.name }));
      json?.msg === "countries and capitals retrieved"
        ? setCountries(json.data.map((item) => ({ name: item.name })))
        : setCountries([]);
      // console.log(test);
    } catch (error) {
      console.log("error");
      setErrMsg(error);
    }
  };

  const getCities = async (value) => {
    try {
      const response = await fetch(
        "https://countriesnow.space/api/v0.1/countries/cities",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            country: value.name.toLowerCase(),
          }),
        }
      );
      const json = await response.json();
      console.log(json);
      json?.msg === `cities in ${value.name} retrieved`
        ? setCities(json.data.map((item) => ({ name: item })))
        : setCities([]);
    } catch (error) {
      console.log("error");
      setErrMsg(error);
    }
  };

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
    getCountries();
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
            {countries?.length > 0 ? (
              <div style={{ width: "200px" }}>
                <Dropdown
                  options={countries}
                  userPrompt="Select Country..."
                  value={country}
                  onChange={(val) => {
                    setCountry(val);
                    country !== ""
                      ? getCities(val)
                      : console.log("country", country);
                  }}
                />
                {console.log("country", country)}
              </div>
            ) : null}

            {cities?.length > 0 ? (
              <div style={{ width: "200px" }}>
                <Dropdown
                  options={cities}
                  userPrompt="Select City..."
                  value={city}
                  onChange={(val) => setCity(val)}
                />
                {console.log(city)}
              </div>
            ) : null}
            {/* <label htmlFor="country">Country:</label>
            <input
              id="country_filter"
              placeholder="Search"
              autoComplete="on"
              onChange={(e) => {
                setCountryFilter(e.target.value.toLowerCase());
              }}
            />
            <select
              id="country"
              defaultValue={0}
              autoComplete="off"
              onChange={(e) => {
                setCountry(e.target.value);
                getCities(e.target.value);
              }}
              // value={country}
              required
            >
              <option hidden disabled value={0}>
                -- select an option --
              </option>
              {countryFilter === ""
                ? countries.map((item, index) => (
                    <option key={index} value={item.name} label={item.name} />
                  ))
                : countries
                    .filter((item) => {
                      return item.name.toLowerCase().includes(countryFilter);
                    })
                    .map((item, index) => (
                      <option key={index} value={item.name} label={item.name} />
                    ))}
            </select> */}
            {/* <label htmlFor="city">City:</label>
            <select
              id="city"
              defaultValue={0}
              autoComplete="on"
              onChange={(e) => {
                setCity(e.target.value);
              }}
              // value={city}
              required
            >
              <option hidden disabled value={0}>
                -- select an option --
              </option>
              {cities.map((item, index) => (
                <option key={index} value={item.name} label={item.name} />
              ))}
            </select> */}
            {/* {console.log(countries[0].name)} */}
            <button className={styles.FormSubmitBtn}>Submit</button>
          </form>
        </section>
      )}
    </>
  );
}

export default AddCourse;
