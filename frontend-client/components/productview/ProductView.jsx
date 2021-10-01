import React, { useRef, useEffect, useState, useMemo } from "react";

import st from "./ProductView.module.css";
import {priceNumber} from '../../utils/priceNumber'
import Link from 'next/link'
import Button from '../button/Button'
import {useSelector, useDispatch } from 'react-redux'
import { setNewOptions } from "../../redux/features/product"
import {addProduct} from '../../redux/features/cart'
import Modal from '../modal/Modal'
import {TOGGLE_CART_ID} from '../../constants/common'

import cartApi from '../../callApi/cartApi'
import { productPage } from "../../utils/urls"

const id_image_prefix = "image_item_"

//utils function
const caculateOffset  = (criterions, index) => {
  let res = 1;  
  for (let i = index+1; i < criterions.length; i++) {
    res *= criterions[i].options.length; 
  }
  return res;
}
const getConbindString = (c_index, o_index, options, criterions) => {
  let arr = []
  for(let i = 0; i < c_index; i++) {
    arr.push(criterions[i].options[options[i]].option_name)
  }
  arr.push(criterions[c_index].options[o_index].option_name)
  return arr.join('-');
}

const isOutOfStock = (combind_string, variants) => {
  let res = 0;
  for (let i = 0; i < variants.length; i++)  {
    if (variants[i].combind_string.includes(combind_string)) {
      res += variants[i].quantity_in_stock
      if (res > 0) {
        return false
      }
    }
  }
  return true;
}

const caculateVariantIndex = (option_indexs, criterions) => {
  let res = 0;
  for (let i = 0; i < option_indexs.length; i++) {
    res += option_indexs[i] * caculateOffset(criterions, i)
  }
  return res;
}


const renderErrBody = (quantity) =>  {
  return (
    <div style={{paddingBottom: '30px'}}>
      You have {quantity} this products in your shopping cart. 
      The selected quantity cannot be added to the cart as it will exceed your purchase limit.
    </div>
  )
}
let renderErrModalBody = null

const ProductView = (props) => {
  const { data } = props;
  const {images, criterions, variants, name, category, id, price} = props;
  const [quantity, setQuantity] = useState(1)
  const dispatch = useDispatch()
  const cart = useSelector(state => state.cart.data)
  const options = useSelector(state => state.product.options)

  const [images_show, set_images_show] = useState([])
  const [showModal, setShowModal] = useState(false)

  const main_image = useRef(null)
  const main_image_index = useRef(0)
  const list_images = useRef(null)

  const variant = useMemo(() => {
    return variants[caculateVariantIndex(options, criterions)]
  }, [options])

  useEffect(() => {    
    return () => {
      console.log("Unmount product view");
    };
  }, []);

  useEffect(() => {
    let images_show_init = []  
    if(criterions && criterions.length > 0) {
      let indexs = criterions[0].options[0].images
      images_show_init = indexs.map((id) => {
        if(id < images.length) {
          return images[id]
        }
        return ''
      })
    } else {
      images_show_init= images
    }
    if (images_show_init.length === 0) {
      images_show_init= images
    
    }
    set_images_show(images_show_init)
    if (images_show_init.length > 0) {
      console.log('images change')
      pickImage(images_show_init[0], 0)
    }

  }, [images, criterions])

  const pickImage = (url, index) => {
    if (main_image && main_image.current && images_show.length > 0) {
      main_image.current.style["background-image"] = `url(${url})`
      if (main_image_index && main_image_index.current !== null) {
        let id = `${id_image_prefix}${main_image_index.current}`
        let pic = document.getElementById(id)
        if (pic) {
          pic.classList.remove(st.active)
        }
        pic = document.getElementById(`${id_image_prefix}${index}`)
        if (pic) {
          pic.classList.add(st.active)
        }
        main_image_index.current = index
      }
    }
  };
  
  const onPickOption = (c_index, o_index) => {
    let newOptions = [...options]
    newOptions[c_index] = o_index
    // change images 
    if(c_index === 0) {
      let images_show_init = []  
      if(criterions && criterions.length > 0) {
        let indexs = criterions[0].options[o_index].images
        indexs.map((id) => {
          if(id < images.length) {
            images_show_init.push(images[id])
          }
        })
      } else {
        images_show_init == images? images:[]
      }
      set_images_show(images_show_init);
      if(images_show_init.length > 0) {
        pickImage(images_show_init[0], 0)
      }

    }
    // reselect available variant option
    for (let i = c_index +1; i < criterions.length; i++) {
      newOptions[i] = 0
      //An infinite loop cannot happen because the previous 
      //selection guarantees an available variant in this loop
      while (isOutOfStock(getConbindString(i, newOptions[i], newOptions, criterions), variants)) {
        newOptions[i] = newOptions[i] + 1
      }
    }
    dispatch(setNewOptions(newOptions))
    setQuantity(1)
  }
  const addQuantity = (amount) => {

    if (quantity === '') {
      setQuantity(1)
    } else {
      let q = quantity + amount
      if (q > 1 && q <= variant.quantity_in_stock) {
        setQuantity(q)
      }
      
    }
    
  }
  
  const renderErrFooter = () => {
    return (
      <Button variant="dash" onClick={() => setShowModal(false)}>
        Ok
      </Button>
    )
  }
  

  console.log("render product view");
  const style = {
    backgroundImage: `url(${data && images ? images[0] : ""})`,
  };

  const scroll = (direction = 1 ) => {
      let img_el = list_images.current.firstChild
      let img_w = img_el.offsetWidth + 10 //10 is margin 
      list_images.current.scrollLeft = list_images.current.scrollLeft + direction * img_w;
  }

  const addToCart = () => {
    
  
    //Check if the product is already in the cart
    let index_cart = cart.findIndex(item => item.variant.id === variant.id)
    if (index_cart !== -1 && 
      cart[index_cart].variant.quantity_in_stock < cart[index_cart].quantity + quantity ) {
        renderErrModalBody = renderErrBody(cart[index_cart].quantity)
        setShowModal(true)
    } else {
      let img_url = images_show.length > 0? images_show[0]:null
      if (img_url) {
        img_url = new URL(img_url).pathname
      }
      let dt = {
        product: id,
        quantity: quantity,
        variant: variant.id,
        image: img_url
      }
      
      ;(async () => {
            try {
              let res = await cartApi.addProduct(dt)
              if (res.status === 200) {
                console.log(res.data)
                dispatch(addProduct(res.data))
                // open cart thumbnail
                document.getElementById(TOGGLE_CART_ID).click()
              }
            } catch (error) {
              console.log(error)
            }
          })()
    }
  }

  const classify_section = useMemo(() => {
    return (
      <div className={st.section}>
          {
            criterions ? (
             <>
              {
                criterions.map((c, c_index)=> (
                  <div className={st.citerion} key={c_index}>
                    <p className={st.label}>
                      {c.criterion_name}:
                      {/* <span>{}</span>                    */}
                    </p>
                   <div className={`${st.options}`}>
                    {
                        c.options.map((o, o_index) => (
                          <div 
                            className={`${st.option} ${isOutOfStock(getConbindString(c_index, o_index, options, criterions), variants)? st.disabled_option:''} 
                            ${options[c_index] === o_index? st.option_active:""}`} 
                            key={o_index} 
                            onClick = {() => onPickOption(c_index, o_index)}
                          >
                            {
                              o.images.length > 0?  (
                                <div className={`${st.criterion_image}`}
                                  style={o.images.length > 0? {backgroundImage: `url(${images[o.images[0]]})`}:{}}
                                >
                                </div>
                              ):null
                            }
                            <div className={st.option_name}>
                              {o.option_name}
                            </div>
                            
                          </div>
                        ))
                      }
                   </div>
                  </div>
                ))
              }
             </>
            ):null
          }
        </div>
    )
  }, [criterions, options])
  

  return (
    <div className={st.product_view + " margin-top-1rem"}>
      <div className={st.media}>
        <div ref={main_image} className={st.main_image} style={style}></div>
        <div className={st.list_images_wraper}>
          <div className={st.list_images} ref={list_images}>
            {
              images_show.map((img, index) => (
                <div
                  className={`${st.image_item} ${
                    main_image_index.current === index ? st.active : ""
                  }`}
                  key={index}
                  onMouseOver={() => pickImage(img, index)}
                  id={`${id_image_prefix}${index}`}
                >
                  <img src={img} alt="" draggable="false" />
                </div>
              ))
            }
          </div>
          <i className={`bx bx-chevron-left ${st.previous}`} onClick={() => scroll(-1)}></i>
          <i className={`bx bx-chevron-right ${st.next}`} onClick={() => scroll(1)}></i>
        </div>
      </div>
      <div className={st.content}>
        <h6 className={st.category}>
            Categoty: 
            <Link href={productPage({category: category.name})}>
              <a>{category.name}</a>
            </Link>
          </h6>
        <div className={st.section}>
          <h1 className={st.name}>{name}</h1>
        </div>
        <div className={st.section}>
            <div className={st.price}>
              <span>{priceNumber(price)}</span>
              <span>đ</span>
            </div>
        </div>
        {/* Classify section */}
        { classify_section }
        <div className={st.section}>
          <p className={st.label}>Quantity:</p>
          <div className={st.quantity_wraper}>
            <div className={st.quantity}>
              <div 
                onClick={() => addQuantity(-1)}
                className={quantity === 1? st.disabled:''}
              >
                <i className='bx bx-minus'></i>
              </div>
              <input type="number" value={quantity} readOnly/>
              {/* <span>{quantity.current}</span> */}
              <div
                onClick={() => addQuantity(1)}
                className={quantity === variant.quantity_in_stock? st.disabled:''}
              >
                <i className='bx bx-plus'></i>
              </div>
            </div>
            <div>
              <p className={st.label}>{variant.quantity_in_stock} products available</p>
            </div>
          </div>
        </div>
        
        <div className={st.section}>
          <div className={st.btn}>
            <div>
              <Button variant=""
                onClick={() => addToCart()}
              >
                <div className={st.btn_body}>
                  <i className='bx bx-cart-alt' ></i>
                  <span>Add to cart</span>
                </div>
              </Button>
            </div>
            <div>
            <Button variant="">
              <div className={st.btn_body}>
                  <i className='bx bx-purchase-tag-alt'></i>
                  <span>Buy now</span>
              </div>
            </Button>
            </div>
          </div>
        </div>
      </div>
      <Modal 
        show={showModal}
        renderBody = {() => renderErrModalBody}
        renderFooter = {() => renderErrFooter()} 
        onHide={() => setShowModal(false)}
      />
    </div>
  );
};

ProductView.defaultProps = {
  data: {
    images: ["", ""],
    category: {},
    criterions: []
  },
};
export default ProductView;
