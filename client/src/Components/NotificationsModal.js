import React, { useContext } from 'react'
import '../css/Notifications.css'
import { Contexts } from '../contexts/contexts';
import Notif from './Notif';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios';

const NotificationsModal = ({ setOpenNotifsModal }) => {
    const { notifsReceived, setNofisReceived, colors } = useContext(Contexts);
    const makeNotifsAsRead = () => {
        axios.delete(`${process.env.REACT_APP_API_URL}/notifications`, {
            headers: {
                'access_header': `bearer ${localStorage.getItem('token')}`
            }
        })
        setNofisReceived([])
    }
    return (
        <div className='notifications-modal' style={{ backgroundColor: colors.mainColor }}>
            <h3 style={{ color: colors.textColor }}>
                <i style={{ color: colors.textColor }} className='close-modal' onClick={() => setOpenNotifsModal(false)}><FontAwesomeIcon icon={faArrowLeft} /></i>
                Notifications
            </h3>
            <div className='notificaions'>
                {notifsReceived.length > 0 ?
                    notifsReceived.map((notif, index) => {
                        return <Notif notif={notif} key={index} />
                    }) : <p className='empty-modal'>No recent notifications</p>
                }
            </div>
            {notifsReceived.length !== 0 && <button
                style={{ border: `1px solid ${colors.textColor}`, color: colors.textColor }}
                className='delete-notifs'
                onClick={makeNotifsAsRead}>
                <FontAwesomeIcon icon={faEye} /> Mark as read
            </button>}
        </div>
    )
}

export default NotificationsModal
