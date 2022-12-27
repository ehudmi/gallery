import { useState, useEffect, useRef } from "react";
import useAuth from "../hooks/useAuth";
import Dropdown from "../components/Dropdown";
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "../styles/FormComponents.module.css";

const LINK_REGEX = new RegExp(
  "^((https?)://)?[a-zA-Z0-9-.]{3,}.[a-zA-Z]{2,}(.[a-zA-Z]{2,})?/$"
);

function ProjectForm() {
  const { authState } = useAuth();

  const [courseData, setCourseData] = useState([]);
  const [courseId, setCourseId] = useState("");

  const [authorData, setAuthorData] = useState([]);
  const [authors, setAuthors] = useState([
    {
      id: authState.userId,
      name: `${authState.first_name} ${authState.last_name}`,
    },
  ]);

  const [projectName, setProjectName] = useState("");
  const [projectId, setProjectId] = useState("");
  const [validProjectId, setValidProjectId] = useState(false);

  const [link, setLink] = useState("");
  const [validProjectLink, setValidProjectLink] = useState(false);

  const [description, setDescription] = useState("");
  const filesRef = useRef(null);
  const [files, setFiles] = useState();

  const errRef = useRef();
  const [errMsg, setErrMsg] = useState("");

  const successRef = useRef();
  const [successMsg, setSuccessMsg] = useState("");
  const [success, setSuccess] = useState(false);

  // check what courses are in the db to populate list of courses

  const getCourseData = async () => {
    const result = await fetch("/projects/read_course", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const json = await result.json();
    setCourseData(json);
  };

  // check which authors are in the db to populate list of authors

  const getAuthorData = async () => {
    const result = await fetch("/users/authors", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const json = await result.json();
    setAuthorData(
      json.map((item) => ({
        id: item.id,
        name: `${item.first_name} ${item.last_name}`,
      }))
    );
  };

  // function to submit project form

  const submitProject = async (event) => {
    event.preventDefault();
    // console.log(
    //   JSON.stringify({
    //     project_name: projectName,
    //     course_id: courseId.id,
    //     description: description,
    //     authors: authors.map((item) => item.id),
    //     link: link,
    //   })
    // );
    // setSuccess(true);
    // setSuccessMsg("Added Project");
    // setProjectName("");
    // setCourseId(0);
    // setDescription("");
    // setAuthors([
    //   {
    //     id: authState.userId,
    //     name: `${authState.first_name} ${authState.last_name}`,
    //   },
    // ]);
    // setLink("");
    try {
      const response = await fetch("/projects/add_project", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          project_name: projectName,
          course_id: courseId.id,
          description: description,
          authors: authors.map((item) => item.id),
          link: link,
        }),
      });
      const projectAdd = await response.json();
      if (projectAdd[0]?.project_id) {
        setSuccess(true);
        setSuccessMsg("Added Project");
        setProjectName("");
        setCourseId(0);
        setDescription("");
        setAuthors([
          {
            id: authState.userId,
            name: `${authState.first_name} ${authState.last_name}`,
          },
        ]);
        setLink("");
        setProjectId(projectAdd[0].project_id);
        successRef.current.focus();
      } else if (projectAdd?.error) throw projectAdd.error;
    } catch (error) {
      // console.log("error");
      setErrMsg(error);
      errRef.current.focus();
    }
  };

  // function to add image data to the db using fileInfo from Uploadcare

  const uploadFiles = async () => {
    const data = new FormData();
    data.append("project_id", projectId);
    if (files.length > 3) {
      alert("too many files");
    } else {
      for (const item of files) {
        data.append("images", item);
      }
      const response = await fetch("/projects/add_images", {
        method: "POST",
        body: data,
      });
      const json = await response.json();
      if (!!json.message) {
        setSuccess(true);
        setSuccessMsg("Added Image Files");
        successRef.current.focus();
      }
    }
  };

  useEffect(() => {
    getCourseData();
    getAuthorData();
  }, []);

  useEffect(() => {
    projectId !== "" ? setValidProjectId(true) : setValidProjectId(false);
  }, [projectId]);

  useEffect(() => {
    link !== ""
      ? setValidProjectLink(LINK_REGEX.test(link))
      : setValidProjectLink("");
  }, [link]);

  if (courseData.length > 0 && authorData.length > 0) {
    return (
      <>
        <div>
          <div className={styles.bigDaddy2}>
            <div className={styles.FormContainer}>
              {success ? (
                <p
                  ref={successRef}
                  className={successMsg ? "errMsgPrj" : "offscreen"}
                  aria-live="assertive"
                >
                  {successMsg}
                </p>
              ) : (
                <p
                  ref={errRef}
                  className={errMsg ? "errMsgPrj" : "offscreen"}
                  aria-live="assertive"
                >
                  {errMsg}
                </p>
              )}
              <form onSubmit={submitProject} className={styles.ActiveForm}>
                <h1 className={styles.title}>Add A Project</h1>
                <label htmlFor="project_name">Project Name</label>
                <input
                  type={"text"}
                  id="project_name"
                  placeholder="Project Name"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                />
                <label htmlFor="course_id">Course</label>
                {courseData?.length > 0 ? (
                  <div style={{ width: "200px" }}>
                    <Dropdown
                      options={courseData}
                      id="id"
                      label="name"
                      userPrompt="Select Course..."
                      value={courseId}
                      onChange={(val) => {
                        setCourseId(val);
                      }}
                    />
                  </div>
                ) : null}
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  placeholder="Description"
                  value={description}
                  rows="4"
                  cols="50"
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
                <label htmlFor="add_author">Additional Author</label>
                <div className={styles.authorSelectContainer}>
                  {authorData?.length > 0 ? (
                    <div style={{ width: "200px" }}>
                      <Dropdown
                        options={authorData}
                        id="id"
                        label="name"
                        userPrompt="Select Author..."
                        value={authors}
                        onChange={(val) => {
                          !!val?.id
                            ? setAuthors((prev) => [
                                ...prev,
                                { id: val.id, name: val.name },
                              ])
                            : setAuthors((prev) => [...prev]);
                        }}
                      />
                    </div>
                  ) : null}
                  <div className={styles.authorsList}>
                    {authors.map((item, index) => (
                      <p className={styles.authorName} key={index}>
                        {item.name}
                        {index > 0 ? (
                          <FontAwesomeIcon
                            icon={faTimes}
                            className="invalid"
                            onClick={() => {
                              setAuthors((prev) => [
                                ...prev.slice(0, index),
                                ...prev.slice(index + 1),
                              ]);
                            }}
                          />
                        ) : null}
                      </p>
                    ))}
                  </div>
                </div>
                <label htmlFor="project_link">
                  Project Link{" "}
                  <FontAwesomeIcon
                    icon={faCheck}
                    className={validProjectLink ? "valid" : "hide"}
                  />
                  <FontAwesomeIcon
                    icon={faTimes}
                    className={validProjectLink || !link ? "hide" : "invalid"}
                  />
                </label>
                <input
                  type={"text"}
                  id="project_link"
                  placeholder="Project Link"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                />

                <div className="btnContainer">
                  <button type="submit" className={` btn ${styles.submitPrj}`}>
                    Submit
                  </button>
                </div>
              </form>
            </div>
            {!!validProjectId ? (
              <div className={styles.fileUploadBtnContainer}>
                <label htmlFor="addImages">
                  <button
                    className="btn"
                    component="span"
                    onClick={() => filesRef.current.click()}
                  >
                    <span>Select Images</span>
                  </button>
                </label>
                <input
                  ref={filesRef}
                  accept=".jpg, .jpeg, .png, .gif"
                  style={{ display: "none" }}
                  id="addImages"
                  multiple
                  type="file"
                  onChange={(e) => {
                    setFiles(e.target.files);
                  }}
                />
                <button onClick={uploadFiles}>Upload Files</button>
              </div>
            ) : null}
          </div>
        </div>
      </>
    );
  } else {
    return <div>Loading</div>;
  }
}

export default ProjectForm;
