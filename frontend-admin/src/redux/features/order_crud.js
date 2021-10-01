import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    id:null,
    user: null,
    name: "",
    city: "",
    district: "",
    commune: "",
    detail_address: "",
    note:"",
    payment_method: "",
    shipping_method: "",
    created: "",
    status: "",
    items: [],
    total: 0.00
}

export const orderSlice = createSlice({
    name: 'order_crud',
    initialState,
    reducers: {
        onChange: (state, action) => {
            state[action.payload.name] = action.payload.value
        },
        onClear: (state, action) => {
            return initialState
        },
        onSetNewOrder: (state, action) => {
            let newState = {...action.payload, errors:{}, total:0}
            let total = 0;
            for (let i = 0; i < newState.items.length; i++) {
                total += newState.items[i].price * newState.items[i].quantity
            }
            newState.total = total;
            return newState
        }
    }
})

export const {onChange, onSetNewOrder, onClear} = orderSlice.actions

export default orderSlice.reducer