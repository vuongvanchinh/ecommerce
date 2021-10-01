import React, { useEffect } from "react";

import "./textfield.css";
import { uuid } from "../../../utils/uuid";

const TextField = (props) => {
  let {
    type,
    value,
    onChange,
    placeholder,
    id,
    name,
    variant,
    errors,
    required,
    ...rest
  } = props;
  if (!id) {
    id = `text-field-${uuid(5)}`;
  }
  if (!name) {
    name = uuid(5);
  }
  if (!variant) {
    variant = "outline";
  }
  if (errors === undefined) {
    errors = [];
  }
  if (value === null) {
    value = "";
  }

  useEffect(() => {
    if (errors.length !== 0) {
      document.getElementById(id).focus();
    }
  }, [errors, id]);

  return (
    <div>
      <div className="text-field">
        <input
          type={type}
          className={`text-field__input text-field__${variant} ${
            errors.length !== 0 ? "error-border" : ""
          }`}
          onChange={(e) => onChange({ name: name, value: e.target.value })}
          placeholder=" "
          autoComplete="off"
          id={id}
          name={name}
          style={rest}
          value={value}
          required={required}
        />
        <label
          htmlFor={id}
          className={`text-field__label ${
            errors.length !== 0 ? "error-message" : ""
          }`}
        >
          {placeholder}
        </label>
      </div>
      {errors.length !== 0
        ? errors.map((error, index) => (
            <p key={index} className="error-message">
              {error}
            </p>
          ))
        : null}
    </div>
  );
};
TextField.defaultProps = {
  required: false,
};
export default TextField;
