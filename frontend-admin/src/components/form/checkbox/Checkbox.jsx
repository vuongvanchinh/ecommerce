import React from 'react'

import { uuid } from '../../../utils/uuid';

import './checkbox.css'

const Checkbox = (props) => {
    let { name, id, label, onChange, checked} = props;
    
    if (id === undefined) {
        id = `checkbox_${uuid(5)}`
    }
    if(!name) {
        name=id
    }
    return (
        <label className="checkbox" htmlFor={id}>
            <input onChange={() => onChange({name: name, value:!checked})} 
                type="checkbox" name={name} id={id}
                checked={checked}
            />
            <span className="checkbox-checkmark-wrap">
                <span className="checkbox-checkmark"></span>
            </span>
            <span className="checkbox-label">{ label}</span>
        </label>
    )
}
Checkbox.defaultProps = {
    checked: false
}
export default Checkbox
