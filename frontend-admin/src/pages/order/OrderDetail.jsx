import React, { useEffect, useState } from "react";
import {Link} from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import { useParams, useHistory } from "react-router-dom";
import Button from "../../components/button/Button";
import {
  onClear,
  onSetNewOrder,
  // onChange,
} from "../../redux/features/order_crud";
import Table from "../../components/table/Table";
import { updateOrder } from "../../redux/features/order_list";
import orderApi from "../../utils/api/orderApi";
import Quote from "../../components/quote/Quote";
import './order.css'
import Timeline from "../../components/timeline/Timeline";
import Modal from '../../components/modal/Modal'
import LoadingPage from "../../components/loadingPage/LoadingPage";
import { orderListPage } from "../../utils/urls";

// const unconfirm_string = 'unconfirmed'
const order_status = {
  unconfirmed: 'unconfirmed',
  canceled: 'canceled',
  shipping: 'shipping',
  delivered: 'delivered',
  returned: 'returned'
 
}

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
  'Returned'
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

const modal_headers = {
  unconfirmed: 'Are you sure unconfirm this order?',
  canceled: 'This order has actually been canceled? (wont be able to go back)',
  delivered: 'Has this order been delivered?',
  returned: 'This order was actually returned? (can not back)',
  shipping: 'Are you sure confirm this order?'
}


let modalHeader = null
let modalBody = null

const OrderDetail = () => {
  // const history = useHistory();
  const { id } = useParams();
  const orders = useSelector((state) => state.order_list.data);
  const order = useSelector((state) => state.order_crud);
  const dispatch = useDispatch();
  const history = useHistory()
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const onHide = () => {
    setShowModal(false)
  }
  const changeStatus = (sta) => {
    let data = null
    switch (sta) {
      case order_status.unconfirmed:
        data = {status: order_status.unconfirmed}
        break;
      case order_status.shipping:
        data = {status: order_status.shipping}
        break;
      case order_status.canceled:
        data = {status: order_status.canceled}
        break;
      case order_status.returned:
        data = {status: order_status.returned}
        break;
        case order_status.delivered:
          data = {status: order_status.delivered}
          break;
      default:
        break;
    }
    if (data) {
      ;(async () => {
        try {
          let res = await orderApi.changeStatus(order.id, data)
          if (res.status === 200) {
            dispatch(updateOrder(res.data))
            setShowModal(false)
          }
        } catch (error) {
          
        }
      })()
    }

  }
  const renderModalBody = (type) => (
    <div className="flex-space-between">
      <Button variant='light' onClick={() => onHide()}>Cancel</Button>
      <Button onClick={() => changeStatus(type)}>Ok</Button>
    </div>
  )
  const showStatusModal = (type) => {
    modalBody = renderModalBody(type)
    modalHeader =  modal_headers[type]//
    setShowModal(true)
  }

  useEffect(() => {
    let index = orders.findIndex((order) => order.id.toString() === id);

    console.log("Render Update Order ", index);
    if (index >= 0) {
      dispatch(onSetNewOrder(orders[index]));
      document.title = `Order #${orders[index].id}`;
      setLoading(false)
    } else {
     alert("Not found")
     history.push(orderListPage())
    }
    return () => {
      dispatch(onClear());
      console.log("Unmount Order Detail ");
    };
  }, [orders, id]);

  if (loading) {
    return <LoadingPage />
  }

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
              <div className='flex-space-between'>
                {order.status && order.status === order_status.unconfirmed ? (
                  <Button
                    onClick={() => showStatusModal(order_status.shipping)}
                  >Confirm</Button>
                ) : null}
                {order.status && order.status === order_status.shipping ? (
                  <div className='grid grid-col-3 grid-col-sm-1'>
                   
                    <Button variant='primary'
                       onClick={() => showStatusModal(order_status.unconfirmed)}
                    >
                      UnConfirmed
                    </Button>
                    <Button variant='danger'
                       onClick={() => showStatusModal(order_status.canceled)}
                    >
                      Canceled
                    </Button>
                    <Button
                       onClick={() => showStatusModal(order_status.delivered)}
                    >
                      Delivered
                    </Button>
                   
                  </div>
                ) : null}
                {order.status && order.status === order_status.delivered ? (
                  <>
                    <Button variant='danger'
                       onClick={() => showStatusModal(order_status.returned)}
                    >
                      Returned
                    </Button>
                  </>

                ) : null}

                <Modal 
                  show={showModal}
                  onHide={() => onHide()}
                  renderHeader = {() => modalHeader}
                  variant='small'
                > 
                  { modalBody }
                </Modal>
              </div>
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
          <Button variant='dash' onClick={() => alert("This feature has not implement yet")}>
            Generate invoice
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
