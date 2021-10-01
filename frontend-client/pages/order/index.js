import React, {useEffect, useState} from 'react'
import st from '../../styles/OrderPage.module.css'
import Order from '../../components/order/Order'
import Modal from '../../components/modal/Modal'

import { useSelector} from 'react-redux'
import orderApi from '../../callApi/orderApi'
import Head from 'next/head'
import Loader from '../../components/loader/Loader'
import LoginForm from '../../components/loginform/LoginForm'


const Orders = (props) => {
    const user = useSelector(state => state.user)
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if(user.email) {
            ;(async () => {
                try {
                    let res = await orderApi.getUserOrders()
                    console.log(res)
                    if (res.status === 200) {
                        setOrders(res.data)
                    }
                    setLoading(false)
                } catch (error) {
                    alert(error)
                }
            })()
        }        
    }, [user])


    if(!user.email) {
        return (
            <>
                <Head>
                    <title>Your orders</title>
                </Head>
                <Modal
                  renderHeader = {() => (
                    <div>
                      <p>You are not logged in</p>
                    </div>
                  )}
                  renderBody = {() => (
                    <LoginForm />
                  )}
                  show={true}
                  onHide = {() => {}}
                />
            </>
          )
    } 
    
    if (loading) {
        return (
          <div className='flex-center' style={{height: '80vh'}}>
            <Head>
              <title>Your orders</title>
            </Head>
            <Loader variant='large'/>
          </div>
        )
      }
    return (
        <div className={st.order_page}>
            <Head>
              <title>Your orders</title>
            </Head>
            <p className='page_header'>Your orders</p>  
            <div className={`${st.orders_wraper}`}>
                {
                    orders.map((order, index) => (
                        <div className="section"  key={index}>
                          <Order order={order} index={index}/>                         
                        </div>
                    ))
                }
            </div>     
        </div>
    )
}

export default Orders
