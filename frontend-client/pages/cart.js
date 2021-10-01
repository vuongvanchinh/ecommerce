import React, { useMemo, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setNewCart } from "../redux/features/cart";
import List from "../components/list/List";
import cartApi from "../callApi/cartApi";
import CartItem from "../components/cartitem/CartItem";
import st from "../styles/Cart.module.css";
import { priceNumber } from "../utils/priceNumber";
import Head from "next/head";
import ProductCard from "../components/productcard/ProductCard";
import productApi from "../callApi/productApi";
import Button from "../components/button/Button";
import Modal from "../components/modal/Modal";
import { checkoutPage } from "../utils/urls";
import Link from "next/link";
import Cart from "../components/cart/Cart";

const renderCartItem = (item, index) => {
  console.log(item, index);
  return <CartItem key={index} item={item} index={index} />;
};
const renderModalHeader = () => <p>Discount</p>;

const CartPage = (props) => {
  // const cart = useSelector(state => state.cart)
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.data);
  const [recommends, setRecommends] = useState([]);
  const [show_modal, setShowModal] = useState(false);

  useEffect(() => {
    (async function () {
      try {
        if (cart.length > 0) {
          console.log("cart ", cart);
          let res = await productApi.getRecommend(cart[0].product.slug);
          console.log("get recommend");
          if (res.status === 200) {
            setRecommends(res.data);
          }
        } else {
        }
      } catch (error) {}
    })();
  }, []);

  const style = {
    maxWidth: "1080px",
    margin: "0 auto",
    backgroundColor: "transparent",
  };

  const total = useMemo(() => {
    let res = 0;
    for (let i = 0; i < cart.length; i++) {
      // console.log(cart[i])
      res += cart[i].variant.price * cart[i].quantity;
    }
    return res;
  }, [cart]);

  const showModal = () => {
    setShowModal(true);
  };

  return (
    <div style={style}>
      <Head>
        <title>{`(${cart.length}) Your shopping cart`}</title>
      </Head>

      <div className={st.card_page}>
        <div className="card  margin-top-1rem">
          {/* <p className="margin-bottom-1rem uppercase font-weight-500 card_header">
              Your shoping cart
            </p>
            {cart.map((item, index) => renderCartItem(item, index))}
            <div className={st.summary}>
              <p></p>
              <p>
                <span className={st.label}>Sum:</span>{" "}
                <span className={`price`}>{priceNumber(total)}</span>
              </p>
            </div> */}
          <Cart show_summary={true} mode="standard" />
        </div>

        {cart && cart.length > 0 ? (
          <div className="card">
            <div className={st.checkout_body}>
              <table className={st.summary_cart}>
                <tbody>
                  <tr>
                    <td>
                      <span className={st.label}>Provisional shipping fee</span>
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
                      <span className={"price"}>
                        {priceNumber(total + 30000)}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="section_footer">
              <div className={`${st.checkout_footer}`}>
                <div></div>
                <div>
                  <Link href={checkoutPage()}>
                    <div>
                      <Button variant="">
                        <div className={st.ckeckout_btn}>
                          <i class="bx bx-purchase-tag-alt"></i>
                          <span>Checkout</span>
                        </div>
                      </Button>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : null}
        <div className="section">
          {recommends.length > 0 ? (
            <div className="section">
              <p className={`uppercase margin-bottom-1rem font-weight-500`}>
                You maybe like it too
              </p>
              <div className="grid grid-col-6 grid-col-md-4 grid-col-sm-2">
                {recommends.map((item, index) => (
                  <ProductCard
                    key={index}
                    images={item.images}
                    name={item.name}
                    price={item.price}
                    slug={item.slug}
                  />
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default CartPage;
