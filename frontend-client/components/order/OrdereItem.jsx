import React from 'react'
import st from './OrderItem.module.css'
import { priceNumber} from '../../utils/priceNumber'
import Link from 'next/link'
import { productDetail } from '../../utils/urls'

const OrdereItem = (props) => {
    const {data} = props
    const style = {backgroundImage: `url(${data.image? data.image:'/default_order_item_img.svg'})`}
    return (
        <div className={st.order_item}>
            <Link href={productDetail(data.product.slug)}>
                <div className={st.image} style={style}>

                </div>
            </Link>
            <div className={st.info}>
                <p className={st.name}>
                    {data.product_name}
                </p>
                <div className={'flex space_between'}>
                    <span className={st.classify}><span className={st.label}>Classify: </span>{data.variant_name}</span>
                    <span className="price">{priceNumber(data.price)}</span>
                </div>
                <p>x{data.quantity}</p>
                
            </div>
            
        </div>
    )
}

export default OrdereItem
