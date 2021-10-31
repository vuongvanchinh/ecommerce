import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    name: '',
    active: true,
    fee: 0,
    errors: {
        name:[]
    }
    
}
export const shippingMethodSlice = createSlice({
    name: 'shipping_method_crud',
    initialState,
    reducers: {
        onChange: (state, action) => {
            state[action.payload.name] = action.payload.value
        },
        onClear: (state, action) => {
            return initialState
        },
        onSetNewShippingMethod: (state, action) => {
            let newState = {...action.payload, errors:{}}
            
            return newState
        }
    }
})

export const {onChange, onSetNewShippingMethod, onClear} = shippingMethodSlice.actions

export default shippingMethodSlice.reducer