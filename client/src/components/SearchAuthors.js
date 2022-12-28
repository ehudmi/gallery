import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Dropdown from "./Dropdown";
import styles from "../styles/FormComponents.module.css";

function SearchAuthors() {
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState([]);
  const [authorId, setAuthorId] = useState("");
  const [searchData, setSearchData] = useState();

  const errRef = useRef();
  const [errMsg, setErrMsg] = useState("");

  const navigate = useNavigate();

  const getAuthors = async () => {
    try {
      const response = await fetch("/users/authors", {
        method: "GET",
      });
      const json = await response.json();
      setData(
        json.map((item) => ({
          id: item.id,
          name: `${item.first_name} ${item.last_name}`,
          about: item.about,
        }))
      );
    } catch (error) {
      setErrMsg(error);
      errRef.current.focus();
    }
  };

  const handleSearch = () => {
    // console.log(data);
    // console.log(
    //   data
    //     .filter((item) => {
    //       return item.about?.toLowerCase().includes(searchTerm.toLowerCase());
    //     })
    //     .map((item) => ({
    //       id: item.id,
    //       name: item.name,
    //       about: item.about,
    //     }))
    // );
    setSearchData(
      data
        .filter((item) => {
          return item.about?.toLowerCase().includes(searchTerm.toLowerCase());
        })
        .map((item) => ({
          id: item.id,
          name: item.name,
          about: item.about,
        }))
    );
  };

  useEffect(() => {
    getAuthors();
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
                <h1 className={styles.title}>Search Authors</h1>
                <label htmlFor="author_name">Author Name</label>
                <div style={{ width: "200px" }}>
                  <Dropdown
                    options={data}
                    id="id"
                    label="name"
                    userPrompt="Select Author..."
                    value={authorId}
                    onChange={(val) => {
                      setAuthorId(val);
                    }}
                  />
                </div>
                <label htmlFor="search_term">Search about</label>
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
                      sessionStorage.setItem("author_id", item.id);
                      return navigate("/author_projects");
                    }}
                  >
                    {item.id} {item.name} {item.about}
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

export default SearchAuthors;
