import React, { useContext, useEffect, useState } from 'react'
import '../css/Suggested.css'
import axios from 'axios'
import SuggestedUser from './SuggestedUser'
import { Contexts } from '../contexts/contexts'

const SuggestedUsersSide = () => {
    const { requestSent, setRequestSent, setRequestTo, friendsList, colors } = useContext(Contexts);
    const [SuggestedUsers, setSuggestedUsers] = useState([]);
    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/users`, {
            headers: {
                'access_header': `bearer ${localStorage.getItem('token')}`,
            }
        }).then(Response => {
            let users = Response.data.reverse();
            setSuggestedUsers(users)
        }).catch(err => console.log(err));
    }, [friendsList])
    return (
        <section className='suggested-users-side' style={{ backgroundColor: colors.mainColor }}>
            {SuggestedUsers ? <div>
                <h3 style={{ color: colors.textColor }}>Other users</h3>
                <div className='suggested-users-side-container'>
                    {SuggestedUsers.map((suggestedUser, index) => {
                        return <SuggestedUser setRequestTo={setRequestTo} setRequestSent={setRequestSent} key={index} suggestedUser={suggestedUser} requestSent={requestSent} />
                    })}
                </div>
            </div> : <div className='lazy-loading' style={{ backgroundColor: colors.fourthColor }}>
            </div>}
        </section>
    )
}

export default SuggestedUsersSide
