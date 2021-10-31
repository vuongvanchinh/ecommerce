import React, {useEffect, useState} from 'react'
import { useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import UserForm from '../../components/userform/UserForm'
import { onSetNew, onClear} from '../../redux/features/user_crud'
import LoadingPage from '../../components/loadingPage/LoadingPage'
// import Loader from '../../components/loader/Loader'
import { useHistory } from 'react-router'
import { customerListPage } from '../../utils/urls'
const UpdateUser = () => {

    const { id } = useParams()
    const usersData = useSelector(state => state.user_list)
    const [loading, setLoading] = useState(true)
    const userList = usersData.data
    const history = useHistory()

    let dispatch = useDispatch()
    

    useEffect(() => {
        console.log("Render Update User ")
        let current_index = userList.findIndex(user => user.id.toString() === id);

        if (current_index >= 0) {
            dispatch(onSetNew(userList[current_index]))
            setLoading(false)
            document.title = userList[current_index].name
        } else {
            history.push(customerListPage())
        }
        return () => {
            dispatch(onClear())
            console.log("Unmount Update User ")
        }
    }, [id, userList])

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
    
    if (loading) {
        return <LoadingPage />
    }
    return (
        <>
            <h2 className="page-header">
                Update user
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
