import React, { useContext } from 'react'
import Friend from './Friend'
import '../css/friendsList.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { Contexts } from '../contexts/contexts'

const FriendsList = ({ userFriends, setOpenFriendList }) => {
    const { colors } = useContext(Contexts)
    return (
        <div className='friendsList-modal' style={{backgroundColor: colors.mainColor}}>
            <h3 style={{color: colors.textColor}}>
            <i style={{color: colors.textColor}} className='close-modal' onClick={() => setOpenFriendList(false)}><FontAwesomeIcon icon={faArrowLeft} /></i>
                Mates
            </h3>
            {userFriends.length > 0 ?
            userFriends.map((friend, index) => {
                return <Friend friend={friend} key={index} />
            }): <div style={{color: colors.textColor}} >Empty List</div>
        } 
        </div>
    )
}

export default FriendsList
