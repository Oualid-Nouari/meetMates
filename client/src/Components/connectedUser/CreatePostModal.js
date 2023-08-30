import React, { useContext, useRef, useState } from 'react'
import Default_image from '../../imgs/demo profile.png'
import { Contexts } from '../../contexts/contexts'
import { convertToBase64 } from './addInfosModal'
import '../../css/handlePostModal.css'
import moment from"moment";
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faCircleXmark} from '@fortawesome/free-regular-svg-icons'
import Loading from '../Loading'
const CreatePostModal = ({post, setPost, openCreatePostModal, setOpenCreatePostModal, setPostCreated}) => {
    let { user, setUploadedPostData, colors } = useContext(Contexts);
    const [isLoading, setIsLoading] = useState(false)
    let text = useRef(null)
    const handlePostTextChange = () => {
        setPost({...post, postText: text.current.value})
    }
    const handleAddPostImage = async (e) => {
        setOpenCreatePostModal(true)
        let uploadedImage = e.target.files[0];
        if(uploadedImage) {
            let postBase64 = await convertToBase64(uploadedImage)
            setPost({...post, postImage: postBase64})
        }
    }
    const removeUploadedImage = () => {
        setPost({...post, postImage: ''})
    }
    const dayOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thir', 'Fri', 'Sat']
    const date = new Date();
    let day = dayOfWeek[date.getDay()];
    const handleSubmit = (e) => {
        setIsLoading(true)
        e.preventDefault();
        axios.post(`${process.env.REACT_APP_API_URL}/post`, {...post, postTime: `${day}, ${moment().format('MM-DD-YYYY hh:mm')}`}, {
            headers: {
                'access_header': `bearer ${localStorage.getItem('token')}`
            }
        })
        .then((Response) => {
            let post = Response.data.post;
            setPost({...post, postText: '', postImage: ''})
            setUploadedPostData(post)
            setOpenCreatePostModal(false)
            setPostCreated(true)
            setTimeout(() => {
                setPostCreated(false)
            }, 3000)
            setIsLoading(false)
        })
        .catch((err) => console.log(err));
    }
    return (
        <form onSubmit={handleSubmit} style={{backgroundColor: colors.mainColor}} className={!openCreatePostModal ? ' handle-post-modal' : ' handle-post-modal active'}>
            { isLoading && <Loading /> }
            <i style={{color: colors.textColor}} className="xmark" onClick={() => {setOpenCreatePostModal(false); setPost({...post, postText: '', postImage: ''})}}><FontAwesomeIcon icon={faCircleXmark} /></i>
            <h1 style={{color: colors.textColor}}>Create new post</h1>
            <div className=' text-part-modal'>
                <a href='/profile'>
                    <img className='profile-in-handlePost' src={ user.profileImage || Default_image} alt="Profile" />
                </a>
                <textarea  value={post.postText} required={post.postImage === "" ? true : false} onChange={handlePostTextChange} placeholder='What are you proud of today. Spill it...' maxLength={250} ref={text} style={{color: colors.textColor, backgroundColor: colors.secondColor, border: `1px solid ${colors.fourthColor}`}} />
            </div>
            {
                post.postImage && 
                <div className='uploaded-image-container'>
                    <i class="xmark" onClick={removeUploadedImage}><FontAwesomeIcon icon={faCircleXmark} /></i>
                    <img className='uploaded_image' src={post.postImage} alt="Uploaded_image" />
                </div>
            }
            <div className='handle-post-modal-footer'>
                <label htmlFor='post-image' className='add-image' style={{border: `1px solid ${colors.fourthColor}`}}>
                    <i style={{color: colors.thirdColor}} class="fa-regular fa-image"></i>
                    <h6 style={{color: colors.textColor}}>Image</h6>
                </label>
                <button className='Post' style={{color: colors.textColor, border: `1px solid ${colors.thirdColor}`}}>Post</button>
                <input id='post-image' type='file' onChange={handleAddPostImage} />
            </div>
        </form>
    )
}

export default CreatePostModal
