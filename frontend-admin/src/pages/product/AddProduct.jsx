import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import ProductForm from '../../components/productform/ProductForm'

import { onClear,onChange} from '../../redux/features/product_crud';
import {appendListProduct } from '../../redux/features/product_list';
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
        // asign order of criterions and option
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

    // delete data.change_image
    // delete data.change_classify

    return data;
} 
const AddProduct = () => {
    const history = useHistory()
    let product_crud = useSelector(state => state.product_crud)
    const dispatch = useDispatch()

    const handleChange = (dt) => {
        dispatch(onChange(dt))
    }
    
    const validate = () =>{
        let res = true;
        let errors = {}
        // name
        if(product_crud.name.length < 10) {
            errors.name = ['At least 10 character.']
            res = false;
        }
        // Slug
        if(product_crud.slug.length < 8 || product_crud.slug.indexOf(' ') !== -1) {
            errors.slug = ['At least 10 character and no space character.'] 
            res = false;           
        }
        // variants 
        for (let i = 0; i < product_crud.variants.length; i++) {
            let p = product_crud.variants[i];
            if(p.price === null  || p.quantity_in_stock === null ||
                p.sku ==='' || p.price < 0 || p.quantity_in_stock < 0) {
                
                errors.variants = [
                    'Price, stock and sku of all of variants must be fill out.',
                    'Price and stock must be great than zero.'                    
                ]
                res=false;
                break;
            }
        }
        // criterions and option
        for (let i = 0; i< product_crud.criterions.length; i++) {
            let c = product_crud.criterions[i];
            if(c.criterion_name.trim() ==='' || c.criterion_name.length > 50) {
                errors.criterions = ["Name's criterion and options must be fill out and max length is 50 chracter"]
                res = false;
                break;
            }
            for (let j = 0;  j < c.options.length; j++) {
                let o = c.options[j];
                if (o.option_name.trim() ==='' || o.option_name.length > 50) {
                    errors.criterions = ["Name's criterion and options must be fill out and max length is 50 chracter."]
                    res = false;
                    break;
                }
            }
        }
        if (!res) {
            dispatch(onChange({name: "errors", value: errors}))
        }
        return res;
    }

    const handleSubmit = (e) =>{
        e.preventDefault();
        // console.log(e)
        console.log("sumit add product")
        if(validate()) {
            console.log("sumit add validated")
            const add = async (data) => {
                try {
                  let res = await productApi.addProduct(data) 
                  if(res.status === 201) {
                      dispatch(appendListProduct([res.data]))
                      history.push('/dashboard/products')
                  }
                 } catch (error) {
                    
                }
            }
            console.log(product_crud);
            let data = dataSumit(product_crud);
            console.log(JSON.stringify(data));
            add(data);
        }
    }
    useEffect(() => {
        console.log("Render add product") 
        document.title = "Add product"
        return () => {
            // dispatch(onClear())
            console.log("Unmount add product ")
        }
    }, [])
    
    return (
        <div className="page-center">
            <div className="page-header">
                <h2>Add new product</h2>
            </div>
            <ProductForm 
                data={product_crud}
                handleChange={ handleChange}
                handleSubmit={ handleSubmit}
                errors={product_crud.errors}
                action="add"
                // handleDelete={ handleDelete}
            />
        </div>
    )
}

export default AddProduct

