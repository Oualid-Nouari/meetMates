import React, { useContext, useEffect, useState } from 'react'
import Icon from '../imgs/meetMates icon.png'
import '../css/platHeader.css'
import { Contexts } from '../contexts/contexts'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { faBell, faComments, faUser, faCircleUser, faMoon, faCircleXmark } from '@fortawesome/free-regular-svg-icons'
import RequestsModal from './RequestsModal'
import NotificationsModal from './NotificationsModal'
import Chat from './chats/Chat'
import axios from 'axios'
import SearchedUser from './SearchedUser'

const PlatHeader = ({ openSettings, setOpenSettings }) => {
  let { user, requestsReceived, notifsReceived, deliveredMessages, openMessaging, setOpenMessaging, colors, isDarkMode } = useContext(Contexts)
  const [openRequestsModal, setOpenRequestsModal] = useState(false)
  const [openNotifsModal, setOpenNotifsModal] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [searchedUsers, setSearchedUsers] = useState([])
  const [openSearchBar, setOpenSearchBar] = useState(false) // for mobile devices
  const [hover, setHover] = useState(false) // for dark theme
  const handleOpenMessaging = () => {
    setOpenMessaging(true)
    setOpenRequestsModal(false)
    setOpenNotifsModal(false)
  }
  const clickOverlay = () => {
    setOpenMessaging(false)
    setOpenRequestsModal(false)
    setOpenNotifsModal(false)
  }
  openMessaging || openRequestsModal || openNotifsModal ? document.body.style.overflowY = 'hidden' : document.body.style.overflowY = 'auto'
  // HANDLING SEARCH:
  useEffect(() => {
    if (searchText.trim() !== '') {
      axios
        .get(`${process.env.REACT_APP_API_URL}/searchUsers?searchText=${searchText}`, { headers: { 'access_header': `bearer ${localStorage.getItem('token')}` } })
        .then((response) => {
          setSearchedUsers([...response.data.searchedUsers]);
        })
        .catch((err) => console.log(err));
    } else {
      setSearchedUsers([]);
    }
  }, [searchText]);
  const handleChangeSearch = (e) => {
    setSearchText(e.target.value);
  };
  return (
    <header className='platHeader' style={{ backgroundColor: isDarkMode ? colors.secondColor : colors.mainColor }}>
      {searchText && <div className='search-overlay' onClick={() => setSearchText('')}></div>}
      {openRequestsModal || openNotifsModal ? <div className='request-overlay' onClick={clickOverlay}></div> : ""}
      <div className='header-container'>
        <div className={openSearchBar ? 'header-left-part full-width' : 'header-left-part'}>
          <img src={Icon} alt="Logo Icon" className='logo' />
          <input
            type='text'
            placeholder='Search...'
            className={openSearchBar ? 'search full' : 'search'}
            onChange={handleChangeSearch}
            value={searchText}
            style={{ border: `1px solid ${colors.textColor}`, color: colors.textColor }}
          />
          {openSearchBar && 
          <i className='close-full-search' style={{color: colors.textColor}} onClick={() => { setOpenSearchBar(false); setSearchText('') }} >
            <FontAwesomeIcon icon={faCircleXmark} />
          </i>}
          {/* Search modal */}
          {searchText &&
            <div className='searches-container' style={{ backgroundColor: colors.mainColor }}>
              <h4
                style={
                  {
                    textAlign: 'center', padding: 10, 
                    borderBottom: `1px solid ${colors.fourthColor}`, 
                    color: colors.textColor
                  }
                }
              >Search results</h4>
              {searchedUsers.length > 0 ?
              searchedUsers.map((searchedUser, index) => {
                return <SearchedUser key={index} searchedUser={searchedUser} />
              }) : <div className='no-results' style={{color: colors.textColor}}>No Results</div>
            }
            </div>
          }
        </div>
        <div className='header-mid-part' style={{ display: openSearchBar ? 'none' : 'flex' }}>
          <i style={{ color: colors.textColor }} className='mid-link requests-icon' onClick={() => setOpenRequestsModal(true)}>
            {requestsReceived.length > 0 && <div className='new-notif'>{requestsReceived.length}</div>}
            <FontAwesomeIcon icon={faUser} /></i>
          {openRequestsModal && <RequestsModal setOpenRequestsModal={setOpenRequestsModal} />}
          <i style={{ color: colors.textColor }} className='mid-link messaging' onClick={handleOpenMessaging}>
            {deliveredMessages.length > 0 && <div className='new-notif'>{deliveredMessages.length}</div>}
            <FontAwesomeIcon icon={faComments} />
          </i>
          {/* (dark mode and profile and search icons are for the mobile devices): */}
          <i style={{ color: colors.textColor }} className='mid-link dark-mode'><FontAwesomeIcon icon={faMoon} /></i>
          <i style={{ color: colors.textColor }} className="mid-link bell" onClick={() => setOpenNotifsModal(true)}>
            <FontAwesomeIcon icon={faBell} />
            {notifsReceived.length > 0 && <small className='new-notif'>{notifsReceived.length}</small>}
          </i>
          {openNotifsModal && <NotificationsModal setOpenNotifsModal={setOpenNotifsModal} />}
          <i className='profile mid-link'><a href="/profile" style={{ color: colors.textColor }}><FontAwesomeIcon icon={faCircleUser} /></a></i>
          <i style={{ color: colors.textColor }} className='search-icon mid-link' onClick={() => setOpenSearchBar(true)}><FontAwesomeIcon icon={faMagnifyingGlass} /></i>
          {openMessaging && <Chat />}
        </div>
        <div className='header-right-part'>
          <div
            className='drop-down'
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            onClick={() => setOpenSettings(!openSettings)}
            style={{ border: `1px solid ${colors.textColor}`, backgroundColor: hover ? colors.secondColor : 'transparent' }}
          >
            <i style={{ color: colors.textColor }}><FontAwesomeIcon icon={faUser} style={{ marginRight: 10 }} /></i>
            <small style={{ color: colors.textColor }}>{user.fullName}</small>
          </div>
        </div>
      </div>
    </header>
  )
}

export default PlatHeader;
