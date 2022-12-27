// import { useState } from "react";
import { useState, useRef, useEffect } from "react";
import styles from "../styles/Dropdown.module.css";

function Dropdown({ options, id, label, userPrompt, value, onChange }) {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState("");
  const ref = useRef(null);

  const toggle = (e) => {
    setOpen(e && e.target === ref.current);
  };

  const filterOptions = () => {
    return options.filter(
      (option) => option[label].toLowerCase().indexOf(filter.toLowerCase()) > -1
    );
  };

  const displayValue = () => {
    if (filter.length > 0) return filter;
    if (value[label]) return value[label];
    return "";
  };

  const selectOption = (item) => {
    setFilter("");
    onChange(item);
    setOpen(false);
  };

  useEffect(() => {
    document.addEventListener("click", toggle);
    return () => document.removeEventListener("click", toggle);
  }, []);

  return (
    <div className={styles.dropdown}>
      <div className={styles.control}>
        <div className={styles.selected_value}>
          <input
            type={"text"}
            ref={ref}
            placeholder={value ? value[label] : userPrompt}
            value={displayValue()}
            onChange={(e) => {
              setFilter(e.target.value);
              setOpen(true);
              onChange("");
            }}
            onClick={() => setOpen(toggle)}
          />
        </div>
        <div className={`${styles.arrow} ${open ? styles.open : null}`} />
      </div>
      <div className={`${styles.options} ${open ? styles.open : null}`}>
        {filterOptions(options).map((option) => (
          <div
            key={option[id]}
            className={`${styles.option} ${
              value === option ? styles.selected : null
            }`}
            onClick={() => {
              selectOption(option);
              // console.log(option[label]);
            }}
          >
            {option[label]}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dropdown;
