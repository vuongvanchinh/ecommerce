import React, {useEffect} from 'react'
import { useSelector } from 'react-redux'
const List = (props) => {

    let {attr1, attr2, dispatchFunction, renderItem, wraper_class} = props;
    const data = useSelector(state => {
        let s = state[attr1]
        if(attr2) {
            return s[attr2]
        }
        return s
    })
    
    useEffect(() => {
        console.log('call dispatch function in list component')
        dispatchFunction()
    }, [attr1, attr2])
    
    return (
        <div className={wraper_class}>
            {
                data.map((item, index) => (
                    renderItem(item, index)
                ))
            }
        </div>
    )
}
List.defaultProps = {
    wraper_class: "grid grid-col-3 grid-col-md-2 grid-col-sm-1",
    dispatchFunction: () => {}
}
export default List