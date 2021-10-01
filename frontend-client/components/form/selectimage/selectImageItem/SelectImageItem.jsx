import React, { useState, useRef } from 'react'
import './selectimageitem.css'
import {uuid} from '../../../../utils/uuid'
import Loader from '../../../loader/Loader'

const SelectImageItem = (props) => {
    const file_ref = useRef(null)

    let { name, id, image, variant, onChange, type, viewOnly } = props
   
    if(!name) {
        name= 'select__image__item' + id
    }
    let label = 'ORTHER...'
    if(!image) {
        label = 'UPLOAD'
    }
   

    const handleChange = (e) => {
        if (file_ref && file_ref.current && file_ref.current.files) {
            let file = file_ref.current.files[0];
            if (file.type.startsWith('image')) {
                let reader = new FileReader();
                let url = reader.readAsDataURL(file);
                reader.onloadend = (event) => {
                    onChange({name:name, value:reader.result})
                }
                // onChange({name: name, value: url})
            } else alert("Use only image format!");
        }
    }
    return (
        <div className={`select__image__item select__image__item-${variant} select__image__item-${type}`}>
            {image? <img src={ image } alt=""/>:""}
            {
                !viewOnly? (
                    <>
                        <div className={`select__image__item__input ${image ? "select__image__item__blur__background":""}`}>
                            <input ref={file_ref} type="file" name={name} id={id}  onChange={handleChange}/>
                            <label htmlFor={id}>{ label }</label>
                        </div>
                        {image? (
                            <i className='bx bx-x select__image__item-close-icon' onClick={() => onChange({name:name, value:null})}></i>
                        ):null}
                    </>
                ): null
            }
            
        </div>

    )
}

export default SelectImageItem
SelectImageItem.defaultProps = {
    viewOnly: false,
    id: uuid(6),
    variant: "medium",
    type: "square"

}