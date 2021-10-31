import React from "react";
import { Link } from 'react-router-dom';

import "./topnav.css";

import Dropdown from '../dropdown/Dropdown';
import default_avatar from '../../assets/images/default_avatar.png';
import user_menu from '../../assets/JsonData/user_menus.json';
import notifications from '../../assets/JsonData/notification.json';




const renderUserToggle = (user) => (
  <div className="topnav__right-user">
    <div className="topnav__right-user__image">
      <img src={user && user.avatar? user.avatar: default_avatar } alt="" />
    </div>
    <div className="topnav__right-user__name">
      { user.username}
    </div>
  </div>
)

const renderUserMenus = (item, index) => (
  <Link to={item.to}>
    <div className="notification-item">
      <i className={ item.icon }></i>
      <span>{ item.content }</span>
    </div>
  </Link>
)

const renderNotificationItem = (item, index, onClick) => (
  <div className="notification-item" key={ index }>
    <i className={ item.icon }></i>
    <span>{ item.content }</span>
  </div>
)

const TopNav = () => {

  // console.log(user_menu)
  const user_current = JSON.parse(localStorage.getItem('user_logedin'))
  return <div className="topnav">
    {/* <div className="topnav__search">
      <input type="text" placeholder="Search here..."/>
      <i className="bx bx-search"></i>
    </div> */}
    <p>Hello <span style={{fontSize: "1.5rem"}}>{user_current.email}</span></p>
    <div className="topnav__right">
      <div className="topnav__right-item">
        <Dropdown 
          customToggle={() => renderUserToggle(user_current)}
          contentData = { user_menu }
          renderItems = {(item, index) => renderUserMenus(item, index)}
        />
      </div>
      <div className="topnav__right-item">
        <Dropdown 
          icon="bx bx-bell"
          badge="12"
          contentData = { notifications }
          renderItems = {(item, index) => renderNotificationItem(item, index)}
        />
      </div>
    </div>

  </div>;
};

export default TopNav;
