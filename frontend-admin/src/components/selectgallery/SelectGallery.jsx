import React, { useState } from "react";
import "./selectgallery.css";
import SelectImageItem from "../form/selectimage/selectImageItem/SelectImageItem";
import Button from "../button/Button";
const SelectGallery = (props) => {
  
  let { images, selected_items, url_attr, value_attr, exportSelectedList } = props;
  const [selected, setSelected] = useState(selected_items);
  console.log(images)
  
  const handlePick = (item) => {
    console.log("item", item)
    let index = selected.findIndex((i) => item === i);
    if (index === -1) {
      setSelected([...selected, item]);
    } else {
      let newState = [...selected];
      newState.splice(index, 1);
      setSelected(newState);
    }
  };

  const handleSave = () => {
    exportSelectedList(selected)
  };

  return (
    <div className="gallery_wraper">
      <div className="gallery">
        {images.map((img, index) => (
          <div className="img_wraper" key={index}>
            <SelectImageItem
              variant="medium"
              viewOnly={true}
              image={img[url_attr]}
            />
            <i
              className={`bx ${
                selected.includes(img[value_attr])? "bxs-checkbox-checked checkbox_icon" : "bx-checkbox"
              } checkbox_icon`}
              onClick={() => handlePick(img[value_attr])}
            ></i>
          </div>
        ))}
      </div>
      <div className="gallery_actions">
        <Button variant="light" onClick={() => props.handleCancel()}>Cancel</Button>
        <Button onClick={() => handleSave()}>Save</Button>
      </div>
    </div>
  );
};

SelectGallery.defaultProps = {
  selected_items: [],
  url_attr: "image",
  value_attr: "order",
};
export default SelectGallery;
