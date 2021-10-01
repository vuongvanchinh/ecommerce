import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    id:null,
    name:"",
    description: "",
    background_image: null,
    slug:"",
    seo_title: "",
    seo_description: "",
    parent: null,

    errors: {
        name:[]
    }
}
export const categorySlice = createSlice({
    name: 'category_crud',
    initialState,
    reducers: {
        onChange: (state, action) => {
            state[action.payload.name] = action.payload.value
        },
        onClear: (state, action) => {
            return initialState
        },
        onSetNewCategory: (state, action) => {
            let newState = {...action.payload, errors:{}}
            return newState
        }

    }
})

export const {onChange, onSetNewCategory, onClear} = categorySlice.actions

export default categorySlice.reducer