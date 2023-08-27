import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Loading from '../Components/Loading';
import PostsInProfile from '../Components/Posts'
import SuggestedUsersSide from '../Components/SuggestedUsersSide';
import UserCard from '../Components/UserCard';
import UserInfo from '../Components/UserInfo';
import { Contexts } from '../contexts/contexts';
import SentMateReqModal from '../Components/sentMateReqModal';
import FriendsList from '../Components/FriendsList';
import Aside from '../Components/Aside';
import Chat from '../Components/chats/Chat';
const OtherUserProfile = () => {
    const { userId } = useParams();
    const [userDetails, setUserDetails] = useState(null)
    const [openFriendList, setOpenFriendList] = useState(false)
    const [userFriends, setUserFriends] = useState([])
    const { requestSent, setRequestSent, requestTo, setRequestTo, openMessaging } = useContext(Contexts);
    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/users/${userId}`)
            .then(Response => setUserDetails(Response.data))
            .catch(err => console.log(err));
        axios.get(`${process.env.REACT_APP_API_URL}/friends?userId=${userId}`).then(Response => {
            setUserFriends(Response.data.friends)
        }).catch(err => console.log(err))
    }, [])
    const handleOverlayClick = () => {
        setRequestTo('')
        setOpenFriendList(false)
    }
    return (
        <div>
            {userDetails ?
                <div>
                    {requestTo || openFriendList ? <div onClick={handleOverlayClick} className='overlay'></div> : ""}
                    {openFriendList && <FriendsList setOpenFriendList={setOpenFriendList} userFriends={userFriends} />}
                    <Aside />
                    {requestTo && <SentMateReqModal
                        setRequestSent={setRequestSent}
                        requestTo={requestTo}
                        setRequestTo={setRequestTo}
                    />}
                    <UserInfo
                        user={userDetails}
                        requestSent={requestSent}
                        setRequestSent={setRequestSent}
                        setRequestTo={setRequestTo}
                        setOpenFriendList={setOpenFriendList}
                        userFriends={userFriends}
                    />
                    {openMessaging && <Chat />}
                    <div className='main-of-page'>
                        <UserCard
                            user={userDetails}
                            requestSent={requestSent}
                            setRequestSent={setRequestSent}
                            setRequestTo={setRequestTo} />
                        <div className='middle-part'>
                            <PostsInProfile author={userDetails} />
                        </div>
                        <SuggestedUsersSide />
                    </div>
                </div>
                : <Loading />}
        </div>
    )
}

export default OtherUserProfile
