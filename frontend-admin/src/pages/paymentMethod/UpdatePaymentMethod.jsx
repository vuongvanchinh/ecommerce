import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import PaymentMethodForm from '../../components/paymentMethodForm/PaymentMethodForm'
import { onClear,onChange, onSetNewPaymentMethod} from '../../redux/features/payment_method_crud'
import {updatePaymentMethod, deletePaymentMethods} from '../../redux/features/payment_method_list'
import { useParams } from 'react-router'
import paymentMethodApi from '../../utils/api/paymentMethodApi'
import { paymentMethodListPage } from '../../utils/urls'
import LoadingPage from '../../components/loadingPage/LoadingPage';


const validate = (data) => {
    let res = {}
    if (!data.name) {
        res.code = ['This field is required']
    }
    
    return res
}
const UpdatePaymentMethod = () => {
    const history = useHistory()
    const payment_method_crud = useSelector(state => state.payment_method_crud)
    const payment_methods  = useSelector(state => state.payment_method_list.data)
    const [loading, setLoading] = useState(true)

    const {id} = useParams()
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
                    let res = await paymentMethodApi.updatePaymentMethod(data);
                    console.log(res)
                    if (res.status === 200) {
                        // console.log(res.data)
                        dispatch(updatePaymentMethod(res.data))
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

    const del = () => {
        ;(async () => {
            try {
                let res = await paymentMethodApi.deletePaymentMethod(payment_method_crud.id)
                if (res.status === 204) {
                    dispatch(deletePaymentMethods([payment_method_crud.id]))
                    history.push(paymentMethodListPage())
                } else {
                    alert('Error')
                }
            } catch (error) {
                alert("Error")
            }
        })()
    }
    
    useEffect(() => {
        console.log("Render update payment method") 
        document.title = "Update payment method"
        return () => {
            dispatch(onClear())
            console.log("Unmount add PaymentMethod")
        }

    }, [])

    useEffect(() => {
        console.log(payment_methods)
        let index = payment_methods.findIndex(item => item.id.toString() === id)
        console.log("index", index)
        if (index !== -1) {
            dispatch(onSetNewPaymentMethod(payment_methods[index]))
            setLoading(false)
        } else {
            alert('Not Found')
            history.push(paymentMethodListPage())

        }     
    }, [id, payment_methods])

    // console.log(payment_method_crud)
    if (loading) {
        return <LoadingPage />
    }

    return (
        <div className="page-center">
            <div className="page-header">
                <h2>Update new payment method</h2>
            </div>
            <PaymentMethodForm 
                data={payment_method_crud}
                handleChange={ handleChange}
                handleSubmit={ handleSubmit}
                errors={payment_method_crud.errors}
                action="update"
                handleDelete={ del}
                
            />
            
        </div>
    )
}

export default UpdatePaymentMethod