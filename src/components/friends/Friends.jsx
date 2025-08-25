import { get, getDatabase, onValue, push, ref, remove, set } from "firebase/database";
import React, { useEffect, useState } from "react";
import time from "../../layouts/time";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { Link } from "react-router";
import moment from "moment";
import { motion } from "motion/react";
import UnfriendPopup from "../../layouts/UnfriendPopup";

export default function Friends() {

  const [friendList, setFriendList] = useState([]);
  const [friendListLoading, setFriendListLoading] = useState(true);
  const db = getDatabase();
  const currentUser = useSelector((state) => state.user.user);
  const [selectFriend, setSelectedFriend]= useState(null)
  const [unFriendPop, setUnfriendPop]= useState(false)

  const unFriendHandler = async () => {
    const friendListRef = ref(db, "friendlist/");
    const snapshot = await get(friendListRef);

    snapshot.forEach((item) => {
      const friend = item.val();
      if (
        (friend.senderid === currentUser.uid && friend.reciverid === selectFriend.id) ||
        (friend.senderid === selectFriend.id && friend.reciverid === currentUser.uid)
      ) {
        remove(ref(db, "friendlist/" + item.key));
        toast.success("Unfriended successfully");
        set(push(ref(db, "notification/")), {
          notifyReciver: friend.senderid === currentUser.uid ? friend.reciverid : friend.senderid,
          type: "negative",
          time: moment().format(),
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
    return <div className="w-full lg:w-[400px] h-[45%]  bg-gray-100 fixed bottom-0 right-0 shadow-md rounded-xl p-4 space-y-4">Loading friends...</div>;
  }
return (
  <motion.div initial={{ opacity: 0, scale: 0.9 }}
  animate={{ opacity: 1, scale: 1 }}   
  transition={{ duration: 0.4, ease: "easeOut" }} className="w-full lg:w-[400px] font-secondary h-[45%]  bg-white/90 backdrop-blur-xl fixed bottom-0 right-0 shadow-2xl rounded-t-3xl border-t border-gray-200/50 p-6 space-y-5 overflow-y-auto">
    
      {
        unFriendPop && <UnfriendPopup name={selectFriend.name} image={selectFriend.image} unfriendPopup={setUnfriendPop} unfriendHandler={unFriendHandler}/>
      }
    {/* Header */}
    <div className="flex items-center justify-between">
      <h2 className="text-transparent bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text font-bold text-xl">
        Your Friends
      </h2>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              {friendList.length==0 ? "No Friends": friendList.length==1 ? `${friendList.length} Friend`: `${friendList.length} Friends`} 
            </div>
    </div>

    {/* Friends List */}
    <div className="space-y-4">
      {friendList.map((friend, idx) => (
        <div 
          key={idx} 
          className="flex items-center justify-between gap-4 p-4 bg-gradient-to-r from-gray-50/80 to-white/80 rounded-2xl border border-gray-200/50 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 group"
        >
          {/* Profile Section */}
          <div className="flex items-center gap-4 flex-1">
            <div className="relative">
              <img
                src={friend.image}
                alt={friend.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-purple-200 group-hover:border-purple-400 transition-colors duration-300"
              />
              {/* <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div> */}
            </div>
            
            <Link to={`/profile/${friend.id}`} className="flex-1 min-w-0">
              <p className="text-gray-900 font-primary font-semibold text-sm hover:text-purple-600 transition-colors duration-200 truncate">
                {friend.name}
              </p>
              <p className="text-gray-500 text-xs font-medium">@{friend.name}</p>
            </Link>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <Link to={`/messages/chat/${friend.id}`}>
            <button className="text-xs bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-4 py-2 rounded-full shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 font-medium flex items-center gap-1.5">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
              </svg>
              Chat
            </button>
            </Link>
            
            <button 
              onClick={() => {setSelectedFriend(friend)
                setUnfriendPop(true)
              }} 
              className="text-xs bg-white hover:bg-red-50 border border-gray-300 hover:border-red-300 text-gray-600 hover:text-red-600 px-4 py-2 rounded-full shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 font-medium flex items-center gap-1.5"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Remove
            </button>
          </div>
        </div>
      ))}
    </div>

    {/* Empty State */}
    {friendList.length === 0 && (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <p className="text-gray-500 font-medium">No friends yet</p>
        <p className="text-gray-400 text-sm">Start connecting with people!</p>
      </div>
    )}
  </motion.div>
);
}
