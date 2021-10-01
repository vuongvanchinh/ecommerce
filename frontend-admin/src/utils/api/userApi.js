import axiosClient from "./axiosClient";

const userApi = {
    login: (data) => {
        const url = 'login/';
        return axiosClient.post(url, data)
    },
    logout: () => {
        const url = 'logout';
        return axiosClient.get(url);
    },
    getListUser: (params) => {
        const  url = 'user/'
        return axiosClient.get(url, {params})
    },
    getInfo: () => {
        const url = 'user/info';
        return axiosClient.get(url)
    },
    addUser: (data) => {
        const url = 'user/'
        return axiosClient.post(url, data)
    },
    updateUser: (data) => {
        const url = `user/${data.id}/`
        return axiosClient.put(url, data)
    }, 
    deleteUser: (id) => {
        const url = `user/${id}/`
        return axiosClient.delete(url)
    },
    resetPassword: (data) => {
        const url = `user/reset_password/`
        return axiosClient.post(url, data)
    }
}

export default userApi;