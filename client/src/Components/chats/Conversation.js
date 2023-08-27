import React, { useContext, useEffect, useRef, useState } from 'react'
import Default_Profile from '../../imgs/demo profile.png'
import axios from 'axios'
import moment from "moment";
import Loading from '../Loading';
import { Contexts } from '../../contexts/contexts';
import ReactScrollableFeed from 'react-scrollable-feed'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane, faHandshake, faArrowLeft } from '@fortawesome/free-solid-svg-icons'

const Conversation = ({ contactDetails, setContactMessages, setChatWith }) => {
    const { socket, chatWith, colors } = useContext(Contexts)
    const [newMessage, setNewMessage] = useState({
        receiverId: contactDetails._id,
        msg: ""
    })
    const [messages, setMessages] = useState(null)
    const sendMessage = (e) => {
        e.preventDefault();
        axios.post(`${process.env.REACT_APP_API_URL}/message`, { ...newMessage, msgTime: `${moment().format('hh:mm')}` }, {
            headers: {
                'access_header': `bearer ${localStorage.getItem('token')}`
            }
        }).then(Response => {
            let message = Response.data.message
            setMessages(prev => [...prev, message])
            message && socket.emit('sendMessage', message)
            message.status === 'delivered' && socket.emit('sendMessageNotification', message)
        })
        setNewMessage(prev => ({ ...prev, msg: "" }))
    }
    const handleWriteMessage = (e) => {
        setNewMessage(prev => ({
            ...prev,
            msg: e.target.value
        }))
    }
    // Get private messages:
    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/messages?receiverId=${contactDetails._id}`, {
            headers: {
                'access_header': `bearer ${localStorage.getItem('token')}`
            }
        }).then(Response => {
            let messagesSeen = Response.data.messages
            setContactMessages('')
            setMessages(messagesSeen)
            messagesSeen.map(message => {
                if (message.senderId === contactDetails._id && message.status === "delivered") {
                    axios.patch(`${process.env.REACT_APP_API_URL}/message?messageId=${message._id}`)
                }
            })
        })
    }, [messages])
    useEffect(() => {
        socket.on('receiveMessage', data => {
            setMessages(prev => [...prev, data])
        })
    }, [socket, chatWith])
    const leftArr = document.querySelector('.left-arr')
    if(leftArr) {
        leftArr.addEventListener('click', () => {
            setChatWith(null)
        })
    }
    return (
        <div className='conv' style={{backgroundColor: colors.secondColor}}>
            <header className='conv-header' style={{borderBottom: `1px solid ${colors.fourthColor}`}}>
                <i style={{color: colors.textColor, border: `1px solid ${colors.textColor}`}} className='left-arr'><FontAwesomeIcon icon={faArrowLeft} /></i>
                <img src={contactDetails.profileImage || Default_Profile} alt='' />
                <p style={{color: colors.textColor}}>{contactDetails.username}</p>
            </header>
            {messages ?
                <ReactScrollableFeed>
                    {messages.length > 0 ?
                        messages.map((message, index) => {
                            const isLastMessage = index === messages.length - 1;
                            return (
                                <div key={index} className={message.receiverId === contactDetails._id ? 'msg message-sent' : 'msg msg-received'}>
                                    <div className='messageANDtime'>
                                        <p style={{backgroundColor: message.receiverId === contactDetails._id && colors.thirdColor}}>{message.msg}</p>
                                        <small>{message.msgTime}</small>
                                    </div>
                                    {isLastMessage && (
                                        message.receiverId === contactDetails._id && <span className='message-status'>{message.status}</span>
                                    )}
                                </div>
                            );
                        }) : <div className='say-hello'>Say Hi to {contactDetails.username} <i style={{fontSize: 25, marginLeft: 5}}><FontAwesomeIcon icon={faHandshake} /></i></div>
                    }
                </ReactScrollableFeed>
                : <div className='loading-messages'><Loading /> </div>}
            <form className='write-message' onSubmit={sendMessage} style={{borderTop: `1px solid ${colors.fourthColor}`}}>
                <input style={{backgroundColor: colors.mainColor, color: colors.textColor, border: `.3px solid ${colors.fourthColor}` }} type='text' placeholder='write message here...' required onChange={handleWriteMessage} value={newMessage.msg} />
                <button className='send-message' style={{backgroundColor: colors.thirdColor}}><FontAwesomeIcon icon={faPaperPlane} /></button>
            </form>
        </div>
    )
}

export default Conversation
