import React, {useMemo, useState} from 'react'
import st from './Order.module.css'
import OrderItem from './OrdereItem'
import Button from '../button/Button'

import { priceNumber } from '../../utils/priceNumber'
import orderApi from '../../callApi/orderApi'
import { useDispatch } from 'react-redux'
import Modal from '../modal/Modal'
import { timeSince } from '../../utils/timeSince'
const unconfirmed = 'unconfirmed'

// const status = [
//     'unconfirmed',
//     'shipping',
//     'delivered',
//     'canceled'
// ]
const confirmCancelModalHeader = () => (
    <p>Are you sure to cancel this order?</p>
)

const status_timelines = [
    'Waiting confirm',
    'Shipping',
    'Deliver',
    'Cancel'
]
const indexs = {
    unconfirmed: 0,
    shipping: 1,
    delivered: 2,
    canceled: 3
}

const labels = {
    unconfirmed: 'Waiting confirm',
    shipping: 'Shipping',
    delivered: 'Deliver',
    canceled: 'Canceled'
}

const Order = (props) => {
    
    const { order, index } = props;
    const [data, setData] = useState(order)// data only update status attrbute
    const [showModal, setShowModal] = useState(false)


    const total = useMemo(()=> {
        const shipping_cost = 30000
        let res = 0
        if (order && order.items) {
            for (let i = 0; i < order.items.length; i++) {
                res += (order.items[i].quantity * order.items[i].price)
            }
        }

        return res + shipping_cost
        
    }, [order])


    const date = useMemo(() => {
        return timeSince(new Date(data.created))
    }, [])

    const cancel = () => {
        if (order.id) {
            ;(async () => {
                try {
                    let res = await orderApi.cancel(order.id)
                    if (res.status === 200) {
                        setData(res.data)
                    }
                } catch (error) {
                    
                }
            })()
        }
    }

    const openModal = () => {
        console.log('open modal ', order.id)
        setShowModal(true)
    }
    const closeModal = () => {
        console.log('close modal')
        setShowModal(false)
    }

    const confirmCancelModalBody = () => (
        <div className="flex-space-between">
          <Button variant='light' onClick={() => closeModal()}>No</Button>
          <Button onClick={() => {
            cancel()
            closeModal()
          }}>Ok</Button>
        </div>
      )

    console.log('rerender Order componient ', order.id)
    return (
        <div className={st.order}>
           
            <div className={st.header}>
                <div className={`${st.status} ${st[data.status]}`}>
                    {labels[data.status]}
                </div>
                {
                    index === 0 && data.status === unconfirmed? (
                        <div className={`${st.status} ${st[data.delivered]}`}>
                            Most recent order
                        </div>
                    ):null
                }
              
            </div>
            <div className={st.body}>
                {
                    data.items.map((item, index) => (
                        <OrderItem  data={item} key={index}/>
                    ))
                }
            </div>
            <div className={st.footer}>
                <div className={st.summary}>
                    <p>
                        <span className={st.label}>{date}</span>
                    </p>
                   <p> 
                        <span className={st.label}>Total payment:</span>
                        <span className="price">{priceNumber(total)}</span>
                    </p>
                </div>
                <div className={st.btns}>
                    <div></div>
                    {
                        indexs[data.status] < 2? (

                            <div>
                                 <Modal 
                                    show={showModal}
                                    renderHeader = {() => confirmCancelModalHeader()}
                                    renderBody = {() => confirmCancelModalBody()}
                                    onHide = {() => closeModal()}
                                />
                                <Button variant='danger'
                                    onClick={() => openModal()}
                                >
                                    <div className={st.btn}>
                                        <span>Cancel</span>
                                
                                    </div>
                                </Button>
                            </div>

                        ):(
                            <Button variant='main' disabled={true}>
                                <div className={`${st.btn} ${st.disabled}`}>
                                    <span>Buy now</span>
                                </div>
                            </Button>
                        )
                    }
                </div>
            </div>
        </div>
    )
}
export default Order
