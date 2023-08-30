require('dotenv').config();
const express = require('express')
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const {userRouter} = require('./routes/userRoutes')
const {postRouter} = require('./routes/postRoutes')
const requestRouter = require('./routes/requestRoutes');
const friendshipRouter = require('./routes/friendshipRoutes');
const messageRouter = require('./routes/messageRoutes');
const notificationsRouter = require('./routes/notificationRoutes');
const likeRouter = require('./routes/likeRoutes');
const commentRouter = require('./routes/commentRoutes');

const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser');
app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));
// middleware:
app.use(express.urlencoded({extended: true}));
app.use(cors({
  origin: [process.env.LOCAL_HOST]
}))
app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


mongoose.connect(process.env.DB_URI).then(() => console.log('connected to db')).catch((err) => console.log(err))

app.use(userRouter)
app.use(postRouter)
app.use(requestRouter);
app.use(notificationsRouter)
app.use(friendshipRouter);
app.use(messageRouter)
app.use(likeRouter)
app.use(commentRouter)

const PORT = process.env.PORT
const server = app.listen(PORT)
// SOCKET IO
const io = require('socket.io')(server, {
    pingTimeout: 300000000,
    cors: {
        origin:process.env.LOCAL_HOST
}
})

let onlineUsers = [];

io.on("connection", (socket) => {
    socket.on('newUser', (user) => {
      !onlineUsers.some(us => us.userId === user) && onlineUsers.push({userId: user,  socket: socket.id})
  });
  

  socket.on('sendMateRequest',  ({ senderId, receiverId, msg, requestId }) => {
    const receiver =  onlineUsers.find(us => us.userId === receiverId)
    if (receiver) {
      io.to(receiver.socket).emit('getMateRequest', {senderId, msg, requestId, receiverId})
    } else {
      console.log('receiver is offline rn');
    }
  });

  socket.on('removeMateRequest',  ({ receiverId, senderId }) => {
    const receiver =  onlineUsers.find(us => us.userId === senderId)
    if (receiver) {
      io.to(receiver.socket).emit('mateReqRemoved', { receiverId, senderId })
    } else {
      console.log('receiver is offline rn');
    }
  });

  socket.on('deleteRequest', ({ receiverId, senderId }) => {
    const receiver =  onlineUsers.find(us => us.userId === receiverId)
    if (receiver) {
      io.to(receiver.socket).emit('requestDeleted', { receiverId, senderId })
    } else {
      console.log('receiver is offline rn');
    }
  })

  socket.on('acceptRequest', ({receiverId, senderId}) => {
    const receiver =  onlineUsers.find(us => us.userId === senderId)
    if (receiver) {
      io.to(receiver.socket).emit('requestAccepted', { receiverId, senderId })
    } else {
      console.log('receiver is offline rn');
    }
  })

  socket.on('sendNotification', ({senderId, receiverId, type, postId}) => {
    const receiver =  onlineUsers.find(us => us.userId === receiverId)
    if(receiver) {
      if(postId) {
        io.to(receiver.socket).emit('receiveNotification', {senderId, receiverId, type, postId})
      } else {
        io.to(receiver.socket).emit('receiveNotification', {senderId, receiverId, type})
      }
    }
  })

  socket.on('makeNewFriend',  ({ user1, user2 }) => {
    const userA =  onlineUsers.find(us => us.userId === user1 )
    const userB = onlineUsers.find(us => us.userId === user2)
    if(userA) {
      io.to(userA.socket).emit('friendshipMade', { friend: user2 })
    } else {
      console.log('user is offline rn')
    }
    if(userB) {
      io.to(userB.socket).emit('friendshipMade', { friend: user1 })
    } else {
      console.log('user is offline rn')
    }
  });

  socket.on('sendMessage', ({senderId, receiverId, msgTime, msg}) => {
    const receiver =  onlineUsers.find(us => us.userId === receiverId)
    if(receiver) {
      io.to(receiver.socket).emit('receiveMessage', {senderId, receiverId, msgTime, msg})
    }
  })

  socket.on('sendMessageNotification', ({senderId, receiverId, msgTime, msg}) => {
    const receiver =  onlineUsers.find(us => us.userId === receiverId)
    if(receiver) {
      io.to(receiver.socket).emit('receiveMessageNotification', {senderId, receiverId, msgTime, msg})
    }
  })

  socket.on('disconnect', () => {
    onlineUsers = onlineUsers.filter(user => user.socket !== socket.id)
  });
});