import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import Default_Profile from '../../imgs/demo profile.png'
import Conversation from './Conversation'
import { Contexts } from '../../contexts/contexts'

const Contact = ({ contact }) => {
    const [contactDetails, setContactDetails] = useState(null)
    const [contactMessages, setContactMessages] = useState([])
    const { socket, chatWith, setChatWith, deliveredMessages, setDeliveredMessages, colors } = useContext(Contexts);
    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/friend?friendId=${contact}`)
            .then(Response => {
                setContactDetails(Response.data.friend)
            }).catch(err => console.log(err))
        let userMessages = deliveredMessages.filter(msg => msg.senderId === contact)
        setContactMessages(userMessages)
    }, [])
    const openChatBox = () => {
        setChatWith(contactDetails._id)
        let otherMessages = deliveredMessages.filter(msg => msg.senderId !== contact)
        setDeliveredMessages(otherMessages)
        setContactMessages('')
    }
    useEffect(() => {
        socket.on('receiveMessageNotification', data => {
            const messageExists = contactMessages.some(msg => msg._id === data._id);
            const senderIsContact = data.senderId === contact;
            if (!messageExists && senderIsContact) {
                setContactMessages(prev => [...prev, data]);
            }
        })
    }, [socket])
    return (
        <>
            {contactDetails ?
                <div className='contact' onClick={openChatBox} style={{backgroundColor: chatWith === contact ? colors.thirdColor : colors.mainColor}}>
                    <div className='contact-details'>
                        <div className='contact-info'>
                            { contactMessages.length > 0 && <div className='new-message-notif-in-contact'></div> }
                            <img className='profile-in-contact' src={contactDetails.profileImage || Default_Profile} alt="Profile" />
                            <p style={{color: chatWith === contact ? '#fff' : colors.textColor }} className='username-in-contact'>{contactDetails.username}</p>
                        </div>
                        { contactMessages.length > 0 && <strong style={{backgroundColor: colors.thirdColor}} className='new-msgs-notif-in-contact'>{contactMessages.length} </strong> }
                    </div>
                    { chatWith === contactDetails._id && <Conversation setChatWith={setChatWith} setContactMessages={setContactMessages} contactDetails={contactDetails} /> }
                </div> :
                <div className='lazy-loading'></div>
            }
        </>
    )
}

export default Contact