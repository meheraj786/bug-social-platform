import { get, getDatabase, onValue, push, ref, remove, set } from 'firebase/database';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import time from '../../layouts/time';
import { TiUserDelete } from 'react-icons/ti';

const FriendsList = () => {
  const [friendList, setFriendList] = useState([]);
  const [friendListLoading, setFriendListLoading] = useState(true);
  const db = getDatabase();
  const currentUser = useSelector((state) => state.user.user);

  const unFriendHandler = async (selectedFriend) => {
    const friendListRef = ref(db, "friendlist/");
    const snapshot = await get(friendListRef);

    snapshot.forEach((item) => {
      const friend = item.val();
      if (
        (friend.senderid === currentUser.uid && friend.reciverid === selectedFriend.id) ||
        (friend.senderid === selectedFriend.id && friend.reciverid === currentUser.uid)
      ) {
        remove(ref(db, "friendlist/" + item.key));
        toast.success("Unfriended successfully");
        set(push(ref(db, "notification/")), {
          notifyReciver: friend.senderid === currentUser.uid ? friend.reciverid : friend.senderid,
          type: "negative",
          time: time(),
          content: `${currentUser.displayName} unfriended you`,
        });
      }
    });
  };

  useEffect(() => {
    const requestRef = ref(db, "friendlist/");
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

  if (friendListLoading) {
    return <div className="text-center absolute bottom-5 right-5 text-gray-500 mt-5">Loading friends...</div>;
  }

  return (
    <div className="p-4 absolute bottom-5 right-5  bg-white rounded-md shadow-md h-[50%] w-[380px] mx-auto mt-8">
      <h2 className="text-xl font-semibold text-black mb-4 border-b pb-2">Your Friends</h2>
      {friendList.length === 0 ? (
        <p className="text-gray-500 text-center">You don't have any friends yet.</p>
      ) : (
        <ul className="space-y-4">
          {friendList.map((friend) => (
            <li
              key={friend.listId}
              className="flex items-center justify-between bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition"
            >
              <div className="flex items-center gap-4">
                <img
                  src={friend.image}
                  alt={friend.name}
                  className="w-12 h-12 rounded-full object-cover border border-gray-300 shadow-sm"
                />
                <div>
                  <p className="text-black font-medium">{friend.name}</p>
                  <p className="text-sm text-gray-500">{friend.email}</p>
                </div>
              </div>
              <button
                onClick={() => unFriendHandler(friend)}
                className="border border-black text-black px-4 py-1 rounded hover:bg-black hover:text-white transition text-lg"
              >
                <TiUserDelete />

              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FriendsList;
