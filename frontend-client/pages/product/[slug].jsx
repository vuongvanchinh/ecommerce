import React, {useEffect, useState} from 'react'
import {useRouter} from 'next/router'
import Link from 'next/link'
import Head from 'next/head'

import ProductView from '../../components/productview/ProductView'
import productApi from '../../callApi/productApi'
import ProductCard from '../../components/productcard/ProductCard'
import Loader from '../../components/loader/Loader'
import { useDispatch } from 'react-redux'
import { setNewOptions } from '../../redux/features/product'

const initialState = {
    id:null, 
    name:'',
    description:'',
    category:{
        name:'',
        slug:''
    },
    criterions:[],
    variants:[],
    images:[]
}
const caculateOffset  = (criterions, index) => {
    let res = 1;  
    for (let i = index+1; i < criterions.length; i++) {
      res *= criterions[i].options.length; 
    }
    return res;
}

const initialOptions = (criterions, variants) => {
    let length = criterions.length
  
    let first_available_variant = variants.findIndex((item => item.quantity_in_stock > 0))
    if (first_available_variant === -1) {// out of stock
      return new Array(length).fill(-1)
    }
    let offsets = []
    for (let i = 0; i < length; i++) {
      offsets.push(caculateOffset(criterions, i))
    }
  
    let res = []
    for (let i = 0; i < length; i++) {
      res.push(Math.floor(first_available_variant/offsets[i]))
      first_available_variant = first_available_variant % offsets[i]
    }
    return res
  }
const ProductDetail = (props) => {
    const {data} = props
    const [dt, setDt] = useState(initialState)
    const [recommends, setRecommends] = useState([])
    const [loading, setLoading] = useState(true)
    const router = useRouter()
    const dispatch = useDispatch()

    let {slug} = router.query;

    useEffect(() =>{
        const get = async () => {
            try {
            
                const res = await productApi.getBySlug(slug) 
                setDt(res.data)
                dispatch(setNewOptions(initialOptions(res.data.criterions, res.data.variants)))
                setLoading(false)
            } catch(e) {
                console.log("get product data in product detail page error", e)
            }
        } 
        get()

    }, [slug])
    
    useEffect(() => {
        ;(async function() {
            try {
                let res = await productApi.getRecommend(slug)
                if (res.status === 200) {
                    setRecommends(res.data)
                }
            } catch (error) {
                
            }
        })()
    }, [slug])


    console.log('render product detail page')
    if (loading) {
        return (
            <div className='flex-center' style={{height: '80vh'}}>
              <Head>
                <title>Product</title>
              </Head>
              <Loader variant='large'/>
            </div>
        )
    }

    return (
        <div >
            <Head>
                <title>{dt.name}</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
                <meta name="description" content={dt.seo_description? dt.seo_description: dt.description}/>
                <meta name="keywords" content={`${data.category? data.category.name:""}, ${dt.name}`}></meta>
                <meta name="author" content={`cdev.com`}/>
            </Head>
           
           <div className="max_width_1280 margin_center padding:0 0.5rem">
            <div className="section">
                <ProductView 
                    data = {dt}
                    name={dt.name}
                    criterions={dt.criterions}
                    variants={dt.variants}
                    category={dt.category}
                    images={dt.images}
                    id={dt.id}
                    price={dt.price}

                />
            </div>
            <div className="section" >
                <p className={`uppercase font-weight-500`}>Description</p>
                <p className={`margin-top-1rem`}>
                    {dt.description}
                </p>
            </div>
            {
                recommends.length > 0 ? (
                    <div className="section">
                         <p className={`uppercase margin-bottom-1rem font-weight-500`}>You maybe like it too</p>

                        <div className="grid grid-col-6 grid-col-md-4 grid-col-sm-2 " style={{padding: "0"}}>
                            {
                                recommends.map((item, index) => (
                                    <ProductCard 
                                        key={index}
                                        images = {item.images}
                                        name={item.name}
                                        price={item.price}
                                        slug={item.slug}
                                    />
                                ))
                            }
                        </div>
                    </div>
                ):null
            }
           </div>
        </div>
    )
}

export async function getStaticProps(context) {
    let slug = context.params.slug
    console.log("params", context.params)
    try {
        const res = await productApi.getBySlug(slug)
        console.log("res product detail", res)
        const json = product.json()
        console.log("json product detail", json)
        return {
            props: {
                data: json
        }, // will be passed to the page component as props
    }
    } catch (error) {
        console.log(error)
        return {
            
            props: {
                data: {
                    name:'',
                    images:[''],
                    category: {},
                    variants: [],
                    criterions: []
                }
            }
        }
    }

}
export async function getStaticPaths() {
    try {
        const res = await productApi.getAll()
        console.log("res", res)
        let products = res   
        // Get the paths we want to pre-render based on posts
        const paths = products.map((p) => ({
          params: { slug: p.slug },
        }))
        return { paths, fallback: 'blocking'}

    } catch (error) {
        console.log(error.toString)
        const products = []
        const paths = products.map((p) => ({
            params: { slug: p.slug, id: p.id },
          }))
        return { paths, fallback: 'blocking'}
    }
}

export default ProductDetail
