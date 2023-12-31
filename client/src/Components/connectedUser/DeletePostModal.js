import axios from 'axios';
import React, { useContext, useState } from 'react'
import { Contexts } from '../../contexts/contexts';
import Loading from '../Loading';

const DeletePostModal = ({postToDelete}) => {
    const { setOpenDeletePostModal, colors } = useContext(Contexts);
    const [isHovered, setIsHovered] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const deletePost = () => {
      setIsLoading(true)
        axios.delete(`${process.env.REACT_APP_API_URL}/post?postid=${postToDelete}`).then((Resposns) => {
          window.location.reload()
          setIsLoading(false)
        }).catch(err => console.log(err));
    }
  return (
    <div className='delete-post-modal' style={{backgroundColor: colors.mainColor}}>
      { isLoading && <Loading /> }
      <h4 style={{color: colors.textColor}}>You sure wanna delete this post</h4>
      <div className='btns'>
        <button onMouseEnter={() => setIsHovered('reject')} onMouseLeave={() => setIsHovered('')} style={{color: isHovered === 'reject' ? '#fff' : colors.textColor}} className='reject' onClick={() => setOpenDeletePostModal(false)}>Decline</button>
        <button onMouseEnter={() => setIsHovered('accept')} onMouseLeave={() => setIsHovered('')} style={{color: isHovered === 'accept' ? '#fff' : colors.textColor}} className='approve' onClick={deletePost}>Yes. Go it</button>
      </div>
    </div>
  )
}

export default DeletePostModal
