import { getDatabase, onValue, ref } from 'firebase/database';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Container from '../layouts/Container';
import { roomUser } from '../features/chatRoom/chatRoom';
import Conversation from '../components/conversation/Conversation';

const mockMessages = [
  {
    id: 1,
    sender: 'friend',
    text: 'Hey! What’s up?',
    time: '2:30 PM',
  },
  {
    id: 2,
    sender: 'me',
    text: 'All good! You?',
    time: '2:32 PM',
  },
];

const Messages = () => {
  const [friendList, setFriendList] = useState([]);
  const [friendListLoading, setFriendListLoading] = useState(true);
  const [message, setMessage]= useState("")
  const db = getDatabase();
  const dispatch= useDispatch()
  const currentUser = useSelector((state) => state.user.user);

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
    <div className="p-5">
      <Container>
      <div className="flex justify-center overflow-x-auto gap-5 pb-3 border-b mb-5">
        {friendList.map((friend) => (
          <div onClick={()=>dispatch(roomUser(friend))} key={friend.id} className="flex border p-3 rounded-lg flex-col items-center min-w-[70px]">
            <img
              src={friend.image}
              alt={friend.name}
              className="w-14 h-14 rounded-full object-cover shadow-md"
            />
            <span className="text-lg font-medium mt-1 text-center truncate">{friend.name}</span>
          </div>
        ))}
      </div>
<Conversation/>

      </Container>
    </div>
  );
};

export default Messages;
