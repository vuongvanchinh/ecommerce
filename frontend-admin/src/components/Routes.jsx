import React from "react"

import { Switch , Route } from "react-router-dom"

import Dashboard from "../pages/Dashboard"
import Customers from "../pages/user/Customers"
import Products from "../pages/product/Products"
import Categories from "../pages/category/Categories"
import Orders from "../pages/order/Orders"
import Coupons from "../pages/coupon/Coupons"
import { customerListPage, productListPage, categoryListPage, couponListPage, orderListPage } from "../utils/urls"
const Routes = (props) => {
  let { path } = props
  
  return (
    <Switch>
      <Route path={path} exact component={Dashboard} />
      <Route path={customerListPage()} component={Customers} />
      <Route path={productListPage()} component={Products} />
      <Route path={categoryListPage()} component={Categories} />
      <Route path={orderListPage()} component={Orders} />
      <Route path={couponListPage()} component={Coupons} />
    </Switch>
  )
}

export default Routes
