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

const Conversation = ({ msgNotification, isFriend }) => {
  const db = getDatabase();
  const dispatch = useDispatch();
  const data = useSelector((state) => state.user.user);
  const roomuser = useSelector((state) => state.roomUser.value);
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [emojiActive, setEmojiActive] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(false);
  const [unfriendConfirm, setUnfriendConfirm] = useState(false);
  const [blockPopup, setBlockPopup] = useState(false);
  const [replyMsg, setReplyMsg] = useState("");
  const [msgLoading, setMsgLoading] = useState(true);

  const messagesEndRef = useRef(null);
  const scrollContainerRef = useRef(null);



  const scrollToBottom = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      container.scrollTop = container.scrollHeight;
    }
  };

  const unFriendHandler = () => {
    remove(ref(db, "friendlist/" + roomuser.id));
    toast.success("Unfriended successfully");
    set(push(ref(db, "notification/")), {
      notifyReciver:
        roomuser.senderid == data.uid ? roomuser.reciverid : roomuser.senderid,
      type: "negative",
      time: time(),
      content: `${data.displayName} unfriend you`,
    });
  };

  const blockHandler = () => {
    let blockerId = "";
    let blockedId = "";
    let blockerName = "";
    let blockedName = "";
    if (roomuser.senderid == data.uid) {
      blockerId = roomuser.senderid;
      blockerName = getSafeName(roomuser.sendername);
      blockedId = roomuser.reciverid;
      blockedName = getSafeName(roomuser.recivername);
    } else {
      blockerId = roomuser.reciverid;
      blockerName = getSafeName(roomuser.recivername);
      blockedId = roomuser.senderid;
      blockedName = getSafeName(roomuser.sendername);
    }
    set(push(ref(db, "blocklist/")), {
      blockerId: blockerId,
      blockedId: blockedId,
      blockerName: blockerName,
      blockedName: blockedName,
    });
    set(push(ref(db, "notification/")), {
      notifyReciver: blockedId,
      type: "negative",
      time: time(),
      content: `${blockerName} blocked you`,
    });
    toast.success("Blocked Successful");
    remove(ref(db, "friendlist/" + roomuser.id));
  };

  useEffect(() => {
    scrollToBottom();
  }, [messageList]);

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
          (message.senderid === data?.uid && message.reciverid === roomuser?.id) ||
          (message.senderid === roomuser?.id && message.reciverid === data?.uid)
        ) {
          arr.push({ ...message, id: messageId });
        }
      });
      setMessageList(arr);
      setMsgLoading(false);
    });

    return () => unsubscribe();
  }, [db, data?.uid, roomuser]);

  console.log(messageList);
  

  const sentMessageHandler = (like) => {
    const senderid = data.uid;
    const sendername = data.displayName;
    const reciverid = roomuser.id;
    const recivername = roomuser.name;

    if (like) {
      set(push(ref(db, "message")), {
        senderid: senderid,
        sendername: sendername,
        reciverid: reciverid,
        recivername: recivername,
        message: "like",
        replyMsg: replyMsg,
        time: time(),
      })
        .then(() => {
          setMessage("");
          setReplyMsg("")
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
        time: time(),
      })
        .then(() => {
          setMessage("");
          setReplyMsg("")
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
    <div className="bg-white p-5 rounded-2xl shadow-lg max-w-xl mx-auto h-[500px] flex flex-col justify-between">
      <div className="overflow-y-auto space-y-4">
        {messageList?.map((msg) => (
          <div className="relative">

              {msg.replyMsg && (
                <span className={`px-2 absolute ${msg.senderid === data.uid ? "-top-1/2 right-0" : "-top-1/2 left-0"} ms-auto py-1 ml-[6px] bg-gray-200 text-gray-600 text-[12px] rounded-t-lg`}>
                  {msg.replyMsg=="like" ? (<AiFillLike className="text-[34px] text-gray-600 animate-floating" />) : msg.replyMsg === "love" ? (<BsFillBalloonHeartFill className="text-[34px] text-red-600 animate-floating" />) : msg.replyMsg === "<3" ? (<BsFillBalloonHeartFill className="text-[34px] text-red-600 animate-floating" />):(msg.replyMsg)}
                </span>
              )}
          <div
            key={msg.id}
            className={`flex ${
              msg.senderid === data.uid ? "justify-end" : "justify-start"
            }`}
          >
            
            {
              msg.senderid == data.uid && <button onClick={()=>messageDeleteHandler(msg)} className="mr-2"><AiTwotoneDelete />
</button>
            }
            <div
              className={`px-4 py-2 rounded-lg max-w-[60%] text-sm ${
                msg.senderid === data.uid
                  ? "bg-black text-white rounded-br-none"
                  : "bg-gray-200 text-black rounded-bl-none"
              }`}
            >
              {msg.message === "like" ? (
                      <AiFillLike className="text-[34px] animate-floating" />
                    ) : msg.message === "love" ? (<BsFillBalloonHeartFill className="text-[34px] text-red-600 animate-floating" />
): msg.message === "<3" ? (<BsFillBalloonHeartFill className="text-[34px] text-red-600 animate-floating" />
): (
                      msg.message
                    )}
              <div className="text-[10px] mt-1 text-right opacity-70">
                {msg.time}
              </div>
            </div>
            {
              msg.senderid !== data.uid && <button onClick={()=>setReplyMsg(msg.message)} className="ml-2"> <MdOutlineReply />
 </button>
            }
            
          </div>
          </div>

        ))}
      </div>

      <div className="mt-4 relative flex items-center gap-2">
                {replyMsg.length !== "" && replyMsg && (
          <Flex className="px-3 py-1 absolute -top-10 mx-10  left-0 w-[90%] bg-gray-200 rounded-lg">
            {
              replyMsg=="like" ? <AiFillLike className="text-[34px] animate-floating" /> : replyMsg=="love" ? <BsFillBalloonHeartFill/> : replyMsg=="<3" ? <BsFillBalloonHeartFill/> : replyMsg
            }
            <Flex className="gap-x-2">
              <FaReplyAll />
              <RxCross2 onClick={() => setReplyMsg("")} />
            </Flex>
          </Flex>
        )}
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Message..."
          className="flex-1 p-3 bg-gray-100 rounded-xl text-sm"
        />
        {message.length == 0 ? (
          <button
            onClick={()=>sentMessageHandler("like")}
            className="p-3 bg-black text-white rounded-xl"
          >
            <AiFillLike />
          </button>
        ) : (
          <button
            onClick={()=>sentMessageHandler()}
            className="p-3 bg-black text-white rounded-xl"
          >
            <FaRegPaperPlane />
          </button>
        )}
      </div>
    </div>
  );
};

export default Conversation;
