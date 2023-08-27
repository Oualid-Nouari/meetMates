import React, { useContext, useState, useEffect } from 'react'
import PlatHeader from '../Components/platHeader'
import Settings from '../Components/Settings'
import UserCard from '../Components/UserCard'
import '../css/feed.css'
import CreatePost from '../Components/connectedUser/CreatePost'
import CreatePostModal from '../Components/connectedUser/CreatePostModal'
import SuggestedUsersSide from '../Components/SuggestedUsersSide'
import { Contexts } from '../contexts/contexts'
import PostModal from '../Components/PostModal'
import axios from 'axios';
import Loading from '../Components/Loading'
import ExplorePosts from '../Components/ExplorePosts'
import SentMateReqModal from '../Components/sentMateReqModal'

const Feed = () => {
  const [openSettings, setOpenSettings] = useState(false)
  const [openCreatePostModal, setOpenCreatePostModal] = useState(false)
  const [postCreated, setPostCreated] = useState(false)
  const [showPostModal, setShowPostModal] = useState(false);
  let { user, setUser, uploadedPostData, setChatWith, requestTo, setRequestTo, setRequestSent, colors } = useContext(Contexts);
  const getData = async () => {
    await axios.get(`${process.env.REACT_APP_API_URL}/user`, {
      headers: {
        'access_header': `bearer ${localStorage.getItem('token')}`
      }
    }).then((Response) => {
      setUser(Response.data)
    }).catch(err => console.log(err));
  }
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      window.location.assign('/sign')
      console.log('token is not safe careful')
    } else {
      getData();
    }
  }, []);
  const [post, setPost] = useState({ // FOR CREATING A POST
    posText: '',
    postImage: '',
  })
  const handleOverlayClick = () => {
    setOpenCreatePostModal(false);
    setShowPostModal(false)
    setChatWith('')
    setRequestTo('')
  }
  return (
    <div>
      {user ? <div className='feed'>
        {openCreatePostModal || showPostModal || requestTo ? <div className='overlay' onClick={handleOverlayClick}></div> : ''}
        {showPostModal && <PostModal
          post={uploadedPostData}
          setShowPostModal={setShowPostModal}
        />}
        {requestTo && <SentMateReqModal
          setRequestSent={setRequestSent}
          requestTo={requestTo}
          setRequestTo={setRequestTo}
        />}
        <PlatHeader
          openSettings={openSettings}
          setOpenSettings={setOpenSettings}
        />
        <Settings openSettings={openSettings} setOpenSettings={setOpenSettings} />
        <CreatePostModal
          post={post}
          setPost={setPost}
          openCreatePostModal={openCreatePostModal}
          setOpenCreatePostModal={setOpenCreatePostModal}
          setPostCreated={setPostCreated}
        />
        <section className='main-of-page'>
          <UserCard user={user} setUser={setUser} />
          <div className='middle-part'>
            <CreatePost setOpenCreatePostModal={setOpenCreatePostModal} />
            <ExplorePosts />
          </div>
          <SuggestedUsersSide />
        </section>
        <span className={postCreated ? 'post-created active' : 'post-created'} style={{ backgroundColor: colors.thirdColor }}>Post created <small onClick={() => setShowPostModal(true)}>View post</small></span>
      </div> : <Loading />}
    </div>
  )
}

export default Feed