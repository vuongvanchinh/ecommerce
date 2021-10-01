import React from 'react'
import Image from 'next/image'

import st from './CardImage.module.css'

const CardImage = (props) => {
    let {image, name, description} = props;
    return (
        <div className={st.card_image}>
            <img src={image} alt=""  draggable="false"/>
            <div className={st.info}>
                <h3 className={st.name}>{name}</h3>
                <p className={st.description}>{description}</p>
            </div>
        </div>
    )
}

export default CardImage
