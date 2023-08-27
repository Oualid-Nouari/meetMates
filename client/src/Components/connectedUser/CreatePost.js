import React, { useContext } from 'react'
import { Contexts } from '../../contexts/contexts'
import Default_image from '../../imgs/demo profile.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faImage, faFaceSmile } from '@fortawesome/free-regular-svg-icons'

const CreatePost = ({ setOpenCreatePostModal }) => {
  let { user, colors } = useContext(Contexts)

  return (
    <article className='create-post' style={{backgroundColor: colors.mainColor}}>
      <div className='create-post-up'>
        <a href='/profile'>
          <img className='profile-in-createPost' src={user.profileImage || Default_image} alt="Profile" />
        </a>
        <input className='input-in-create-post' onFocus={() => setOpenCreatePostModal(true)} type='text' placeholder='What are you proud of today. Spill it...' style={{color: colors.textColor, backgroundColor: colors.secondColor, border: `1px solid ${colors.fourthColor}`}} />
      </div>
      <div className='create-post-down'>
        <span className='create-post-type' onClick={() => setOpenCreatePostModal(true)}>
          <i style={{color: colors.thirdColor}}><FontAwesomeIcon icon={faImage} /></i>
          <small style={{color: colors.textColor}}>image</small>
        </span>
        <span className='create-post-type' onClick={() => setOpenCreatePostModal(true)}>
          <i style={{color: colors.thirdColor}}><FontAwesomeIcon icon={faFaceSmile} /></i>
          <small style={{color: colors.textColor}}>Feeling</small>
        </span>
      </div>
    </article>
  )
}

export default CreatePost