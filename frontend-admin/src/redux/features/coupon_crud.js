import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    code:'',
    description: '',
    type: 'freeship',
    discount: null,
    min_order_value: null,
    active: false,
    valid_from: '',
    valid_to: '',

    errors: {
        code:[]
    }
    
}
export const couponSlice = createSlice({
    name: 'coupon_crud',
    initialState,
    reducers: {
        onChange: (state, action) => {
            state[action.payload.name] = action.payload.value
        },
        onClear: (state, action) => {
            return initialState
        },
        onSetNewCoupon: (state, action) => {
            let newState = {...action.payload, errors:{}}
            return newState
        }

    }
})

export const {onChange, onSetNewCoupon, onClear} = couponSlice.actions

export default couponSlice.reducer