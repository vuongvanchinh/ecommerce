import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import CouponForm from '../../components/couponForm/CouponForm'
import { onClear, onSetNewCoupon ,onChange} from '../../redux/features/coupon_crud';
import {appendListCoupon} from '../../redux/features/coupon_list'

import couponApi from '../../utils/api/couponApi';
import { couponListPage } from '../../utils/urls';

const validate = (data) => {
    let res = {}
    if (!data.code) {
        res.code = ['This field is required']
    }
    if (!data.description) {
        res.code = ['This field is required']
    }
    if (!data.type) {
        res.type = ['This field is required']
    }
    if (!data.discount) {
        res.discount = ['This field is required']
    } else {
        if (data.type === 'percentage deduction' && (data.discount > 100 || data.discount < 0 )) {
            res.discount = ['Discount width percentage deduction type must be between 0 and 100']
        }
    }
    if(!data.valid_from) {
        res.valid_from = ['This field is required']
    }
    if(!data.valid_to) {
        res.valid_to = ['This field is required']
    }
    return res
}
const AddCoupon = () => {
    const history = useHistory()
    const coupon_crud = useSelector(state => state.coupon_crud)
    const dispatch = useDispatch()

    const handleChange = (dt) => {
        dispatch(onChange(dt))
    }

    const handleSubmit = (e) =>{
        e.preventDefault();
        console.log("submit add coupon", e)
        const errs = validate(coupon_crud)
        if (Object.keys(errs).length > 0) {// has errors
            dispatch(onChange({name:"errors",value:errs}))
        } else {
            const add = async (data) => {
                try {
                    let res = await couponApi.addCoupon(data);
                    console.log(res)
                    if (res.status === 201) {
                        // console.log(res.data)
                        dispatch(appendListCoupon([res.data]))
                        history.push(couponListPage())
                    } 
                    if (res.status === 400) {
                        console.log(res, res.data)
                        dispatch(onChange({name:"errors",value:res.data }))
                    }
    
                } catch (error) {
                    console.log(error)
                }
            }
            let data_clone = {...coupon_crud}
            delete data_clone.errors
            add(data_clone);
        }
        
    }

    
    useEffect(() => {
        console.log("Render add coupon") 
        document.title = "Add Coupon"
        return () => {
            dispatch(onClear())
            console.log("Unmount add Coupon")
        }
    }, [])
    return (
        <div className="page-center">
            <div className="page-header">
                <h2>Add new coupon</h2>
            </div>
            <CouponForm 
                data={coupon_crud}
                handleChange={ handleChange}
                handleSubmit={ handleSubmit}
                errors={coupon_crud.errors}
                action="add"
               
            />
            
        </div>
    )
}

export default AddCoupon