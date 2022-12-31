import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Dropdown from "./Dropdown";
import styles from "../styles/Search.module.css";

function SearchAuthors() {
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState([]);
  const [selectedAuthor, setSelectedAuthor] = useState("");
  const [searchData, setSearchData] = useState();

  const errRef = useRef();
  const [errMsg, setErrMsg] = useState("");

  const navigate = useNavigate();

  // get list of authors from DB

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

  if (data.length > 0) {
    return (
      <>
        <div>
          <div className={styles.bigDaddy}>
            <div className={styles.listContainer}>
              <p
                ref={errRef}
                className={errMsg ? "errMsgPrj" : "offscreen"}
                aria-live="assertive"
              >
                {errMsg}
              </p>
              {/* <form className={styles.ActiveForm}> */}
              <h1 className={styles.listHeader}>Search Authors</h1>
              <div className={styles.searchContainer}>
                <label className={styles.lblSearchAbout} htmlFor="author_name">
                  Author Name
                </label>
                <div className={styles.dropdown}>
                  <Dropdown
                    className={styles.inpSearchAbout}
                    options={data.map((item) => ({
                      id: item.id,
                      name: item.name,
                    }))}
                    id="id"
                    label="name"
                    userPrompt="Select Author..."
                    value={selectedAuthor}
                    onChange={(val) => {
                      setSelectedAuthor(val);
                    }}
                  />
                </div>
                <button
                  className={` btn ${styles.submitPrj} ${styles.searchBtn}`}
                  onClick={() => {
                    sessionStorage.setItem("author_id", selectedAuthor.id);
                    return navigate("/author_projects");
                  }}
                >
                  To Author
                </button>
              </div>
              <div className={styles.searchAboutContainer}>
                <label className={styles.lblSearchAbout} htmlFor="search_term">
                  Search about
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
              {/* </form> */}
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
                        sessionStorage.setItem("author_id", item.id);
                        return navigate("/author_projects");
                      }}
                    >
                      {item.id} {item.name} {item.about}
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

export default SearchAuthors;
