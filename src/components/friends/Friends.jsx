import { get, getDatabase, onValue, push, ref, remove, set } from "firebase/database";
import React, { useEffect, useState } from "react";
import time from "../../layouts/time";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const followers = [
  {
    name: "Product Hunt",
    username: "@ProductHunt",
    avatar: "https://i.pravatar.cc/150?img=12",
  },
  {
    name: "Mark Zuckerberg",
    username: "@MZuckerberg_",
    avatar: "https://i.pravatar.cc/150?img=5",
  },
  {
    name: "Ryan Hoover",
    username: "@rrhoover",
    avatar: "https://i.pravatar.cc/150?img=32",
  },
];

export default function Friends() {

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
    return <div className="w-full lg:w-[400px] h-[40%] mt-10 bg-gray-100 fixed bottom-0 left-0 shadow-md rounded-xl p-4 space-y-4">Loading friends...</div>;
  }
  return (
    <div className="w-full lg:w-[400px] h-[40%] mt-10 bg-gray-100 fixed bottom-0 left-0 shadow-md rounded-xl p-4 space-y-4">
      <h2 className="text-gray-800 font-semibold text-lg">Who is Your Friend</h2>

      {friendList.map((friend, idx) => (
        <div key={idx} className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <img
              src={friend.image}
                  alt={friend.name}
              className="w-10 h-10 rounded-full"
            />
            
        <Link to={`/profile/${friend.id}`}>
              <p className="text-gray-900 font-medium text-sm">
                {friend.name}
              </p>
              <p className="text-gray-500 text-xs">@{friend.name}</p>
            </Link>
          </div>
          <div>
          <button className="text-sm mr-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-1 rounded-full shadow-md hover:scale-105 transition duration-200">
            Chat
          </button>
          <button onClick={()=>unFriendHandler(friend)} className="text-sm bg-white border border-purple-600 text-purple-600 px-4 py-1 rounded-full shadow-md hover:scale-105 transition duration-200">
            Unfriend
          </button>

          </div>
        </div>
      ))}
    </div>
  );
}
