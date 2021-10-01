import axiosClient from "./axiosClient"

const cartApi = {
    get: () => {
        const url = 'cart/'
        return axiosClient.get(url)
    },
    addProduct:  (data) => {
        const url = 'cart/add_product/'
        return axiosClient.post(url, data)
    },
    validate: (data) => {
        const url = 'cart/validate/'
        return axiosClient.post(url, data)
    }
}
export default cartApi