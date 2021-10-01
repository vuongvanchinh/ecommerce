import { createSlice } from "@reduxjs/toolkit"


const initialState = {
    
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setNewUser: (state, action) => {
            return action.payload
        }    
    }
})

export const { setNewUser } = userSlice.actions
export default userSlice.reducer
