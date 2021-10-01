import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import CategoryForm from '../../components/categoryForm/CategoryForm'
import { onClear, onSetNewCategory ,onChange} from '../../redux/features/category_crud';
import {appendListCategory} from '../../redux/features/category_list'

import categoryApi from '../../utils/api/categoryApi';
const AddCategory = () => {
    const history = useHistory()
    const category_crud = useSelector(state => state.category_crud)
    const dispatch = useDispatch()

    const handleChange = (dt) => {
        dispatch(onChange(dt))
    }
    const handleSubmit = (e) =>{
        e.preventDefault();
        console.log("submit add category", e)
        const add = async (data) => {
            try {
                let res = await categoryApi.addCategory(data);
                console.log(res)
                if (res.status === 201) {
                    // console.log(res.data)
                    dispatch(appendListCategory([res.data]))
                    history.push('/dashboard/categories')
                } 
                if (res.status === 400) {
                    console.log(res, res.data)
                    dispatch(onChange({name:"errors",value:res.data }))
                }

            } catch (error) {
                console.log(error)
            }
        }
        let data_clone = {...category_crud}
        delete data_clone.errors
        add(data_clone);

    }

    useEffect(() => {
        console.log("Render add category") 
        document.title = "Add Category"
        return () => {
            dispatch(onClear())
            console.log("Unmount add User ")
        }
    }, [])
    return (
        <div className="page-center">
            <div className="page-header">
                <h2>Add new category</h2>
            </div>
            <CategoryForm 
                data={category_crud}
                handleChange={ handleChange}
                handleSubmit={ handleSubmit}
                errors={category_crud.errors}
                action="add"
                // handleDelete={ handleDelete}
            />
            
        </div>
    )
}

export default AddCategory

