import { get, getDatabase, onValue, push, ref, remove, set } from "firebase/database";
import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";
import time from "../../layouts/time";
import { IoPersonAddSharp } from "react-icons/io5";
import { TbUserCancel } from "react-icons/tb";
import { FaUserFriends } from "react-icons/fa";
import { motion } from "motion/react";
import CustomToast from "../../layouts/CustomToast";

const AllUserList = () => {
  const [userList, setUserList] = useState([]);
  const [requestList, setRequestList]= useState([])
  const [userLoading, setUserLoading] = useState(true);
  const [friendList, setFriendList]= useState([])
  const db = getDatabase();
  const currentUser = useSelector((state) => state.user.user);

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
        toast.custom((t) => (
      <CustomToast
        t={t}
        img={item.imageUrl}
        name={item.username}
        content={`You sent Friend Request to ${item.username}`}
      />
    ));
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
            (request.reciverid === currentUser.uid && request.senderid === friend.id)
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
    return <div className="text-center absolute top-5 left-5 text-gray-500 mt-5">Loading users...</div>;
  }

  return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }}
  animate={{ opacity: 1, scale: 1 }}   
  transition={{ duration: 0.4, ease: "easeOut" }} className="p-4 absolute top-5 left-5 h-full overflow-y-auto bg-white rounded-md shadow-md w-[380px] mx-auto mt-8">
      <h2 className="text-xl font-semibold text-black mb-4 border-b pb-2">All Users</h2>
      <ul className="space-y-4">
        {userList.map((user) => (
          <li
            key={user.id}
            className="flex items-center justify-between bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition"
          >
            <div className="flex items-center space-x-4">
              <img
                src={user.imageUrl}
                alt={user.username}
                className="w-12 h-12 rounded-full object-cover border border-gray-300 shadow-sm"
              />
              <div>
                <p className="text-black font-medium">{user.username}</p>
                <p className="text-sm text-gray-600">{user.email}</p>
                <p className="text-xs text-gray-400">{user.location}</p>
              </div>
            </div>
            {
              requestList.includes(user.id+currentUser.uid || currentUser.uid+user.id) ? (
<button onClick={()=>cancelRequest(user)} className="bg-black text-white px-4 py-1 rounded hover:bg-gray-800 transition text-lg">
              <TbUserCancel />
            </button>
              ) : friendList.includes(user.id+currentUser.uid || currentUser.uid+user.id) ? (
<span className=" text-lg"><FaUserFriends />
</span>
              ) :  (
                <button onClick={()=>handleRequest(user)} className="bg-black text-white px-4 py-1 rounded hover:bg-gray-800 transition text-lg">
              <IoPersonAddSharp />
            </button>
              )
            }
          </li>
        ))}
      </ul>
    </motion.div>
  );
};

export default AllUserList;
