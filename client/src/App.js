import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Sign from './pages/Sign';
import { Contexts } from './contexts/contexts';
import { useEffect, useState } from 'react';
import Feed from './pages/Feed';
import Profile from './pages/userProfile';
import OtherUserProfile from './pages/OtherUserProfile';
import io from 'socket.io-client';
import axios from 'axios';
function App() {
  const [user, setUser] = useState(null)
  const [uploadedPostData, setUploadedPostData] = useState(null);
  const [newUserData, setNewUserData] = useState({ fullName: '', username: '', bio: '', profileImage: '', bannerImage: '' }); //TO UPDATE USER INFO
  const [openEditPostModal, setOpenEditPostModal] = useState(false);
  const [openDeletePostModal, setOpenDeletePostModal] = useState(false)
  const [requestSent, setRequestSent] = useState([]) // contain all receiversIds
  const [requestsReceived, setRequestsReceived] = useState([])
  const [notifsReceived, setNofisReceived] = useState([]);
  const [requestTo, setRequestTo] = useState('') // Request receiverId
  const [friendsList, setFriendsList] = useState([]) // contain all friends
  const [openMessaging, setOpenMessaging] = useState(false)
  const [chatWith, setChatWith] = useState(null)
  const [deliveredMessages, setDeliveredMessages] = useState([])
  const [likedPosts, setLikedPosts] = useState([]) // contains posts ids liked by this user
  // HANDLING THEME:
  const [isDarkMode, setIsDarkMode] = useState(JSON.parse(localStorage.getItem('isDarkMode')) || false)
  const [variableColor, setVariableColor] = useState(localStorage.getItem('varColor') || "2785FF")
  const [colors, setColors] = useState({
    mainColor: '#fff',
    textColor: '#000',
    secondColor: '#F5F6FA',
    thirdColor: '#2785FF',
    fourthColor: '#323337' //for icons, borders
  })
  useEffect(() => {
    if (isDarkMode) {
      setColors({
        mainColor: '#242526',
        textColor: '#E0E0E0',
        secondColor: '#18191A',
        thirdColor: `#${variableColor}`,
        fourthColor: '#323337'
      })
    } else {
      setColors({
        mainColor: '#fff',
        textColor: '#000',
        secondColor: '#F5F6FA',
        thirdColor: `#${variableColor}`,
        fourthColor: '#B8BACC'
      })
      
    }
  }, [isDarkMode, variableColor])
  document.body.style.backgroundColor = colors.secondColor
  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/postsLiked`, {
      headers: {
        'access_header': `bearer ${localStorage.getItem('token')}`
      }
    }).then(Response => {
      let likedPosts = Response.data.likedPosts
      likedPosts.map(postLiked => {
        setLikedPosts(prev => [...prev, postLiked.likedPostId])
      })
    })
  }, [])
  // SOCKET IO:
  const [socket, setSocket] = useState(io(`${process.env.REACT_APP_API_URL}`))
  useEffect(() => {
    user && socket.emit('newUser', user.id);
  }, [socket, user])
  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/requests`, {
      headers: {
        'access_header': `bearer ${localStorage.getItem('token')}`
      }
    }).then(Response => {
      const receivedReqs = Response.data.userRequests.reverse();
      setRequestsReceived(receivedReqs);
    })
  }, [socket])
  useEffect(() => {
    socket.on('getMateRequest', data => {
      setRequestsReceived(prev => [...prev, data])
    })
  }, [socket])
  // Notifs:*
  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/notifications`, {
      headers: {
        'access_header': `bearer ${localStorage.getItem('token')}`
      }
    }).then(Response => {
      const receivedNotifs = Response.data.receivedNotifs
      setNofisReceived(receivedNotifs);
    })
  }, [])
  useEffect(() => {
    socket.on('receiveNotification', data => {
      setNofisReceived(prev => [...prev, data])
    })
  }, [socket])
  // Messages notifications:
  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/deliveredMessages`, {
      headers: {
        'access_header': `bearer ${localStorage.getItem('token')}`
      }
    }).then(Response => {
      let deliveredMessages = Response.data.deliveredMessages
      setDeliveredMessages(deliveredMessages)
    })
  }, [])
  useEffect(() => {
    socket.on('receiveMessageNotification', data => {
      setDeliveredMessages(prev => [...prev, data])
    })
  }, [socket])
  return (
    <div className="App">
      <Contexts.Provider value={{
        setUser, user, setUploadedPostData, uploadedPostData, newUserData, setNewUserData,
        openEditPostModal, setOpenEditPostModal, openDeletePostModal, setOpenDeletePostModal,
        socket, requestSent, setRequestSent, requestTo, setRequestTo, friendsList, setFriendsList,
        requestsReceived, setRequestsReceived, notifsReceived, setNofisReceived, chatWith, setChatWith,
        deliveredMessages, setDeliveredMessages, likedPosts, setLikedPosts, openMessaging, setOpenMessaging,
        colors, setColors, setIsDarkMode, isDarkMode, setVariableColor, variableColor
      }}>
        <Router>
          <Routes>
            {!localStorage.getItem('token') && <Route path='/sign' element={<Sign />} />}
            <Route path='/' element={<Feed />} />
            <Route path='/profile' element={<Profile />} />
            <Route path='/users/:userId' element={<OtherUserProfile />} />
          </Routes>
        </Router>
      </Contexts.Provider>
    </div>
  );
}

export default App;
