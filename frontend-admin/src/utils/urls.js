const base = '/dashboard'

export const dashboardPage = () => {
    return base
}


// category
export const categoryListPage = () => {
    return `${base}/categories`
}

export const categoryAddPage = () => {
    return `${base}/categories/add`
}
export const categoryUpdatePage = (id) => {
    return `${base}/categories/${id}`
}
// customers
export const customerListPage = () => {
    return `${base}/customers`
}

export const customerAddPage = () => {
    return `${base}/customers/add`
}

export const customerUpdatePage = (id) => {
    return `${base}/customers/${id}`
}
//product
export const productListPage = () => {
    return `${base}/products`
}

export const productAddPage = () => {
    return `${base}/products/add`
}

export const productUpdatePage = (id) => {
    return `${base}/products/${id}`
}
//coupon
export const couponListPage = () => {
    return `${base}/coupons`
}

export const couponAddPage = () => {
    return `${base}/coupons/add`
}

export const couponUpdatePage = (id) => {
    return `${base}/coupons/${id}`
}
//order 
export const orderListPage = () => {
    return `${base}/orders`
}

export const orderAddPage = () => {
    return `${base}/orders/add`
}

export const orderUpdatePage = (id) => {
    return `${base}/orders/${id}`
}

export const paymentMethodListPage = () => {
    return `${base}/payment-method`
}

export const paymentMethodAddPage = () => {
    return `${base}/payment-method/add`
}

export const paymentMethodUpdatePage = (id) => {
    return `${base}/payment-method/${id}`
}

export const shippingMethodListPage = () => {
    return `${base}/shipping-method`
}

export const shippingMethodAddPage = () => {
    return `${base}/shipping-method/add`
}

export const shippingMethodUpdatePage = (id) => {
    return `${base}/shipping-method/${id}`
}


