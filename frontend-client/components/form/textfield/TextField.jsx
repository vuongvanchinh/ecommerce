import React, {useEffect} from 'react'

import st from './Textfield.module.css'
import { uuid } from '../../../utils/uuid'

const TextField = (props) => {
    let {type, value, onChange, placeholder, id, name, 
        variant, errors, required, show_require_signal, ...rest} = props;

    if (!name) {
        name = id
    }
  
    useEffect(() => {
        if (errors.length !== 0) {
            document.getElementById(id).focus();
        }
    }, [errors, id])
    
    console.log('render textfield', name)
    
    return (
        <div>
            <div className={st['text-field']}>
            <input type={type} className={`${st['text-field__input']} ${st['text-field__'+variant]}`}
                onChange={(e) => onChange({name: name,  value:e.target.value}) }            
                placeholder=" "
                autoComplete="off"
                id={id}
                name={name}
                style={rest}    
                value={value}  
                required={required}  
     
            />
            <label htmlFor={id} className={`${st['text-field__label']}`}>{ placeholder }</label>
            {
                required && show_require_signal? (
                    <span className={st.required}>*</span>
                ):null
            }
        </div>
            {
                errors.length !== 0 ? (
                    errors.map((error, index) => (
                        <p key={index} className="error-message">{error}</p>
                    ))
                ):null
            }
        </div>

    )
}
TextField.defaultProps = {
    variant: 'outline',
    errors: [],
    value: "",
    id:`text-field-${uuid(5)}`,
    onChange: () =>{},
    required: false,
    show_require_signal: false
}
export default TextField
