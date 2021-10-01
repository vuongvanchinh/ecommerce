import React, { useRef } from 'react'
import { useRouter } from 'next/router'
import st from './Catalog.module.css'
import { categoryUrl } from '../../utils/urls'
import { useSelector } from 'react-redux'
import InfinityList from '../infinitylist/InfinityList'
import Dropdown from '../dropdown/Dropdown'
import Button from '../button/Button'
import Link from 'next/link'
import { productPage } from '../../utils/urls'
import Checkbox from '../form/checkbox/Checkbox'

const renderEmptyList = () => (
    <p>There is no results.</p>
)

const SORT_BY = [
    {
        href: productPage({sortBy: 'price', order: 'asc'}),
        icon: 'bx bx-sort-up',
        label: 'Sort by price ascending',
        query: {sortBy: 'price', order: 'asc'}

    },
    {
        href: productPage({sortBy: 'price', order: 'desc'}),
        icon: 'bx bx-sort-down',
        label: 'Sort by price descending',
        query: {sortBy: 'price', order: 'desc'}
    }
]

const Catalog = (props) => {
    const categories = useSelector(state => state.categories.data)
    const router = useRouter()
    const min = useRef(null)
    const max = useRef(null)
    const filter = useRef(null)
    const sort = useRef(null)

    let query = router.query
    let {slug} = router.query
    
    const { page} = props
    
    // const [query, setQuery] = useState({
    //     minPrice: null,
    //     maxPrice: null,
    // })
   
    const applyPrice = () => {
        try {
           
            let min_p = null
            let max_p = null

            if (min.current.value.trim()) {
                min_p = parseFloat(min.current.value)
            }

            if(max.current.value.trim()) {
                max_p = parseFloat(max.current.value)
            } 
            console.log("min", min.current.value)
            console.log("max", max.current.value)

            if(min_p !== null || max_p !== null) {
                let p = {
                    ...query,
                    minPrice: min_p,
                    maxPrice: max_p                    
                }
                const url = page === 'category'? categoryUrl(slug, p):productPage(p)
                router.push(url)
            }
        } catch (error) {
            console.log('parse errors', error)
        }
    }
    const sortBy = (q) => {
        let p = {
            ...query,
            ...q

        }
        delete p.slug
        const url = page === 'category'? categoryUrl(slug, p):productPage(p)

        console.log(url, {q})
        router.push(url)
    }

    const toggleFilter = () => {
        if (filter && filter.current) {
            filter.current.classList.toggle(st.open_filter)
        } 
        if (sort && sort.current) {
            sort.current.classList.remove(st.open_sort)
        } 
    }

    const toggleSort = () => {
        if (sort && sort.current) {
            sort.current.classList.toggle(st.open_sort)
        } 
        if (filter && filter.current) {
            filter.current.classList.remove(st.open_filter)
        } 
        
    }

    const pickFilter = (dt) => {
        try {
            let {name, value} = dt
            console.log("value", value)
            let query = {
                ...router.query
            }
            if (query[name]) {
                let list = query[name].toString().split(',')
                if(value[0]) {// pick
                    list.push(value[1])
                    query[name] = list.join(',')
                } else {// unpick
                    list = list.filter(item => item !== value[1])
                    if (list.length === 0) {
                        delete query[name]
                    } else {
                        query[name] = list.join(',')
                    }
                }
            } else { // fisrt pick
                query[name] = value[1]
            }
            console.log(router.query)
            router.push({
                pathname: productPage(),
                query: query
            })
        } catch (error) {
            router.push({
                pathname: productPage(),
            
            })
        }
    }
    console.log('render catalog')

    return (
        <div className={st.product_list}>
           
            <div className={`${st.top_sort}`}>
                <div></div>
                <Dropdown 
                    renderToggle = {() => (
                        <div className={`${st.button}  ${st.top_sort_button}` }>
                                <i className='bx bx-sort-down'></i>
                        </div>
                    )}

                    renderBody = {() => (
                        <div className={st.sort}>
                            {
                                SORT_BY.map((item, index) => (
                                    <p className={st.sort_item} key={index}
                                        onClick={() => sortBy(item.query)}
                                    >
                                        <i className={item.icon}></i>
                                        <span>{item.label}</span>
                                    </p>
                                ))
                            }

                        </div>
                    )}
                />

            </div>
            <div className={st.main_content}>
                
                <div className={st.filter_wraper}>
                    <div className={st.filter} ref={filter}>
                        <div className={st.filter_block}>
                            <p className={st.filter_block_header} >Categories</p>
                            <ul className={st.select_item_wraper}>
                                {/* <Link href={productPage()}>
                                    <li className={`${st.select_item } ${router.route === productPage()? st.selected:""}`}>All</li>
                                </Link> */}
                                {categories.map((item, index) => (
                                    
                                    <div className={st.select_item} key={index}>
                                        <Checkbox 
                                            label={item.name}
                                            name="category"
                                            onChange = {(dt) => pickFilter(dt)}
                                            checked_value = {[true, item.name]}
                                            uncheck_value ={[false, item.name]}
                                            checked={router.query.category && router.query.category.toString().split(',').includes(item.name)}
                                        />
                                    </div>
                                ))}
                            </ul>
                        </div>
                        <div className={st.filter_block}>
                            <p className={st.filter_block_header} >Price</p>
                            <div className={st.price_block}>
                                <div className={st.min_max_wraper}>
                                    <input ref={min} type="number" placeholder='Min'/>
                                    <input ref={max} type="number" placeholder='Max'/>
                                </div>
                                <Button variant='dash'
                                    onClick = { applyPrice }
                                >
                                    Apply
                                </Button>
                            </div>
                        </div>
                       
                    </div>
                    <div className={`${st.sort} ${st.sort_mobile}`} ref={sort} onClick={() => toggleSort()}>
                        {
                            SORT_BY.map((item, index) => (
                                <p className={st.sort_item} key={index}
                                    onClick={() => sortBy(item.query)}
                                >
                                    <i className={item.icon}></i>
                                    <span>{item.label}</span>
                                </p>
                            ))
                        }
                    </div>
                    <div className={st.button_filter_wraper}>
                        <button className={`${st.button} ${st.filter_button}`}
                            onClick={() => toggleFilter()}
                        >
                            <i className='bx bx-filter'></i>
                        </button>
                    </div>
                    
                    <div className={st.button_sort_wraper}>
                        <button className={`${st.button} ${st.sort_button}`}
                          onClick = {() => toggleSort()}
                        >
                            <i className='bx bx-sort-down'></i>
                        </button>
                    </div>
                                
                </div>
                <div className={st.list}>
                    <InfinityList
                        gap_col="15px"
                        gap_row="20px"
                        query={query}
                        renderEmptyList={ renderEmptyList }
                    />
                </div>
            </div>
        
        </div>
    )
}
Catalog.defaultProps = {
    page:'product'
}
export default Catalog

