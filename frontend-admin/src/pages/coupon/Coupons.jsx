import React, { useEffect} from "react"
import { NavLink, Switch, Route, useRouteMatch, useHistory } from "react-router-dom"

import { useSelector, useDispatch } from "react-redux"

import TableExtra from "../../components/table/TableExtra"
import Button from "../../components/button/Button"
// import Checkbox from "../../components/form/checkbox/Checkbox"
import AddCoupon from './AddCoupon'
import UpdateCoupon from "./UpdateCoupon"
import couponApi from "../../utils/api/couponApi"

import { setNewListCoupon, selectCoupons } from "../../redux/features/coupon_list"
import { priceNumber } from "../../utils/priceNumber"
import Badge from "../../components/badge/Badge"
import { couponAddPage, couponUpdatePage } from "../../utils/urls"
const percentage = 'percentage deduction'
const direct = 'direct deduction'
const freeship = 'freeship'

const couponTableHead = [
  "id",
  "code",
  "type",
  "discount",
  "status",
  "min order value to apply",
]

const renderCouponBody = (item, index) => (
  <>
  <td>{item.id}</td>
    <td>{item.code}</td>
    <td>
      {item.type}
    </td>
    <td>{priceNumber(item.discount)}{item.type === percentage? '%':'đ'}</td>
    <td>{item.active? <Badge content='In effect' type='success'/>: <Badge content='Expired' type='warning'/>  }</td>
    <td>{priceNumber(item.min_order_value)} đ</td>
    
  </>
)

const renderCouponHead = () => couponTableHead.map((item, index) => {
  return (
    <th key={index}>{item}</th>
  )
})

const searchFields = [
  {value: "code", content:"Code"},
  {value: "type", content:"Type"},
  {value: "discount", content:"Discount"},
]

const actions = [
  {label: "Delete", onClick:() => {alert("This featute has not implemented yet")}},
  {label: "Export", onClick:() => {alert("This featute has not implemented yet")}}
]


const Coupons = () => {
  const { path } = useRouteMatch()
  const couponData = useSelector(state => state.coupon_list)
  const dispatch = useDispatch()

  let history  = useHistory()
  
  const selectItem = (dt) => {
    dispatch(selectCoupons(dt))
  }

  const onPickItem = (item) => {
    history.push(couponUpdatePage(item.code))
  }
  
  
  useEffect(() => {
    console.log("render Coupon list")
    document.title = "Coupons"
    if(1) {
      console.log("call list coupon")
      const getListCoupon = async () => {
        try {
          // const params = {limit:50}
          let res = await couponApi.getListCoupon({})
          if (res.status === 200) {
            dispatch(setNewListCoupon(res.data))
            console.log(res.data)
          }
        } catch (error) {
          console.log(error)
        }
      }
      getListCoupon()
    }

    return () => {
      console.log("Un mount categories component")
    }
  }, [])

  return (
    <div className="page-center">
      <Switch>
        <Route path={path} exact>
          
          <div className="page-header">
            <h2>Coupons</h2>
            <NavLink to={couponAddPage()}>
                <Button>Create new coupon</Button>
            </NavLink>
          </div>

          <div className="row">
            <div className="col-12">
              <TableExtra 
                data={couponData.data}
                title="Coupons"
                placeholder="Search coupons"
                searchFields={ searchFields}
                renderBodyItems = {(item, index) =>  renderCouponBody(item, index)}
                renderHeadItems = {renderCouponHead}
                handleSelectItem={selectItem}
                selectedItems={couponData.selectedItems}
                actions ={actions}
                onPickItem = {(item) => onPickItem(item) }
                primary_field='id'
              />
            </div>
          </div>
        </Route>
        
        <Route path={couponAddPage()} exact component={AddCoupon} />
        <Route path={`${path}/:id`} component={UpdateCoupon}/>
      </Switch>
    </div>
  )
}

export default Coupons
