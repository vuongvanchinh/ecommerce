import React from 'react'
import { NavLink } from 'react-router-dom'
import './sidebar.css'
// import logo from '/public/second_logo.png'
import sidebar_items from '../../assets/JsonData/sidebar_routes.json'

const SidebarItem = (props) => {
    const active = props.active ? 'active' : ''
    
    return (
        <div className="sidebar__item">
            <div className={`sidebar__item-inner ${active}`}>
                <i className={props.icon}></i>
                <span>{ props.title }</span>
            </div>
        </div>
    )
}

const Sidebar = (props) => {
    // console.log(props)
    const activeItem = sidebar_items.findIndex(item => (item.route === props.location.pathname))
    
    return (
        <div className="sidebar">
           <div className="sidebar__logo">
                <img src='/second_logo.png' alt="company logo" />
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
