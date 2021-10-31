import React, { useRef, useMemo } from "react";
import { uuid } from "../../../utils/uuid";
import Loader from "../../loader/Loader";
import "./selectfield.css";

const clickOutsideRef = (content_ref, toggle_ref, label_ref, back_state=null, disabled) => {
  document.addEventListener("mousedown", (e) => {
    if (disabled) {
      return 
    }
    if (toggle_ref.current && toggle_ref.current.contains(e.target)) {
      content_ref.current.classList.toggle("select-active");
      label_ref.current.classList.add("label-active");
    } else {
      if (toggle_ref.current && !toggle_ref.current.contains(e.target) && !content_ref.current.contains(e.target)) {
        content_ref.current.classList.remove("select-active");
      }

      // if (label_ref.current && !back_state) {
      //   console.log('back')
      //   label_ref.current.classList.remove("label-active");
      // }
      
    }
  });
};

const SelectField = (props) => {
  const wraper = useRef(null);
  const select_box = useRef(null);
  const label_ref = useRef(null);

  let { options, id, name, onChange, value, label, disabled, content_attr, value_attr, errors } = props;
  if (!id) {
    id = "select-field" + uuid(5);
  }

  name = name ? name : id;
 
  let selected_item = useMemo(() => {
    let res =  {
      icon: null,
      [value_attr]: null,
      [content_attr]: null,
    };
    if (options && value) {
      let selected_index = options.findIndex((item) => item[value_attr] === value)
      if (selected_index !== -1) {
        res = options[selected_index];
      }
    }
    return res;
  }, [options, value, content_attr, value_attr])
  
  clickOutsideRef(wraper, select_box, label_ref, selected_item[value_attr], disabled);
  // console.log(selected_item, options, value)
  const select = (item) => {
    wraper.current.classList.remove("select-active");
    if (item[value_attr] !== selected_item[value_attr]) {
      onChange({ name: name, value: item[value_attr]});
    }
  };

  return (
    <div className="select-field">
      <div className="select-field-select__box" ref={select_box}>
        <div>
          {selected_item.icon ? <i className={selected_item.icon}></i> : ""}
          <span>{selected_item[content_attr]}</span>
        </div>
      </div>
      <label ref={label_ref} htmlFor={id} className={`select-field__label ${!selected_item[value_attr]? "": "label-active"}`}>
        {label}
      </label>
      <div ref={wraper} className="select-field-options-wrapper">
        {options.map((item, index) => (
          <div
            key={index}
            className={`select-field-option__value ${
              item[value_attr] === selected_item[value_attr] ? "active" : ""
            }`}
            onClick={() => {select(item)}}
          >
            {item.icon ? <i className={item.icon}></i> : ""}
            <span>{item[content_attr]}</span>
          </div>
        ))}
        {
          (options.length)? "":<Loader/>
        }
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
SelectField.defaultProps = {
  value_attr:"value",
  content_attr:"content",
  options:[],
  disabled: false,
  errors: []
}
export default SelectField;
