import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    total: 0,
    selectedItems:[],
    
    data: [
    
    ]
}

export const userSlice = createSlice({
    name: 'user_list',
    initialState,
    reducers: {
        appendListUser: (state, action) => {
            state.data.push.apply(state.data, action.payload)
        },

        setNewListUser: (state, action) => {
            state.data = action.payload.data
            state.total = action.payload.total
            state.selectedItems=[]
        },    
        setNullListUser: (state, action) => {
            return initialState
        }, 

        updateUser: (state, action) => {
            let data = action.payload;
            let index = state.data.findIndex(user => user.id===data.id)
            if (index !== -1) {
                state.data[index] = data
            }
            state.selectedItems =[]
        },
        deleteUsers: (state, action) => {
            let ids = action.payload;
            state.data = state.data.filter(user => !ids.includes(user.id))
            state.selectedItems =[]
        }, 

        selectUsers: (state, action) =>{
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

export const {deleteUsers, updateUser, appendListUser, setNewListUser, setNullListUser, selectUsers } = userSlice.actions
export default userSlice.reducer
