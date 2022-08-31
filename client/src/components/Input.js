import React from "react";

function Input(props) {
  return (
    <div>
      <input
        type={props.type}
        name={props.name}
        placeholder={props.placeholder}
        value={props.value}
        onChange={props.inputChange}
      />
      <label htmlFor={props.name}>{props.placeholder}</label>
    </div>
  );
}

export default Input;
