import React, {useState} from "react"
import TextField from "../form/textfield/TextField"
import Button from "../button/Button"
import {useSelector, useDispatch} from 'react-redux'
import st from './LoginForm.module.css'
import Link from 'next/link'
import userApi from "../../callApi/userApi"
import { resetPasswordPage } from "../../utils/urls"
import { setNewUser } from "../../redux/features/user"
import {useRouter} from 'next/router'

const logo = "/second_logo.png"

const validate = (data) => {
    let res = {}
    if(data.email === '') {
      res.email = ['Email must be fill out']
    }

    if(data.password === '') {
      res.password = ['Password must be fill out']
    } 
    
    
    return res
}

const initialState = {
    email: '',
    password: '',
    errors:{

    }
}

const LoginForm = (props) => {
    const [data, setData] = useState(initialState)
    const dispatch = useDispatch()
    const router = useRouter()
    const {redirect_url} =props;
    const onSubmit = (e) => {
        e.preventDefault()
        let errs = validate(data)
        setData({
            ...data,
            errors: errs
        })

        if(Object.keys(data.errors).length === 0) {
            ;(async () => {
                try {
                    let res = await userApi.login(data)
                    console.log(res)
                    if (res.status === 200) {
                        localStorage.setItem('jwt', res.data.jwt)
                        dispatch(setNewUser(res.data.user_logedin))
                        if (redirect_url) {
                            router.push(redirect_url)
                        }
                    }
                } catch (err) {

                }
            })()
        }
    }
    const handleChange = (dt) => {
        setData({
            ...data,
            [dt.name]: dt.value
        })
    }
    console.log('render login form')

    return (
        <div>
        <form className={st.login_form} onSubmit={onSubmit}>
            <div className={st.login_form_header}>
            <img src={logo} alt="" draggable={false} />
            </div>
            <div className={st.login_form_body}>
            <TextField
                type="email"
                id="email"
                name="email"
                placeholder="Email"
                onChange={handleChange}
                value={data.email}
                required={true}
                errors={data.errors.email}
            />
            <TextField
                type="password"
                id="password"
                name="password"
                placeholder="Password"
                onChange={handleChange}
                value={data.password}
                required={true}
                errors={data.errors.password}
            />
            </div>
            <div className={st.login_form_footer}>
                <div></div>
                <Button type="submit">
                    Login...
                </Button>
            </div>
            <div className={st.login_form_footer}>
            <p>
                You forgot password?{" "}
                <Link href={resetPasswordPage()}>
                <a>Reset password</a>
                </Link>
            </p>
            </div>
        </form>
        </div>
    )
}

export default LoginForm
