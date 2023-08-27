import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import Loading from './Loading'
import Default_profile from '../imgs/demo profile.png'
import { Contexts } from '../contexts/contexts'

const Friend = ({friend}) => {
    const [friendDetails, setFriendDetails] = useState(null)
    const [connectedUser, setConnectedUser] = useState()
    const { colors } = useContext(Contexts)
    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/user`, {
            headers: {
                'access_header' : `bearer ${localStorage.getItem('token')}`
            }
        }).then(Response => setConnectedUser(Response.data))
        axios.get(`${process.env.REACT_APP_API_URL}/friend?friendId=${friend}`)
        .then(Response => {
            setFriendDetails(Response.data.friend)
        }).catch(err => console.log(err))
    }, [])
    const goToUserProfile = () => {
        if(friend === connectedUser.id) {
            window.open('/profile', '_blank')
        } else {
            window.open(`/users/${friend}`, '_blank')
        }
    }
    return (
        <div>
            {friendDetails  ?
            <button onClick={goToUserProfile} className='friend' style={{backgroundColor: colors.secondColor}}>
                <div className='left-side'>
                    <img src={friendDetails.profileImage || Default_profile } alt='profile' />
                    <p style={{color: colors.textColor}}>{friendDetails.username}</p>
                </div>
            </button> 
            
            : <Loading />
        }
        </div>
    )
}

export default Friend
