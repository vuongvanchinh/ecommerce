import React, { useEffect, useState} from "react"
import { NavLink, Switch, Route, useRouteMatch, useHistory } from "react-router-dom"

import { useSelector, useDispatch } from "react-redux"

import TableExtra from "../../components/table/TableExtra"
import Button from "../../components/button/Button"
// import Checkbox from "../../components/form/checkbox/Checkbox"
import AddShippingMethod from './AddShippingMethod'
import UpdateShippingMethod from "./UpdateShippingMethod"
import shippingMethodApi from "../../utils/api/shippingMethodApi"

import { setNewListShippingMethod, selectShippingMethods } from "../../redux/features/shipping_method_list"
import Badge from "../../components/badge/Badge"
import { shippingMethodAddPage, shippingMethodUpdatePage } from "../../utils/urls"
import LoadingPage from "../../components/loadingPage/LoadingPage"
import { priceNumber } from "../../utils/priceNumber"
const shippingMethodTableHead = [
  "id",
  "name",
  "fee",
  "status",
]

const renderShippingMethodBody = (item, index) => (
  <>
  <td>{item.id}</td>
    <td>{item.name}</td>
   
    <td>{priceNumber(item.fee)}</td>
    <td>{item.active? <Badge content='Active' type='success'/>: <Badge content='Disabled' type='warning'/>  }</td>
  </>
)

const renderShippingMethodHead = () => shippingMethodTableHead.map((item, index) => {
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


const ShippingMethods = () => {
  const { path } = useRouteMatch()
  const shippingMethodData = useSelector(state => state.shipping_method_list)
  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch()

  let history  = useHistory()
  
  const selectItem = (dt) => {
    dispatch(selectShippingMethods(dt))
  }

  const onPickItem = (item) => {
    history.push(shippingMethodUpdatePage(item.id))
  }
  
  useEffect(() => {
    console.log("render ShippingMethod list")
    document.title = "Shipping methods"
    if(shippingMethodData.data.length === 0) {
      console.log("call list shipping Method")
      const getListShippingMethod = async () => {
        try {
          // const params = {limit:50}
          let res = await shippingMethodApi.getListShippingMethod({})
          if (res.status === 200) {
            dispatch(setNewListShippingMethod(res.data))
            // console.log(res.data)
            setLoading(false)
          } else {
            alert('Error')
          }
        } catch (error) {
          console.log(error)
        }
      }
      getListShippingMethod()
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
            <h2>Shipping methods</h2>
            <NavLink to={shippingMethodAddPage()}>
                <Button>Create new shipping method</Button>
            </NavLink>
          </div>

          <div className="row">
            <div className="col-12">
              <TableExtra 
                data={shippingMethodData.data}
                title="Shipping methods"
                placeholder="Search shipping methods"
                searchFields={ searchFields}
                renderBodyItems = {(item, index) =>  renderShippingMethodBody(item, index)}
                renderHeadItems = {renderShippingMethodHead}
                handleSelectItem={selectItem}
                selectedItems={shippingMethodData.selectedItems}
                actions ={actions}
                onPickItem = {(item) => onPickItem(item) }
                primary_field='id'
              />
            </div>
          </div>
        </Route>
        
        <Route path={shippingMethodAddPage()} exact component={AddShippingMethod} />
        <Route path={`${path}/:id`} component={UpdateShippingMethod}/>
      </Switch>
    </div>
  )
}

export default ShippingMethods