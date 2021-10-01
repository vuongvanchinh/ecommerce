import React, { useEffect} from "react";
import UserForm from "../../components/userform/UserForm";
import { useDispatch } from "react-redux";
import { onClear } from "../../redux/features/user_crud";

const AddUser = () => {
  const dispatch = useDispatch();
  
  useEffect(() => {
    document.title = "Add customer"
    return () =>{
      console.log("onclear user add")
      dispatch(onClear())
    }
  }, [])
  
  return (
    <>
      <div className="page-header">
        <h2>Create User</h2>
      </div>
      <UserForm 
        // data={user_crud}
      />
    </>
  );
};

export default AddUser;
