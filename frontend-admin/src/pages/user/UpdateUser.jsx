import React, {useEffect} from 'react'
import { useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import UserForm from '../../components/userform/UserForm'
import { onSetNew, onClear} from '../../redux/features/user_crud'
// import Loader from '../../components/loader/Loader'

const UpdateUser = () => {
    let { id } = useParams()
    id = parseInt(id)
    const usersData = useSelector(state => state.user_list)
    const userList = usersData.data
    let dispatch = useDispatch()
    let current_index = userList.findIndex(user => user.id === id);

    useEffect(() => {
        console.log("Render Update User ", current_index)
        if (current_index >= 0) {
            // console.log(userList[current_index])
            console.log("call set new crud user")
            dispatch(onSetNew(userList[current_index]))
            document.title = userList[current_index].name
        }
        return () => {
            dispatch(onClear())
            console.log("Unmount Update User ")
        }
    }, [current_index])

    useEffect(() => {
        document.title = 'Update user'        
    }, [])

    const renderHistoryUser = (data) => (
        <div className="form-card">
            <div className="form-card__header">
                History User
            </div>
            <div className="form-card__body">
                <small style={{marginBottom: "10px"}}>Last login</small>
                <p>{data.last_login? data.last_login: "-"}</p>
                <hr style={{margin:"10px 0"}} />
                <small >Last order</small>
                <p>There is no order</p>
            </div>
        </div>
    )

    return (
        <>
            <h2 className="page-header">
                {current_index !== -1? userList[current_index].email:"Update user"}
            </h2>
            <UserForm 
                action="update"
                renderHistoryUser={(data) =>renderHistoryUser(data)}
            />
            {/* <div className="row">
            <div className="col-md-12 col-6">
            </div>
            </div> */}
      </>
    )
}

export default UpdateUser
