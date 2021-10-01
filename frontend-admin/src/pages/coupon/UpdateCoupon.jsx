import React, { useEffect, useState, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import CouponForm from '../../components/couponForm/CouponForm'
import { onClear, onSetNewCoupon ,onChange} from '../../redux/features/coupon_crud';
import {appendListCoupon, updateCoupon} from '../../redux/features/coupon_list'

import couponApi from '../../utils/api/couponApi';
import { couponListPage } from '../../utils/urls';
import Loader from '../../components/loader/Loader';

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

const UpdateCoupon = () => {
    const history = useHistory()
    const coupon_crud = useSelector(state => state.coupon_crud)
    const coupons = useSelector(state => state.coupon_list.data)
    const dispatch = useDispatch()
    const {code} = useParams();
    const handleChange = (dt) => {
        dispatch(onChange(dt))
    }
    const index = useMemo(() => {
        return coupons.findIndex(item => item.code === code)
    }, [coupons, code])

    const handleSubmit = (e) =>{
        e.preventDefault();
        console.log("submit add coupon", e)
        const errs = validate(coupon_crud)
        if (Object.keys(errs).length > 0) {// has errors
            dispatch(onChange({name:"errors",value:errs}))
        } else {
            const update = async (data) => {
                try {
                    let res = await couponApi.updateCoupon(data);
                    if (res.status === 200) {
                        dispatch(updateCoupon({index: index, data:res.data}))
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
            update(data_clone);
        }
        
    }

    useEffect(() => {
        console.log("Render update coupon") 
        document.title = "Update Coupon"
        if (index !== -1) {
            dispatch(onSetNewCoupon(coupons[index]))
        } else {
            history.push(couponListPage())
        }
        return () => {
            dispatch(onClear())
            console.log("Unmount add Coupon")
        }
    }, [])

    if (!coupon_crud.code) {
        return <div className='flex-center' style={{ minHeight: '70vh'}}>
                <Loader variant='medium'/>
        </div>

    }

    return (
        <div className="page-center">
            <div className="page-header">
                <h2>Update coupon</h2>
            </div>
            <CouponForm 
                data={coupon_crud}
                handleChange={ handleChange}
                handleSubmit={ handleSubmit}
                errors={coupon_crud.errors}
                action="update"
                // handleDelete={ handleDelete}
            />
            
        </div>
    )
}

export default UpdateCoupon