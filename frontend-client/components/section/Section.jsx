import React from 'react'
import st from './Section.module.css'

const Section = (props) => {

    return (
        <div className={st.section}>
            <h4 className={st.title}>{props.title}</h4>
            {props.children}
        </div>
    )
}

export default Section
