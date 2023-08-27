import React, { useContext } from 'react'
import Default_profile from '../imgs/demo profile.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faXmark, faCheck } from '@fortawesome/free-solid-svg-icons'
import { Contexts } from '../contexts/contexts'
import axios from 'axios'
const RequestMsg = ({ req, reqSender, setOpenRequestMessage, setReqRemoved }) => {
    const { socket, colors } = useContext(Contexts);
    const pathToProfile = `/users/${reqSender._id}`
    const rejectRequest = () => {
        setOpenRequestMessage(false)
        setReqRemoved(true)
        axios.delete(`${process.env.REACT_APP_API_URL}/rejectRequest?senderId=${req.senderId}&receiverId=${req.receiverId}`).then((Response) => {
          const request = Response.data.deletedRequest;
          if (request) {
            socket.emit('removeMateRequest', { receiverId: request.receiverId, senderId: request.senderId });
            socket.emit('deleteRequest', { receiverId: request.receiverId, senderId: request.senderId })
          }
          setReqRemoved(false)
        }).catch(err => console.log(err))
      }
      const acceptRequest = () => {
        setOpenRequestMessage(false)
        setReqRemoved(true)
        axios.post(`${process.env.REACT_APP_API_URL}/notification?type=request&senderId=${req.receiverId}&receiverId=${req.senderId}`)
          .then(Response => {
            const newNotification = Response.data.notification
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
        <div className='request-message' style={{ backgroundColor: colors.mainColor }}>
            <i style={{ color: colors.textColor }} className='close-request' onClick={() => setOpenRequestMessage(false)} ><FontAwesomeIcon icon={faArrowLeft} /></i>
            <h3 style={{ color: colors.textColor }}>Request from {reqSender.username}</h3>
            <img className='profile-pic' src={ reqSender.profileImage || Default_profile} alt="" onClick={() => window.open(`${pathToProfile}`, 'blank')} />
            <div className='msg' style={{ color: colors.textColor, backgroundColor: colors.secondColor }} > {req.msg} </div>
            <div className='btns'>
            <button className='reject' onClick={rejectRequest}><FontAwesomeIcon icon={faXmark} /></button>
              <button className='accept' onClick={acceptRequest} style={{backgroundColor: colors.thirdColor}}><FontAwesomeIcon icon={faCheck}/></button>
            </div>
        </div>
    )
}

export default RequestMsg
