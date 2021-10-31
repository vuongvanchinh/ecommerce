import axiosClient from "./axiosClient";
const base = 'order/shipping-method'

const shippingMethodApi = {
    getListShippingMethod: (params) => {
        const  url = `${base}?mode=full`
        return axiosClient.get(url, {params})
    },
    addShippingMethod: (data) => {
        const url = `${base}/`
        return axiosClient.post(url, data)
    },
    updateShippingMethod: (data) => {
        const url = `${base}/${data.id}/`
        return axiosClient.put(url, data)
    }, 
    deleteShippingMethod: (id) => {
        const url = `${base}/${id}/`
        return axiosClient.delete(url)
    }
}

export default shippingMethodApi;