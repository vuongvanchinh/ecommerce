import axiosClient from "./axiosClient";
const base = 'product-admin'

const productApi = {
    getListProduct: (params) => {
        const  url = base
        return axiosClient.get(url, {params})
    },
    addProduct: (data) => {
        const url = `${base}/`
        return axiosClient.post(url, data)
    },
    updateProduct: (data) => {
        const url = `${base}/${data.id}/`
        return axiosClient.put(url, data)
    }, 
    deleteProduct: (id) => {
        const url = `${base}/${id}/`
        return axiosClient.delete(url)
    }
}

export default productApi;