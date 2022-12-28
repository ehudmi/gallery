import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import Dropdown from "./Dropdown";
import SearchAuthors from "./SearchAuthors";
import SearchProjects from "./SearchProjects";
import styles from "../styles/FormComponents.module.css";

function Search() {
  // const [searchTerm, setSearchTerm] = useState("");
  const [searchField, setSearchField] = useState("");
  // const [resultList, setResultList] = useState([]);

  // const navigate = useNavigate();

  // const handleSubmit = async (event) => {
  //   event.preventDefault();
  //   if (searchField === "author") {
  //     const response = await fetch("/users/search", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         search_term: searchTerm,
  //       }),
  //     });
  //     const results = await response.json();
  //     setResultList(results);
  //   } else if (searchField === "project") {
  //     const response = await fetch("/projects/search", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         search_term: searchTerm,
  //       }),
  //     });
  //     const results = await response.json();
  //     setResultList(results);
  //   }
  // };

  return (
    <div className={styles.bigDaddy2}>
      <div className={styles.FormContainer}>
        <form className={styles.ActiveForm}>
          <h1>search</h1>
          {/* <label htmlFor="search_term">Search Term</label>
          <input
            type={"text"}
            id="search_term"
            name="search_term"
            onChange={(e) => {
              setSearchTerm(e.target.value);
            }}
          /> */}
          <label htmlFor="projects">project name</label>
          <input
            type={"radio"}
            id="projects"
            name="search_field"
            value={"project"}
            onChange={(e) => {
              setSearchField(e.target.value);
            }}
          />
          <label htmlFor="authors">author name</label>
          <input
            type={"radio"}
            id="authors"
            name="search_field"
            value={"author"}
            onChange={(e) => {
              setSearchField(e.target.value);
            }}
          />
        </form>
        {(() => {
          switch (searchField) {
            case "project":
              return <SearchProjects />;
            case "author":
              return <SearchAuthors />;
            default:
              return null;
          }
        })()}
      </div>
    </div>
  );
}

export default Search;
