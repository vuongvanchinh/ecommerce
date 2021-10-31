import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import PaymentMethodForm from '../../components/paymentMethodForm/PaymentMethodForm'
import { onClear, onChange} from '../../redux/features/payment_method_crud'
import {appendListPaymentMethod} from '../../redux/features/payment_method_list'

import paymentMethodApi from '../../utils/api/paymentMethodApi'
import { paymentMethodListPage } from '../../utils/urls'

const validate = (data) => {
    let res = {}
    if (!data.name) {
        res.code = ['This field is required']
    }
    
    return res
}
const AddPaymentMethod = () => {
    const history = useHistory()
    const payment_method_crud = useSelector(state => state.payment_method_crud)
    
    const dispatch = useDispatch()

    const handleChange = (dt) => {
        dispatch(onChange(dt))
    }

    const handleSubmit = (e) =>{
        e.preventDefault();
        console.log("submit add payment method", e)
        const errs = validate(payment_method_crud)
        if (Object.keys(errs).length > 0) {// has errors
            dispatch(onChange({name:"errors",value:errs}))
        } else {
            const add = async (data) => {
                try {
                    let res = await paymentMethodApi.addPaymentMethod(data);
                    console.log(res)
                    if (res.status === 201) {
                        // console.log(res.data)
                        dispatch(appendListPaymentMethod([res.data]))
                        history.push(paymentMethodListPage())
                    } 
                    if (res.status === 400) {
                        console.log(res, res.data)
                        dispatch(onChange({name:"errors",value:res.data }))
                    }
                } catch (error) {
                    console.log(error)
                }
            }
            let data_clone = {...payment_method_crud}
            delete data_clone.errors
            add(data_clone);
        }
        
    }

    
    useEffect(() => {
        console.log("Render add payment method") 
        document.title = "Add payment method"
        return () => {
            dispatch(onClear())
            console.log("Unmount add PaymentMethod")
        }
    }, [])
    return (
        <div className="page-center">
            <div className="page-header">
                <h2>Add new payment method</h2>
            </div>
            <PaymentMethodForm 
                data={payment_method_crud}
                handleChange={ handleChange}
                handleSubmit={ handleSubmit}
                errors={payment_method_crud.errors}
                action="add"
            />
            
        </div>
    )
}

export default AddPaymentMethod