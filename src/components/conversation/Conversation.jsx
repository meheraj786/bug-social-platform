import {
  getDatabase,
  onValue,
  push,
  ref,
  remove,
  set,
} from "firebase/database";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import time from "../../layouts/time";
import { roomUser } from "../../features/chatRoom/chatRoom";
import { AiFillLike, AiTwotoneDelete } from "react-icons/ai";
import { FaRegPaperPlane, FaReplyAll } from "react-icons/fa";
import Flex from "../../layouts/Flex";
import { RxCross2 } from "react-icons/rx";
import { MdOutlineReply } from "react-icons/md";
import { useParams } from "react-router";
import moment from "moment";

const Conversation = ({ msgNotification, isFriend }) => {
  const db = getDatabase();
  const dispatch = useDispatch();
  const data = useSelector((state) => state.user.user);
  // const roomuser = useSelector((state) => state.roomUser.value);
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [emojiActive, setEmojiActive] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(false);
  const [unfriendConfirm, setUnfriendConfirm] = useState(false);
  const [blockPopup, setBlockPopup] = useState(false);
  const [replyMsg, setReplyMsg] = useState("");
  const [msgLoading, setMsgLoading] = useState(true);
  const [roomuser, setRoomuser]= useState(null)
  const {id}= useParams()

  const messagesEndRef = useRef(null);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const requestRef = ref(db, 'friendlist/');
    onValue(requestRef, (snapshot) => {
      snapshot.forEach((item) => {
        const request = item.val();
        if (request.senderid==data.uid && request.reciverid==id || request.reciverid==data.uid || request.senderid==id) {
          setRoomuser({...request, id: item.key})
        }
      });
    });
  }, []);

  // const scrollToBottom = () => {
  //   if (scrollContainerRef.current) {
  //     const container = scrollContainerRef.current;
  //     container.scrollTop = container.scrollHeight;
  //   }
  // };

  // const unFriendHandler = () => {
  //   remove(ref(db, "friendlist/" + roomuser.id));
  //   toast.success("Unfriended successfully");
  //   set(push(ref(db, "notification/")), {
  //     notifyReciver:
  //       roomuser.senderid == data.uid ? roomuser.reciverid : roomuser.senderid,
  //     type: "negative",
  //     time: time(),
  //     content: `${data.displayName} unfriend you`,
  //   });
  // };

  // const blockHandler = () => {
  //   let blockerId = "";
  //   let blockedId = "";
  //   let blockerName = "";
  //   let blockedName = "";
  //   if (roomuser.senderid == data.uid) {
  //     blockerId = roomuser.senderid;
  //     blockerName = getSafeName(roomuser.sendername);
  //     blockedId = roomuser.reciverid;
  //     blockedName = getSafeName(roomuser.recivername);
  //   } else {
  //     blockerId = roomuser.reciverid;
  //     blockerName = getSafeName(roomuser.recivername);
  //     blockedId = roomuser.senderid;
  //     blockedName = getSafeName(roomuser.sendername);
  //   }
  //   set(push(ref(db, "blocklist/")), {
  //     blockerId: blockerId,
  //     blockedId: blockedId,
  //     blockerName: blockerName,
  //     blockedName: blockedName,
  //   });
  //   set(push(ref(db, "notification/")), {
  //     notifyReciver: blockedId,
  //     type: "negative",
  //     time: time(),
  //     content: `${blockerName} blocked you`,
  //   });
  //   toast.success("Blocked Successful");
  //   remove(ref(db, "friendlist/" + roomuser.id));
  // };

  // useEffect(() => {
  //   scrollToBottom();
  // }, [messageList]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (roomuser?.id && isFriend && Array.isArray(isFriend)) {
        if (!isFriend.includes(roomuser.id)) {
          console.log("User is not in friend list");
          dispatch(roomUser(null));
        } else {
          console.log("User is friend");
        }
      }
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, [isFriend, roomuser?.id, dispatch]);

  const handleMsgNotificationDelete = () => {
    if (!roomuser || !msgNotification?.length) return;

    msgNotification.forEach((item) => {
      if (
        (item.senderid === roomuser.senderid &&
          item.reciverid === roomuser.reciverid) ||
        (item.senderid === roomuser.reciverid &&
          item.reciverid === roomuser.senderid)
      ) {
        const notificationRef = ref(db, "messagenotification/" + item.id);
        remove(notificationRef);
      }
    });
  };

  useEffect(() => {
    if (!roomuser || !data?.uid) return;

    const messageRef = ref(db, "message/");
    const unsubscribe = onValue(messageRef, (snapshot) => {
      let arr = [];

      snapshot.forEach((item) => {
        const message = item.val();
        const messageId = item.key;
        if (
          (message.senderid === data?.uid && message.reciverid === id) ||
          (message.senderid === id && message.reciverid === data?.uid)
        ) {
          arr.push({ ...message, id: messageId });
        }
      });
      setMessageList(arr);
      setMsgLoading(false);
    });

    return () => unsubscribe();
  }, [db, data?.uid, roomuser, id]);

  console.log("roomuser",roomuser);
  

  const sentMessageHandler = (like) => {
  const senderid = data.uid;
  const sendername = data.displayName;
  
  let reciverid, recivername;
  
  if (roomuser.senderid === data.uid) {
    reciverid = roomuser.reciverid;
    recivername = roomuser.recivername;
  } else {
    reciverid = roomuser.senderid;
    recivername = roomuser.sendername;
  }

  if (like) {
    set(push(ref(db, "message")), {
      senderid: senderid,
      sendername: sendername,
      reciverid: reciverid,
      recivername: recivername,
      message: "like",
      replyMsg: replyMsg,
      time: moment().format(),
    })
      .then(() => {
        setMessage("");
        setReplyMsg("");
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to send message.");
      });
  } else {
    set(push(ref(db, "message")), {
      senderid: senderid,
      sendername: sendername,
      reciverid: reciverid,
      recivername: recivername,
      message: message,
      replyMsg: replyMsg,
      time: moment().format(),
    })
      .then(() => {
        setMessage("");
        setReplyMsg("");
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to send message.");
      });
  }
};

  const messageDeleteHandler = (msg) => {
    const msgRef = ref(db, "message/" + msg.id);
    remove(msgRef);
    toast.success("Message Deleted");
  };

  if (!roomuser) {
    return (
      <div className="convo mt-10 xl:mt-0 shadow-shadow flex justify-center items-center rounded-[20px] xl:w-[100%] h-[93vh]">
        <div className="text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-gray-400 text-3xl">💬</span>
          </div>
          <p className="text-gray-500 text-lg font-medium">
            No Friend Selected
          </p>
          <p className="text-gray-400 text-sm mt-2">
            Select a Friend to start chatting
          </p>
        </div>
      </div>
    );
  }
return (
  <div className="bg-gradient-to-br h-full from-white to-gray-50/50 backdrop-blur-xl p-6 rounded-3xl shadow-2xl border border-white/20 max-w-3xl mx-auto  flex flex-col justify-between relative overflow-hidden">
    {/* User Info */}
    <div
                key={roomuser.senderid==data.uid ? roomuser.reciverid : roomuser.senderid}
                className="flex items-center gap-4 p-3 bg-white/80 rounded-xl border border-white/60 shadow hover:shadow-lg cursor-pointer transition-all hover:scale-[1.02]"
              >
                <div className="relative">
                  <img
                    src={roomuser.senderid==data.uid ? roomuser.reciverimg : roomuser.senderimg}
                    alt={roomuser.name}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-white"
                  />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <span className="font-medium text-gray-800 truncate">
                  {roomuser.senderid==data.uid ? roomuser.recivername : roomuser.sendername}
                </span>
              </div>
    
    {/* Decorative Background Elements */}
    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-3xl"></div>
    <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-pink-200/20 to-yellow-200/20 rounded-full blur-2xl"></div>

    {/* Messages Container */}
    <div className="overflow-y-auto space-y-6 flex-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent pr-2">
      {messageList?.map((msg) => (
        <div key={msg.id} className="relative group">
          
          {/* Reply Message Indicator */}
          {msg.replyMsg && (
            <div className={`absolute z-10 ${msg.senderid === data.uid ? "-top-3 right-4" : "-top-3 left-4"} 
              px-3 py-1 bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm 
              border border-white/30 text-gray-700 text-xs rounded-full shadow-lg`}>
              {msg.replyMsg === "like" ? (
                <AiFillLike className="text-2xl text-blue-500 animate-bounce" />
              ) : msg.replyMsg === "love" || msg.replyMsg === "<3" ? (
                <BsFillBalloonHeartFill className="text-2xl text-red-500 animate-pulse" />
              ) : (
                <span className="font-medium">↳ {msg.replyMsg}</span>
              )}
            </div>
          )}

          <div className={`flex items-end gap-3 ${msg.senderid === data.uid ? "justify-end" : "justify-start"}`}>
            
            {/* Delete Button (for own messages) */}
            {msg.senderid === data.uid && (
              <button 
                onClick={() => messageDeleteHandler(msg)} 
                className="opacity-0 group-hover:opacity-100 transition-all duration-300 p-2 hover:bg-red-100 rounded-full text-red-500 hover:text-red-600 transform hover:scale-110"
              >
                <AiTwotoneDelete className="text-lg" />
              </button>
            )}

            {/* Message Bubble */}
            <div className={`relative max-w-[70%] ${msg.senderid === data.uid ? "order-1" : "order-2"}`}>
              <div
                className={`px-5 py-3 rounded-2xl shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl ${
                  msg.senderid === data.uid
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-br-md shadow-blue-200/50"
                    : "bg-white/80 text-gray-800 rounded-bl-md border border-gray-200/50 shadow-gray-200/50"
                }`}
              >
                {/* Message Content */}
                <div className="text-sm leading-relaxed">
                  {msg.message === "like" ? (
                    <AiFillLike className="text-3xl animate-bounce" />
                  ) : msg.message === "love" || msg.message === "<3" ? (
                    <BsFillBalloonHeartFill className="text-3xl text-red-400 animate-pulse" />
                  ) : (
                    msg.message
                  )}
                </div>
                
                {/* Timestamp */}
                <div className={`text-xs mt-2 ${msg.senderid === data.uid ? "text-white/70" : "text-gray-500"}`}>
                  {moment(msg.time).fromNow()}
                </div>
              </div>
              
              {/* Message Tail */}
              {/* <div className={`absolute bottom-0 w-4 h-4 ${
                msg.senderid === data.uid 
                  ? "right-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-bl-full" 
                  : "left-0 bg-white/80 rounded-br-full border-r border-b border-gray-200/50"
              }`}></div> */}
            </div>

            {/* Reply Button (for others' messages) */}
            {msg.senderid !== data.uid && (
              <button 
                onClick={() => setReplyMsg(msg.message)} 
                className="opacity-0 group-hover:opacity-100 transition-all duration-300 p-2 hover:bg-blue-100 rounded-full text-blue-500 hover:text-blue-600 transform hover:scale-110"
              >
                <MdOutlineReply className="text-lg" />
              </button>
            )}
          </div>
        </div>
      ))}
    </div>

    {/* Input Section */}
    <div className="mt-6 relative">
      
      {/* Reply Preview */}
      {replyMsg.length !== "" && replyMsg && (
        <div className="absolute -top-16 left-0 right-0 mx-4">
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-50 to-purple-50 backdrop-blur-sm border border-blue-200/50 rounded-2xl shadow-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-full">
                <FaReplyAll className="text-blue-600 text-sm" />
              </div>
              <div className="text-sm text-gray-700 font-medium">
                {replyMsg === "like" ? (
                  <AiFillLike className="text-2xl text-blue-500" />
                ) : replyMsg === "love" || replyMsg === "<3" ? (
                  <BsFillBalloonHeartFill className="text-2xl text-red-500" />
                ) : (
                  `Replying to: ${replyMsg}`
                )}
              </div>
            </div>
            <button 
              onClick={() => setReplyMsg("")}
              className="p-2 hover:bg-red-100 rounded-full text-red-500 hover:text-red-600 transition-all duration-200"
            >
              <RxCross2 className="text-lg" />
            </button>
          </div>
        </div>
      )}

      {/* Input Bar */}
      <div className="flex items-center gap-4 p-2 bg-white/60 backdrop-blur-xl rounded-2xl border border-white/30 shadow-lg">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 px-4 py-3 bg-transparent text-gray-800 placeholder-gray-500 text-sm focus:outline-none"
        />
        
        {/* Send/Like Button */}
        {message.length === 0 ? (
          <button
            onClick={() => sentMessageHandler("like")}
            className="group p-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <AiFillLike className="text-xl group-hover:animate-bounce" />
          </button>
        ) : (
          <button
            onClick={() => sentMessageHandler()}
            className="group p-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <FaRegPaperPlane className="text-xl group-hover:translate-x-1 transition-transform duration-200" />
          </button>
        )}
      </div>
    </div>
  </div>
);
};

export default Conversation;
