import React, { useState, useEffect} from 'react'

import './table.css'


const Table = ( props ) => {

    const initDataShow  = props.limit && props.bodyData ? props.bodyData.slice(0, Number(props.limit)) : props.bodyData
    const [ dataShow, setDataShow ] = useState(initDataShow)
    let pages = 1
    let range = []

    if (props.limit !== undefined) {
      let page = Math.floor(props.bodyData.length / Number(props.limit))
      pages = props.bodyData.length % Number(props.limit) === 0 ? page : page + 1
      range = [...Array(pages).keys()]
    }

    useEffect(() => {
      let data = props.limit && props.bodyData ? props.bodyData.slice(0, Number(props.limit)) : props.bodyData
      setDataShow(data)
    }, [props.bodyData, props.limit])

    const [ currPage, setCurrPage] = useState(0)

    const selectPage = (page) => {
      const start = Number(props.limit) * page
      const end = start + Number(props.limit)
      // console.log(props.bodyData.length)
      setDataShow(props.bodyData.slice(start, end))
      setCurrPage(page)
    }

    return (
        <div>
          
            <div className="table-wraper">
              <table className="table">
                {
                  props.headData && props.renderHead ? (
                    <thead>
                      <tr>
                        {
                          props.headData.map((item, index) => props.renderHead(item, index))
                        }
                      </tr>
                    </thead>
                  ) : null
                }
                {
                  props.bodyData && props.renderBody ? (
                    <tbody>
                        {
                          dataShow.map((item, index) => props.renderBody(item, index))
                        }
  
                    </tbody>
                  ) : null
                }
              </table>
            </div>
            {
              pages > 1 ? (
                <div className="table__pagination">
                  {
                    range.map((item, index) =>(
                      <div className={`table__pagination-item ${ currPage === index ? 'active':''}`}
                        onClick={() => selectPage(index)}
                        key={index}
                      >
                        { item + 1}

                      </div>
                    ))
                  }
                </div>

              ) : null
            }
        </div>
    )
}

export default Table
