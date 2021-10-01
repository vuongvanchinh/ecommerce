import React from "react"
import Link from "next/link"
import st from "./ProductCard.module.css"
import Image from "next/image"
import Button from "../button/Button"
import { priceNumber } from "../../utils/priceNumber"
import { getProductUrl} from '../../utils/getProductUrl'

const defaut_avt = '/chinh.jpg'

const ProductCard = (props) => {
  let { slug, images, name, price } = props;
  console.log('render product card')
  return (
    <Link href={getProductUrl(slug)}>
      <div className={st.card}>
        <div className={st.images}>
          <img src={images.length > 0 ? images[0] : defaut_avt} alt="" />
        </div>
        <h1 className={st.name}>{name}</h1>
        <div className={st.price}>{priceNumber(price)}</div>
      </div>
    </Link>
  );
};

export default ProductCard;
