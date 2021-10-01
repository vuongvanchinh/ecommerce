import React from 'react'
import styles from './Button.css'

const Button = (props) => {
    let {variant, type, disabled, onClick } = props;
    
    if (variant === undefined) {
        variant = 'main'
    }
    if (type === undefined) {
        type="button"
    }
    if(disabled === undefined) {
        disabled=false
    }
    return (
        <button type={type} 
            disabled={disabled}
            className={`button button-${variant}`}
            onClick = {(e) => {
                if (onClick) {
                    return onClick()
                }
            }}
            >
            { props.children }
        </button>
    )
}
export default Button
