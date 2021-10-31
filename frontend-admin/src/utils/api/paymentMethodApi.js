import axiosClient from "./axiosClient";
const base = 'order/payment-method'
const paymentMethodApi = {
    getListPaymentMethod: (params) => {
        const  url = `${base}?mode=full`
        return axiosClient.get(url, {params})
    },
    addPaymentMethod: (data) => {
        const url = `${base}`
        return axiosClient.post(url, data)
    },
    updatePaymentMethod: (data) => {
        const url = `${base}/${data.id}`
        return axiosClient.put(url, data)
    }, 
    deletePaymentMethod: (id) => {
        const url = `${base}/${id}/`
        return axiosClient.delete(url)
    }
}

export default paymentMethodApi;