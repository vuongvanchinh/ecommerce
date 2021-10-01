import React, {useEffect, useRef} from "react"
import { useDispatch, useSelector } from "react-redux"
import { useRouter } from 'next/router'
import st from "./Navbar.module.css"
import Link from "next/link"
import navbars from "../../assets/JsonData/navbar_routes.json"
import NotificationButton from "../notificationbutton/NotificationButton"

import { setNewUser } from "../../redux/features/user"
// import logo from "../..//second_logo.png"
import Dropdown from '../dropdown/Dropdown'
import Cart from "../cart/Cart"
import {cartPage, checkoutPage, loginPage, registerPage, settingPage, orderPage} from '../../utils/urls'
import Button from "../button/Button"
import {TOGGLE_CART_ID} from '../../constants/common'

const logo = '/second_logo.png'
const anonymous_menu = [
  {
    icon: 'bx bx-log-in',
    name: 'Login',
    onClick: (router) => {
      router.push({
        pathname: loginPage(),
        // query: {
        //   next: `/`
        // }
      })
    }
  },
  {
    icon: 'bx bx-user-plus',
    name: 'Register',
    onClick: (router) => {
      router.push({
        pathname: registerPage(),
        // query: {
        //   next: `/`
        // }
      })
    }
  }
]



const renderCartBody = () => (
  <Cart mode='thumbnail'
    renderHeader={() => (
      <div className='card_header padding_1rem main_color_background color_white'>Your cart</div>
    )}
  />
)

const renderCartFooter = () => (
  <div className={`${st.cart_footer} flex space_between`}>
    <div>
      <Link href={cartPage()}>
          <div>
            <Button variant="">
              <div className={`${st.cart_btn} orange-color`}>
                <i className="bx bx-cart"></i>
                <span>View Cart</span>
              </div>
            </Button>
          </div>
      </Link>
    </div>
    <div>
      <Link href={checkoutPage()}>
        <div>
          <Button variant="">
            <div className={`${st.checkout_btn} main-color`}>
              <i className="bx bx-purchase-tag-alt"></i>
              <span>Checkout</span>
            </div>
          </Button>
        </div>
      </Link>
    </div>
  </div>
)

const renderUserToggle = (user) => {
  if (user.email) {
    return (
      <div className={st.auth_user_toggle}>
        <img src={user.avatar} alt="" />
        <span className="label">{user.username}</span>
      </div>
    )
  } else {
    return (
      <div className={st.user_toggle}>
        <i className="bx bx-user"></i>
      </div>
    )
  }
}
const renderCartToggle = () => {
  return (
    <NotificationButton 
        icon="bx bx-shopping-bag"
        attr1 = 'cart'
        attr2 = 'length'
    />
  )
}

const Navbar = (props) => {
    const router = useRouter()
    const nav = useRef(null)
    const dispatch = useDispatch()
    const user = useSelector(state => state.user)
    const auth_menu = [
      {
        icon: 'bx bx-log-out',
        name: 'Logout',
        onClick: (router) => {
          localStorage.removeItem('jwt')
          dispatch(setNewUser({}))
          router.push('/')
        }
      },
      {
        icon: 'bx bx-receipt',
        name: 'Your orders',
        onClick: (router) => {
          router.push(orderPage())
        }
      },
      {
        icon: 'bx bx-cog',
        name: 'Setting',
        onClick: (router) => {
          router.push({
            pathname: settingPage(),
            // query: {
            //   next: `/`
            // }
          })
        }
      }
    ]
    const renderUserBody = (user, router) => (
      <div className={st.user_menu_body}>
        {
          user.email ? (
            auth_menu.map((item, index) => (
              <p className={st.user_menu_item}
                onClick={() => item.onClick(router)}
                key={index}
              >
                <i className={item.icon}></i>
                <span>{item.name}</span>
              </p>
            ))
          ):(
            anonymous_menu.map((item, index) => (
              <p className={st.user_menu_item}
                onClick={() => item.onClick(router)}
                key={index}
              >
                <i className={item.icon}></i>
                <span>{item.name}</span>
              </p>
            ))
          )
        }
      </div>
    )
    

    



    console.log("render navbar")

    useEffect(() => {
      const func = () => {
        if (document.body.scrollTop > 80 || document.documentElement.scrollTop > 80) {
          if (nav && nav.current) {
            nav.current.classList.add(st.shrink)
          }
          
        } else {
            if (nav && nav.current) {
              nav.current.classList.remove(st.shrink)
            }
        }
      }
      document.addEventListener("scroll", func)
      return () => {
        document.removeEventListener("scroll", func)
      }

    }, [])

    return (
      <div className={st.navbar} ref={nav}>
        <div className={st.side + " " + st.side_left}>
          {navbars.map((item, index) => (
            <div className={st.link} key={index}>
              <Link href={item.route}>
                <a className={router.pathname === item.route? st.active:''}>{item.display_name}</a>
              </Link>
            </div>
          ))}
        </div>
        <div className={st.logo}>
          <img src={logo} alt="" />
        </div>
        <div className={st.side + " " + st.side_right}>
          <div className={st.right_item}>
            <i className="bx bx-search"></i>
          </div>
          <div className={st.right_item}>
          
            <Dropdown 
              renderToggle={() => renderUserToggle(user)}
              renderBody={() => renderUserBody(user, router)}
              
              toggle_id = 'user_toggle'
            />
          </div>
          <div className={st.right_item}>
          
            <Dropdown 
              renderToggle={() => renderCartToggle()}
              renderBody={() => renderCartBody()}
              renderFooter={() => renderCartFooter()}
              toggle_id = {TOGGLE_CART_ID}
            />
          </div>
          
          
        </div>
      </div>
    )
}

export default Navbar
