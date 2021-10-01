import React from 'react'

import st from './Badge.module.css'

const Badge = (props) => {
    return (
        <span className={`${st.badge} ${st['badge_'+props.type]}`}>
            { props.content }
        </span>
    )
}


export default Badge
