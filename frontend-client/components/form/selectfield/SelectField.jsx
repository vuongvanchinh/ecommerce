import React, { useRef, useEffect, useMemo } from "react";
import { uuid } from "../../../utils/uuid";
import Loader from "../../loader/Loader";
import st from "./SelectField.module.css";

const SelectField = (props) => {
  const wraper = useRef(null);
  const select_box = useRef(null);
  const label_ref = useRef(null);

  let {
    options,
    id,
    name,
    onChange,
    value,
    label,
    disabled,
    content_attr,
    value_attr,
    errors,
  } = props;
  if (!id) {
    id = "select-field" + uuid(5);
  }
  name = name ? name : id;

  let selected_item = useMemo(() => {
    console.log("ca select item");
    let res = {
      icon: null,
      [value_attr]: null,
      [content_attr]: null,
    };
    if (options && value) {
      let selected_index = options.findIndex(
        (item) => item[value_attr] === value
      );
      if (selected_index !== -1) {
        res = options[selected_index];
      }
    }

    return res;
  }, [value_attr, content_attr, options, value]);

  useEffect(() => {
    const f = (e) => {
      if (select_box.current && select_box.current.contains(e.target)) {
        wraper.current.classList.toggle(st.show_options);
        label_ref.current.classList.add(st.label_active);
      } else {
        if (
          select_box.current &&
          !select_box.current.contains(e.target) &&
          !wraper.current.contains(e.target)
        ) {
          wraper.current.classList.remove(st.show_options);
        }
      }
    };

    document.addEventListener("mousedown", f);

    return () => {
      document.removeEventListener("mousedown", f);
    };
  }, []);
  // console.log(selected_item, options, value)
  const select = (item) => {
    wraper.current.classList.remove(st.show_options);
    if (item[value_attr] !== selected_item[value_attr]) {
      onChange({ name: name, value: item[value_attr] });
    }
  };

  return (
    <div>
      <div className={st.select_field}>
    
      <div className={st.select_box} ref={select_box}>
        <div>
          {selected_item.icon ? <i className={selected_item.icon}></i> : ""}
          <span>{selected_item[content_attr]}</span>
        </div>
      </div>

      <label
        ref={label_ref}
        htmlFor={id}
        className={`${st.label} ${
          !selected_item[value_attr] ? "" : st.label_active
        }`}
      >
        {label}
      </label>

      <div ref={wraper} className={st.options_wrapper}>
        {options.map((item, index) => (
          <div
            key={index}
            className={`${st.option_value} ${
              item[value_attr] === selected_item[value_attr]
                ? st.selected_option
                : ""
            }`}
            onClick={() => {
              select(item);
            }}
          >
            {item.icon ? <i className={item.icon}></i> : ""}
            <span>{item[content_attr]}</span>
          </div>
        ))}
        {options.length ? "" : <Loader />}
      </div>
     
    </div>
      {errors ? (
          <div className={st.errors}>
            {errors.map((err, index) => (
              <p className="error-message" key={index}>
                {err}
              </p>
            ))}
          </div>
        ) : null}
    </div>
  );
};
SelectField.defaultProps = {
  value_attr: "value",
  content_attr: "content",
  options: [],
  disabled: false,
  onChange: () => {},
};
export default SelectField;
