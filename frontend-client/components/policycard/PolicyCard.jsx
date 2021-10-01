import React from 'react'
import st from './PolicyCard.module.css'
const PolicyCard = ({icon, name, description}) => {
    return (
        <div className={st.policy_card}>
            <i className={`${icon} ${st.icon}`}></i>
            <div className={st.content}>
                <p className={st.name}>
                {name}
                </p>
                <p className={st.description}>{description}</p>
            </div>
        </div>
    )
}


export default PolicyCard
