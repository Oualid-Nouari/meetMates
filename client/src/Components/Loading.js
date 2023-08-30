import React, { useContext } from 'react'
import Logo from '../imgs/meetMates icon.png'
import '../css/loading.css'
import { Contexts } from '../contexts/contexts'

const Loading = () => {
    const { isDarkMode } = useContext(Contexts)
    return (
        <div className='loading' style={{backgroundColor: !isDarkMode ? 'rgba(245, 246, 250, 0.8)' : 'rgba(24, 25, 26, 0.8)'}}>
            <img src={Logo} alt="Loading" />
        </div>
    )
}

export default Loading
