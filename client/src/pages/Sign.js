import React, { useState } from 'react'
import Navbar from '../Components/Navbar'
import Signup from '../Components/connectedUser/signup'
import '../css/Home.css'
import '../css/homeBack.css'
import Purpose from '../Components/Purpose'

const Home = () => {
  const [openHomeModal, setOpenHomeModal] = useState(false)
  const [accountCreated, setAccountCreated] = useState(false)
  return (
    <div className='home'>
      <p className={accountCreated ? 'accCreated active' : 'accCreated'}>Your account has been created !</p>
      {openHomeModal && <div className='overlay'></div>}
      <div class="area" >
                <ul class="circles">
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                </ul>
            </div >
      <Navbar setOpenHomeModal={setOpenHomeModal} />
      <Signup setAccountCreated={setAccountCreated} />
      <Purpose openHomeModal={openHomeModal} setOpenHomeModal={setOpenHomeModal} />
    </div>
  )
}

export default Home
