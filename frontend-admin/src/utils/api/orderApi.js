import axiosClient from "./axiosClient";

const orderApi = {
    getListOrder: (params) => {
        const  url = 'order'
        return axiosClient.get(url, {params})
    },
    addOrder: (data) => {
        const url = 'order/'
        return axiosClient.post(url, data)
    },
    updateOrder: (data) => {
        const url = `order/${data.id}/`
        return axiosClient.put(url, data)
    }, 
    deleteOrder: (id) => {
        const url = `order/${id}/`
        return axiosClient.delete(url)
    },
    
    changeStatus: (id, data) => {
        const url = `order/${id}/change_status/`
        return axiosClient.post(url, data)
    }
}

export default orderApi;