import React, { useContext, useState } from 'react'
import '../css/aside.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHouse } from '@fortawesome/free-solid-svg-icons'
import { faBell, faComments, faMoon, faUser } from '@fortawesome/free-regular-svg-icons'
import { faSun } from '@fortawesome/free-solid-svg-icons'
import RequestsModal from './RequestsModal'
import NotificationsModal from './NotificationsModal'
import { Contexts } from '../contexts/contexts'
import { motion } from 'framer-motion'

const Aside = () => {
  let { colors, requestsReceived, notifsReceived, deliveredMessages, openMessaging, setOpenMessaging, setIsDarkMode, isDarkMode } = useContext(Contexts)
  const [openRequestsModal, setOpenRequestsModal] = useState(false)
  const [openNotifsModal, setOpenNotifsModal] = useState(false)
  const backToHome = () => {
    window.open('/', '_self')
  }
  const toggleMode = () => {
    setIsDarkMode(!isDarkMode)
    
    localStorage.setItem('isDarkMode', !isDarkMode)
  }
  const clickOverlay = () => {
    setOpenMessaging(false)
    setOpenRequestsModal(false)
    setOpenNotifsModal(false)
  }
  openMessaging || openRequestsModal || openNotifsModal ? document.body.style.overflowY = 'hidden' : document.body.style.overflowY = 'auto'
  return (
    <div className='aside'>
      {openRequestsModal || openNotifsModal ? <div className='overlay' onClick={clickOverlay}></div> : ""}
      <button className=" aside-btn house" onClick={backToHome}><FontAwesomeIcon icon={faHouse} /></button>
      <motion.button animate={{scale: openRequestsModal ? 1.2 : 1}} style={{backgroundColor: openRequestsModal && colors.thirdColor}} className='requests-icon aside-btn' onClick={() => setOpenRequestsModal(true)}>
        {requestsReceived.length > 0 && <div className='new-notif'>{requestsReceived.length}</div>}
        <FontAwesomeIcon icon={faUser} /></motion.button>
      {openRequestsModal && <RequestsModal setOpenRequestsModal={setOpenRequestsModal} />}
      <motion.button animate={{scale: openNotifsModal ? 1.2 : 1}} style={{backgroundColor: openNotifsModal && colors.thirdColor}} className="bell aside-btn" onClick={() => setOpenNotifsModal(true)}>
        {notifsReceived.length > 0 && <div className='new-notif'>{notifsReceived.length}</div>}
        <FontAwesomeIcon icon={faBell} /></motion.button>
      {openNotifsModal && <NotificationsModal setOpenNotifsModal={setOpenNotifsModal} />}
      <motion.button animate={{scale: openMessaging ? 1.2 : 1}} style={{backgroundColor: openMessaging && colors.thirdColor}} className='messaging aside-btn' onClick={() => setOpenMessaging(true)}>
        {deliveredMessages.length > 0 && <div className='new-notif'>{deliveredMessages.length}</div>}
        <FontAwesomeIcon icon={faComments} />
      </motion.button>
      <button className="moon aside-btn" onClick={toggleMode}> {isDarkMode ? <FontAwesomeIcon icon={faSun} /> : <FontAwesomeIcon icon={faMoon} /> }</button>
    </div>
  )
}

export default Aside
