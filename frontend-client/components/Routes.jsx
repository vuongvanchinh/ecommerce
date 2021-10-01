import React from "react";

import { Switch , Route } from "react-router-dom";

import Dashboard from "../pages/Dashboard";
import Customers from "../pages/user/Customers"
import Products from "../pages/product/Products";
import Categories from "../pages/category/Categories";
import Orders from "../pages/order/Orders";

const Routes = (props) => {
  let { path } = props;
  
  return (
    <Switch>
      <Route path={path} exact component={Dashboard} />
      <Route path={`${path}/customers`} component={Customers} />
      <Route path={`${path}/products`} component={Products} />
      <Route path={`${path}/categories`} component={Categories} />
      <Route path={`${path}/orders`} component={Orders} />
    </Switch>
  );
};

export default Routes;
