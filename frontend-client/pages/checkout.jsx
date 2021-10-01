import React, { useMemo, useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
// import { setNewCart } from "../redux/features/cart"
// import List from "../components/list/List"
// import cartApi from "../callApi/cartApi"
// import CartItem from "../components/cartitem/CartItem"
import st from "../styles/Checkout.module.css"
import { priceNumber } from "../utils/priceNumber"
import Head from "next/head"
// import ProductCard from "../components/productcard/ProductCard"
// import productApi from "../callApi/productApi"
// import Button from "../components/button/Button"
import Modal from "../components/modal/Modal"
import TextField from "../components/form/textfield/TextField"
import SelectField from "../components/form/selectfield/SelectField"
import Checkbox from "../components/form/checkbox/Checkbox"
import CartItem from "../components/cartitem/CartItem"
import administration from "../assets/JsonData/administrative_vietnam.json"
import orderApi from "../callApi/orderApi"
import Link  from "next/link"
import { cartPage, orderPage } from "../utils/urls"
import Button from "../components/button/Button"
import Cart from "../components/cart/Cart"
import {useRouter} from 'next/router'
import LoginForm from "../components/loginform/LoginForm"
import Loader from "../components/loader/Loader"
import { setNewCart } from "../redux/features/cart"

const validate = (data) => {
  let errors = {}
  if (data.name.length == 0) {
    errors.name = ['This field is required.']
  }
  if(data.phone.length === 0) {
    errors.phone = ['This field is required.']
  }

  if (data.city.length == 0) {
    errors.city = ['This field is required.', 'hello ']
  }


  if (data.district.length == 0) {
    errors.district = ['This field is required.']
  }

  if (data.commune.length == 0) {
    errors.commune = ['This field is required.']
  }

  if (data.detail_address.length == 0) {
    errors.detail_address = ['This field is required.']
  }

  if (data.payment_method.length == 0) {
    errors.payment_method = ['Choose payment method']
  }
  if (data.shipping_method.length == 0) {
    errors.shipping_method = ['Choose shipping method']
  }

  return errors
}
const initialState = {
  name: '',
  email:'',
  phone: '',
  city: '',
  district: '',
  commune: '',
  detail_address: '',
  note: "",
  payment_method: "",
  shipping_method: "",

  errors: {

  }
}
const style = {
  maxWidth: "1080px",
  margin: "0 auto",
  backgroundColor: "transparent",
}

const renderModalHeader = () => (
  <p>Discount</p>
)

const Checkout = (props) => {
  // const cart = useSelector(state => state.cart)
  const dispatch = useDispatch()
  const cart = useSelector((state) => state.cart.data)
  const user = useSelector(state => state.user)
  
  const [data, setData] = useState(initialState)
  const [show_modal, setShowModal] = useState(false)
  const [success, setSuccess] = useState(false)
  const [payment_methods, setPaymentMethods] = useState(false) // false is state when hasn't call api, after call api it going to be array
  const [shipping_methods, setShippingMethod] = useState(false)

  

  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (cart.length > 0) {
      ;(async () => {
        try {
          
          let payment_method = await orderApi.getPaymentMethod()
          let shipping_method = await orderApi.getShippingMethod()
  
          if (payment_method.status === 200 && shipping_method.status === 200) {
            
            setPaymentMethods(payment_method.data)
            setShippingMethod(shipping_method.data)
            setLoading(false)
          }
        } catch (error) {}
      })()
    }
  }, [])

  useEffect(() => {
    if(user.email && cart.length > 0) {
      const newData = {
        name: `${user.username? user.username:''}`,
        email: `${user.email? user.email:''}`,
        phone: `${user.phone? user.phone:''}`,
        city: `${user.address && user.address.length >=1? user.address[0].city:''}`,
        district: `${user.address && user.address.length >= 1? user.address[0].district:''}`,
        commune: `${user.address && user.address.length >=1? user.address[0].commune:''}`,
        detail_address: `${user.address && user.address.length >=1? user.address[0].detail:''}`,
        note: "",
        payment_method: "",
        shipping_method: "",
        errors: {
      
        }
      }
      setData(newData)
    }

  },[user])

  

  const handleSubmit = (e) => {
    e.preventDefault()
    let errors = validate(data)
    console.log("errors", errors)
    setData({
      ...data,
      errors
    })
    if(Object.keys(errors).length === 0) {
      let order_items = cart.map((item, index) => {
        return {
          product:item.product.id,
          variant:item.variant.id,
          quantity:item.quantity,
          price:item.variant.price,
          product_name: item.product.name,
          variant_name: item.variant.combind_string,
          product_sku: item.variant.sku,
          image: new URL(item.image).pathname
        }
      })

      ;(async () => {
        let dt = {
          ...data,
          items: order_items
        }
        console.log(dt)

        try {
          setLoading(true)
          let res = await orderApi.create(dt)
          if (res.status === 201) {
            console.log("data checkout", res.data)
            setSuccess(true)
            dispatch(setNewCart([]))
          } else {
            // handle error
            setLoading(false)
          }
          

        } catch (error) {
          alert('There are error')
        }
      })()
      
    }
  }
  const total = useMemo(() => {
    let res = 0
    for (let i = 0; i < cart.length; i++) {
      // console.log(cart[i])
      res += cart[i].variant.price * cart[i].quantity
    }
    return res
  }, [cart])

  const onChange = (dt) => {
    let { name, value } = dt
    setData({
      ...data,
      [name]: value,
    })
  }

  const showModal = () => {
    setShowModal(true)
  }

  const cities = administration.data
  let districts = useMemo(() => {
    console.log("calculate district")
    let res = []
    try {
      if (data.city) {
        let cityIndex = cities.findIndex((city) => city.name === data.city)
        if (cityIndex !== -1) {
          res = cities[cityIndex].level2s
        }
      }
    } catch (error) {
      return res
    }
    return res
  }, [data.city, cities])

  let communes = useMemo(() => {
    let res = []
    try {
      if (data.district) {
        let districtIndex = districts.findIndex(
          (district) => district.name === data.district
        )
        if (districtIndex !== -1) {
          res = districts[districtIndex].level3s
        }
      }
    } catch (error) {
      return res
    }
    return res
  }, [data.district, districts])

  if (success) {//after checkout success
    router.push(orderPage())
  }

  if(!cart || cart.length === 0 && !success) {
    router.push(cartPage())
  }

  if (Object.keys(user).length === 0) {
    return (
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
    )
  }

  if (loading) {
    return (
      <div className='flex-center' style={{height: '80vh'}}>
        <Head>
          <title>Checkout</title>
        </Head>
        <Loader variant='large'/>
      </div>
    )
  }

  return (
    <div style={style}>
      <Head>
        <title>Checkout</title>
      </Head>

      {payment_methods !== false && payment_methods.length == 0 || 
      shipping_methods !== false && shipping_methods.length == 0 ? (
        <p>System is not ready to order</p>
      ) : (
        
        <form 
          onSubmit={(e) => handleSubmit(e)}
          className={st.checkout_page}>
          <div className={`${st.form_section} margin-top-1rem `}>
            
              <div className="card ">
                <div className="card_header forn-weight-500">
                  Shipping Information
                </div>
                <div className="card_body">
                  <div className="grid grid-col-1" style={{ padding: "0" }}>
                    <TextField
                      placeholder="Name"
                      name="name"
                      id="name"
                      value={data.name}
                      onChange={(dt) => onChange(dt)}
                      required={true}
                      errors={data.errors.name}
                      required={true}
                    />
                    <TextField
                      placeholder="Phone"
                      name="phone"
                      id="phone"
                      value={data.phone}
                      onChange={(dt) => onChange(dt)}
                      required={true}
                      errors={data.errors.phone}
                      required={true}
                    />
                    <TextField
                      placeholder="Email"
                      type="email"
                      name="email"
                      id="email"
                      value={data.email}
                      onChange={(dt) => onChange(dt)}
                      errors={data.errors.email}
                      
                    />
                    <div className="grid grid-col-2" style={{ padding: "0" }}>
                      <SelectField
                        options={cities}
                        value_attr="name"
                        content_attr="name"
                        value={data.city}
                        label="City"
                        name="city"
                        id="city"
                        required={true}
                        onChange={(dt) => onChange(dt)}
                        errors={data.errors.city}
                        
                      />
                      <SelectField
                        options={districts}
                        value_attr="name"
                        content_attr="name"
                        value={data.district}
                        label="District"
                        name="district"
                        id="district"
                        required={true}
                        onChange={(dt) => onChange(dt)}
                        errors={data.errors.district}
                      />
                      <SelectField
                        options={communes}
                        value_attr="name"
                        content_attr="name"
                        value={data.commune}
                        label="Commune"
                        name="commune"
                        id="commune"
                        required={true}
                        onChange={(dt) => onChange(dt)}
                        errors={data.errors.commune}
                      />
                    </div>
                    <TextField
                      placeholder="Address detail"
                      name="detail_address"
                      id="detail_address"
                      value={data.detail_address}
                      onChange={(dt) => onChange(dt)}
                      required={true}
                      errors={data.errors.detail_address}
                      required={true}
                    />
                    <TextField
                      placeholder="Note"
                      name="note"
                      id="note"
                      value={data.note}
                      onChange={(dt) => onChange(dt)}
                      errors={data.errors.note}
                    />
                  </div>
                </div>
              </div>
              
              <div className="card">
                <div className="card_header">Shipping Method</div>
                <div className="card_body">
                  { 
                    data.errors.shipping_method? (
                      data.errors.shipping_method.map((item, index) => (
                        <p className="error-message" key={index}>{item}</p>
                      ))
                    ):null
                  }
                  {shipping_methods
                    ? shipping_methods.map((item, index) => (
                        <Checkbox
                          key={index}
                          label={item.name}
                          id={item.name}
                          name="shipping_method"
                          checked={data.shipping_method === item.name}
                          checked_value={item.name}
                          unchecked_value=""
                          onChange={(dt) => onChange(dt)}
                        />
                      ))
                    : null}
                </div>
              </div>
              <div className="card">
                <div className="card_header">Payment Method</div>
                <div className="card_body">
                  { 
                    data.errors.payment_method? (
                      data.errors.payment_method.map((item, index) => (
                        <p className="error-message" key={index}>{item}</p>
                      ))
                    ):null
                  }
                  {payment_methods
                    ? payment_methods.map((item, index) => (
                        <Checkbox
                          key={index}
                          label={item.name}
                          id={item.name}
                          name="payment_method"
                          checked={data.payment_method === item.name}
                          checked_value={item.name}
                          unchecked_value=""
                          onChange={(dt) => onChange(dt)}
                        />
                      ))
                    : null}
                </div>
              </div>
             
          
          </div>

          <div className={`${st.cart_section}  margin-top-1rem`}>
            <div className="card">
              {/* <div className="card_header">Your Cart</div> */}
              <div >
                <Cart mode='thumbnail'/>
                <div className={st.cart_footer}>
                  <p
                    className={`${st.discount} ${st.label} ${st.link}`}
                    onClick={() => showModal()}
                  >
                    Select voucher?
                    <Modal
                      show={show_modal}
                      onHide={() => setShowModal(false)}
                      renderHeader={renderModalHeader}
                    />
                  </p>
                  <Link href={cartPage()}>
                    <p className={`${st.label} ${st.link}`}>Edit your cart</p>
                  </Link>
                </div>
              
              </div>
            </div>
            <div className="card">
              <div className="card_header">Summary</div>
              <div className="card_body">
                <table className={st.summary_cart}>
                  <tbody>
                    <tr>
                      <td>
                        <span className={st.label}>Shipping fee</span>
                      </td>
                      <td>
                        <span className={st.label}>:</span>
                        <span className={"price"}>30.000</span>
                      </td>
                    </tr>
                    <tr>
                      <td className={st.label}>Provisional total payment</td>
                      <td>
                        <span className={st.label}>:</span>
                        <span className={"price"}>{priceNumber(total + 30000)}</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <Button variant="dash" type="submit">
                    Checkout
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}

export default Checkout
