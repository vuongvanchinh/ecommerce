import React, { useEffect, useRef } from "react";
import {Link} from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import { useParams, useHistory } from "react-router-dom";
import Button from "../../components/button/Button";
import {
  onClear,
  onSetNewOrder,
  onChange,
} from "../../redux/features/order_crud";
import Table from "../../components/table/Table";
import { updateOrder } from "../../redux/features/order_list";
import orderApi from "../../utils/api/orderApi";
import Quote from "../../components/quote/Quote";
import './order.css'
import Timeline from "../../components/timeline/Timeline";
const unconfirm_string = 'unconfirmed'
const productHeader = [
  "Product",
  "Variant",
  "Sku",
  "Price",
  "Quantity",
  "Total",
];

const STATUS_INDEX= {
  'unconfirm': 0,
  'shipping': 1,
  'delivered': 2,
  'returned': 3
}
const status = [
  'Waiting confirm',
  'Shipping',
  'Delivered',
  'Return'
]

const renderTableHead = (item, index) => <td key={index}>{item}</td>;

const renderTableBodyProduct = (item, index) => (
  <tr key={index}>
    <td>{item.product_name}</td>
    <td>{item.variant_name}</td>
    <td>{item.product_sku}</td>
    <td>{item.price}</td>
    <td>{item.quantity}</td>
    <td>{item.price * item.quantity}</td>
  </tr>
);
const OrderDetail = () => {
  // const history = useHistory();
  const { id } = useParams();
  const orders = useSelector((state) => state.order_list.data);
  const order = useSelector((state) => state.order_crud);
  const dispatch = useDispatch();

  useEffect(() => {
    let index = orders.findIndex((order) => order.id.toString() === id);

    console.log("Render Update Order ", index);
    if (index >= 0) {
      dispatch(onSetNewOrder(orders[index]));
      document.title = `Order #${orders[index].id}`;
    } else {
      console.log(index, orders);
    }
    return () => {
      dispatch(onClear());
      console.log("Unmount Order Detail ");
    };
  }, [orders]);

  // console.log("order", order)

  return (
    <div className="page-center">
      <div className="page-header">
        <h2>Order #{order.id}</h2>
      </div>
      <div className="row">
        <div className="col-md-12 col-8">
         {
           order.note? (
            <Quote 
              content={order.note}
            />
           ):null
         }
          <div className="form-card">
            <div className="form-card__header flex-space-between">
              <div className="flex-container">
                <div
                  className={`dot dot-${order.paid ? "success" : "warning"}`}
                ></div>
                <span>{order.paid ? "Paid" : "Unpaid"}</span>
              </div>
              {order.status && order.status === unconfirm_string ? (
                <Button>Confirm</Button>
              ) : null}
            </div>
            <div className="form-card__body">
              <Table
                headData={productHeader}
                renderHead={renderTableHead}
                bodyData={order.items}
                renderBody={renderTableBodyProduct}
              />
              <p className="text-align-right"><strong>Total product's value: </strong> {order.total}</p>
            </div>
          </div>
          <div className="form-card">
            <div className="form-card__header">Status order</div>
            <div className="form-card__body">
                <Timeline 
                  timelines={status}
                  current_index = {STATUS_INDEX[order.status]}

                />
            </div>
          </div>
          <div className="form-card">
              <div className="form-card__header">
                Method
              </div>
              <div className="form-card__body">
                <div className="line-wraper">
                  <i class='bx bx-package icon'></i>
                  <p className="text-line">
                    {order.shipping_method}
                  </p>
                </div>
                <div className="line-wraper">
                  <i class='bx bx-receipt icon' ></i>
                  <p className="text-line">
                    {order.payment_method}
                  </p>
                </div>
                  
              </div>
          </div>
        
        </div>
        <div className="col-md-12 col-4">
         
          <div className="form-card">
            <div className="form-card__header">Receiver information</div>
            <div className="form-card__body">
              <div className="line-wraper">
                <i class='bx bx-user-circle icon' ></i>
                <p className="text-line">
                  {order.name} {order.user? (
                    <Link to={`/dashboard/customers/${order.id}`}>
                      (view profile)
                    </Link>
                  ):"(nonymous user)"}
                </p>
              </div>
              <div className="line-wraper">
                <i className="bx bx-phone icon"></i>
                <p className="text-line">
                  {order.phone}
                </p>
              </div>
              <div className="line-wraper">
                <i className="bx bx-mail-send icon"></i>
                <p className="text-line">
                  {order.email}
                </p>
              </div>
              <div className="line-wraper">
              <i class='bx bxs-home-smile icon' ></i>
                <p className="text-line">
                  {order.detail_address}
                </p>
              </div>
              <div className="line-wraper">
              <i class='bx bxs-building-house icon' ></i>
                <p className="text-line">
                  {order.commune}
                </p>
              </div>
              <div className="line-wraper">
              <i class='bx bxs-buildings icon' ></i>
                <p className="text-line">
                  {order.district}
                </p>
              </div>
              <div className="line-wraper">
              <i class='bx bxs-city icon'></i>
                <p className="text-line">
                  {order.city}
                </p>
              </div>
            </div>
          </div>
          <Button variant='dash'>
            Generate invoice
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
