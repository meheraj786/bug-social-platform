import React, { useEffect, useState } from 'react';
import time from '../../layouts/time';
import toast from 'react-hot-toast';
import { getDatabase, onValue, push, ref, remove, set } from 'firebase/database';
import { useSelector } from 'react-redux';
import FriendsList from '../friendsList/FriendsList';
import CustomToast from '../../layouts/CustomToast';

const FriendReq = () => {
  const [requestList, setRequestList] = useState([]);
  const [requestListLoading, setRequestListLoading] = useState(true);
  const db = getDatabase();
  const currentUser = useSelector((state) => state.user.user);

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
      setRequestList(arr);
      setRequestListLoading(false);
    });
  }, []);

  const cancelRequest = (friend, dontShow) => {
    remove(ref(db, "friendRequest/" + friend.id))
      .then(() => {
        if (!dontShow) {
          toast.success("Friend request canceled");
          set(push(ref(db, "notification/")), {
            notifyReciver: friend.senderid,
            type: "negative",
            time: time(),
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
            toast.custom((t)=>(
      <CustomToast t={t} img={user.senderimg} name={user.sendername} content={`You accept Friend Request from ${user.sendername}`}/>
    ))
    const dontShow = true;
    cancelRequest(user, dontShow);
    set(push(ref(db, "notification/")), {
          notifyReciver: user.senderid,
          type: "positive",
          time: time(),
          content: `${user.recivername} Accept your friend request`,
        });
  };

  if (requestListLoading) {
    return <div className="text-center absolute top-5 right-5 text-gray-500 mt-5">Loading friend requests...</div>;
  }

  return (
    <>
    <div className="p-4 bg-white absolute top-5 right-5 overflow-y-auto rounded-md shadow-md w-[380px] h-[50%] mx-auto mt-8">
      <h2 className="text-xl font-semibold text-black mb-4 border-b pb-2">Friend Requests</h2>
      {requestList.length === 0 ? (
        <p className="text-gray-500 text-center">No pending friend requests.</p>
      ) : (
        <ul className="space-y-4">
          {requestList.map((user) => (
            <li
              key={user.id}
              className="flex items-center justify-between bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition"
            >
              <div className="flex items-center gap-4">
                <img
                  src={user.senderimg}
                  alt={user.sendername}
                  className="w-12 h-12 rounded-full object-cover border border-gray-300 shadow-sm"
                />
                <div>
                  <p className="text-black font-medium">{user.sendername}</p>
                  <p className="text-sm text-gray-500">{user.senderemail}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => acceptFriendReq(user)}
                  className="bg-black text-white px-3 py-1 rounded hover:bg-gray-800 transition text-sm"
                >
                  Accept
                </button>
                <button
                  onClick={() => cancelRequest(user)}
                  className="border border-black text-black px-3 py-1 rounded hover:bg-black hover:text-white transition text-sm"
                >
                  Cancel
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
    <FriendsList/>
    </>
  );
};

export default FriendReq;
