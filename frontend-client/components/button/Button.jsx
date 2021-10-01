import React from 'react'
import st from './Button.module.css'

const Button = (props) => {
    const {variant, type, disabled, onClick } = props;
    

    return (
        <button type={type} 
            disabled={disabled}
            className={`${st.button} ${st[variant]}`}
            onClick = {(e) => onClick(e)}
        >
            { props.children }
        </button>
    )
}

Button.defaultProps = {
    disabled: false,
    type: 'button',
    variant: 'main',
    onClick: (e) => {},
}
export default Button
