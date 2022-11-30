import { useState } from "react";

function Search() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchField, setSearchField] = useState("");
  const [resultList, setResultList] = useState([]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (searchField === "author") {
      const response = await fetch("/users/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          search_term: searchTerm,
        }),
      });
      const results = await response.json();
      console.log(results);
      setResultList(results);
    } else if (searchField === "project") {
      const response = await fetch("/projects/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          search_term: searchTerm,
        }),
      });
      const results = await response.json();
      console.log(results);
      setResultList(results);
    }
  };

  return (
    <>
      <h3>search</h3>
      <form onSubmit={handleSubmit}>
        <label htmlFor="search_term">Search Term</label>
        <input
          type={"text"}
          id="search_term"
          name="search_term"
          onChange={(e) => {
            setSearchTerm(e.target.value);
          }}
        />
        <label htmlFor="project">project</label>
        <input
          type={"radio"}
          id="project"
          name="search_field"
          value={"project"}
          onChange={(e) => {
            setSearchField(e.target.value);
          }}
        />
        <label htmlFor="author">author</label>
        <input
          type={"radio"}
          id="author"
          name="search_field"
          value={"author"}
          onChange={(e) => {
            setSearchField(e.target.value);
          }}
        />
        <button>Search</button>
      </form>
      {resultList.length > 0
        ? resultList.map((item, index) => {
            return <p key={index}>{item.name}</p>;
          })
        : null}
    </>
  );
}

export default Search;
