import React from "react";
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Generic input to be used with props

function Input({
  type,
  name,
  elementRef,
  placeholder,
  value,
  inputChange,
  blurChange,
  focusChange,
  validData,
  dataValue,
}) {
  return (
    <div>
      <label htmlFor={name}>
        {placeholder}
        <FontAwesomeIcon
          icon={faCheck}
          className={validData ? "valid" : "hide"}
        />
        <FontAwesomeIcon
          icon={faTimes}
          className={validData || !dataValue ? "hide" : "invalid"}
        />
      </label>
      <input
        type={type}
        name={name}
        ref={elementRef}
        placeholder={placeholder}
        value={value}
        onChange={inputChange}
        onBlur={blurChange}
        onFocus={focusChange}
      />
    </div>
  );
}

export default Input;
