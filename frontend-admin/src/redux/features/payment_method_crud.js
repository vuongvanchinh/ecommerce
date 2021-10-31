import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    name: '',
    coupon: null,
    active: true,
    errors: {
        name:[]
    }
    
}
export const paymentMethodSlice = createSlice({
    name: 'payment_method_crud',
    initialState,
    reducers: {
        onChange: (state, action) => {
            state[action.payload.name] = action.payload.value
        },
        onClear: (state, action) => {
            return initialState
        },
        onSetNewPaymentMethod: (state, action) => {
            let newState = {...action.payload, errors:{}}
            if (newState.coupon !== null && typeof newState.coupon ==='object') {
                newState.coupon = newState.coupon.id
            }
            return newState
        }
    }
})

export const {onChange, onSetNewPaymentMethod, onClear} = paymentMethodSlice.actions

export default paymentMethodSlice.reducer