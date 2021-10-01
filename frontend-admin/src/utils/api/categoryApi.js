import axiosClient from "./axiosClient";
const base = 'category'
const categoryApi = {
    getListCategory: (params) => {
        const  url = `${base}/`
        return axiosClient.get(url, {params})
    },
    addCategory: (data) => {
        const url = `${base}/`
        return axiosClient.post(url, data)
    },
    updateCategory: (data) => {
        const url = `${base}/${data.id}/`
        return axiosClient.put(url, data)
    }, 
    deleteCategory: (id) => {
        const url = `${base}/${id}/`
        return axiosClient.delete(url)
    }
}

export default categoryApi;