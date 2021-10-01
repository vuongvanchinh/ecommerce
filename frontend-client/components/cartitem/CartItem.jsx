import React, { useRef, useState } from "react";
import st from "./CartItem.module.css";
import { priceNumber } from "../../utils/priceNumber";
import { updateItem, deleteItem } from "../../redux/features/cart"
import {useDispatch} from "react-redux"
import { getProductUrl } from "../../utils/getProductUrl"
import Link from 'next/link'
import Modal from '../modal/Modal.jsx'
import Button from "../button/Button";
import Tooltip from '../tooltip/Tooltip'

let renderModalHeader = () => {}
let renderModalBody = () => {}

const confirmDeleteHeader = () => (
  <p>Are you sure delete this item from your cart?</p>    
)

const CartItem = (props) => {
  let { product, quantity, variant, image} = props.item;
  let {index, mode} = props;
  const [show_modal, setShowModal] = useState(false)
  const minus_btn = useRef(null);
  const dispatch = useDispatch()

  const addQuantity = (index, amount) => {
    let t = quantity + amount;

    dispatch(updateItem({index:index, name:'quantity', value: t}))
  };

  const confirmDeleteBody = () => (
    <div className="flex-space-between">
      <Button variant='light' onClick={() => setShowModal(false)}>No</Button>
      <Button onClick={() => {
        dispatch(deleteItem(index))
        setShowModal(false)
      }}>Ok</Button>
    </div>
  )

  const openDeleteModal = () => {
    renderModalHeader = confirmDeleteHeader
    renderModalBody = confirmDeleteBody
    setShowModal(true)
  }
  return (
    <div className={`${st.cart_item} ${st[mode]}`}>
      <div className={st.img}>
        <Link href={getProductUrl(product.slug)}>
          <img src={image} alt="" />
        </Link>
      </div>
      <div className={st.info}>
        <div className={st.name}>
          <span>{product.name}</span>
        </div>
        <div className={st.classify}>
          <span>{variant.combind_string}</span>
        </div>

        {
          mode === 'thumbnail'? (
            <Tooltip
              tooltip_text="Read only"
              type='top'
            >
              <div className={`${st.quantity}`}>
                
                <div className={quantity === 1 || mode ==='thumbnail'? st.disabled:'' } onClick={() => addQuantity(index, -1)} >
                  <i className="bx bx-minus"></i>
                </div>
                <input type="number" value={quantity} readOnly/>
                <div className={quantity >= variant.quantity_in_stock || mode ==='thumbnail'? st.disabled:''} onClick={() => addQuantity(index, 1)}>
                  <i className="bx bx-plus"></i>
                </div>
              </div>
            </Tooltip>
          ):(
            <div className={st.quantity_wraper}>
              <div className={`${st.quantity}`}>
                <div className={quantity === 1 || mode ==='thumbnail'? st.disabled:'' } onClick={() => addQuantity(index, -1)} >
                  <i className="bx bx-minus"></i>
                </div>
                <input type="number" value={quantity} readOnly/>
                <div className={quantity >= variant.quantity_in_stock || mode ==='thumbnail'? st.disabled:''} onClick={() => addQuantity(index, 1)}>
                  <i className="bx bx-plus"></i>
                </div>
              
              </div>
              <span className={st.label}>{variant.quantity_in_stock} available</span>
            </div>
            
          )
        }
        
        <div className={st.price}>
          <span className="price">{priceNumber(variant.price)}</span>
        </div>

        <div className={st.price}>
          <span className="price">{priceNumber(variant.price * quantity)}</span>
        </div>        
      </div>
      {
        mode === 'standard'? (
          <>
            <div className={st.remove} onClick={ openDeleteModal}>
              <i className='bx bx-x'></i>
              
            </div>
            <Modal
              show={show_modal}
              onHide = {() => setShowModal(false)}
              renderHeader = {renderModalHeader}
              renderBody = {renderModalBody}
            />
          </>
        ):null
      }
    </div>
  );
};
CartItem.defaultProps = {
  price: 0.0,
  product: {},
  quantity: 1,
  mode:'standard'
};
export default CartItem;
