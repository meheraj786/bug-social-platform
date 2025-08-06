import { getDatabase, onValue, ref, remove } from 'firebase/database';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Container from '../layouts/Container';
import { roomUser } from '../features/chatRoom/chatRoom';
import Conversation from '../components/conversation/Conversation';
import { Link } from 'react-router';
import { motion } from 'motion/react';



const Messages = () => {
  const [friendList, setFriendList] = useState([]);
  const [friendListLoading, setFriendListLoading] = useState(true);
  const [message, setMessage]= useState("")
  const db = getDatabase();
  const dispatch= useDispatch()
  const currentUser = useSelector((state) => state.user.user);
  const [msgNotification, setMsgNotification]= useState([])
  const [msgNotif, setMsgNotif]= useState([])
    useEffect(() => {
    const notificationRef = ref(db, "messagenotification/");
    onValue(notificationRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        const notification = item.val();

        if (notification.reciverid == currentUser?.uid) {
          arr.push(notification.senderid);
        }
      });
      setMsgNotification(arr);
    });
  }, [currentUser?.uid, db]);
    useEffect(() => {
    const notificationRef = ref(db, "messagenotification/");
    onValue(notificationRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        const notification = item.val();

        if (notification.reciverid == currentUser?.uid) {
          arr.push({...notification, id:item.key});
        }
      });
      setMsgNotif(arr);
    });
  }, [currentUser?.uid, db]);
    
  const handleMsgNotificationDelete = (friend) => {
    msgNotif.forEach((item) => {
      if (
        (item.senderid === friend.id &&
          item.reciverid === currentUser.uid) ||
        (item.senderid === currentUser.uid &&
          item.reciverid === friend.id)
      ) {
        const notificationRef = ref(db, "messagenotification/" + item.id);
        remove(notificationRef);
      }
    });
  };


  useEffect(() => {
    const requestRef = ref(db, 'friendlist/');
    onValue(requestRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        const request = item.val();
        if (request.senderid === currentUser.uid || request.reciverid === currentUser.uid) {
          const isSender = request.senderid === currentUser.uid;
          const friendId = isSender ? request.reciverid : request.senderid;
          const friendName = isSender ? request.recivername : request.sendername;
          const friendEmail = isSender ? request.reciveremail : request.senderemail;
          const friendImage = isSender ? request.reciverimg : request.senderimg;

          arr.push({
            id: friendId,
            name: friendName,
            email: friendEmail,
            image: friendImage,
            listId: item.key,
          });
        }
      });
      setFriendList(arr);
      setFriendListLoading(false);
    });
  }, []);

return (
  <div className="h-screen pt-[50px] bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6">
    <Container>
      {/* Flex Container */}
      <div className="flex gap-6">
        
        {/* Friends List Section */}
        <div className="w-[30%] bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-4 overflow-y-auto h-[85vh]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Active Friends
            </h2>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              {friendList.length==0 ? "No Friends": friendList.length==1 ? `${friendList.length} Friend`: `${friendList.length} Friends`} 
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {friendList.map((friend) => (
              <Link to={`/messages/chat/${friend.id}`}>
              <div
                key={friend.id}
                onClick={()=>handleMsgNotificationDelete(friend)}
                className="flex relative items-center gap-4 p-3 bg-white/80 rounded-xl border border-white/60 shadow hover:shadow-lg cursor-pointer transition-all hover:scale-[1.02]"
                >
                {
                  msgNotification.includes(friend.id) && (
                    <span className='w-3 h-3 absolute top-2 right-2 rounded-full  bg-red-500 animate-pulse'></span>
                  )
                }
                <div className="relative">
                  <img
                    src={friend.image}
                    alt={friend.name}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-white"
                  />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <span className="font-medium text-gray-800 truncate">
                  {friend.name}
                </span>
              </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Conversation Section */}
        <div className="w-[70%] h-[85vh] bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 overflow-hidden flex flex-col">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Conversation</h3>
                <p className="text-white/80 text-sm">Start chatting with your friends</p>
              </div>
            </div>
          </div>

          {/* Conversation Messages */}
          <motion.div initial={{ opacity: 0, scale: 0.9 }}
  animate={{ opacity: 1, scale: 1 }}   
  transition={{ duration: 0.4, ease: "easeOut" }} className="flex-1 p-6 overflow-y-auto">
            <Conversation  msgNotif={msgNotif} />
          </motion.div>
        </div>
      </div>
    </Container>
  </div>
);

};

export default Messages;
