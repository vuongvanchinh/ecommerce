import React, { useEffect, useState} from "react"
import { NavLink, Switch, Route, useRouteMatch, useHistory } from "react-router-dom"

import { useSelector, useDispatch } from "react-redux"

import TableExtra from "../../components/table/TableExtra"
import Button from "../../components/button/Button"
// import Checkbox from "../../components/form/checkbox/Checkbox"
import AddPaymentMethod from './AddPaymentMethod'
import UpdatePaymentMethod from "./UpdatePaymentMethod"
import paymentMethodApi from "../../utils/api/paymentMethodApi"

import { setNewListPaymentMethod, selectPaymentMethods } from "../../redux/features/payment_method_list"
import Badge from "../../components/badge/Badge"
import { paymentMethodAddPage, paymentMethodUpdatePage } from "../../utils/urls"
import LoadingPage from "../../components/loadingPage/LoadingPage"

const paymentMethodTableHead = [
  "id",
  "name",
  "coupon",
  "status",
]

const renderPaymentMethodBody = (item, index) => (
  <>
  <td>{item.id}</td>
    <td>{item.name}</td>
   
    <td>{item.coupon? item.coupon.description:'NULL'}</td>
    <td>{item.active? <Badge content='Active' type='success'/>: <Badge content='Disabled' type='warning'/>  }</td>
  </>
)

const renderPaymentMethodHead = () => paymentMethodTableHead.map((item, index) => {
  return (
    <th key={index}>{item}</th>
  )
})

const searchFields = [
  {value: "name", content:"Name"}
]

const actions = [
  {label: "Delete", onClick:() => {alert("This featute has not implemented yet")}},
  {label: "Export", onClick:() => {alert("This featute has not implemented yet")}}
]


const PaymentMethods = () => {
  const { path } = useRouteMatch()
  const paymentMethodData = useSelector(state => state.payment_method_list)
  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch()

  let history  = useHistory()
  
  const selectItem = (dt) => {
    dispatch(selectPaymentMethods(dt))
  }

  const onPickItem = (item) => {
    history.push(paymentMethodUpdatePage(item.id))
  }
  
  useEffect(() => {
    console.log("render PaymentMethod list")
    document.title = "Payment methods"
    if(paymentMethodData.data.length === 0) {
      console.log("call list payment Method")
      const getListPaymentMethod = async () => {
        try {
          // const params = {limit:50}
          let res = await paymentMethodApi.getListPaymentMethod({})
          if (res.status === 200) {
            dispatch(setNewListPaymentMethod(res.data))
            // console.log(res.data)
            setLoading(false)
          } else {
            alert('Error')
          }
        } catch (error) {
          console.log(error)
        }
      }
      getListPaymentMethod()
    } else {
      setLoading(false)
    }

    return () => {
      console.log("Un mount categories component")
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
            <h2>Payment methods</h2>
            <NavLink to={paymentMethodAddPage()}>
                <Button>Create new payment method</Button>
            </NavLink>
          </div>

          <div className="row">
            <div className="col-12">
              <TableExtra 
                data={paymentMethodData.data}
                title="Payment methods"
                placeholder="Search payment methods"
                searchFields={ searchFields}
                renderBodyItems = {(item, index) =>  renderPaymentMethodBody(item, index)}
                renderHeadItems = {renderPaymentMethodHead}
                handleSelectItem={selectItem}
                selectedItems={paymentMethodData.selectedItems}
                actions ={actions}
                onPickItem = {(item) => onPickItem(item) }
                primary_field='id'
              />
            </div>
          </div>
        </Route>
        
        <Route path={paymentMethodAddPage()} exact component={AddPaymentMethod} />
        <Route path={`${path}/:id`} component={UpdatePaymentMethod}/>
      </Switch>
    </div>
  )
}

export default PaymentMethods