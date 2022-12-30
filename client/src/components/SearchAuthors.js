import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Dropdown from "./Dropdown";
import styles from "../styles/ListContainer.module.css";

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
            <div className={styles.ListContainer}>
              <p
                ref={errRef}
                className={errMsg ? "errMsgPrj" : "offscreen"}
                aria-live="assertive"
              >
                {errMsg}
              </p>
              {/* <form className={styles.ActiveForm}> */}
              <h1 className={styles.listHeader}>Search Authors</h1>
              <label htmlFor="author_name">Author Name</label>
              <div className={styles.searchContainer}>
                <div style={{ width: "200px" }}>
                  <Dropdown
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
                  onClick={() => {
                    sessionStorage.setItem("author_id", selectedAuthor.id);
                    return navigate("/author_projects");
                  }}
                >
                  Take me to the author
                </button>
              </div>
              <div>
                <label htmlFor="search_term">Search about</label>
                <input
                  type={"text"}
                  id="search_term"
                  name="search_term"
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                  }}
                />
                <button
                  onClick={handleSearch}
                  className={` btn ${styles.submitPrj}`}
                >
                  Search
                </button>
              </div>
              {/* </form> */}
            </div>
          </div>
          {searchData !== undefined ? (
            <div>
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
