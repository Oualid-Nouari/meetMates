import React, { useContext, useEffect, useState } from 'react'
import '../css/sentMateReqModal.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleXmark } from '@fortawesome/free-regular-svg-icons'
import { Contexts } from '../contexts/contexts';
import axios from 'axios';
import Loading from './Loading';


const SentMateReqModal = ({ requestTo, setRequestSent, setRequestTo }) => {
  const { socket, colors } = useContext(Contexts);
  const [suggestedUser, setSuggestedUser] = useState(null)
  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/suggestedUser?userId=${requestTo}`)
      .then(Response => setSuggestedUser(Response.data.suggestedUser))
      .catch(err => console.log(err));
  }, [])
  const [reqData, setReqData] = useState({
    receiverId: requestTo,
    msg: "",
  })
  const handleMsgChange = (e) => {
    setReqData(prev => ({
      ...prev,
      msg: e.target.value
    }))
  }
  const handleSendRequest = (e) => {
    setRequestTo("");
    setRequestSent(prev => [...prev, reqData.receiverId])
    e.preventDefault();
    try {
      axios.post(`${process.env.REACT_APP_API_URL}/request`, reqData, {
        headers: {
          'access_header': `bearer ${localStorage.getItem('token')}`
        }
      }).then(Response => {
        const request = Response.data.request;
        socket.emit('sendMateRequest', { senderId: request.senderId, receiverId: request.receiverId, msg: request.msg, requestId: request._id });
      }).catch(err => console.log(err));
    } catch (err) {
      console.log(err);
    }
  }
  return (
    <div>
      {suggestedUser ? <section className='send-mate-req-modal' style={{backgroundColor: colors.mainColor}}>
        <i className="xmark" onClick={() => { setRequestTo("") }} style={{color: colors.textColor}}><FontAwesomeIcon icon={faCircleXmark} /></i>
        <h1 style={{color: colors.textColor}}>Mate request to {suggestedUser.username}</h1>
        <form onSubmit={handleSendRequest}>
          <textarea placeholder="It's better to accord a message with your request" onChange={handleMsgChange} maxLength="270" style={{color: colors.textColor, backgroundColor: colors.secondColor, border: `1px solid ${colors.fourthColor}`}} />
          <button style={{color: colors.textColor, border: `1px solid ${colors.thirdColor}`}}>{reqData.msg ? 'Send' : 'Send anyway'}</button>
        </form>
      </section> : <Loading />}
    </div>
  )
}

export default SentMateReqModal;
