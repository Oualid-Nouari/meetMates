import React, { useContext, useEffect, useState } from 'react'
import '../css/userProfile.css'
import Aside from '../Components/Aside'
import { Contexts } from '../contexts/contexts'
import AddInfosModal from '../Components/connectedUser/addInfosModal'
import UserCard from '../Components/UserCard'
import PostsInProfile from '../Components/Posts'
import SuggestedUsersSide from '../Components/SuggestedUsersSide'
import Loading from '../Components/Loading'
import axios from 'axios'
import UserInfo from '../Components/UserInfo'
import FriendsList from '../Components/FriendsList'
import SentMateReqModal from '../Components/sentMateReqModal'
import Chat from '../Components/chats/Chat'

const Profile = () => {
  let {
    user, setUser, setNewUserData, openEditPostModal, openDeletePostModal, setOpenDeletePostModal,
    requestTo, setRequestTo, setOpenEditPostModal, socket, setRequestSent, openMessaging } = useContext(Contexts);

  const [openAddInfosForm, setOpenInfosForm] = useState(false)
  const [openFriendList, setOpenFriendList] = useState(false)
  const [userFriends, setUserFriends] = useState([])
  const getData = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/user`, {
        headers: {
          'access_header': `bearer ${localStorage.getItem('token')}`
        }
      })
      const userData = response.data;
      setUser(userData)
      setNewUserData(prevData => ({
        ...prevData,
        fullName: userData.fullName || '',
        username: userData.username || '',
        bio: userData.bio || '',
        profileImage: userData.profileImage || '',
        bannerImage: userData.bannerImage || ''
      }))
    } catch (err) {
      console.log(err)
    }
  }
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      window.location.assign('/sign')
    } else {
      getData();
      axios.get(`${process.env.REACT_APP_API_URL}/friends`, {
        headers: {
          'access_header': `bearer ${localStorage.getItem('token')}`
        }
      }).then(Response => {
        setUserFriends(Response.data.friends)
      }).catch(err => console.log(err))
    }
  }, []);
  useEffect(() => {
    socket.on('requestAccepted', data => {
      setUserFriends(prev => [...prev, data.receiverId])
    })
  }, [socket])
  const handleOverlayClick = () => {
    setOpenDeletePostModal(false);
    setRequestTo("");
    setOpenEditPostModal(false)
    setOpenFriendList(false)
    setOpenInfosForm(false)
  }
  return (
    <div>
      {user ? <div>
        {openAddInfosForm && <AddInfosModal openAddInfosForm={openAddInfosForm} setOpenInfosForm={setOpenInfosForm} />}
        {openAddInfosForm ||
          openEditPostModal ||
          openDeletePostModal ||
          requestTo ||
          openFriendList ? <div className='overlay' onClick={handleOverlayClick}></div> : ''}
        {openFriendList && <FriendsList setOpenFriendList={setOpenFriendList} userFriends={userFriends} />}
        {requestTo && <SentMateReqModal
          setRequestSent={setRequestSent}
          requestTo={requestTo}
          setRequestTo={setRequestTo}
        />}
        {openMessaging && <Chat />}
        <Aside />
        <UserInfo
          user={user}
          setOpenInfosForm={setOpenInfosForm}
          setOpenFriendList={setOpenFriendList}
          userFriends={userFriends} />
        <div className='main-of-page'>
          <UserCard
            user={user}
            setUser={setUser}
            setOpenInfosForm={setOpenInfosForm}
            openAddInfosForm={openAddInfosForm}
          />
          <div className='middle-part'>
            <PostsInProfile author={user} />
          </div>
          <SuggestedUsersSide />
        </div>
      </div> : <Loading />}
    </div>
  )
}

export default Profile;

