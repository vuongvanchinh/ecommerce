import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    data: [
        
    ],

    meta: {
        total: 0
    }
}

export const productSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        setNewListProducts: (state, action) => {
            state.data = action.payload
        }
    }
})

export const { setNewListProducts } = productSlice.actions
export default productSlice.reducer
