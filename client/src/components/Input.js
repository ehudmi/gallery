import React from "react";

function Input({ type, name, placeholder, value, inputChange }) {
  return (
    <div>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={inputChange}
      />
      <label htmlFor={name}>{placeholder}</label>
    </div>
  );
}

export default Input;
