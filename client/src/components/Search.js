import { useState } from "react";
import SearchAuthors from "./SearchAuthors";
import SearchProjects from "./SearchProjects";
import styles from "../styles/Search.module.css";

function Search() {
  const [searchField, setSearchField] = useState("");

  return (
    <>
      <div className={styles.bigDaddy}>
        <div className={styles.ListContainer}>
          <h1 className={styles.listHeader}>Search</h1>
          <div className={styles.btnContainer}>
            <label className={styles.lblSearch} htmlFor="projects">
              <input
                className={styles.inpSearch}
                type={"radio"}
                id="projects"
                name="search_field"
                value={"project"}
                onChange={(e) => {
                  setSearchField(e.target.value);
                }}
              />
              <span className={styles.lblSpan}>Project Name</span>
            </label>

            <label className={styles.lblSearch} htmlFor="authors">
              <input
                className={styles.inpSearch}
                type={"radio"}
                id="authors"
                name="search_field"
                value={"author"}
                onChange={(e) => {
                  setSearchField(e.target.value);
                }}
              />
              <span className={styles.lblSpan}> Author Name</span>
            </label>
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
