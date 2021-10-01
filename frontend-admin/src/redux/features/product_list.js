import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    // total: 0,
    selectedItems:[],
    
    data: [
    
    ]
}

export const productSlice = createSlice({
    name: 'product_list',
    initialState,
    reducers: {
        appendListProduct: (state, action) => {
            state.data.push.apply(state.data, action.payload)
        },
        setNewListProduct: (state, action) => {
            state.data = action.payload
            // state.total = action.payload.total
            state.selectedItems=[]
        },    
        setNullListProduct: (state, action) => {
            return initialState
        }, 

        updateProduct: (state, action) => {
            let data = action.payload;
            let index = state.data.findIndex(product => product.id===data.id)
            if (index !== -1) {
                state.data[index] = data
            }
            state.selectedItems =[]
        },
        deleteProducts: (state, action) => {
            let ids = action.payload;
            state.data = state.data.filter(product => !ids.includes(product.id))
            state.selectedItems =[]
        }, 

        selectProducts: (state, action) =>{
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

export const {
            deleteProducts, updateProduct, 
            appendListProduct, setNewListProduct, 
            setNullListProduct, selectProducts } = productSlice.actions
export default productSlice.reducer
