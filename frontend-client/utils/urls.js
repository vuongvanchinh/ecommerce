export const cartPage = () => {
    return '/cart'
}

export const productPage = (params={}) => {
    if(Object.keys(params).length !== 0) {
        let p = new URLSearchParams(params)
        return `/product?${p.toString()}`
    }
    return `/product`
}
export const productDetail = (slug) => {
    return `/product/${slug}`
}

export const checkoutPage = () => {
    return '/checkout'
}

export const loginPage = () => {
    return '/login'
}

export const resetPasswordPage = () => {
    return '/reset-password'
}

export const registerPage = () => {
    return '/register'
}

export const settingPage = () => {
    return '/setting'
}

export const categoryUrl = (slug, params={}) => {
    let p = new URLSearchParams(params)
    return `/category/${slug}?${p}`
}

export const orderPage = () => {
    
    return `/order`
}

export const orderItemImageUrl = (pathname) => {
    
    return ``
}