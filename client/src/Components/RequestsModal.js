import React, { useContext, useEffect } from 'react'
import { Contexts } from '../contexts/contexts'
import '../css/RequestsModal.css'
import Request from './Request'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'

const RequestsModal = ({ setOpenRequestsModal }) => {

    const { socket, requestsReceived, setRequestsReceived, colors } = useContext(Contexts);
    useEffect(() => {
        socket.on('requestDeleted', data => {
            const reqReceived = requestsReceived.filter(req => req.senderId !== data.senderId)
            setRequestsReceived(reqReceived);
        })
    }, [socket, requestsReceived])
    return (
        <div className="Requests-modal" style={{ backgroundColor: colors.mainColor }}>
            <h3 style={{ color: colors.textColor }}>
                <i style={{ color: colors.textColor }} className='close-modal' onClick={() => setOpenRequestsModal(false)}><FontAwesomeIcon icon={faArrowLeft} /></i>
                Requests
            </h3>
            {requestsReceived.length > 0 ?
                <div>
                    {requestsReceived.map((req, index) => {
                        return <Request req={req} key={index} />
                    })}
                </div>
                : <h3 className='empty-modal'>No recent requests</h3>
            }
        </div>
    )
}

export default RequestsModal
