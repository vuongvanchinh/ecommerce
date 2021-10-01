import React from "react";
import { Link, useHistory } from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";
import TextField from "../form/textfield/TextField";
import SelectField from "../form/selectfield/SelectField";
import { onChange} from "../../redux/features/user_crud";
import {appendListUser, deleteUsers, updateUser} from '../../redux/features/user_list';
import Button from "../button/Button";
import SelectImageItem from "../form/selectimage/selectImageItem/SelectImageItem";
import Checkbox from "../form/checkbox/Checkbox";
import TextEditor from "../form/texteditor/TextEditor";
import administrative_vietnam from "../../assets/JsonData/administrative_vietnam.json";

import "./userform.css";

import userApi from "../../utils/api/userApi";


const validate = (data)=>{
  let result = {}
  let email_regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  if (!email_regex.test(data.email)) {
    result.email = ['Email is not in the correct format.']
  }
  // if(data.username.trim() === "") {
  //   result.username = ['Username have to not only space or emtpy']
  // }

  return result;
}

const UserForm = (props) => {
  let history = useHistory()
  const data = useSelector(state => state.user_crud)
  const user_logedin = useSelector((state) => state.user_login.user_logedin);
  const dispatch = useDispatch();

  let {action, renderHistoryUser } = props;

  if (action === undefined) {
    action = "add";
  }

  const handleChange = (dt) => {
    // console.log(dt)
    dispatch(onChange(dt));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let valid = validate(data)
    if(Object.keys(valid).length !== 0) {
      // alert("Hello")
      handleChange({name:"errors", value: valid})
      return;
    }
    let data_clone = { ...data };
    delete data_clone.errors;

    switch (action) {
      case "add":
        const addUser = async (data) => {
          try {
            console.log(data);
            let res = await userApi.addUser(data);
            console.log(res);
            if (res.status === 201) {
              dispatch(appendListUser([res.data]))
              history.push("/dashboard/customers")

            } else if(res.status === 400 && res.data) {
              dispatch(onChange({name:"errors", value: res.data}))
            }
          } catch (error) {
            console.log(error)
          }
        };
        addUser(data_clone);
        break;
      case "update":
        const update = async (data) => {
          try {
            let res = await userApi.updateUser(data);
            if(res.status === 201) {
              dispatch(updateUser(res.data))
              history.push("/dashboard/customers")
            } else if(res.status === 400 && res.data) {
              dispatch(onChange({name:"errors", value: res.data}))
            }
          } catch (error) {
            console.log(error);
          }
        };
        update(data_clone)
        break
      default:
        break;
    }
  };

  const handleDelete = async (id) => {
    console.log(id)
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        let res = userApi.deleteUser(id)
        dispatch(deleteUsers([parseInt(id)]))
        history.push("/dashboard/customers")
      } catch (error) {
        
      }
    } else {
    }
    
  }

  const cities = administrative_vietnam.data;
  let address = data.address[0];
  let districts = [];
  let communes = [];
  if (address) {
    if (address.city) {
      let cityIndex = cities.findIndex((city) => city.name === address.city);
      if (cityIndex !== -1) {
        districts = cities[cityIndex].level2s;
      }
    }
    if (address.district) {
      let districtIndex = districts.findIndex(
        (district) => district.name === address.district
      );
      if (districtIndex !== -1) {
        communes = districts[districtIndex].level3s;
      }
    }
  }
  return (
    <div className={`user-form`}>
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-sm-12 col-md-12 col-4 margin-bottom-1rem">
            <div className="row">
              <div className="col-md-4 col-12">
                <SelectImageItem
                  variant="large"
                  name="avatar"
                  id="avatar"
                  type="cycle"
                  onChange={handleChange}
                  image={data.avatar}
                />
              </div>
              <div className="col-md-1 col-1" style={{minHeight: "30px"}}>
              </div>
              {action !== "add" && renderHistoryUser && data.is_staff? (
                <div className="col-md-7 col-12">
                  {renderHistoryUser(data)}
                </div>
              ) : null}
            </div>
          </div>
          <div className="col-sm-12 col-md-12 col-8">
            <div className="form-card">
              <div className="form-card__header">User infomation</div>
              <div className="form-card__body">
                <TextField
                  id="email"
                  name="email"
                  value={data.email}
                  onChange={handleChange}
                  placeholder="Email"
                  type="email"
                  variant="outline"
                  errors={data.errors.email}
                />
                <TextField
                  id="username"
                  name="username"
                  value={data.username}
                  onChange={handleChange}
                  placeholder="Username"
                  type="text"
                  variant="outline"
                  errors={data.errors.username}
                />
                <div className="row">
                  <div className="col-6">
                    <TextField
                      id="first_name"
                      name="first_name"
                      value={data.first_name}
                      onChange={handleChange}
                      placeholder="first name"
                    />
                  </div>
                  <div className="col-6">
                    <TextField
                      id="last_name"
                      name="last_name"
                      value={data.last_name}
                      onChange={handleChange}
                      placeholder="last name"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="form-card">
              <div className="form-card__header">Shipment details</div>
              <div className="form-card__body">
                <div className="row">
                  <div className="col-6">
                    <SelectField
                      id="city"
                      name="city"
                      value={address.city}
                      onChange={handleChange}
                      label="city"
                      options={cities}
                      value_attr="name"
                      content_attr="name"
                    />
                  </div>
                  <div className="col-6">
                    <SelectField
                      id="district"
                      name="district"
                      value={address.district}
                      onChange={handleChange}
                      label="district"
                      options={districts}
                      value_attr="name"
                      content_attr="name"
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-6">
                    <SelectField
                      id="commune"
                      name="commune"
                      value={address.commune}
                      onChange={handleChange}
                      label="commune"
                      options={communes}
                      value_attr="name"
                      content_attr="name"
                    />
                  </div>
                  <div className="col-6">
                    <TextField
                      id="address-detail"
                      name="detail"
                      value={address.detail}
                      onChange={handleChange}
                      placeholder="detail"
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-6">
                    <TextField
                      id="phone"
                      name="phone"
                      value={data.phone}
                      onChange={handleChange}
                      placeholder="phone"
                      error={data.errors.phone}
                    />
                  </div>
                </div>
              </div>
            </div>
          {/* if is admin user */}
            {user_logedin.is_staff ? (
              <>
                <div className="form-card">
                  <div className="form-card__header">Active Information</div>
                  <div className="form-card__body row">
                    <div className="col-6 col-sm-12">
                      <Checkbox
                        onChange={handleChange}
                        label="Active"
                        name="is_active"
                        id="is_active"
                        checked={data.is_active}
                      />
                    </div>
                    <div className="col-6 col-sm-12">
                      <Checkbox
                        onChange={handleChange}
                        label="Staff"
                        name="is_staff"
                        id="is_staff"
                        checked={data.is_staff}
                      />
                    </div>
                  </div>
                </div>
                <div className="form-card">
                  <div className="form-card__header">Note about this user</div>
                  <div className="form-card__body">
                    <TextEditor
                      placeholder="Note..."
                      name="note"
                      id="note"
                      onChange={handleChange}
                      content={data.note}
                    />
                  </div>
                </div>
              </>
            ) : null}
            {/* if is admin user */}
          </div>
        </div>
        <div className="form__actions">
          <div>
            {action !== "add" ? (
              <Button type="button" variant="danger"
                onClick={() => handleDelete(data.id)}
              >
                Delete
              </Button>
            ) : null}
          </div>
          <div className="actions">
            <Link to="/dashboard/customers">
              <Button variant="light">Cancel</Button>
            </Link>
            <Button
              type="submit"
              disabled={data.email.trim() ===""}
            >
              Save
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default UserForm;
