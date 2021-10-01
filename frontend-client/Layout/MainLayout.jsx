import React, {useEffect, useState} from 'react'
import Navbar from '../components/navbar/Navbar'
import Footer from '../components/footer/Footer'

import st from './MainLayout.module.css'
import userApi from '../callApi/userApi'
import cartApi from '../callApi/cartApi'

import { useDispatch } from 'react-redux'
import {LOG_ID} from '../constants'
import { setNewUser } from '../redux/features/user'
import { setNewCart } from '../redux/features/cart'
import { setNewListCategories } from '../redux/features/categories'
import Loader from '../components/loader/Loader'
import categoryApi from '../callApi/categoryApi'
import { stringify } from 'query-string'

const ClientLayout = (props) => {
    console.log("render layout")
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(true)

    // user 
    useEffect(() => {
        ;( async () => {
            try {
                let jwt = localStorage.getItem('jwt')
                if (jwt) {
                    let res = await userApi.getInfo()
                    
                    if (res.status === 200) {
                        dispatch(setNewUser(res.data))
                    } else {
                        localStorage.removeItem('jwt')
                    }
                    // setLoading(false)
                }
            } catch (error) {
                
            }
        })()
        ;(async () => {
            try {
                let res = await categoryApi.getAll()
                if (res.status === 200) {
                    dispatch(setNewListCategories(res.data))
                }
            } catch (error) {
                
            }
        })()
        ;(async () => {
            let l = localStorage.getItem('cart')
            try {
              if (l) {
                let dt = JSON.parse(l)
                let res = await cartApi.validate(dt)
                
                if (res.status === 200) {
                  dispatch(setNewCart(res.data))
                } else if (res.status === 500 || res.status === 400) {
                  console.log('validate fail request')
                  localStorage.removeItem('cart')
                }
                else {
                    // dispatch(setNewCart([]))
                    // localStorage.setItem('cart', stringify([]))
                }
              }
              setLoading(false)
            } catch (error) {
              console.log('validate fail request catch', error)
              localStorage.removeItem('cart')
            }
          })()
    }, [])

    if (loading) {
        return (
            <div className='flex-center' style={{height: '100vh'}}>
                <Loader variant='large'/>
            </div>
        )
    }

    return (
        <div className={st.container}>
            <div className={st.content}>
                <Navbar />
                <main>
                    {props.children}
                </main>
                <Footer />
            </div>
            <div className={st.log} id={LOG_ID}>
               
            </div>
        </div>
    )
}
export default ClientLayout
