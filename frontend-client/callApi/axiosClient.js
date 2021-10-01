import axios from "axios"

import querystring from 'query-string'

const axiosClient = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/', 
    headers: {
        'content-Type': 'application/json',
        "Authorization": "Bearer "
    },
    // withCredentials: true,
    paramsSerializer: params => querystring.stringify(params),
})

// Add a request interceptor
axiosClient.interceptors.request.use(function (config) {
    const token = localStorage.getItem('jwt')
    if (token) {
        config.headers.Authorization =  "Bearer "  + token
    }
    return config
})

axiosClient.interceptors.response.use((response) => {
    // if ( response && response.data) {
    //     return response.data
    // }
    return response
}, (error) => {
    // handleError
    
    if(error.response) {
        console.log("Error reponse")
        return error.response
    }
})

export default axiosClient
