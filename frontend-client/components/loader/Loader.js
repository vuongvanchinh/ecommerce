import React from 'react'
import  st from './Loader.module.css'

const Loader = ({ variant, style }) => {
    variant = variant ? variant:"small"
    return (
        <div style={style} className={`${st.loader} ${st[variant]}`}>
        </div>
    )
}
export default Loader
