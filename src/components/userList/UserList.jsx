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
    toast.success("Friend Request Accepted");
    const dontShow = true;
    cancelFriendRequest(user, dontShow);
    set(push(ref(db, "notification/")), {
      notifyReciver: user.senderid,
      type: "positive",
      time: time(),
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
    <div className="w-full lg:w-[400px] h-1/2 fixed mt-[80px] top-0 right-0 bg-white shadow-md rounded-xl p-4 space-y-4">
      <h2 className="text-gray-800 font-semibold text-lg">Add Some Friends</h2>

      {friendRequestList.map((user, idx) => (
        <div key={idx} className="flex my-3 items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <img
              src={user.senderimg}
              alt={user.sendername}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="text-gray-900 font-medium text-sm">
                {user.sendername}
              </p>
              <p className="text-gray-500 text-xs">{user.senderemail}</p>
            </div>
          </div>
          <div>
          <button
            onClick={() => acceptFriendReq(user)}
            className="text-sm bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-1 rounded-full shadow-md hover:scale-105 transition duration-200"
          >
            Accept
          </button>
          <button
            onClick={() => cancelFriendRequest(user)}
            className="text-sm bg-white border-purple-600 text-purple-600 mr-2 px-4 py-1 rounded-full shadow-md hover:scale-105 transition duration-200"
          >
            Reject
          </button>

          </div>
        </div>
      ))}


{userList
  .filter(
    (user) =>
      !friendList.includes(user.id + currentUser.uid) &&
      !friendList.includes(currentUser.uid + user.id)
  )
  .map((user, idx) => (
    <div key={idx} className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <img
          src={user.imageUrl}
          alt={user.username}
          className="w-10 h-10 rounded-full"
        />
        <div>
          <p className="text-gray-900 font-medium text-sm">{user.username}</p>
          <p className="text-gray-500 text-xs">{user.email}</p>
        </div>
      </div>

      {requestList.includes(user.id + currentUser.uid) ||
      requestList.includes(currentUser.uid + user.id) ? (
        <button
          onClick={() => cancelRequest(user)}
          className="text-sm bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-1 rounded-full shadow-md hover:scale-105 transition duration-200"
        >
          Cancel
        </button>
      ) : (
        <button
          onClick={() => handleRequest(user)}
          className="text-sm bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-1 rounded-full shadow-md hover:scale-105 transition duration-200"
        >
          Add
        </button>
      )}
    </div>
  ))}


      <button className="text-sm text-blue-600 hover:underline mt-2">
        Show more
      </button>
    </div>
  );
}
