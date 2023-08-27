import React, { useContext, useEffect, useState } from 'react'
import Default_profile from '../imgs/demo profile.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserPlus } from '@fortawesome/free-solid-svg-icons'
import { Contexts } from '../contexts/contexts'
import axios from 'axios'

const SuggestedUser = ({ suggestedUser, requestSent, setRequestSent, setRequestTo }) => {
  const { socket, friendsList, setFriendsList, setOpenMessaging, setChatWith, requestsReceived, setRequestsReceived, colors } = useContext(Contexts);
  const [requestsSenders, setRequestsSenders] = useState([])
  useEffect(() => {
    requestsReceived.map(req => {
      setRequestsSenders(prev => [...prev, req.senderId])
    })
    socket.on('requestDeleted', data => {
      const reqReceived = requestsReceived.filter(req => req.senderId !== data.senderId)
      setRequestsReceived(reqReceived);
    })
  }, [requestsReceived])
  const pathToProfile = `/users/${suggestedUser._id}`
  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/requestsMade`, {
      headers: {
        'access_header': `bearer ${localStorage.getItem('token')}`
      }
    }).then(Response => {
      const requests = Response.data.requestsMade;
      const newRequests = requests.map((req) => req.receiverId)
      setRequestSent(newRequests);
    }).catch(err => {
      console.log(err)
    })
    axios.get(`${process.env.REACT_APP_API_URL}/friendship?friendId=${suggestedUser._id}`, {
      headers: {
        'access_header': `bearer ${localStorage.getItem('token')}`
      }
    })
      .then(Response => {
        const friend = Response.data.friend
        if (friend) {
          if (friend.user1 === suggestedUser._id || friend.user2 === suggestedUser._id) {
            setFriendsList(prev => [...prev, suggestedUser._id])
          }
        }
      }).catch(err => console.log(err))
  }, [])
  const handleCancelRequest = () => {
    let newRequestSent = requestSent.filter((req) => req !== suggestedUser._id)
    setRequestSent(newRequestSent)
    axios.delete(`${process.env.REACT_APP_API_URL}/request?receiverId=${suggestedUser._id}`, {
      headers: {
        'access_header': `bearer ${localStorage.getItem('token')}`
      }
    }).then((Response) => {
      const request = Response.data.deletedReq
      request && socket.emit('deleteRequest', { receiverId: request.receiverId, senderId: request.senderId })
    }).catch(err => console.log(err))
  }
  // When the request rejected:
  useEffect(() => {
    socket.on('mateReqRemoved', data => {
      let newRequestSent = requestSent.filter(req => req !== data.receiverId)
      setRequestSent(newRequestSent);
    })
    socket.on('requestAccepted', data => {
      setFriendsList(prev => [...prev, data.receiverId])
      let newRequestSent = requestSent.filter(req => req !== data.receiverId)
      setRequestSent(newRequestSent);
    })
  }, [socket])
  // Unmate function:
  const removeFriend = () => {
    const newFriendsList = friendsList.filter(friend => friend !== suggestedUser._id)
    setFriendsList(newFriendsList);
    axios.delete(`${process.env.REACT_APP_API_URL}/friend?friendId=${suggestedUser._id}`, {
      headers: {
        'access_header': `bearer ${localStorage.getItem('token')}`
      }
    })
  }
  const sendMessagFromSuggestions = () => {
    setOpenMessaging(true)
    setChatWith(suggestedUser._id)
  }
  return (
    <div
      className='suggested-user'
      style={{backgroundColor: colors.secondColor}}
    >
      {/* {showSuggestedModal && <UserInfoModal suggestedUser={suggestedUser} />} */}
      <div className='suggested-user-header'>
        <img className='suggested-user-profile' src={suggestedUser.profileImage || Default_profile} alt='Profile' />
        <a href={pathToProfile} className='name-and-username' style={{color: colors.textColor}} >
          <h4 style={{color: colors.textColor}}>{suggestedUser.username}</h4>
          <small style={{color: colors.textColor}}> {suggestedUser.fullName} </small>
        </a>
      </div>
      <div className='suggested-user-footer' >
        {friendsList.includes(suggestedUser._id) && <button className='send-a-message' onClick={sendMessagFromSuggestions} style={{color: colors.textColor, border: `1px solid ${colors.thirdColor}`}}>Message</button>}
        {friendsList.includes(suggestedUser._id) ? <button onClick={removeFriend} className='unmate' style={{backgroundColor: colors.thirdColor, border: `1px solid ${colors.thirdColor}`}}>Unmate</button>
        : requestsSenders.includes(suggestedUser._id) ? ''
            : requestSent === [] ? <button className='make-mate' onClick={() => { setRequestTo(suggestedUser._id) }} style={{backgroundColor: colors.thirdColor, border: `1px solid ${colors.thirdColor}`}}><i><FontAwesomeIcon icon={faUserPlus} /></i> mate</button>
              : !requestSent.includes(suggestedUser._id)
                ? <button className='make-mate' onClick={() => { setRequestTo(suggestedUser._id) }} style={{backgroundColor: colors.thirdColor}}><i><FontAwesomeIcon icon={faUserPlus} /></i> mate</button>
                : requestSent.includes(suggestedUser._id) ? <button onClick={handleCancelRequest} className='cancel-req' style={{border: `1px solid ${colors.thirdColor}`, color: colors.textColor}}>Cancel</button> 
                : ""
        }
      </div>
    </div>
  )
}

export default SuggestedUser
