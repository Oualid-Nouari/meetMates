import React, { useContext, useEffect, useState } from 'react'
import Default_profile from '../imgs/demo profile.png'
import axios from 'axios';
import Loading from './Loading';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart } from '@fortawesome/free-regular-svg-icons'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { Contexts } from '../contexts/contexts';
import { motion } from "framer-motion"
import LikedIcon from '../imgs/liked.png'
import moment from "moment";
import Comment from './Comment';

const PostModal = ({ post, setPostOpened, setShowPostModal }) => {
    const { colors, socket, setLikedPosts, likedPosts } = useContext(Contexts)
    const [connectedUser, setConnectedUser] = useState()
    const [author, setAuthor] = useState(null)
    const getAuthorData = async () => {
        post && await axios.get(`${process.env.REACT_APP_API_URL}/author?id=${post.postAuthor}`)
            .then((Response) => {
                setAuthor(Response.data.author)
            })
            .catch(err => console.log(err));
    }
    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/user`, {
            headers: {
                'access_header' : `bearer ${localStorage.getItem('token')}`
            }
        }).then(Response => setConnectedUser(Response.data))
        getAuthorData()
    }, []);
    const handleCloseModal = () => {
        setShowPostModal && setShowPostModal(false)
        setPostOpened && setPostOpened("")
    }
    const [likeBtnClicked, setLikeBtnClicked] = useState(false)
    const handleLikePost = () => {
        setLikeBtnClicked(true)
        setTimeout(() => {
            setLikeBtnClicked(false)
        }, 300)
        axios.post(`${process.env.REACT_APP_API_URL}/like`, {
            receiverId: post.postAuthor,
            itemLiked: "post",
            likedPostId: post._id
        },
            {
                headers: {
                    'access_header': `bearer ${localStorage.getItem('token')}`
                }
            }).then(Response => {
                let likedPost = Response.data.likedPost
                if (likedPost.senderId !== post.postAuthor) {
                    axios.post(`${process.env.REACT_APP_API_URL}/notification?type=likePost&senderId=${likedPost.senderId}&receiverId=${likedPost.receiverId}&postId=${likedPost.likedPostId}`, {
                        headers: {
                            'access_header': `bearer ${localStorage.getItem('token')}`
                        }
                    })
                        .then(Response => {
                            let newNotification = Response.data.notification
                            socket.emit('sendNotification',
                                {
                                    senderId: newNotification.senderId,
                                    receiverId: newNotification.receiverId,
                                    type: newNotification.type,
                                    postId: newNotification.postId
                                })
                        })
                }
            })
        setLikedPosts(prev => [...prev, post._id])
    }
    const handleRemoveLikePost = () => {
        axios.delete(`${process.env.REACT_APP_API_URL}/like?likedPostId=${post._id}&itemLiked=post`, {
            headers: {
                'access_header': `bearer ${localStorage.getItem('token')}`
            }
        }).then(Response => {
            let removedLike = Response.data.removedLike
            let newLikedPostsArr = likedPosts.filter(likedPost => likedPost !== removedLike.likedPostId)
            setLikedPosts(newLikedPostsArr)
        })
    }
    // COMMENT LOGIC:
    const [commentsWrittenHere, setCommentsWrittenHere] = useState([])
    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/comments?postId=${post._id}`)
            .then(Response => {
                setCommentsWrittenHere(Response.data.comments)
            }).catch(err => console.log(err))
    }, [])
    const [comment, setComment] = useState({
        receiverId: post.postAuthor,
        commentText: "",
        targetedPost: post._id,
        commentTime: ""
    })
    const handleWriteComment = (e) => {
        setComment(prev => ({
            ...prev,
            commentText: e.target.value
        }))
    }
    const postComment = (e) => {
        e.preventDefault()
        axios.post(`${process.env.REACT_APP_API_URL}/comment`, { ...comment, commentTime: `${moment().format('MM-DD-YYYY hh:mm')}` }, {
            headers: {
                'access_header': `bearer ${localStorage.getItem('token')}`
            }
        }).then(Response => {
            const newComment = Response.data.comment
            setCommentsWrittenHere([...commentsWrittenHere, newComment])
            if (newComment.senderId !== post.postAuthor) {
                axios.post(`${process.env.REACT_APP_API_URL}/notification?type=comment&senderId=${newComment.senderId}&receiverId=${newComment.receiverId}&postId=${newComment.targetedPost}`)
                    .then(Response => {
                        let newNotif = Response.data.notification;
                        socket.emit('sendNotification',
                            {
                                senderId: newNotif.senderId,
                                receiverId: newNotif.receiverId,
                                type: newNotif.type,
                                postId: newNotif.postId
                            })
                    })
            }
        })
        setComment(prev => ({ ...prev, commentText: "" }))
    }
    return (
        <React.Fragment>
            {post && connectedUser ? <section className='post-modal' style={{ backgroundColor: colors.mainColor, outline: `3px solid ${colors.fourthColor}` }}>
                {author ?
                    <div className='post-modal-container'>
                        <div className='post-modal-content'>
                            <div className='post-modal-content-author' style={{borderBottom: `1px solid ${colors.textColor}`}}>
                                <i style={{ color: colors.textColor }} className='close-post-modal' onClick={handleCloseModal}><FontAwesomeIcon icon={faArrowLeft} /></i>
                                <img width="36px" height="36px" src={author.profileImage || Default_profile} alt="Profile" />
                                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
                                    <h5 style={{ color: colors.textColor }} className='post-modal-author'>@{author ? author.username : 'user'}</h5>
                                    <small style={{ color: colors.textColor }}>{post.postTime}</small>
                                </div>
                            </div>
                            <div className='post-modal-content-text' style={{ backgroundColor: colors.secondColor }}>
                                <p style={{ color: colors.textColor }} className={post.postImage ? '' : 'onlyText'}>{post.postText}</p>
                            </div>
                            {post.postImage &&
                                <div className='post-modal-content-image'>
                                    <img height="300px" src={post.postImage} alt="postImage" />
                                </div>}
                            <div className='post-modal-content-reactions' style={{borderTop: `1px solid ${colors.fourthColor}`, borderBottom: `1px solid ${colors.fourthColor}`}}>
                                <div className='left-post-reactions'>
                                    <i style={{ color: colors.textColor }}
                                        onClick={!likedPosts.includes(post._id) ? handleLikePost : handleRemoveLikePost}
                                    >
                                        {!likedPosts.includes(post._id) ? <FontAwesomeIcon icon={faHeart} />
                                            : <motion.img animate={{ scale: likeBtnClicked ? 1.4 : 1, y: 3 }} className='liked-icon' src={LikedIcon} alt="Liked icon" />}
                                    </i>
                                </div>
                            </div>
                        </div>
                        <section className='comments'>
                            <div className='add-comment'>
                                <img className='profile-in-comments' src={connectedUser.profileImage || Default_profile} alt="profile" />
                                <form onSubmit={postComment} className='adding-comment-section'>
                                    <textarea
                                        required
                                        onChange={handleWriteComment}
                                        value={comment.commentText}
                                        maxLength={230}
                                        type="text"
                                        placeholder='Add comment...'
                                        style={{color: colors.textColor, backgroundColor: colors.secondColor, border: `1px solid ${colors.fourthColor}`}}
                                    />
                                    <div className='add-comment-container'>
                                        {comment.commentText && <button className='add' style={{backgroundColor: colors.thirdColor}}>
                                            Comment
                                        </button>}
                                    </div>
                                </form>
                            </div>
                            <h3 style={{ color: colors.textColor, textAlign: 'center' }}>Comments</h3>
                            {commentsWrittenHere.length > 0 ?
                                <main className='comments'>
                                    {commentsWrittenHere.map((comment, index) => {
                                        return <Comment comment={comment} key={index} />
                                    })}
                                </main> : <p style={{ color: colors.textColor }} className='no-comment'>No comments for this post</p>
                            }
                        </section>
                    </div> : <Loading />
                }
            </section> : <Loading />}
        </React.Fragment>
    )
}

export default PostModal
