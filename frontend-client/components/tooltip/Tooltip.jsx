import React from 'react'
import st from './Tooltip.module.css'

const Tooltip = (props) => {
    const { type } = props

    return (
        <div className={`${st.tooltip} ${st[type]}`}>
            {props.children}
            <span className={st.tooltip_text}>{props.tooltip_text}</span>
        </div>
    )
}

Tooltip.defaultProps = {
    type: 'top'
}
export default Tooltip
