import React, { useContext } from 'react'
import Logo from '../imgs/meetMates icon.png'
import '../css/loading.css'
import { Contexts } from '../contexts/contexts'

const Loading = () => {
    const { colors } = useContext(Contexts)
    return (
        <div className='loading'>
            <img src={Logo} alt="Loading" />
            <h3 style={{color: colors.textColor}}>Loading...</h3>
        </div>
    )
}

export default Loading
