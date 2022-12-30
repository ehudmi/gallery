import { useState } from "react";
import SearchAuthors from "./SearchAuthors";
import SearchProjects from "./SearchProjects";
import styles from "../styles/ListContainer.module.css";

function Search() {
  const [searchField, setSearchField] = useState("");

  return (
    <>
      <div className={styles.bigDaddy}>
        <div className={styles.ListContainer}>
          <h1 className={styles.listHeader}>search</h1>
          <div className={styles.btnContainer}>
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
          </div>
        </div>
      </div>
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
    </>
  );
}

export default Search;
