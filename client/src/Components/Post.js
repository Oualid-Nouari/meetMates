import React, { useContext, useEffect, useState } from 'react'
import Default_profile from '../imgs/demo profile.png'
import '../css/posts.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faComments, faHeart } from '@fortawesome/free-regular-svg-icons'
import { faEllipsis } from '@fortawesome/free-solid-svg-icons'
import EditPost from './connectedUser/EditPost'
import LikedIcon from '../imgs/liked.png'
import { motion } from "framer-motion"
import axios from 'axios'
import { Contexts } from '../contexts/contexts'
import ManagePost from './connectedUser/ManagePost'
import DeletePostModal from './connectedUser/DeletePostModal'
const Post = ({ post, setPostOpened }) => {
    const { user, socket, likedPosts, setLikedPosts, openDeletePostModal, colors } = useContext(Contexts);
    const [author, setAuthor] = useState(null)
    const [openManagePost, setOpenManagePost] = useState(false);
    const pathToProfile = `/users/${post.postAuthor}`
    const getAuthorData = async () => {
        await axios.get(`${process.env.REACT_APP_API_URL}/author?id=${post.postAuthor}`)
            .then((Response) => {
                setAuthor(Response.data.author)
            })
            .catch(err => console.log(err));
    }
    useEffect(() => {
        getAuthorData()
    }, []);
    const handleManagePost = () => {
        setOpenManagePost(!openManagePost)
    }
    const [postToUpdate, setPostToUpdate] = useState('')
    const [postToDelete, setPostToDelete] = useState('')
    // LIKE POST LOGIC:
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
                if (likedPost.receiverId === post.postAuthor) {
                    axios.post(`${process.env.REACT_APP_API_URL}/notification?type=likePost&senderId=${likedPost.senderId}&receiverId=${likedPost.receiverId}&postId=${likedPost.likedPostId}`)
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
    // Comment logic:
    const hadnleClickCommentIcon = () => {
        setPostOpened(post)
    }
    return (
        <div>
            {author ?
                <div className='post' style={{ backgroundColor: colors.mainColor }}>
                    <div href={user && post.postAuthor === user.id ? '/profile' : pathToProfile} rel='noreferrer' target='blank' className='post-header'>
                        <a className='left-post-header' href={user && post.postAuthor === user.id ? '/profile' : pathToProfile} rel='noreferrer' target='blank'>
                            <img className='author-profile' src={author.profileImage || Default_profile} alt='Profile' />
                            <div className='post-author'>
                                <h3 style={{ color: colors.textColor }}>{author ? author.username : 'Name'} </h3>
                                <small style={{ color: colors.textColor }} className='post-date'>{post.postTime}</small>
                            </div>
                        </a>
                        {postToDelete && openDeletePostModal ? <DeletePostModal postToDelete={postToDelete} /> : ""}
                        {postToUpdate && <EditPost postToUpdate={postToUpdate} />}
                        <ManagePost
                            post={post}
                            openManagePost={openManagePost}
                            setOpenManagePost={setOpenManagePost}
                            setPostToUpdate={setPostToUpdate}
                            setPostToDelete={setPostToDelete}
                        />
                        {(user && post.postAuthor === user.id) && <i className='ellipsis' onClick={handleManagePost} style={{color: colors.textColor, backgroundColor: openManagePost && colors.fourthColor}}><FontAwesomeIcon icon={faEllipsis} /></i>}
                    </div>
                    <div className='post-content'>
                        <div className={post.postImage ? 'post-text' : 'post-text onlyText'} style={{ color: colors.textColor }}> {post.postText} </div>
                        {post.postImage && <div className='post-image'>
                            <img src={post.postImage} alt="PostImage" />
                        </div>}
                    </div>
                    <div className='post-reactions'>
                        <div className='left-post-reactions'>
                            <i style={{ color: colors.textColor }}
                                onClick={!likedPosts.includes(post._id) ? handleLikePost : handleRemoveLikePost}
                            >
                                {!likedPosts.includes(post._id) ? <FontAwesomeIcon icon={faHeart} />
                                    : <motion.img animate={{ scale: likeBtnClicked ? 1.4 : 1, y: 5 }} className='liked-icon' src={LikedIcon} alt="Liked icon" />}
                            </i>
                            <i className='open-post-to-comment' style={{color: colors.textColor}}><FontAwesomeIcon icon={faComments} onClick={hadnleClickCommentIcon} /></i>
                        </div>
                    </div>
                </div> : <div className='lazy-loading' style={{color: colors.textColor, backgroundColor: colors.fourthColor}}><small className='lazy-loading-animation'></small></div>
            }
        </div>
    )
}

export default Post
