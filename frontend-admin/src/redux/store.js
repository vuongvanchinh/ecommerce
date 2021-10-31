import { configureStore } from '@reduxjs/toolkit'
import user_crud from './features/user_crud'
import user_login from './features/user_login'
import user_list from './features/user_list'
import category_crud from './features/category_crud'
import category_list from './features/category_list'
import product_crud from './features/product_crud'
import product_list from './features/product_list'
import order_list from './features/order_list'
import order_crud from './features/order_crud'
import coupon_list from './features/coupon_list'
import coupon_crud from './features/coupon_crud'
import payment_method_list from './features/payment_method_list'
import payment_method_crud from './features/payment_method_crud'
import shipping_method_list from './features/shipping_method_list'
import shipping_method_crud from './features/shipping_method_crud'

export const store = configureStore({
  reducer: {
    user_crud: user_crud,
    user_login: user_login,
    user_list: user_list,
    category_crud:category_crud,
    category_list:category_list,
    product_crud: product_crud,
    product_list: product_list,
    order_list,
    order_crud,
    coupon_list,
    coupon_crud,
    payment_method_list,
    payment_method_crud,
    shipping_method_list,
    shipping_method_crud

  }
})