import React from 'react'

const TableVariant = (props) => {
    let { criterions } = props

    return (
        <table>
            <thead>
                { criterions.map((c, index) =>(
                     <th key={index}>{c.criterion_name}</th>
                ))
                }
                <th>Price</th>
                <th>Instock</th>
            </thead>     
        </table>
    )
}

export default TableVariant
