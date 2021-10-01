import React from 'react'
import {useSelector} from 'react-redux'
import st from './NotificationButton.module.css';

const NotificationButton = ({icon, attr1, attr2}) => {
    const count = useSelector(state => {
        let s = state[attr1]
        if (attr2) {
            return s[attr2]
        }
        return s
    })

    return (
        <div className={st.noti_btn}>
            <i className={icon}></i>
            <span className={st.badge}>{count}</span>
        </div>
    )
}

export default NotificationButton
