import React, { useEffect, useState} from "react";
import { NavLink, Switch, Route, useRouteMatch, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import TableExtra from "../../components/table/TableExtra";
import Button from "../../components/button/Button";
// import Checkbox from "../../components/form/checkbox/Checkbox";
import AddProduct from './AddProduct';
import UpdateProduct from "./UpdateProduct";
import productApi from "../../utils/api/productApi";
import {setNewListProduct, selectProducts } from '../../redux/features/product_list'
import SelectImageItem from "../../components/form/selectimage/selectImageItem/SelectImageItem";
import { priceNumber } from "../../utils/priceNumber";
import { productAddPage, productUpdatePage, } from "../../utils/urls"
import LoadingPage from "../../components/loadingPage/LoadingPage";

const productTableHead = [
  "id",
  "name",
  "slug",
  "price"
];

const renderProductHead = () => productTableHead.map((item, index) => {
  return (
    <th key={index}>{item}</th>
  )
})

const searchFields = [
  {value: "name", content:"Name"},
  {value: "slug", content:"Slug"},
  {value: "price", content:"Price"},
];

const actions = [
  {label: "Delete", onClick:() => {console.log("Delete")}},
  {label: "Export", onClick:() => {console.log("Export")}}
]

const renderProductBody = (item, index) => (
  <>
    <td>{item.id}</td>
    <td>
      <div className="center-content-wraper">
        <SelectImageItem variant="small" image={item.images.length > 0? item.images[0].image:null} viewOnly={true}/>
        <span style={{marginLeft: "10px"}}>{item.name}</span>
      </div>
    </td>
    <td>{item.slug}</td>
    <td>{priceNumber(item.price)}</td>
  </>
);


const Products = () => {
  const { path, url } = useRouteMatch()
  const productData = useSelector(state => state.product_list)
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(true)

  let history  = useHistory()
  
  const selectItem = (dt) => {
    dispatch(selectProducts(dt))
  }

  const onPickItem = (item) => {
    history.push(productUpdatePage(item.slug))
  }
  
  
  useEffect(() => {
    console.log("render Product list")
    document.title = "Products"
    if(productData.data.length === 0) {
      console.log("call list product")
      const getListProduct = async () => {
        try {
          // const params = {limit:50}
          let res = await productApi.getListProduct({})
          if (res.status === 200) {
            dispatch(setNewListProduct(res.data))
            setLoading(false)
          } else {
            alert("Errors")
          }
        } catch (error) {
          console.log(error)
        }
      }
      getListProduct()
    } else {
      setLoading(false)
    }

    return () => {
      console.log("Un mount categories component")
    }
  }, [])

  console.log('render product page ')
  if(loading) {
    return <LoadingPage />
  }

  return (
    <div className="page-center">
      <Switch>
        <Route path={path} exact>
          
          <div className="page-header">
            <h2>Products</h2>
            <NavLink to={`${url}/add`}>
                <Button>Create new product</Button>
            </NavLink>
          </div>

          <div className="row">
            <div className="col-12">
              <TableExtra 
                data={productData.data}
                title="Products"
                placeholder="Search customers"
                searchFields={ searchFields}
                renderBodyItems = {(item, index) =>  renderProductBody(item, index)}
                renderHeadItems = {renderProductHead}
                handleSelectItem={selectItem}
                selectedItems={productData.selectedItems}
                actions ={actions}
                onPickItem = {(item) => onPickItem(item) }
              />
            </div>
          </div>
        </Route>
        
        <Route path={productAddPage()} exact component={AddProduct} />
        <Route path={`${path}/:slug`} component={UpdateProduct}/>
      </Switch>
    </div>
  );
};

export default Products;
