import React from 'react'
import { Redirect} from 'react-router-dom'

const Logout = () => {

    localStorage.removeItem('jwt')
    localStorage.removeItem('user_current')

    return (
       <Redirect to='/'/>
    )
}

export default Logout
