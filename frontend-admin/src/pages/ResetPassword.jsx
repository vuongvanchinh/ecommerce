import React, { useState } from "react";
import { useDispatch } from "react-redux";

import { Link, Redirect, useLocation, useHistory } from "react-router-dom";

import logo from "../assets/images/second_logo.png";

import TextField from "../components/form/textfield/TextField";
import Button from "../components/button/Button";

import "../pages/css/login.css";

import userApi from "../utils/api/userApi";

const validate = (data) => data && data.email !== "" && data.password !== "";

const ResetPassword = (props) => {
  let history = useHistory()
  const [data, setData] = useState({
    email: "",
    code: "",
    new_password: "",
    new_password_confirm: "",
  });
  const [step, setStep] = useState(0);
  const [error, setError] = useState('')
  const [message, setMessage] = useState('We gona send a code 6 character to your email.')
  //0: enter email, 1: enter code, 2: enter new password
  // let data = {email:"", password: ""}
  // const location = useLocation();
  const handleChange = (dt) => {
    let {name, value} = dt;
    if (name === 'code') {
      value = value.substring(0, 6).trim();
    }
    setData({
      ...data,
      [name]: value      
    })
  };

  const validate = (data) =>{
    if (data.new_password && data.new_password_confirm && data.new_password !== data.new_password_confirm) {
      setError('password and password confirm do not match.')
      return false;
    }
    return true;
  } 
  const onSubmit = (e) => {
    e.preventDefault();

    const reset = async (data) => {
      try {
        const res = await userApi.resetPassword(data);
        if (res.status === 200) {
          let t = step + 1;
          setStep(t)
          setError('')
          setMessage(res.data.message)
          if (t > 2) {
            alert(res.data.message)
            history.push('/login')
          }
        } else if (res.status === 400) {
          setError(res.data.message)
        }
      } catch (e) {
        console.log("Error", e);
      }
    };
    if (validate(data)) {
      reset(data);
    }
  };

  // console.log('cookie', document.cookie)

  return (
    <div className="login__page row">
      <div className="col-md-0 col-3 sidebar__login"></div>
      <div className="col-md-12 col-9 full-height absolute-center">
        <form className="login-form" onSubmit={onSubmit}>
          <div className="login-form__header">
            <img src={logo} alt="" />
          </div>
          <p className="error-message">{error}</p>
          <div className="login-form__body">
            {step === 0? (
              <>
                <TextField
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Your register email"
                  onChange={handleChange}
                  value={data.email}
                />
              </>
            ):[
              step === 1? (
                <TextField
                  key={3}
                  type="text"
                  id="code"
                  name="code"
                  placeholder="Code"
                  onChange={handleChange}
                  value={data.code}
                />
              ): (
                <>
                  <TextField
                    key={0}
                    type="text"
                    id="code"
                    name="new_password"
                    placeholder="new password"
                    onChange={handleChange}
                    value={data.new_password}
                  />
                   <TextField
                    key={1}
                    type="text"
                    id="new_password_confirm"
                    name="new_password_confirm"
                    placeholder="new password confirm"
                    onChange={handleChange}
                    value={data.new_password_confirm}
                  />
                </>
              )
             
            ]} 
          </div>
          <div className="login-form__footer">
            <div>
              {message}
            </div>
            <Button type="submit">
                {step < 2 ? "Send": "Reset password"}
            </Button>
          </div>
          {/* <div className="login-form__footer">
            <p>
              You forgot password?{" "}
              <Link to="/reset-password">Reset password</Link>
            </p>
          </div> */}
        </form>
      </div>
    </div>
  );
};
export default ResetPassword;
