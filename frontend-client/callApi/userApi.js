import axiosClient from "./axiosClient"

const userApi = {
    login: (data) => {
        const url = 'login/'
        return axiosClient.post(url, data)
    },
    getInfo: () => {
        const url = 'user/info/'
        return axiosClient.get(url)
    }
    

}

export default userApi
