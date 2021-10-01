import { createSlice } from "@reduxjs/toolkit"
const cart_item = {
    variant: {},
    product: {},
    quantity: 1,
    image: null
}

const initialState = {
    length: 0,
    data: []
}
const saveToLocalStorage = (data) => {
    let new_cart = []
    for(let i = 0; i < data.length; i++) {
        let item = {
            product: data[i].product.id,
            variant: data[i].variant.id,
            quantity: data[i].quantity,
            image: data[i].image? new URL(data[i].image).pathname: data[i].image
        }
        new_cart.push(item)
    }
    localStorage.setItem('cart', JSON.stringify(new_cart))
}

export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        setNewCart: (state, action) => {
            let newState = action.payload
            state.data = newState
            state.length = newState.length
            saveToLocalStorage(state.data)
            
        },
        addProduct: (state, action) => {
            let newItem = action.payload
            let item = {
                product: newItem.product.id,
                variant: newItem.variant.id,
                quantity: newItem.quantity,
                image: newItem.image
            }
           
            let index = state.data.findIndex(i => (i.product.id === item.product &&  i.variant.id == item.variant))
            if(index === -1) { // not exist in cart
                state.data.push(newItem)
                state.length += 1
            } else {// exist in cart
                let old_quantity = state.data[index].quantity
                newItem.quantity += old_quantity
                state.data[index] = newItem
            }
                        
            try {
                let l = JSON.parse(localStorage.getItem('cart'))
                if(index === -1) {
                    l.push(item)
                } else {
                    l[index].quantity = newItem.quantity
                }
                localStorage.setItem('cart', JSON.stringify(l))
            } catch (error) {//handle localstorage was destroy cause error
                saveToLocalStorage(state.data)
            }

        },
        updateItem: (state, action) => {
            let {index, name, value} = action.payload
            state.data[index][name] = value
            saveToLocalStorage(state.data)
        },
        deleteItem: (state, action) => {
            let index  = action.payload
            state.data.splice(index, 1)
            saveToLocalStorage(state.data)
        }

    }
})

export const { setNewCart, addProduct, updateItem, deleteItem } = cartSlice.actions
export default cartSlice.reducer
