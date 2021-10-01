import React , {useEffect, useState} from "react";
import { BrowserRouter, Route, useRouteMatch, Redirect} from "react-router-dom";
import userApi from "../../utils/api/userApi";
import { useSelector, useDispatch} from 'react-redux';

import "./layoutdashboard.css";

import Sidebar from "../sidebar/Sidebar";
import TopNav from "../topnav/TopNav";
import Routes from '../Routes';
import Loader from "../loader/Loader";
// import { Switch } from 'react-router-dom';
import { onChange } from '../../redux/features/user_login'

const Layout = (props) => {
  let { path, url } = useRouteMatch();
  let dispatch = useDispatch()

  // const user_logedin = useSelector(state => state.user_login.user_logedin)

  const [loading, setLoading] = useState(true)
  const [redirect, setRedirect] = useState(false)

  const getUserData = async () => {
    try {
      let res = await userApi.getInfo()
      localStorage.setItem('user_logedin', JSON.stringify(res.data))
      if (res.data.is_staff) {
        dispatch(onChange({name:"user_logedin", value: res.data}))
        setLoading(false)
      } else {
        setRedirect(true)
      }
      
      console.log("success authenticate")
    } catch (error) {
      console.log("failed authentcate")
      setRedirect(true)     
    }
  }

  useEffect(() => {
    console.log("call effect")
    getUserData()
  }, [])

  // handle redirect to login or display loader when call api
  if (redirect) {
    return <Redirect to='/login'/>
  }
  if(loading) {
    return (
      <div className="full-loader">
        <Loader variant="large"/>
      </div>
    )
  }
  
  return (
     <div className={`layout ${''}`}>
     <Sidebar {...props}/>
     <div className="layout__content">
       <TopNav />
       <div className="layout__content-main">
         <Routes path={ path }/>
       </div>
     </div>
   </div>
  );
};

export default Layout;
