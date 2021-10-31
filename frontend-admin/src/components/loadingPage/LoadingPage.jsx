import React from 'react'
import Loader from '../loader/Loader'

const LoadingPage = () => {
    return (
        <div className='flex-center' style={{minHeight: '70vh'}}>
            <Loader variant='large'/>
        </div>
    )
}

export default LoadingPage
