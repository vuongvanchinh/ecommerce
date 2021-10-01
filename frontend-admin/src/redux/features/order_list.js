import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    // total: 0,
    selectedItems:[],
    
    data: [
    ]
}
export const orderSlice = createSlice({
    name: 'order_list',
    initialState,
    reducers: {
        appendListOrder: (state, action) => {
            let data = action.payload
            for (let i = 0; i < data.length; i++) {
                data[i].total = 0;
                for(let j = 0; j < data[i].items.length; j++) {
                    data[i].total += data[i].items[j].price * data[i].items[j].quantity;
                }
                console.log(data[i].total)
            }
            state.data.push.apply(state.data, data)
        },
        setNewListOrder: (state, action) => {
            let data = action.payload
            for (let i = 0; i < data.length; i++) {
                data[i].total = 0;
                for(let j = 0; j < data[i].items.length; j++) {
                    data[i].total += data[i].items[j].price * data[i].items[j].quantity;
                }
                console.log(data[i].total)
            }
            state.data = data;
            state.selectedItems=[];
        },    
        setNullListOrder: (state, action) => {
            return initialState
        }, 

        updateOrder: (state, action) => {
            let data = action.payload;
            let index = state.data.findIndex(order => order.id===data.id)
            if (index !== -1) {
                state.data[index] = data
            }
            state.selectedItems =[]
        },
        deleteOrders: (state, action) => {
            let ids = action.payload;
            state.data = state.data.filter(order => !ids.includes(order.id))
            state.selectedItems =[]
        }, 
        selectOrders: (state, action) =>{
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

export const {deleteOrders, updateOrder, appendListOrder, setNewListOrder, setNullListOrder, selectOrders } = orderSlice.actions
export default orderSlice.reducer
