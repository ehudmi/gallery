import React from "react";

// Generic input to be used with props

function Input({ type, name, placeholder, value, inputChange, blurChange }) {
  return (
    <div>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={inputChange}
        onBlur={blurChange}
      />
      <label htmlFor={name}>{placeholder}</label>
    </div>
  );
}

export default Input;
