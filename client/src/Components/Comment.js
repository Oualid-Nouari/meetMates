import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import Loading from './Loading'
import Default_profile from '../imgs/demo profile.png'
import { Contexts } from '../contexts/contexts'
const Comment = ({comment}) => {
    const { colors } = useContext(Contexts)
    const [commentAuthor, setCommentAuthor] = useState(null)
    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/commentAuthor?id=${comment.senderId}`)
        .then(Response => setCommentAuthor(Response.data.author))
        .catch(err => console.log(err))
    }, [])
    return (
        <React.Fragment>
            {commentAuthor ?
            <div className='comment' style={{border: `1px solid ${colors.textColor}`, backgroundColor: colors.secondColor}}>
                <div className='author-info'>
                    <img className='comment-author-profile' src={commentAuthor.profileImage || Default_profile} alt="Profile" />
                    <div className='username'>
                        <h4 style={{ color: colors.textColor }}>{commentAuthor.username}</h4>
                        <small style={{ color: colors.textColor }}>{comment.commentTime}</small>
                    </div>
                </div>
                <p style={{ color: colors.textColor }} className='comment-text'>{comment.commentText}</p>
            </div>
            : <div className='loading-container'> <Loading /> </div>
        }
        </React.Fragment>
    )
}

export default Comment
