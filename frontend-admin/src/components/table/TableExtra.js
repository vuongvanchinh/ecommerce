import React, { useState, useEffect, useRef } from "react";
import Checkbox from "../form/checkbox/Checkbox";
import Button from "../button/Button";
import Dropdown from "../dropdown/Dropdown";
import SelectField from "../form/selectfield/SelectField";

import "./table_extra.css";

const renderActionToggle = () => "Action";

const renderActionItem = (item, index) => (
  <div onClick={ item.onClick } className="table-extra__action" key={index}>
    {item.label}
  </div>
)

const renderActions = (actions=[]) => (
  <div style={{ zIndex: '2'}} >
    {
      actions.map((action, index) => renderActionItem(action, index))
    }
  </div>
)


const TableExtra = (props) => {
  let {
    data,
    placeholder,
    title,
    searchFields,
    selectedItems,
    renderBodyItems,
    actions,
    primary_field
  } = props;

  // console.log(data)
  const initDataShow = data? data.slice(0, 10): [];

  const [limit, setLimit] = useState(10);
  const [dataShow, setDataShow] = useState(initDataShow);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchField, setSearchField] = useState(searchFields[0].value);
  const queryRef = useRef(null);

  useEffect(() => {
    let dt = data? data.slice(0, limit): []
    setDataShow(dt)
    setCurrentPage(0)
  }, [data, limit])


  const selectItems = (dt) => {
    let id = dt.name.split("_")[1];
    let ids = []
    if (id ==='0') {
      ids = dataShow.map(item => item[primary_field])
      ids.push(0)
    } else {
      if(isNaN(id)) {
        ids = [id]
      } else {
        ids = [parseInt(id)]
      }
    }
    props.handleSelectItem({ids: ids, value:dt.value});
  }

  let p = Math.floor(data.length / limit);
  
  let pages = data.length % limit === 0 ? p : p + 1;
  let range = [...Array(pages).keys()];
  
  const selectPage = (page) => {
    const start = limit * page
    const end = start + limit
    // console.log(props.bodyData.length)
    setDataShow(data.slice(start, end))
    setCurrentPage(page)
  }

  const search = () =>{
    console.log(queryRef.current.value)
    let query = queryRef.current.value
    if (query.trim()) {
      let dt = data.filter(item => item[searchField].toString().toLowerCase().includes(query.toLowerCase()))
      setDataShow(dt)
    } else if (query ==='') {
      const start = limit * currentPage
      const end = start + limit
      // console.log(props.bodyData.length)
      setDataShow(data.slice(start, end))
    }
    
  }

  return (
    <div className="table-extra">
      <div className="table-extra__header">{title}</div>
      <div className="search-filter ">
        <Dropdown
          customToggle={() => renderActionToggle()}
          renderBody = {() => renderActions(actions)}
        />
        <div className="search-wraper">
          <input
            ref= {queryRef}
            onChange= {() => search()}
            type="text"
            name="query"
            id="query"
            placeholder={placeholder}
          />
          {
            searchFields.length > 0? (
             <div className='searchfield'>
                <SelectField
                  name="searchfield"
                  options={searchFields}
                  value={searchField}
                  onChange={(dt) => setSearchField(dt.value)}
              />
             </div>
            ):null
          }
        </div>
      </div>
      <div className="table-extra__wraper">
        <table className='table-extra-table'>
          <thead>
            <tr>
              <th>
                <Checkbox
                  name={`${title.toLowerCase()}_0`}
                  onChange={(dt) => selectItems(dt)}
                  checked={selectedItems.includes(0)}
                />
              </th>
              {props.renderHeadItems ? props.renderHeadItems() : null}
            </tr>
          </thead>
          <tbody>
            {dataShow && renderBodyItems
              ? dataShow.map((item, index) => (
                  <tr key={index} 
                    className={selectedItems.includes(item[primary_field])? "tr-selected": ""}
                    onDoubleClick={() => props.onPickItem(item)}
                  >
                    <td>
                      <Checkbox
                        name={`${title.toLowerCase()}_${item[primary_field]}`}
                        onChange={(dt) => selectItems(dt)}
                        checked={selectedItems.includes(item[primary_field])}
                      />
                    </td>
                    {renderBodyItems(item, index)}
                  </tr>
                ))
              : null}
          </tbody>
        </table>
      </div>

      <div className="table-extra__footer">
        <div>
          Limit:
          <select
            name="limit"
            className="table-extra-limit"
            value={limit}
            onChange={(e) => {setLimit(parseInt(e.target.value))}}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={30}>30</option>
            <option value={40}>40</option>
          </select>
          items
        </div>
        <div>
          {pages > 1 ? (
            <div className="table-extra__pagination">
              {range.map((item, index) => (
                <div
                  className={`table-extra__pagination-item ${
                    currentPage === index ? "active" : ""
                  }`}
                  onClick={() => selectPage(index)}
                  key={index}
                >
                  {item + 1}
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

TableExtra.defaultProps = {
  data: [],
  searchFields: [{ value: "name", content: "name" }],
  title: "Products",
  selectedItems: [],
  primary_field: 'id'
};
export default TableExtra;
