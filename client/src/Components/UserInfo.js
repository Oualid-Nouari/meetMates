import React, { useContext, useEffect, useState } from 'react'
import Default_banner from '../imgs/default banner.png'
import Profile_pic from '../imgs/demo profile.png'
import { Contexts } from '../contexts/contexts'
import axios from 'axios'
const UserInfo = ({ user, setOpenInfosForm, requestSent, setRequestSent, setRequestTo, setOpenFriendList, userFriends }) => {
  const { socket, friendsList, setFriendsList, setOpenMessaging, setChatWith, setUser, colors } = useContext(Contexts);
  const [postsCount, setPostsCount] = useState(0)
  const [isHovered, setIsHovered] = useState('')
  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/requestsMade`, {
      headers: {
        'access_header': `bearer ${localStorage.getItem('token')}`
      }
    }).then(Response => {
      const requests = Response.data.requestsMade;
      const newRequests = requests.map((req) => req.receiverId)
      requestSent && setRequestSent(newRequests);
    }).catch(err => {
      console.log(err)
    })
    axios.get(`${process.env.REACT_APP_API_URL}/friend?friendId=${user.id}`)
      .then(Response => {
        const friend = Response.data.friend
        if (friend) {
          if (friend.user1 === user.id || friend.user2 === user.id) {
            setFriendsList(prev => [...prev, user._id])
          }
        }
      }).catch(err => console.log(err))
      // Requesting users posts count
      axios.get(`${process.env.REACT_APP_API_URL}/postsCount?author=${user.id}`)
      .then(Response => setPostsCount(Response.data.postsCount))
      .catch(err => console.log(err))
  }, [])
  const handleCancelRequest = () => {
    let newRequestSent = requestSent.filter((req) => req !== user.id)
    setRequestSent(newRequestSent)
    axios.delete(`${process.env.REACT_APP_API_URL}/request?receiverId=${user.id}`, {
      headers: {
        'access_header': `bearer ${localStorage.getItem('token')}`
      }
    }).then((Response) => {
      const request = Response.data.deletedReq
      request && socket.emit('deleteRequest', { receiverId: request.receiverId, senderId: request.senderId })
    }).catch(err => console.log(err))
  }
  // unmate:
  const removeFriend = () => {
    const newFriendsList = friendsList.filter(friend => friend !== user.id)
    setFriendsList(newFriendsList);
    axios.delete(`${process.env.REACT_APP_API_URL}/friend?friendId=${user.id}`, {
      headers: {
        'access_header': `bearer ${localStorage.getItem('token')}`
      }
    }).then(Response => {
      const deletedFriendShip = Response.data.deletedFriendship;
      socket.emit('unmate', { user1: deletedFriendShip.user1, user2: deletedFriendShip.user2 })
    }).catch(err => console.log(err));
  }
  const handleSendingMessage = () => {
    setOpenMessaging(true)
    setChatWith(user.id)
  }
  const logout = () => {
        setUser(null)
        localStorage.removeItem('token')
        window.location.assign('/sign')
    }
  return (
    <React.Fragment>
      {friendsList && <div className='user-infos'>
      <img className='banner' src={user.bannerImage || Default_banner} alt="Banner" />
      <div className='infos'>
        <div className='essential-infos'>
          <img className='profile' src={user.profileImage || Profile_pic} alt="profile" />
          <h1 className='full-name'>{user.fullName}</h1>
          <p>@{user.username}</p>
          <p className='bio'>{user.bio}</p>
        </div>
        <div className='mates' >
          <div className='num'>
            <div className='num-posts'>
              <h1>{postsCount}</h1>
              <h3>Posts</h3>
            </div>
            <div className='num-mates' onClick={() => setOpenFriendList(true)}>
              <h1>{userFriends ? userFriends.length : 0}</h1>
              <h3>Mates</h3>
            </div>
          </div>
          <div className='user-btns'>
            {setOpenInfosForm ? <button className='edit-profile' onClick={() => setOpenInfosForm(true)} style={{border: `1px solid ${colors.thirdColor}`, backgroundColor: isHovered === 'edit-profile' && colors.thirdColor}} onMouseEnter={() => setIsHovered('edit-profile')} onMouseLeave={() => setIsHovered('')}>Edit profile</button>
              : friendsList.includes(user.id) ? <button onClick={removeFriend} style={{border: `1px solid ${colors.thirdColor}`, backgroundColor: isHovered === 'unmate' && colors.thirdColor}} onMouseEnter={() => setIsHovered('unmate')} onMouseLeave={() => setIsHovered('')}>Unmate</button> 
              : requestSent === [] ? <button className='send-req' onClick={() => { setRequestTo(user.id) }} style={{border: `1px solid ${colors.thirdColor}`, backgroundColor: isHovered === 'request' && colors.thirdColor}} onMouseEnter={() => setIsHovered('request')} onMouseLeave={() => setIsHovered('')}>Request mate</button>
                : !requestSent.includes(user.id)
                  ? <button className='send-req' onClick={() => { setRequestTo(user.id) }} style={{border: `1px solid ${colors.thirdColor}`, backgroundColor: isHovered === 'request' && colors.thirdColor}} onMouseEnter={() => setIsHovered('request')} onMouseLeave={() => setIsHovered('')}>Request mate</button> 
                  : <button onClick={handleCancelRequest} style={{border: `1px solid ${colors.thirdColor}`, backgroundColor: isHovered === 'cancel' && colors.thirdColor}} onMouseEnter={() => setIsHovered('cancel')} onMouseLeave={() => setIsHovered('')}>Cancel</button>
            }
              {friendsList.includes(user.id) ? 
              <button className='send-a-message' onClick={handleSendingMessage} style={{border: `1px solid ${colors.thirdColor}`, backgroundColor: isHovered === 'send-message' && colors.thirdColor}} onMouseEnter={() => setIsHovered('send-message')} onMouseLeave={() => setIsHovered('')}>Send message</button> 
              : setOpenInfosForm ? <button className='logout' onClick={logout} style={{border: `1px solid ${isHovered === 'logout' ? 'red' : colors.thirdColor}`}} onMouseEnter={() => setIsHovered('logout')} onMouseLeave={() => setIsHovered('')}>Logout</button> : ""}
          </div>
        </div>
      </div>
      <div className='gradient'></div>
    </div>}
    </React.Fragment>
  )
}

export default UserInfo
