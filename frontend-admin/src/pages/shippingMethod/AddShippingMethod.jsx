import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import ShippingMethodForm from '../../components/shippingMethodForm/ShippingMethodForm'
import { onClear, onChange} from '../../redux/features/shipping_method_crud'
import {appendListShippingMethod} from '../../redux/features/shipping_method_list'

import shippingMethodApi from '../../utils/api/shippingMethodApi'
import { shippingMethodListPage } from '../../utils/urls'

const validate = (data) => {
    let res = {}
    if (!data.name) {
        res.name = ['This field is required']
    }
    if (data.fee < 0) {
        res.fee = ['Free must be grate or equal 0']
    }
    
    return res
}
const AddShippingMethod = () => {
    const history = useHistory()
    const shipping_method_crud = useSelector(state => state.shipping_method_crud)
    
    const dispatch = useDispatch()

    const handleChange = (dt) => {
        dispatch(onChange(dt))
    }
    const handleSubmit = (e) =>{
        e.preventDefault();
        console.log("submit add shipping method", e)
        const errs = validate(shipping_method_crud)
        if (Object.keys(errs).length > 0) {// has errors
            dispatch(onChange({name:"errors",value:errs}))
        } else {
            const add = async (data) => {
                try {
                    let res = await shippingMethodApi.addShippingMethod(data);
                    console.log(res)
                    if (res.status === 201) {
                        // console.log(res.data)
                        dispatch(appendListShippingMethod([res.data]))
                        history.push(shippingMethodListPage())
                    } else {
                        alert('Error')
                    }
                    if (res.status === 400) {
                        console.log(res, res.data)
                        dispatch(onChange({name:"errors",value:res.data }))
                    }
                } catch (error) {
                    console.log(error)
                }
            }
            let data_clone = {...shipping_method_crud}
            delete data_clone.errors
            add(data_clone);
        }
        
    }

    
    useEffect(() => {
        console.log("Render add shipping method") 
        document.title = "Add shipping method"
        return () => {
            dispatch(onClear())
            console.log("Unmount add ShippingMethod")
        }
    }, [])
    return (
        <div className="page-center">
            <div className="page-header">
                <h2>Add new shipping method</h2>
            </div>
            <ShippingMethodForm 
                data={shipping_method_crud}
                handleChange={ handleChange}
                handleSubmit={ handleSubmit}
                errors={shipping_method_crud.errors}
                action="add"
            />
            
        </div>
    )
}

export default AddShippingMethod