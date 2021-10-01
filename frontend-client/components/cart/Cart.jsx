import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'
import CartItem from '../cartitem/CartItem'
import { priceNumber } from '../../utils/priceNumber';
import st from './Cart.module.css'
import Link from 'next/link'
import { productPage } from '../../utils/urls';
const renderCartItem = (item, index, mode='standard') => {
    return <CartItem key={index} item={item} index={index} image={item.image} mode={mode}/>;
};

const Cart = ({mode, show_summary, renderHeader}) => {
    const cart = useSelector(state => state.cart.data)
    console.log('cart', cart)
    const total = useMemo(() => {
      let res = 0;
      for (let i = 0; i < cart.length; i++) {
        // console.log(cart[i])
        res += cart[i].variant.price * cart[i].quantity
      }
      return res;
    }, [cart]);

    return (
        <div>
            {
              renderHeader()
            }
            {cart ? (
              cart.map((item, index) => renderCartItem(item, index, mode))
            ):null}
            {cart.length === 0? (
              <p className="padding_1rem">
                <span >Your cart is empty!</span> 
                <span className="link">
                  <Link href={productPage()}>
                    <a > go to shopping</a>
                  </Link>
                </span>
              </p>
            ):null}
            {
              show_summary? (
                <div className={st.summary}>
                  <p></p>
                  <p>
                    <span className={st.label}>Sum:</span>{" "}
                    <span className={`price`}>{priceNumber(total)}</span>
                  </p>
                </div>
              ):null
            }
        </div>
    )
}

Cart.defaultProps = {
  show_summary: false,
  renderHeader: () => (
    <p className="uppercase font-weight-500 card_header">
              Your shoping cart
    </p>
  )
}
export default Cart
