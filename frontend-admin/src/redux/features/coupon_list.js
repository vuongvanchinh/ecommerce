import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    // total: 0,
    selectedItems:[],
    
    data: [
    
    ]
}

export const couponSlice = createSlice({
    name: 'coupon_list',
    initialState,
    reducers: {
        appendListCoupon: (state, action) => {
            state.data.push.apply(state.data, action.payload)
        },

        setNewListCoupon: (state, action) => {
            state.data = action.payload
          
            state.selectedItems=[]
        },    
        setNullListCoupon: (state, action) => {
            return initialState
        }, 

        updateCoupon: (state, action) => {
            const {index, data} = action.payload;
            if (index !== -1) {
                state.data[index] = data
            }
            state.selectedItems =[]
        },
        deleteCoupons: (state, action) => {
            let ids = action.payload;
            state.data = state.data.filter(coupon => !ids.includes(coupon.id))
            state.selectedItems =[]
        }, 

        selectCoupons: (state, action) =>{
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
                state.selectedItems = state.selectedItems.filter(coupon => !ids.includes(coupon))
            }
        }
    }
})

export const {deleteCoupons, updateCoupon, appendListCoupon,
     setNewListCoupon, setNullListCoupon, selectCoupons } = couponSlice.actions
export default couponSlice.reducer
