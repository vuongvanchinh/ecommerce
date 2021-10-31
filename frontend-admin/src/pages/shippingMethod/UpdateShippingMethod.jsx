import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import ShippingMethodForm from '../../components/shippingMethodForm/ShippingMethodForm'
import { onClear,onChange, onSetNewShippingMethod} from '../../redux/features/shipping_method_crud'
import {updateShippingMethod, deleteShippingMethods} from '../../redux/features/shipping_method_list'
import { useParams } from 'react-router'
import shippingMethodApi from '../../utils/api/shippingMethodApi'
import { shippingMethodListPage } from '../../utils/urls'
import LoadingPage from '../../components/loadingPage/LoadingPage';


const validate = (data) => {
    let res = {}
    if (!data.name) {
        res.code = ['This field is required']
    }
    if (data.fee < 0) {
        res.fee = ['Free must be grate or equal 0']
    }
    return res
}
const UpdateShippingMethod = () => {
    const history = useHistory()
    const shipping_method_crud = useSelector(state => state.shipping_method_crud)
    const shipping_methods  = useSelector(state => state.shipping_method_list.data)
    const [loading, setLoading] = useState(true)

    const {id} = useParams()
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
                    let res = await shippingMethodApi.updateShippingMethod(data);
                    console.log(res)
                    if (res.status === 200) {
                        // console.log(res.data)
                        dispatch(updateShippingMethod(res.data))
                        history.push(shippingMethodListPage())
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

    const handleDelete = () => {
        ;(async () => {
            try {
                let res = await shippingMethodApi.deleteShippingMethod(shipping_method_crud.id)
                if(res.status === 204) {
                    dispatch(deleteShippingMethods([shipping_method_crud.id]))
                    history.push(shippingMethodListPage())
                } else {
                    alert('Errors')
                }
            } catch (error) {
                alert('Errors')
            }
        })()
    }

    
    useEffect(() => {
        console.log("Render update shipping method") 
        document.title = "Update shipping method"
        return () => {
            dispatch(onClear())
            console.log("Unmount add ShippingMethod")
        }

    }, [])

    

    useEffect(() => {
        console.log(shipping_methods)
        let index = shipping_methods.findIndex(item => item.id.toString() === id)
        console.log("index", index)
        if (index !== -1) {
        
            dispatch(onSetNewShippingMethod(shipping_methods[index]))
            setLoading(false)
        } else {
            alert('Not found')
            history.push(shippingMethodListPage())
        }
    }, [id, shipping_methods])

    // console.log(shipping_method_crud)
    if (loading) {
        return <LoadingPage />
    }
    return (
        <div className="page-center">
            <div className="page-header">
                <h2>Update new shipping method</h2>
            </div>
            <ShippingMethodForm 
                data={shipping_method_crud}
                handleChange={ handleChange}
                handleSubmit={ handleSubmit}
                errors={shipping_method_crud.errors}
                action="update"
                handleDelete={handleDelete}
            />
            
        </div>
    )
}

export default UpdateShippingMethod