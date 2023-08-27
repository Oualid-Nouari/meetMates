import React, { useContext, useEffect, useState } from 'react'
import BannerImage from '../imgs/default banner.png'
import ProfileImage from '../imgs/demo profile.png'
import '../css/userCard.css'
import { Contexts } from '../contexts/contexts'
import axios from 'axios'

const UserCard = ({ setOpenInfosForm, openAddInfosForm, user, setUser, requestSent, setRequestSent, setRequestTo }) => {
    const { socket, friendsList, setFriendsList, colors } = useContext(Contexts);
    const [isHovered, setIsHovered] = useState('')
    const logout = () => {
        setUser(null)
        localStorage.removeItem('token')
        window.location.assign('/sign')
    }
    const openEditProfile = () => {
        if (openAddInfosForm !== undefined) {
            setOpenInfosForm(true)
        }
    }
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
    const removeFriend = () => {
        const newFriendsList = friendsList.filter(friend => friend !== user.id)
        setFriendsList(newFriendsList);
        axios.delete(`${process.env.REACT_APP_API_URL}/friend?friendId=${user.id}`, {
            headers: {
                'access_header': `bearer ${localStorage.getItem('token')}`
            }
        })
    }
    return (
        <div className='user-card' style={{ backgroundColor: colors.mainColor }}>
            <div className='images'>
                <img className='banner-in-card' src={user.bannerImage || BannerImage} alt="Banner" />
                <div className='infos-in-card'>
                    <img className='profile-in-card' src={user.profileImage || ProfileImage} alt="Profile" style={{ outline: `2px solid ${colors.mainColor}` }} />
                    <h1 style={{ color: colors.textColor }} className='full-name-in-card'> {user.fullName} </h1>
                    <p style={{ color: colors.textColor }} className='username-in-card'> @{user.username} </p>
                    <p style={{ color: colors.textColor }} className='bio-in-card'> {user.bio || ''} </p>
                </div>
            </div>
            {openAddInfosForm !== undefined ?
                <div className='buttons-in-card'>
                    <button 
                    className='edit-profile' 
                    onClick={openEditProfile} 
                    onMouseEnter={() => setIsHovered('edit-profile')}
                    onMouseLeave={() => setIsHovered('')}
                    style={
                        { border: `1px solid ${colors.textColor}`, color:  isHovered === 'edit-profile' ? '#fff' : colors.textColor }
                        }>Edit profile</button>
                    <button className='logout' onMouseEnter={() => setIsHovered('logout')} onMouseLeave={() => setIsHovered('')} onClick={logout} style={{ border: `1px solid ${colors.textColor}`, color: isHovered === 'logout' ? '#fff' : colors.textColor }}>Logout</button>
                </div> :
                !setUser ? <div className='btn-in-card-contain'>
                    {friendsList.includes(user.id)
                        ? <button onClick={removeFriend} className='btn-in-card' style={{ border: `1px solid ${colors.textColor}`, color: isHovered === 'unmate' ? '#fff' : colors.textColor }} onMouseEnter={() => setIsHovered('unmate')} onMouseLeave={() => setIsHovered('')}>Unmate</button>
                        : requestSent === [] ? <button onMouseEnter={() => setIsHovered('request')} onMouseLeave={() => setIsHovered('')} className='btn-in-card' onClick={() => { setRequestTo(user.id) }} style={{ border: `1px solid ${colors.textColor}`, color: isHovered === 'request' ? '#fff' : colors.textColor }}>Request mate</button>
                            : !requestSent.includes(user.id)
                                ? <button onMouseEnter={() => setIsHovered('request')} onMouseLeave={() => setIsHovered('')} className='btn-in-card' onClick={() => { setRequestTo(user.id) }} style={{ border: `1px solid ${colors.textColor}`, color: isHovered === 'request' ? '#fff' : colors.textColor }}>Request mate</button>
                                : <button onMouseEnter={() => setIsHovered('cancel')} onMouseLeave={() => setIsHovered('')} className='btn-in-card' onClick={handleCancelRequest} style={{ border: `1px solid ${colors.textColor}`, color: isHovered === 'cancel' ? '#fff' : colors.textColor }}>Cancel</button>}
                </div> :
                    <div
                        className='btn-in-card-contain'>
                        <a
                            href='/profile'
                            className='btn-in-card'
                            onMouseEnter={() => setIsHovered('profile')}
                            onMouseLeave={() => setIsHovered('')}
                            style={
                                { border: `1px solid ${colors.textColor}`, color: isHovered === 'profile' ? '#fff' : colors.textColor }}>
                            View profile
                        </a>
                    </div>
            }
        </div>
    )
}

export default UserCard