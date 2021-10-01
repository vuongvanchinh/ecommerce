import React from "react";
import { useSelector, useDispatch } from 'react-redux';
import { Link } from "react-router-dom";
import TextField from "../form/textfield/TextField";
import TextEditor from "../form/texteditor/TextEditor";
import SelectImageItem from "../form/selectimage/selectImageItem/SelectImageItem";
import SelectField from "../form/selectfield/SelectField";
import Button from "../button/Button";

const CategoryForm = (props) => {
  let { action, data, handleChange, handleSubmit, errors } = props;
  const categories = useSelector(state => state.category_list.data)
  let categories_exclude = categories.filter(category => category.id !== data.id)
  if(categories_exclude.length > 0) {
    categories_exclude.unshift({id:'', name:"____No parent____"})
  }
  // const handleSubmit = (e) => {
  //   e.preventDefault();

  //   console.log(data);
  // };
  
  return (
    <form onSubmit={handleSubmit}>
      <div className="form-card">
        <div className="form-card__header">General Information</div>
        <div className="form-card__body">
          <TextField
            placeholder="Name"
            onChange={handleChange}
            name="name"
            id="category_name"
            value={data.name}
            errors={ errors.name }
          />
          <TextEditor
            placeholder="Discription"
            onChange={handleChange}
            name="description"
            id="category_description"
            content={data.description}
          />
        </div>
      </div>
      <div className="form-card">
        <div className="form-card__header">Background Image</div>
        <div className="form-card__body">
          <SelectImageItem
            image={data.background_image}
            name="background_image"
            id="category_background_image"
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="form-card">
        <div className="form-card__header">Seo Information</div>
        <div className="form-card__body">
          <TextField
            placeholder="slug"
            name="slug"
            id="category_slug"
            value={data.slug}
            onChange={handleChange}
            errors={ errors.slug }
          />
          <TextField
            placeholder="Seo title"
            name="seo_title"
            id="category_seo_title"
            value={data.seo_title}
            onChange={handleChange}
          />

          <TextEditor
            placeholder="Seo description"
            content={data.seo_description}
            name="seo_description"
            id="category_seo_description"
            onChange={handleChange}
            
          />
        </div>
      </div>
      <div className="form-card">
            <div className="form-card__header">Hierarchy</div>
            <div className="form-card__body">
                <SelectField 
                    name="parent"
                    id="category_parent"
                    value={data.parent}
                    value_attr="id"
                    content_attr="name"
                    options={categories_exclude}
                    onChange={handleChange}
                    label="Parent"
                />
            </div>
        </div>
      <div className="form__actions">
        <div>
          {action !== "add" ? (
            <Button
              type="button"
              variant="danger"
              onClick={() => props.handleDelete(data.id)}
            >
              Delete
            </Button>
          ) : null}
        </div>
        <div className="actions">
          <Link to="/dashboard/categories">
            <Button variant="light">Cancel</Button>
          </Link>
          <Button
            type="submit"
            //   disabled={data.email.trim() ===""}
          >
            Save
          </Button>
        </div>
      </div>
    </form>
  );
};

CategoryForm.defaultProps = {
  action: "add",
  data: {
    name: "",

  },
  errors: {

  }
};
export default CategoryForm;
