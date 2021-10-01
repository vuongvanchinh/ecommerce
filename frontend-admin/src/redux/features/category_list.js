import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    // total: 0,
    selectedItems:[],
    
    data: [
    
    ]
}

export const categorySlice = createSlice({
    name: 'category_list',
    initialState,
    reducers: {
        appendListCategory: (state, action) => {
            state.data.push.apply(state.data, action.payload)
        },

        setNewListCategory: (state, action) => {
            state.data = action.payload
            // state.total = action.payload.total
            state.selectedItems=[]
        },    
        setNullListCategory: (state, action) => {
            return initialState
        }, 

        updateCategory: (state, action) => {
            let data = action.payload;
            let index = state.data.findIndex(category => category.id===data.id)
            if (index !== -1) {
                state.data[index] = data
            }
            state.selectedItems =[]
        },
        deleteCategories: (state, action) => {
            let ids = action.payload;
            state.data = state.data.filter(category => !ids.includes(category.id))
            state.selectedItems =[]
        }, 

        selectCategories: (state, action) =>{
            let dt = action.payload;
            let ids = dt.ids 
            if(dt.value) {
                for (let i=0; i < ids.length; i++){
                    let include  = state.selectedItems.includes(ids[i])
                    if (!include) {
                        state.selectedItems.push(ids[i])
                    }
                }
            } else {
                state.selectedItems = state.selectedItems.filter(user => !ids.includes(user))
            }
        }
    }
})

export const {deleteCategories, updateCategory, appendListCategory,
     setNewListCategory, setNullListCategory, selectCategories } = categorySlice.actions
export default categorySlice.reducer
