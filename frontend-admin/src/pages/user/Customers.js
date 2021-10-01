import React, { useEffect} from "react";
import { NavLink, Switch, Route, useRouteMatch, useHistory } from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";

// import Table from "../../components/table/Table";
import TableExtra from "../../components/table/TableExtra";
import Button from "../../components/button/Button";
import AddUser from "./AddUser";
import UpdateUser from './UpdateUser';
// import Checkbox from "../../components/form/checkbox/Checkbox";
// import customerList from "../../assets/JsonData/customers-list.json";
import userApi from "../../utils/api/userApi";
import {setNewListUser, selectUsers } from '../../redux/features/user_list'
import SelectImageItem from "../../components/form/selectimage/selectImageItem/SelectImageItem";

const customerTableHead = [
  "id",
  "name",
  "email",
  "phone",
  // "total orders",
  // "total spend",
  "location",
];

const renderCustomerHead = () => customerTableHead.map((item, index) => {
  return (
    <th key={index}>{item}</th>
  )
})

const searchFields = [
  {value: "email", content:"Email"},
  {value: "username", content:"Name"},
  {value: "phone", content:"Phone"},
  // {value: "phoe", content:"Location"}
];

const actions = [
  {label: "Delete", onClick:() => {console.log("Delete")}},
  {label: "Export", onClick:() => {console.log("Export")}}
]

const renderCustomerBody = (item, index) => (
  <>
    <td>{item.id}</td>
    <td>
      <div className="center-content-wraper">
      <SelectImageItem variant="small" image={item.avatar} viewOnly={true}/>
      <span style={{marginLeft: "10px"}}>{item.username}</span>
      </div>
    </td>
    <td>{item.email}</td>
    <td>{item.phone}</td>
    <td>{item.address.length !== 0? item.address[0].city:""}</td> 
  </>
);


const Customers = () => {
  const { path, url } = useRouteMatch()
  const userData = useSelector(state => state.user_list)
  const dispatch = useDispatch()

  let history  = useHistory()
  
  const selectItem = (dt) => {
   
    dispatch(selectUsers(dt))
  }

  const onPickItem = (item) => {
    history.push(`/dashboard/customers/${item.id}`)
  }
  
  
  useEffect(() => {
    console.log("Render customers ")
    if(userData.data.length === 0) {
      console.log("call list user")
      const getListUser = async () => {
        try {
          const params = {limit:10}
          let res = await userApi.getListUser(params)
          if (res.status === 200) {
            dispatch(setNewListUser(res.data))
          }
        } catch (error) {
          console.log(error)
        }
      }
      getListUser()
    }
    
    document.title = "Customers"
    return () => {
      console.log("Un mount customers component")
    }
  }, [])

  return (
    <div className="page-center">
      <Switch>
        <Route path={path} exact>
          
          <div className="page-header">
            <h2>Customers</h2>
            <NavLink to={`${url}/add`}>
                <Button>Create new user</Button>
              </NavLink>
          </div>

          <div className="row">
            <div className="col-12">
              <TableExtra 
                data={userData.data}
                title="Customers"
                placeholder="Search customers"
                searchFields={ searchFields}
                renderBodyItems = {(item, index) =>  renderCustomerBody(item, index)}
                renderHeadItems = {renderCustomerHead}
                handleSelectItem={selectItem}
                selectedItems={userData.selectedItems}
                actions ={actions}
                onPickItem = {(item) => onPickItem(item) }
              />
              {/* <div className="card">
                <div className="card__body">
                  
                  <Table
                    limit={10}
                    headData={customerTableHead}
                    renderHead={(item, index) =>
                      renderCustomerHead(item, index)
                    }
                    bodyData={userData.data}
                    renderBody={(item, index) =>
                      renderCustomerBody(item, index)
                    }
                  />
                </div>
              </div> */}
            </div>
          </div>
        </Route>
        
        <Route path={`${path}/add`} component={AddUser} />
        <Route path={`${path}/:id`} component={UpdateUser}/>
      </Switch>
    </div>
  );
};

export default Customers;
