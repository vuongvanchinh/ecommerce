import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    options: []
}

export const productSlice = createSlice({
    name: 'product',
    initialState,
    reducers: {
        setNewOptions: (state, action) => {
            state.options = action.payload
        },
        pickOption: (state, action) => {
            let {c_index, o_index} = action.payload
            state.options[c_index] = o_index
        }
    }

})

export const { setNewOptions, pickOption } = productSlice.actions
export default productSlice.reducer
