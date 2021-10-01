import React, { useEffect} from "react";
import { NavLink, Switch, Route, useRouteMatch, useHistory } from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";

import TableExtra from "../../components/table/TableExtra";
import Button from "../../components/button/Button";
import Checkbox from "../../components/form/checkbox/Checkbox";

import AddCategory from './AddCategory'
import UpdateCategory from './UpdateCategory'
import categoryApi from "../../utils/api/categoryApi";
import {setNewListCategory, selectCategories } from '../../redux/features/category_list'
import SelectImageItem from "../../components/form/selectimage/selectImageItem/SelectImageItem";
import { categoryAddPage, categoryUpdatePage } from "../../utils/urls"

const categoryTableHead = [
  "id",
  "name",
  "slug"
];

const renderCategoryHead = () => categoryTableHead.map((item, index) => {
  return (
    <th key={index}>{item}</th>
  )
})

const searchFields = [
  {value: "name", content:"Name"},
  {value: "slug", content:"Slug"},
];

const actions = [
  {label: "Delete", onClick:() => {console.log("Delete")}},
  {label: "Export", onClick:() => {console.log("Export")}}
]

const renderCategoryBody = (item, index) => (
  <>
    <td>{item.id}</td>
    <td>
      <div className="center-content-wraper">
      <SelectImageItem variant="small" image={item.background_image} viewOnly={true}/>
      <span style={{marginLeft: "10px"}}>{item.name}</span>
      </div>
    </td>
    <td>{item.slug}</td>
  </>
);


const Categories = () => {
  const { path} = useRouteMatch()
  const categoryData = useSelector(state => state.category_list)
  const dispatch = useDispatch()

  let history  = useHistory()
  
  
  const selectItem = (dt) => {
    dispatch(selectCategories(dt))
  }

  const onPickItem = (item) => {
    history.push(categoryUpdatePage(item.slug))
  }
  
  
  useEffect(() => {
    console.log("Render customers ")
    if(categoryData.data.length === 0) {
      console.log("call list category")
      const getListCategory = async () => {
        try {
          const params = {limit:10}
          let res = await categoryApi.getListCategory(params)
          if (res.status === 200) {
            dispatch(setNewListCategory(res.data))
            console.log(res.data)
          }
        } catch (error) {
          console.log(error)
        }
      }
      getListCategory()
    }
    document.title = "Categories"
    return () => {
      console.log("Un mount categories component")
    }
  }, [])

  return (
    <div className="page-center">
      <Switch>
        <Route path={path} exact>
          
          <div className="page-header">
            <h2>Categories</h2>
            <NavLink to={categoryAddPage()}>
                <Button>Create new category</Button>
            </NavLink>
          </div>

          <div className="row">
            <div className="col-12">
              <TableExtra 
                data={categoryData.data}
                title="Categories"
                placeholder="Search customers"
                searchFields={ searchFields}
                renderBodyItems = {(item, index) =>  renderCategoryBody(item, index)}
                renderHeadItems = {renderCategoryHead}
                handleSelectItem={selectItem}
                selectedItems={categoryData.selectedItems}
                actions ={actions}
                onPickItem = {(item) => onPickItem(item) }
              />
             
            </div>
          </div>
        </Route>
        
        <Route path={categoryAddPage()} exact component={AddCategory} />
        <Route path={`${path}/:slug`} component={UpdateCategory}/>
      </Switch>
    </div>
  );
};

export default Categories;
