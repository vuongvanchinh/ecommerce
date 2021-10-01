import React from 'react'

import { uuid } from '../../../utils/uuid';

import st from './Checkbox.module.css'


const Checkbox = (props) => {
    let { name, id, label, onChange, checked, checked_value, uncheck_value} = props;
    
    if (id === undefined) {
        id = `checkbox_${uuid(5)}`
    }
    if(!name) {
        name=id
    }
    console.log('render checkox', name)
    
    return (
        <label className={st.checkbox} htmlFor={id}>
            <input onChange={() => onChange({name: name, value:checked? uncheck_value: checked_value})} 
                type="checkbox" name={name} id={id}
                checked={checked}
            />
            <span className={st.checkbox_checkmark_wrap}>
                <span className={st.checkbox_checkmark}></span>
            </span>
            <span className={st.checkbox_label}>{ label}</span>
        </label>
    )
}
Checkbox.defaultProps = {
    checked: false,
    onChange: () => {},
    checked_value: true,
    uncheck_value: false
}
export default Checkbox
