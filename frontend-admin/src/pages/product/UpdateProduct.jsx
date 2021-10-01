import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useHistory, useLocation } from 'react-router-dom';
import ProductForm from '../../components/productform/ProductForm';
import { onClear ,onChange, onSetNewProduct} from '../../redux/features/product_crud';
import {updateProduct, deleteProducts} from '../../redux/features/product_list'

import productApi from '../../utils/api/productApi';
const dataSumit = (dt) => {
    let data = JSON.parse(JSON.stringify(dt));
    delete data.errors;
    
    if (data.change_image) {
        for (let i = 0; i < data.images.length; i++) {
            data.images[i].order = i;
        }
    }

    if (data.change_classify) {
        let l = data.criterions.length;
        for (let i = 0; i < l; i++) {
            data.criterions[i].order = i;
            for (let j = 0; j < data.criterions[i].options.length; j++) {
                data.criterions[i].options[j].order = j;
            }
        }
        // asign order and combind_string for variants
        let variant_index = 0;
        
        if (l > 0) {
            let f1 = data.criterions[0];
            let i, j, z;
            for (i = 0; i < f1.options.length; i++) {
                if (l > 1) {
                    let f2 = data.criterions[1];
                    for (j = 0; j < f2.options.length; j++) {
                        if (l > 2) {// 3 criterion
                            let f3 = data.criterions[2];
                            for (z = 0; z < f3.options.length; z++) {
                                data.variants[variant_index].order = variant_index;
                                data.variants[variant_index].combind_string = `${f1.options[i].option_name}-${f2.options[j].option_name}-${f3.options[z].option_name}`;
                                variant_index ++;
                            }
                        } else { //2 criterion
                            data.variants[variant_index].order = variant_index;
                            data.variants[variant_index].combind_string = `${f1.options[i].option_name}-${f2.options[j].option_name}`;
                            variant_index ++;
                        }
                    }
                } else { //1 criterion
                    data.variants[variant_index].order = variant_index;
                    data.variants[variant_index].combind_string = f1.options[i].option_name;
                    variant_index ++;
                }
            }
        }

    }

    return data;
} 
const UpdateProduct = () => {
    const history = useHistory()
    const location = useLocation()
    const {slug} = useParams();
    const products = useSelector(state => state.product_list.data)
    const product_crud = useSelector(state => state.product_crud)
    const dispatch = useDispatch()

    const handleChange = (dt) => {
        dispatch(onChange(dt))
    }

    const handleSubmit = (e) =>{
        e.preventDefault();
        console.log("submit update product", e)
        const update = async (data) => {
            try {
                let res = await productApi.updateProduct(data);
                console.log(res)
                if (res.status <= 300 && res.status >= 200) {
                    // console.log(res.data)
                    dispatch(updateProduct(res.data))
                    history.push('/dashboard/products')
                } else if (res.status === 400) {
                    console.log(res, res.data)
                    dispatch(onChange({name:"errors",value:res.data }))
                } else if (res.status === 403) {
                    history.push(`/login/next=${location.pathname}`)
                }

            } catch (error) {
                console.log(error)
            }
        }
        let data = dataSumit(product_crud)
        update(data)
    }

    const handleDelete = (id) => {
        const del = async (id) => {
            try {
                let res = await productApi.deleteProduct(id)
                console.log(res)
                if (res.status === 204) {
                    dispatch(deleteProducts([id]))
                    history.push('/dashboard/products')
                } else if (res.status === 403) {
                    history.push('/login')
                }
                
            } catch(error) {
                console.log(error)
            }
        }
        console.log("Delete product", id)
        del(id)
    }
    // let current_index = products.findIndex(product => product.slug === slug); 
    
    useEffect(() => {
        let current_index = products.findIndex(product => product.slug === slug); 
        console.log("Render Update Product ", current_index)
        if (current_index >= 0) {
            console.log("call set new crud product")
            dispatch(onSetNewProduct(products[current_index]))
            document.title = products[current_index].name;
        }
        return () => {
            dispatch(onClear())
            console.log("Unmount Update Product ")
        }
    }, [products])

    return (
        <div className="page-center">
            <div className="page-header">
                <h2>Update Product</h2>
            </div>

            <ProductForm 
                data={product_crud}
                handleChange={ handleChange}
                handleSubmit={ handleSubmit}
                errors={product_crud.errors}
                action="update"
                handleDelete={ handleDelete}
            />
            
        </div>
    )
}

export default UpdateProduct
