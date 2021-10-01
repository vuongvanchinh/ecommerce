import React, { useEffect} from 'react'
import { uuid } from '../../../utils/uuid'
import './text-editor.css'


const TextEditor = (props) => {
    let {content, name, id, placeholder, onChange} = props
    if (!id) {
        id = uuid(5)
    }
    if (!name) {
        name ="text-editor" + id
    } 
    if(content === null) {
        content = ""
    }   
    const textareaAdjust = (id, key) => {
        let el = document.getElementById(id);
        el.style.height = "1px";
        if(key.keyCode === 8) {
            el.value = el.value.trim('\n'); 
        }
        let offset = 0;
        if (key.keyCode === 13) {
            offset=23
        }
        let contentHeight = el.scrollHeight;
        el.style.height = (contentHeight +23 + offset) + "px";
       
    }

    useEffect(() => {
        let el = document.getElementById(id);
        el.style.height = "1px";
        let contentHeight = el.scrollHeight;
        el.style.height = (contentHeight +23) + "px";
        return () => {
           
        }
    }, [id])

    return (
        <div className={`text-editor`}>
            <div className="text-editor__content">
                <textarea 
                    onKeyDown={(key) =>textareaAdjust(id, key)} 
                    className="text-editor__content-textarea" name={name} id={id} placeholder=" " 
                    onChange={(e) => onChange({name:name, value: e.target.value})}
                    value={content}
                    >
                   
                </textarea>
                <label htmlFor={id} className="text-editor__label">{ placeholder }</label>
            </div>
            
        </div>
    )
}

TextEditor.defaultProps = {
    content:""
}
export default TextEditor

