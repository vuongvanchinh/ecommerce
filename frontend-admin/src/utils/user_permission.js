// import axiosClient from "./api/axiosClient";

import userApi from "./api/userApi";

const check_token = () => {
    let jwt = localStorage.getItem('jwt');
    console.log(jwt)
    if (!jwt) {
        console.log("no jwt", jwt)
        return false;
    }
    userApi.getInfo().then((res) =>{
    console.log(res)
    if (res.status === 200) {
        console.log(res.status)
        localStorage.setItem('user_current', JSON.stringify(res.data))
        return true
    }
   }) 
   
   return false
}

export default check_token;
