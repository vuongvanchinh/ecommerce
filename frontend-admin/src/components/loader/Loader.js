import React from 'react'

import './loader.css'
const Loader = ({ variant, style }) => {
    variant = variant ? variant:"small"
    return (
        <div style={style} className={`loader loader-${variant}`}>
            
        </div>
    )
}
export default Loader
