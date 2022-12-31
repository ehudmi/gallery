import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Dropdown from "./Dropdown";
import styles from "../styles/Search.module.css";

function SearchProjects() {
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [searchData, setSearchData] = useState();

  const errRef = useRef();
  const [errMsg, setErrMsg] = useState("");

  const navigate = useNavigate();

  // get list of projects from DB

  const getProjects = async () => {
    try {
      const response = await fetch("/projects/full_project_list", {
        method: "GET",
      });
      const json = await response.json();
      setData(
        json.map((item) => ({
          id: item.id,
          name: item.project_name,
          link: item.link,
          description: item.description,
        }))
      );
    } catch (error) {
      setErrMsg(error);
      errRef.current.focus();
    }
  };

  const handleSearch = () => {
    setSearchData(
      data
        .filter((item) => {
          return item.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        })
        .map((item) => ({
          id: item.id,
          name: item.name,
          description: item.description,
        }))
    );
  };

  useEffect(() => {
    getProjects();
  }, []);

  if (data.length > 0) {
    return (
      <>
        <div className={styles.motherContainer}>
          <div className={styles.bigDaddy}>
            <div className={styles.ListContainer}>
              <p
                ref={errRef}
                className={errMsg ? "errMsgPrj" : "offscreen"}
                aria-live="assertive"
              >
                {errMsg}
              </p>
              {/* <div className={styles.ActiveForm}> */}
              <h1 className={styles.listHeader}>Search Projects</h1>
              <div className={styles.searchContainer}>
                <label className={styles.lblSearchAbout} htmlFor="project_name">
                  Project Name
                </label>
                <div style={{ width: "283px" }}>
                  <Dropdown
                    className={styles.inpSearchAbout}
                    options={data.map((item) => ({
                      id: item.id,
                      name: item.name,
                    }))}
                    id="id"
                    label="name"
                    userPrompt="Select Project..."
                    value={selectedProject}
                    onChange={(val) => {
                      setSelectedProject(val);
                    }}
                  />
                </div>
                <button
                  className={` btn ${styles.submitPrj} ${styles.searchBtn}`}
                  onClick={() => {
                    sessionStorage.setItem("project_id", selectedProject.id);
                    return navigate("/project_details");
                  }}
                >
                  To Project
                </button>
              </div>
              <div className={styles.searchAboutContainer}>
                <label className={styles.lblSearchAbout} htmlFor="search_term">
                  Pj Description
                </label>
                <input
                  className={styles.inpSearchAbout}
                  type={"text"}
                  id="search_term"
                  name="search_term"
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                  }}
                />
                <button
                  onClick={handleSearch}
                  className={` btn ${styles.submitPrj} ${styles.searchBtn}`}
                >
                  Search
                </button>
              </div>
            </div>
          </div>
          {searchData !== undefined ? (
            <div className={styles.mapContainer}>
              {searchData.map((item, index) => {
                return (
                  <div className={styles.itemBigDaddy} key={index}>
                    <h3
                      className={styles.listItem}
                      onClick={() => {
                        sessionStorage.setItem("project_id", item.id);
                        return navigate("/project_details");
                      }}
                    >
                      {item.id} {item.name} {item.description}
                    </h3>
                  </div>
                );
              })}
            </div>
          ) : null}
        </div>
      </>
    );
  } else {
    return <div>Loading</div>;
  }
}

export default SearchProjects;
