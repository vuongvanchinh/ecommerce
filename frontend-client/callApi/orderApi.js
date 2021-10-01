import axiosClient from "./axiosClient";
const base = 'order'
const orderApi = {
    getPaymentMethod: () => {
        const url = `${base}/payment-method/`
        return axiosClient.get(url)
    },
    getShippingMethod: () => {
        const url = `${base}/shipping-method/`
        return axiosClient.get(url)
    },
    create: (data) => {
        const url = `${base}/create/`
        return axiosClient.post(url, data)
    },
    getUserOrders: () => {
        const url = `${base}/your-order`
        return axiosClient.get(url)
    },
    cancel: (id) => {
        const url = `${base}/${id}/cancel`
        return axiosClient.get(url)
    }
}

export default orderApi;