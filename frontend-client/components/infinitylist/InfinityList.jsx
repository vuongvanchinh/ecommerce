import React, {useEffect, useRef, useState} from 'react'
import ProductCard from '../productcard/ProductCard';
import st from './InfinityList.module.css'
import { useSelector, useDispatch } from 'react-redux';
import productApi from '../../callApi/productApi';
import { setNewListProducts } from '../../redux/features/products';
import { useRouter } from 'next/router'
import Loader from '../loader/Loader'

const InfinityList = (props) => {
    let {per_load, callApi, gap_row, gap_col, query, attr1, attr2} = props;
    const data = useSelector(state => {
        let s = state[attr1]
        if (attr2) {
            return s[attr2]
        }
        return s
    })
    // const router = useRouter()
    
    

    const dispatch = useDispatch()

    const [dataShow, setdataShow] = useState([])

    const [loading, setLoading] = useState(true)

    const [index, setIndex] = useState(0)

    const style = {
        gridGap: gap_row + " " + gap_col 
    }

    useEffect(() => {
        const getProducts = async () => {
            try {
                console.log('call api')
              let res = await productApi.getAll()
              if(res.status === 200) {
                // console.log(res)
                dispatch(setNewListProducts(res.data))
                setLoading(false)
              }
            } catch (error) {
              alert(error.message)   
            }
        }
        getProducts()
    }, [])
    
    useEffect(() => {
        let {minPrice, maxPrice, sortBy, order, category} = query;
            console.log(query)
            let new_list = [...data.data]

            if (minPrice && minPrice !== 'null') {
                new_list = new_list.filter(p => parseFloat(p.price) >= minPrice)
            }

            if (maxPrice && maxPrice !== 'null') {
                new_list = new_list.filter(p => parseFloat(p.price) <= maxPrice)
            }
            console.log('category', category)
            if (category) {
                new_list = new_list.filter(p => category.split(',').includes(p.category.name))
            }
            // sort by
            if (sortBy && order === 'asc' || order ==='desc') {
                new_list.sort((a, b) => {
                    if (order == 'asc') {
                        return a[sortBy] - b[sortBy]

                    } else {
                        return b[sortBy] - a[sortBy]
                    }
                })
            }
            setdataShow(new_list)
       
    }, [query, data.data])


    console.log('render infinilist')
    if (loading) {
        return (
            <div className='full_with full_height flex_center'>
                <Loader 
                    variant='medium'
                />
            </div>
        )
    }
    return (
        <div>
            <div className="grid grid-col-4 grid-col-md-3 grid-col-sm-2" style={style}>
                {
                    dataShow.map((item, index) => (
                        <ProductCard 
                            key={index}
                            images = {item.images}
                            name={item.name}
                            price={item.price}
                            slug={item.slug}
                        />
                    ))
                }
                {
                    dataShow.length === 0 ? (
                        props.renderEmptyList()
                    ):null 
                }
            </div>
        </div>
    )
}

InfinityList.defaultProps = {
    per_load: 8,
    dataShow:[],
    gap_row: "20px",
    gap_col: "20px",
    query: {},
    attr1: 'products',
    renderEmptyList: () => <p></p>
}


export default InfinityList
