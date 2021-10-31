import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import CategoryForm from '../../components/categoryForm/CategoryForm'
import LoadingPage from '../../components/loadingPage/LoadingPage';
import { onClear, onSetNewCategory ,onChange} from '../../redux/features/category_crud';
import {updateCategory, deleteCategories} from '../../redux/features/category_list'
import categoryApi from '../../utils/api/categoryApi';
import { categoryListPage } from '../../utils/urls';

const UpdateCategory = () => {
    const history = useHistory()
    const {slug} = useParams();
    const categories = useSelector(state => state.category_list.data)
    const category_crud = useSelector(state => state.category_crud)
    const [loading, setLoading] = useState(true)
    const dispatch = useDispatch()

    const handleChange = (dt) => {
        console.log(dt)
        dispatch(onChange(dt))
    }

    const handleSubmit = (e) =>{
        e.preventDefault();
        console.log("submit update", e)
        const update = async (data) => {
            try {
                let res = await categoryApi.updateCategory(data);
                console.log(res)
                if (res.status === 201) {
                    // console.log(res.data)
                    dispatch(updateCategory(res.data))
                    history.push('/dashboard/categories')
                } else if (res.status === 400) {
                    console.log(res, res.data)
                    dispatch(onChange({name:"errors",value:res.data }))
                } else if (res.status === 403) {
                    history.push('/login')
                }

            } catch (error) {
                console.log(error)
            }
        }
        let data_clone = {...category_crud}
        delete data_clone.errors
        update(data_clone);

    }

    const handleDelete = (id) => {
        const del = async (id) => {
            try {
                let res = await categoryApi.deleteCategory(id)
                console.log(res)
                if (res.status === 204) {
                    dispatch(deleteCategories([id]))
                    history.push('/dashboard/categories')
                } else if (res.status === 403) {
                    history.push('/login')
                }
                
            } catch(error) {
                console.log(error)
            }
        }
        console.log("Delete category", id)
        del(id)
    }

    console.log(slug)
    // let current_index = categories.findIndex(category => category.slug === slug); 

    useEffect(() => {
        let current_index = categories.findIndex(category => category.slug === slug); 
        console.log("Render Update Category ", current_index)
        if (current_index >= 0) {
            console.log("call set new crud category")
            dispatch(onSetNewCategory(categories[current_index]))
            setLoading(false)
            document.title = categories[current_index].name
        } else {
            history.push(categoryListPage())
        }
        return () => {
            dispatch(onClear())
            console.log("Unmount Update User ")
        }
    }, [categories])

    if (loading) {
        return <LoadingPage />
    }
    return (
        <div className="page-center">
            <div className="page-header">
                <h2>Update Category</h2>
            </div>
            <CategoryForm 
                data={category_crud}
                handleChange={ handleChange}
                handleSubmit={ handleSubmit}
                errors={category_crud.errors}
                action="update"
                handleDelete={ handleDelete}
            />
            
        </div>
    )
}

export default UpdateCategory
