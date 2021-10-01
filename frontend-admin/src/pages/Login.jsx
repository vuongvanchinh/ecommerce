import React,{ useState } from 'react'
import { useSelector, useDispatch } from "react-redux";

import { Link, Redirect, useLocation } from "react-router-dom";
import TextField from "../components/form/textfield/TextField";
import Button from "../components/button/Button";

import { onChange } from "../redux/features/user_login";

import "../pages/css/login.css";

import userApi from '../utils/api/userApi'
const logo = '/second_logo.png'
const validate = (data) => data && data.email !== "" && data.password !== "";

const Login = (props) => {
  
  const data = useSelector((state) => state.user_login);
  // let data = {email:"", password: ""}
  const location = useLocation()
  let [redirect, setRedirect] = useState(false)

  
  const dispatch = useDispatch();
  const handleChange = (dt) => {
    dispatch(onChange(dt));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    
    const login = async (data) => {
      try {
        const res = await userApi.login(data)
        if(res.status === 200) {
          localStorage.setItem('jwt', res.data.jwt)
          handleChange({name:"user_logedin", value: res.data.user_logedin})
          setRedirect(true)
        }
      } catch(e) {
        console.log("Error", e)
      }
    }
    login({email:data.email, password: data.password})
  };

  if (redirect){
    let url = new URLSearchParams(location.search).get('next')
    if (url == null) {
      url = '/dashboard'
    }
    return <Redirect to={ url }/>
  }
  // console.log('cookie', document.cookie)

  return (
    <div className="login__page row">
      <div className="col-md-0 col-3 sidebar__login"></div>
      <div className="col-md-12 col-9 full-height absolute-center">
        <form className="login-form" onSubmit={onSubmit}>
          <div className="login-form__header">
            <img src={logo} alt="" />
          </div>
          <div className="login-form__body">
            <TextField
              type="email"
              id="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              value={data.email}
            />
            <TextField
              type="password"
              id="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              value={data.password}
            />
          </div>
          <div className="login-form__footer">
            <div></div>
            <Button type="submit" disabled={!validate(data)}>
              Login...
            </Button>
          </div>
          <div className="login-form__footer">
            <p>
              You forgot password?{" "}
              <Link to="/reset_password">Reset password</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
export default Login;
