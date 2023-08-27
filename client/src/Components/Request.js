import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import Loading from './Loading'
import Default_profile from '../imgs/demo profile.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark, faCheck } from '@fortawesome/free-solid-svg-icons'
import { Contexts } from '../contexts/contexts'
import RequestMsg from './RequestMsg'

const Request = ({ req }) => {
  const [reqSender, setReqSender] = useState(null)
  const { socket, setFriendsList, friendsList, colors, requestsReceived, setRequestsReceived } = useContext(Contexts);
  const [reqRemoved, setReqRemoved] = useState(false)
  const [openRequestMessage, setOpenRequestMessage] = useState(false)
  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/requestSender?senderId=${req.senderId}`)
      .then(Response => {
        const requestSender = Response.data.requestSender
        setReqSender(requestSender)
      })
      .catch(err => console.log(err))
  }, [req])
  const rejectRequest = () => {
    setReqRemoved(true)
    axios.delete(`${process.env.REACT_APP_API_URL}/rejectRequest?senderId=${req.senderId}&receiverId=${req.receiverId}`).then((Response) => {
      const request = Response.data.deletedRequest;
      if (request) {
        const newReqReceivedArr = requestsReceived.filter(req => req.requestId !== request._id)
        setRequestsReceived(newReqReceivedArr)
        socket.emit('removeMateRequest', { receiverId: request.receiverId, senderId: request.senderId });
        socket.emit('deleteRequest', { receiverId: request.receiverId, senderId: request.senderId })
        setReqRemoved(false)
      }
    }).catch(err => console.log(err))
  }
  const acceptRequest = () => {
    setReqRemoved(true)
    axios.post(`${process.env.REACT_APP_API_URL}/notification?type=request&senderId=${req.receiverId}&receiverId=${req.senderId}`)
      .then(Response => {
        const newNotification = Response.data.notification
        setFriendsList([...friendsList, newNotification.receiverId])
        axios.post(`${process.env.REACT_APP_API_URL}/friendship?userA=${newNotification.senderId}&userB=${newNotification.receiverId}`)
        // Delete request after accepting it:
        axios.delete(`${process.env.REACT_APP_API_URL}/rejectRequest?senderId=${req.senderId}&receiverId=${req.receiverId}`).then((Response) => {
          const request = Response.data.deletedRequest
          request && socket.emit('acceptRequest', { receiverId: request.receiverId, senderId: request.senderId })
          request && socket.emit('deleteRequest', { receiverId: request.receiverId, senderId: request.senderId })
          socket.emit('sendNotification',
            {
              senderId: newNotification.senderId,
              receiverId: newNotification.receiverId,
              type: newNotification.type
            })
            setReqRemoved(false)
        }).catch(err => console.log(err))
      })
      .catch(err => console.log(err));
  }
  return (
    <div>
      {reqSender ?
        <div className='request' style={{ backgroundColor: colors.secondColor }}>
          {reqRemoved && <div className='loading'> <Loading /> </div>}
          {openRequestMessage && <RequestMsg setReqRemoved={setReqRemoved} req={req} reqSender={reqSender} setOpenRequestMessage={setOpenRequestMessage} />}
          <div className='req-left'>
            <img src={reqSender.profileImage || Default_profile} alt="Profile_image" />
            <p style={{ color: colors.textColor }}>{reqSender.username}</p>
          </div>
          {req.msg ? <button className='view-message' onClick={() => setOpenRequestMessage(true)} style={{ backgroundColor: colors.thirdColor, border: `1px solid ${colors.thirdColor}` }}>View message</button> :
            <div className='btns'>
              <button className='reject' onClick={rejectRequest}><FontAwesomeIcon icon={faXmark} /></button>
              <button className='accept' onClick={acceptRequest} style={{ backgroundColor: colors.thirdColor }}><FontAwesomeIcon icon={faCheck} /></button>
            </div>
          }
        </div> : <Loading />}
    </div>
  )
}

export default Request
