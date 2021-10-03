import React, {useMemo} from 'react'
import { NavLink } from 'react-router-dom'
import './sidebar.css'
import sidebar_items from '../../assets/JsonData/sidebar_routes.json'

import logo from '../../assets/images/second_logo.png'

const SidebarItem = (props) => {
    const active = props.active ? 'active' : ''
    
    return (
        <div className="sidebar__item">
            <div className={`sidebar__item-inner ${active}`}>
                <i className={props.icon}></i>
                <span className="sidebar__item_name">{ props.title }</span>
            </div>
        </div>
    )
}

const Sidebar = (props) => {
    // console.log(props)
    const activeItem = useMemo(() => {
        if (props.location.pathname === sidebar_items[0].route) {
            return 0;
        }
        for (let i = 1; i < sidebar_items.length; i++) {
            if (props.location.pathname.includes(sidebar_items[i].route)) {
                return i
            }
        }
        return -1
    }, [props.location.pathname])

    console.log(props.location.pathname)
    return (
        <div className="sidebar">
           <div className="sidebar__logo">
                <img src={logo} alt="company logo" />
            </div>
            {
                sidebar_items.map((item, index) => (
                    <NavLink to={item.route} key={index}>
                        <SidebarItem 
                            title={ item.display_name}
                            icon={ item.icon}
                            active={ index === activeItem}
                        />
                    </NavLink>
                ))
            } 

        </div>
    )
}

export default Sidebar
