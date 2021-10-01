import axiosClient from "./axiosClient"

const base = 'product'

const productApi = {
    getAll: () => {
        const url = `${base}/`
        return axiosClient.get(url)
    },
    getBySlug: (slug) => {
        const url = `${base}/${slug}`
        return axiosClient.get(url)
    },
    getRecommend: (slug) => {
        const url = `product-recommend/${slug}`

        return axiosClient.get(url)
    }
}
export default productApi
