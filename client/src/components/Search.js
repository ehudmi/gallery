import { useState } from "react";
import SearchAuthors from "./SearchAuthors";
import SearchProjects from "./SearchProjects";
import styles from "../styles/FormComponents.module.css";

function Search() {
  const [searchField, setSearchField] = useState("");

  return (
    <div className={styles.bigDaddy2}>
      <div className={styles.FormContainer}>
        <form className={styles.ActiveForm}>
          <h1>search</h1>
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
