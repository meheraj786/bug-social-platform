import {
  get,
  getDatabase,
  onValue,
  push,
  ref,
  remove,
  set,
} from "firebase/database";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import time from "../../layouts/time";
import { useSelector } from "react-redux";
import { TbUserCancel } from "react-icons/tb";
import { IoPersonAddSharp } from "react-icons/io5";
import { Link } from "react-router";
import moment from "moment";


  import { motion } from "motion/react";

export default function UserList() {
  const [userList, setUserList] = useState([]);
  const [requestList, setRequestList] = useState([]);
  const [userLoading, setUserLoading] = useState(true);
  const [friendList, setFriendList] = useState([]);
  const db = getDatabase();
  const currentUser = useSelector((state) => state.user.user);
  const [friendRequestList, setFriendRequestList] = useState([]);
  const [requestListLoading, setRequestListLoading] = useState(true);

  useEffect(() => {
    const requestRef = ref(db, "friendRequest/");
    onValue(requestRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        const request = item.val();
        if (request.reciverid === currentUser.uid) {
          arr.push({ ...request, id: item.key });
        }
      });
      setFriendRequestList(arr);
      setRequestListLoading(false);
    });
  }, []);

  const cancelFriendRequest = (friend, dontShow) => {
    remove(ref(db, "friendRequest/" + friend.id))
      .then(() => {
        if (!dontShow) {
          toast.success("Friend request canceled");
          set(push(ref(db, "notification/")), {
            notifyReciver: friend.senderid,
            type: "negative",
            time: moment().format(),
            content: `${friend.recivername} canceled your friend request`,
          });
        }
      })
      .catch((error) => {
        console.error(error);
        toast.error("Failed to cancel request");
      });
  };

  const acceptFriendReq = (user) => {
    set(push(ref(db, "friendlist/")), {
      senderid: user.senderid,
      sendername: user.sendername,
      senderimg: user.senderimg,
      reciverid: currentUser.uid,
      reciverimg: currentUser.photoURL,
      recivername: currentUser.displayName,
    });
    toast.success("Friend Request Accepted");
    const dontShow = true;
    cancelFriendRequest(user, dontShow);
    set(push(ref(db, "notification/")), {
      notifyReciver: user.senderid,
      type: "positive",
      time: moment().format(),
      content: `${user.recivername} Accept your friend request`,
    });
  };

  useEffect(() => {
    const userRef = ref(db, "users/");
    onValue(userRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        const user = item.val();
        const userId = item.key;
        if (userId !== currentUser.uid) {
          arr.push({ ...user, id: userId });
        }
      });
      setUserList(arr);
      setUserLoading(false);
    });
  }, []);

  useEffect(() => {
    const requestRef = ref(db, "friendRequest/");
    onValue(requestRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        const request = item.val();
        arr.push(request.reciverid + request.senderid);
      });
      setRequestList(arr);
    });
  }, []);

  useEffect(() => {
    const requestRef = ref(db, "friendlist/");
    onValue(requestRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        const request = item.val();
        arr.push(request.reciverid + request.senderid);
      });
      setFriendList(arr);
    });
  }, []);

  const handleRequest = (item) => {
    set(push(ref(db, "friendRequest/")), {
      senderid: currentUser.uid,
      sendername: currentUser.displayName,
      reciverid: item.id,
      senderimg: currentUser.photoURL,
      recivername: item.username,
      time: time(),
    });
    toast.success("Friend Request Sent");
  };

  const cancelRequest = (friend) => {
    const requestRef = ref(db, "friendRequest/");

    get(requestRef)
      .then((snapshot) => {
        snapshot.forEach((item) => {
          const request = item.val();
          const key = item.key;
          if (
            (request.senderid === currentUser.uid &&
              request.reciverid === friend.id) ||
            (request.reciverid === currentUser.uid &&
              request.senderid === friend.id)
          ) {
            toast.success("Friend request canceled");
            return remove(ref(db, "friendRequest/" + key));
          }
        });
      })
      .catch((error) => {
        console.error("Error canceling request:", error);
        toast.error("Failed to cancel request");
      });
  };

  if (userLoading) {
    return (
      <div className="text-center absolute top-5 left-5 text-gray-500 mt-5">
        Loading users...
      </div>
    );
  }

return (
  <motion.div initial={{ opacity: 0, scale: 0.9 }}
  animate={{ opacity: 1, scale: 1 }}   
  transition={{ duration: 0.4, ease: "easeOut" }} className="w-full font-secondary lg:w-[400px] h-1/2 fixed mt-[80px] top-0 right-0 bg-white/90 backdrop-blur-xl shadow-2xl rounded-2xl border border-gray-200/50 p-6 space-y-5 overflow-y-auto">
    {/* Header */}
    <div className="flex items-center justify-between">
      <h2 className="text-transparent bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text font-bold text-xl">
        Add Friends
      </h2>
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
        <span className="font-medium">{userList.length} users</span>
      </div>
    </div>

    {/* Friend Requests Section */}
    {friendRequestList.length > 0 && (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-1 h-6 bg-gradient-to-b from-purple-500 to-blue-500 rounded-full"></div>
          <h3 className="font-semibold text-gray-800">Friend Requests</h3>
          <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">
            {friendRequestList.length}
          </span>
        </div>
        
        {friendRequestList.map((user, idx) => (
          <div key={idx} className="flex items-center justify-between gap-4 p-4 bg-gradient-to-r from-purple-50/80 to-blue-50/80 rounded-2xl border border-purple-200/50 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 group">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative">
                <img
                  src={user.senderimg}
                  alt={user.sendername}
                  className="w-12 h-12 rounded-full object-cover border-2 border-purple-200 group-hover:border-purple-400 transition-colors duration-300"
                />
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-white flex items-center justify-center">
                  <span className="text-white text-xs font-bold">!</span>
                </div>
              </div>
              
              <Link to={`/profile/${user.id}`} className="flex-1 min-w-0">
                <p className="text-gray-900 font-primary font-semibold text-sm hover:text-purple-600 transition-colors duration-200 truncate">
                  {user.sendername}
                </p>
                <p className="text-gray-500 text-xs font-medium truncate">{user.senderemail}</p>
              </Link>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => acceptFriendReq(user)}
                className="text-xs bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-2 rounded-full shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 font-medium flex items-center gap-1.5"
              >
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Accept
              </button>
              
              <button
                onClick={() => cancelFriendRequest(user)}
                className="text-xs bg-white hover:bg-red-50 border border-gray-300 hover:border-red-300 text-gray-600 hover:text-red-600 px-4 py-2 rounded-full shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 font-medium flex items-center gap-1.5"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    )}

    {/* Suggested Users Section */}
    <div className="space-y-4">
      {friendRequestList.length > 0 && (
        <div className="flex items-center gap-2">
          <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
          <h3 className="font-semibold text-gray-800">Suggested</h3>
        </div>
      )}
      
      {userList
        .filter(
          (user) =>
            !friendList.includes(user.id + currentUser.uid) &&
            !friendList.includes(currentUser.uid + user.id)
        )
        .map((user, idx) => (
          <div key={idx} className="flex items-center justify-between gap-4 p-4 bg-gradient-to-r from-gray-50/80 to-white/80 rounded-2xl border border-gray-200/50 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 group">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative">
                <img
                  src={user.imageUrl}
                  alt={user.username}
                  className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 group-hover:border-blue-400 transition-colors duration-300"
                />
                <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-gray-400 rounded-full border-2 border-white"></div>
              </div>
              
              <Link to={`/profile/${user.id}`} className="flex-1 min-w-0">
                <p className="text-gray-900 font-primary font-semibold text-sm hover:text-blue-600 transition-colors duration-200 truncate">
                  {user.username}
                </p>
                <p className="text-gray-500 text-xs font-medium truncate">{user.email}</p>
              </Link>
            </div>

            <div className="flex items-center">
              {requestList.includes(user.id + currentUser.uid) ||
              requestList.includes(currentUser.uid + user.id) ? (
                <button
                  onClick={(e) => {
                    cancelRequest(user);
                    e.stopPropagation();
                  }}
                  className="text-xs bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-4 py-2 rounded-full shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 font-medium flex items-center gap-1.5"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Pending
                </button>
              ) : (
                <button
                  onClick={(e) => {
                    handleRequest(user);
                    e.stopPropagation();
                  }}
                  className="text-xs bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-4 py-2 rounded-full shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 font-medium flex items-center gap-1.5"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Friend
                </button>
              )}
            </div>
          </div>
        ))}
    </div>


    {/* Empty State */}
    {userList.filter(
      (user) =>
        !friendList.includes(user.id + currentUser.uid) &&
        !friendList.includes(currentUser.uid + user.id)
    ).length === 0 && friendRequestList.length === 0 && (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <p className="text-gray-500 font-medium">No suggestions available</p>
        <p className="text-gray-400 text-sm">Check back later for new friends!</p>
      </div>
    )}
  </motion.div>
);
}
