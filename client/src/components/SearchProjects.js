import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Dropdown from "./Dropdown";
import styles from "../styles/FormComponents.module.css";

function SearchProjects() {
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState([]);
  const [projectId, setProjectId] = useState("");
  const [searchData, setSearchData] = useState();

  const errRef = useRef();
  const [errMsg, setErrMsg] = useState("");

  const navigate = useNavigate();

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
    // console.log(searchTerm);
    // console.log(data.map((item) => ({ desc: item.description.toLowerCase() })));
    // console.log(
    //   data
    //     .filter((item) => {
    //       return item.description
    //         .toLowerCase()
    //         .includes(searchTerm.toLowerCase());
    //       // .indexOf(searchTerm.toLowerCase()) >
    //       // -1
    //     })
    //     .map((item) => ({
    //       id: item.id,
    //       name: item.name,
    //       description: item.description,
    //     }))
    // );
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

  //   return <div><form>
  //   <label htmlFor="search_term">Search Term</label>
  //     <input
  //       type={"text"}
  //       id="search_term"
  //       name="search_term"
  //       onChange={(e) => {
  //         setSearchTerm(e.target.value);
  //       }}
  //     />
  //   </form></div>;
  if (data.length > 0) {
    return (
      <>
        <div>
          <div className={styles.bigDaddy2}>
            <div className={styles.FormContainer}>
              <p
                ref={errRef}
                className={errMsg ? "errMsgPrj" : "offscreen"}
                aria-live="assertive"
              >
                {errMsg}
              </p>
              <form className={styles.ActiveForm}>
                <h1 className={styles.title}>Search Projects</h1>
                <label htmlFor="project_name">Project Name</label>
                <div style={{ width: "200px" }}>
                  <Dropdown
                    options={data}
                    id="id"
                    label="name"
                    userPrompt="Select Project..."
                    value={projectId}
                    onChange={(val) => {
                      setProjectId(val);
                    }}
                  />
                </div>
                <label htmlFor="search_term">Search Description</label>
                <input
                  type={"text"}
                  id="search_term"
                  name="search_term"
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                  }}
                />
                <div className="btnContainer"></div>
              </form>
              <button
                onClick={handleSearch}
                className={` btn ${styles.submitPrj}`}
              >
                Search
              </button>
            </div>
          </div>
          {searchData !== undefined ? (
            <div>
              {searchData.map((item, index) => {
                return (
                  <div
                    key={index}
                    onClick={() => {
                      sessionStorage.setItem("project_id", item.id);
                      return navigate("/project_details");
                    }}
                  >
                    {item.id} {item.name} {item.description}
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
