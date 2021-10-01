import React, {useState} from "react"
import Link from 'next/link'

// import TextField from "../components/form/textfield/TextField"
// import SelectField from "../components/form/selectfield/SelectField"
// import Button from '../components/button/Button'

import st from '../styles/Login.module.css'
import LoginForm from "../components/loginform/LoginForm"
import Head from 'next/head'

const logo = '/second_logo.png'

const Login = () => {
 
  console.log('render login page')
 
 
  return (
    <div className={st.login_page + "row"}>
      <Head>
          <title>
            Login
          </title>
      </Head>
      <div className={"col-md-0 col-3 " + st.sidebar_login}></div>
      <div className={"col-md-12 col-9 full-height " + st.absolute_center}>
        <LoginForm 
          redirect_url = '/'
        />
      </div>
    </div>
  )
}

export default Login

Login.getLayout = (page) => {
  return page
}