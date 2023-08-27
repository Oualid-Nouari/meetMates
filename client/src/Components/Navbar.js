import React from 'react'
import Logo from '../imgs/meetMates logo.png'

const Navbar = ({setOpenHomeModal}) => {
    return (
        <header>
            <div className='header-container'>
                <a href='/'><img src={Logo} alt="our logo" className='logo' /></a>
                <span className='purpose' onClick={() => setOpenHomeModal(true)}><i class="fa-regular fa-circle-question"></i> <p>What the purpose of our platform</p></span>
            </div>
        </header>
    )
}

export default Navbar
