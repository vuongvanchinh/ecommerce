import { configureStore } from '@reduxjs/toolkit'
import products from './features/products'
import product from './features/product'
import categories from './features/categories'
import cart from './features/cart'
import user from './features/user'

export const store = configureStore({
  reducer: {
    products,
    product,
    categories,
    cart,
    user,
    
  },
})
