import React, { useEffect, useState} from "react";
import { NavLink, Switch, Route, useRouteMatch, useHistory } from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";

import TableExtra from "../../components/table/TableExtra";
import Button from "../../components/button/Button";
// import Checkbox from "../../components/form/checkbox/Checkbox";

import AddOrder from './AddOrder'
import OrderDetail from './OrderDetail'
import orderApi from "../../utils/api/orderApi";
import {setNewListOrder, selectOrders } from '../../redux/features/order_list'
// import SelectImageItem from "../../components/form/selectimage/selectImageItem/SelectImageItem";
import Badge from "../../components/badge/Badge"
import LoadingPage from "../../components/loadingPage/LoadingPage";

const status = {
  unconfirmed: 'secondary',
  shipping: 'info',
  canceled: 'warning',
  dilivered: 'sussess',
  returned: 'danger'
}

const orderTableHead = [
  "id",
  "customer",
  "date",
  "payment",
  "status",
  "Adress",
  "total",
];

const renderOrderHead = () => orderTableHead.map((item, index) => {
  return (
    <th key={index}>{item}</th>
  )
})

const searchFields = [
  {value: "status", content:"Status"},
  {value: "total_payment", content:"Total"},
  // {value: "status", content:"Total"}
];

const actions = [
  // {label: "Delete", onClick:() => {console.log("Delete")}},
  {label: "Export", onClick:() => {console.log("Export")}}
]

function timeSince(date) {

    var seconds = Math.floor((new Date() - date) / 1000);
  
    var interval = seconds / 31536000;
  
    if (interval > 1) {
      return Math.floor(interval) + " years ago";
    }
    interval = seconds / 2592000;
    if (interval > 1) {
      return Math.floor(interval) + " months ago";
    }
    interval = seconds / 86400;
    if (interval > 1) {
      return Math.floor(interval) + " days ago";
    }
    interval = seconds / 3600;
    if (interval > 1) {
      return Math.floor(interval) + " hours ago";
    }
    interval = seconds / 60;
    if (interval > 1) {
      return Math.floor(interval) + " minutes ago";
    }
    return Math.floor(seconds) + " seconds ago";
}

const renderOrderBody = (item, index) => (
  <>
    <td>#{item.id}</td>
    <td>
      {item.name}
    </td>
    <td>{timeSince(new Date(item.created))}</td>
    <td>
      <div className="flex-container">
        <div className={`dot dot-${item.paid?"success":"warning"}`}></div>
        <span>{item.paid? "Paid":"Unpaid"}</span>
      </div>
    </td>
    <td>
      <Badge content={item.status} type={status[item.status]}/>
      
    </td>
    <td>{item.city}</td>
    <td>{item.total}</td>
  </>

);


const Orders = () => {
  const { path, url } = useRouteMatch()
  const orderData = useSelector(state => state.order_list)
  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch()

  let history  = useHistory()

  const selectItem = (dt) => {
    dispatch(selectOrders(dt))
  }

  const onPickItem = (item) => {
    history.push(`${url}/${item.id}`)
  }
  
  useEffect(() => {
    console.log("Render Orders ")
    if(orderData.data.length === 0) {
      console.log("call list order")
      const getListOrder = async () => {
        try {
        //   const params = {limit:10}
          let res = await orderApi.getListOrder()
          if (res.status === 200) {
            dispatch(setNewListOrder(res.data))
            setLoading(false)
          }
        } catch (error) {
          console.log(error)
        }
      }
      getListOrder()
    } else {
      setLoading(false)
    }

    document.title = "Orders"
    return () => {
      console.log("Un mount orders component")
    }
  }, [])

  if(loading) {
    return <LoadingPage />
  }
  return (
    <div className="page-center">
      <Switch>
        <Route path={path} exact>
          
          <div className="page-header">
            <h2>Orders</h2>
            {/* <NavLink to={`${url}/add`}>
                <Button>Create new order</Button>
            </NavLink> */}
          </div>

          <div className="row">
            <div className="col-12">
              <TableExtra 
                data={orderData.data}
                title="Orders"
                placeholder="Search orders"
                searchFields={ searchFields}
                renderBodyItems = {(item, index) =>  renderOrderBody(item, index)}
                renderHeadItems = {renderOrderHead}
                handleSelectItem={selectItem}
                selectedItems={orderData.selectedItems}
                actions ={actions}
                onPickItem = {(item) => onPickItem(item) }
              />
             
            </div>
          </div>
        </Route>
        
        <Route path={`${path}/add`} exact component={AddOrder} />
        <Route path={`${path}/:id`} component={OrderDetail}/>
      </Switch>
    </div>
  );
};

export default Orders;
