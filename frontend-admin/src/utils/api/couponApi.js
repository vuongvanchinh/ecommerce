import axiosClient from "./axiosClient";
const base = 'coupon'
const couponApi = {
    getListCoupon: (params) => {
        const  url = `${base}/`
        return axiosClient.get(url, {params})
    },
    addCoupon: (data) => {
        const url = `${base}/`
        return axiosClient.post(url, data)
    },
    updateCoupon: (data) => {
        const url = `${base}/${data.id}/`
        return axiosClient.put(url, data)
    }, 
    deleteCoupon: (id) => {
        const url = `${base}/${id}/`
        return axiosClient.delete(url)
    }
}

export default couponApi;