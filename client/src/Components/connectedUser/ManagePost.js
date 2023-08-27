import React, { useContext, useState } from 'react'
import { Contexts } from '../../contexts/contexts'

const ManagePost = ({openManagePost, setOpenManagePost, post, setPostToUpdate, setPostToDelete}) => {
  const { setOpenEditPostModal, setOpenDeletePostModal, colors } = useContext(Contexts)
  const [isHovered, setIsHovered] = useState('')
  const handleClickEdit = () => {
    setOpenEditPostModal(true)
    setOpenManagePost(false)
    setPostToUpdate(post._id)
  }
  const openModalTodeletePost = () => {
    setOpenDeletePostModal(true);
    setOpenManagePost(false)
    setPostToDelete(post._id)
  }
  return (
    <div>
      <section className={openManagePost ? 'manage-post active' : 'manage-post'} style={{backgroundColor: colors.secondColor}}>
        <button 
        onMouseEnter={() => setIsHovered('edit')} 
        onMouseLeave={() => setIsHovered('')} 
        style={{color: colors.textColor, backgroundColor: isHovered === "edit" && colors.fourthColor}} 
        className='edit-post' 
        onClick={handleClickEdit}>Edit post</button>
        <button 
        onMouseEnter={() => setIsHovered('delete')} 
        onMouseLeave={() => setIsHovered('')} 
        style={{color: colors.textColor, backgroundColor: isHovered === "delete" && colors.fourthColor}} 
        className='delete-post' 
        onClick={openModalTodeletePost}>Delete post</button>
      </section>
    </div>
    
  )
}

export default ManagePost
