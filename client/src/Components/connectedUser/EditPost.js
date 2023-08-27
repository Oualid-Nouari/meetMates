import React, { useContext, useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleXmark } from '@fortawesome/free-regular-svg-icons'
import Default_image from '../../imgs/demo profile.png'
import { Contexts } from '../../contexts/contexts'
import '../../css/handlePostModal.css'
import axios from 'axios'
import Loading from '../Loading'
// import { convertToBase64 } from './addInfosModal'
const EditPost = ({postToUpdate}) => {
    const { user, openEditPostModal, setOpenEditPostModal, colors } = useContext(Contexts);
    const [post, setPost] = useState({})
    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/post?postid=${postToUpdate}`).then((Response) => {
            setPost(Response.data.post)
        }).catch(err => console.log(err));
    }, []) 
    const handlePostText = (e) => {
        setPost(prev => ({
            ...prev,
            postText: e.target.value
        }))
    }
    // const uploadPostImage = async (e) => {
    //     let postedImage = e.target.files[0]
    //     if(postedImage) {
    //         let postedBase64 = await convertToBase64(postedImage)
    //         imageLink = postedBase64
    //         setPost({...post, postImage: postedBase64})
    //     }
    // }
    const removeUploadedImage = () => {
        setPost({...post, postImage: ''})
    }
    const updatePost = (e) => {
        e.preventDefault();
        axios.patch(`${process.env.REACT_APP_API_URL}/post?postid=${post._id}`, post)
        .then((Response) => window.location.reload())
        .catch(err => console.log(err));
    }
    return (
        <form className={openEditPostModal ? 'handle-post-modal active' : 'handle-post-modal'} style={{backgroundColor: colors.mainColor}} onSubmit={updatePost}>
            {post ? 
            <div>
                <i style={{color: colors.textColor}} className="xmark" onClick={() => setOpenEditPostModal(false)}><FontAwesomeIcon icon={faCircleXmark} /></i>
            <h1 style={{color: colors.textColor}}>Edit post</h1>
            <div className=' text-part-modal'>
                <a href='/profile'>
                    <img className='profile-in-handlePost' src={ user.profileImage || Default_image} alt="Profile" />
                </a>
                <textarea style={{color: colors.textColor, backgroundColor: colors.secondColor, border: `1px solid ${colors.fourthColor}`}} required={post.postImage === "" ? true : false} value={post.postText || ''} onChange={handlePostText} placeholder='What are you proud of today. Spill it...' maxLength={250} />
            </div>
            {
                post.postImage && 
                <div className='uploaded-image-container'>
                    <i class="xmark"><FontAwesomeIcon icon={faCircleXmark} onClick={removeUploadedImage} /></i>
                    <img className='uploaded_image' src={post.postImage} alt="Uploaded_image"  />
                </div>
            }
            <div className='handle-post-modal-footer edit-post-modal-footer'>
                <button className='Post' style={{color: colors.textColor, border: `1px solid ${colors.thirdColor}`}}>Update</button>
                <input id='post-image' type='file' />
            </div>
            </div>: <Loading />
        }
        </form>
    )
}

export default EditPost
