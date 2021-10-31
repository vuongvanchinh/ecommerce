import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    // total: 0,
    selectedItems:[],
    
    data: [
    
    ]
}

export const shippingMethodSlice = createSlice({
    name: 'shipping_method_list',
    initialState,
    reducers: {
        appendListShippingMethod: (state, action) => {
            state.data.push.apply(state.data, action.payload)
        },

        setNewListShippingMethod: (state, action) => {
            state.data = action.payload
          
            state.selectedItems=[]
        },    
        setNullListShippingMethod: (state, action) => {
            return initialState
        }, 

        updateShippingMethod: (state, action) => {
            const data = action.payload;
            let index = state.data.findIndex(item => item.id === data.id)
            if (index !== -1) {
                state.data[index] = data
            }
            state.selectedItems =[]
        },
        deleteShippingMethods: (state, action) => {
            let ids = action.payload;
            state.data = state.data.filter(shippingMethod => !ids.includes(shippingMethod.id))
            state.selectedItems =[]
        }, 

        selectShippingMethods: (state, action) =>{
            let dt = action.payload;
            let ids = dt.ids 
            if(dt.value) {
                for (let i=0; i < ids.length; i++){
                    let include  = state.selectedItems.includes(ids[i])
                    if (!include) {
                        state.selectedItems.push(ids[i])
                    }
                }
            } else {// un select
                state.selectedItems = state.selectedItems.filter(shippingMethod => !ids.includes(shippingMethod))
            }
        }
    }
})

export const {deleteShippingMethods, updateShippingMethod, appendListShippingMethod,
     setNewListShippingMethod, setNullListShippingMethod, selectShippingMethods } = shippingMethodSlice.actions
export default shippingMethodSlice.reducer
