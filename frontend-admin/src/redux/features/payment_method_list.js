import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    // total: 0,
    selectedItems:[],
    
    data: [
    
    ]
}

export const paymentMethodSlice = createSlice({
    name: 'payment_method_list',
    initialState,
    reducers: {
        appendListPaymentMethod: (state, action) => {
            state.data.push.apply(state.data, action.payload)
        },

        setNewListPaymentMethod: (state, action) => {
            state.data = action.payload
          
            state.selectedItems=[]
        },    
        setNullListPaymentMethod: (state, action) => {
            return initialState
        }, 

        updatePaymentMethod: (state, action) => {
            const data = action.payload;
            let index = state.data.findIndex(item => item.id === data.id)
            if (index !== -1) {
                state.data[index] = data
            }
            state.selectedItems =[]
        },
        deletePaymentMethods: (state, action) => {
            let ids = action.payload;
            state.data = state.data.filter(paymentMethod => !ids.includes(paymentMethod.id))
            state.selectedItems =[]
        }, 

        selectPaymentMethods: (state, action) =>{
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
                state.selectedItems = state.selectedItems.filter(paymentMethod => !ids.includes(paymentMethod))
            }
        }
    }
})

export const {deletePaymentMethods, updatePaymentMethod, appendListPaymentMethod,
     setNewListPaymentMethod, setNullListPaymentMethod, selectPaymentMethods } = paymentMethodSlice.actions
export default paymentMethodSlice.reducer
