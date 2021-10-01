import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    email: "",
    password: "",
    
    user_logedin: {
        email: "",
        username: "",
        first_name: "",
        last_name: "",
        address: [{
          city: "",
          district: "",
          commute: "",
          detail: ""
        }],
        avatar: "",
        phone: "",
        last_login: "",
    }
}

export const userSlice = createSlice({
    name: 'user_login',
    initialState,
    reducers: {
        onChange: (state, action) => {
            let data = action.payload
            state[data.name] = data.value
        },
    }
})

export const { onChange } = userSlice.actions

export default userSlice.reducer