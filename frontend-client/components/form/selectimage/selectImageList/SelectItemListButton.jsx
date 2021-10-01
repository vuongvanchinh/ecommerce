import React from 'react'
import './selectimagelist.css'
import { uuid } from '../../../../utils/uuid';

const SelectItemListButton = (props) => {
    let {label, id, onChange, name} = props;
    const handleChange = (e) => {
        let files = e.target.files;
        for (let i = 0; i < files.length; i++) {
            let file = files[i];
            if (file.type.startsWith('image')) {
                let reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onloadend = (event) => {
                    onChange({name: name, value: [reader.result]})
                }
                // onChange({name: name, value: url})
            } else alert("Use only image format!");
        }
        
    }

    return (
        <div className="select-image-list">
            <input type="file" id={id}
                onChange = {(e) => handleChange(e)}
                multiple
            />
            <label htmlFor={id}>{label}</label>
        </div>
    )
}

SelectItemListButton.defaultProps = {
    id: `select-list-image-${uuid(3)}`,
    label: "Upload",
    name:"select-image-list"
}

export default SelectItemListButton
