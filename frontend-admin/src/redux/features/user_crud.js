import { createSlice } from "@reduxjs/toolkit"

const initialState = {
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
    avatar: null,
    phone: "",
    is_active: true,
    is_staff: false,
    note: "",
    errors: {
        email: [],
        username: [],
        phone: [],
    }
}

export const userSlice = createSlice({
    name: 'user_crud',
    initialState,
    reducers: {
        onChange: (state, action) => {
            let address_properties = ['city', 'district', 'commune', 'detail']
            let data = action.payload
            if (address_properties.includes(data.name)) {
                state.address[0][data.name] = data.value
            } else {
                state[data.name] = data.value
            }
        },
        onClear: (state, action) => {
            return initialState
        },
        onSetNew: (state, action) => {
            let newState = {...action.payload, errors:{}}
            if(newState.address.length === 0) {
                newState.address = state.address
            }
            return newState
        }
    }
})

export const { onChange, onClear, onSetNew } = userSlice.actions

export default userSlice.reducer