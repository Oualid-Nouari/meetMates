import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import Loading from './Loading';
import Default_profile from '../imgs/demo profile.png'
import PostModal from './PostModal';
import { Contexts } from '../contexts/contexts';

const Notif = ({ notif }) => {
    const [notificationSender, setNotificationSender] = useState(null)
    const [showPostModal, setShowPostModal] = useState(false);
    const { colors, setOpenMessaging, setChatWith } = useContext(Contexts)
    const [post, setPost] = useState(null)
    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/notifSender?senderId=${notif.senderId}`)
            .then(Response => {
                const notifSender = Response.data.notifSender;
                setNotificationSender(notifSender)
            })
    }, [])
    const handleOpenPostModal = () => {
        axios.get(`${process.env.REACT_APP_API_URL}/post?postid=${notif.postId}`)
            .then(Response => {
                setPost(Response.data.post)
                setShowPostModal(true)
            }
            )
            .catch(err => console.log(err))
    }
    const handleSendingMessage = () => {
        setOpenMessaging(true)
        setChatWith(notif.senderId)
    }
    return (
        <div className='notif'>
            {notificationSender ?
                notif.type === "request" ?
                    <div className='notif-container' style={{backgroundColor: colors.secondColor}} onClick={handleSendingMessage}>
                        <img src={notificationSender.profileImage || Default_profile} alt="Profile img" />
                        <p style={{color: colors.textColor}}>{notificationSender.username}, Has Accepted Your mate request</p>
                    </div>
                    : <div>
                        <div className='notif-container' onClick={handleOpenPostModal} style={{backgroundColor: colors.secondColor}}>
                            <img src={notificationSender.profileImage || Default_profile} alt="Profile img" />
                            <p style={{color: colors.textColor}}>{notificationSender.username}, {notif.type === "likePost" ? 'Liked' : 'Commented on'} Your post</p>
                        </div>
                        {showPostModal &&
                            <PostModal post={post} setShowPostModal={setShowPostModal} />
                        }
                    </div>
                :
                <div> <Loading /> </div>
            }
        </div>
    )
}

export default Notif
