import { createSlice } from "@reduxjs/toolkit"
import categoryApi from "../../callApi/categoryApi"


const initialState = {
    data: []
}

export const categorySlice = createSlice({
    name: 'categories',
    initialState,
    reducers: {
        setNewListCategories: (state, action) => {
            state.data = action.payload
        }    
    }
})

export const { setNewListCategories } = categorySlice.actions
export default categorySlice.reducer
