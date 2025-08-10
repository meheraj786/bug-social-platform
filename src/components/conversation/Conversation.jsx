import {
  get,
  getDatabase,
  onValue,
  push,
  ref,
  remove,
  set,
  update,
} from "firebase/database";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import time from "../../layouts/time";
import { roomUser } from "../../features/chatRoom/chatRoom";
import { AiFillLike, AiTwotoneDelete } from "react-icons/ai";
import { FaRegPaperPlane, FaReplyAll } from "react-icons/fa";
import { GrEmoji } from "react-icons/gr";
import { RxCross2 } from "react-icons/rx";
import { PiImageDuotone } from "react-icons/pi";
import { MdOutlineReply } from "react-icons/md";
import { useParams } from "react-router";
import moment from "moment";
import { AnimatePresence } from "motion/react";
import { motion } from "motion/react";
import EmojiPicker from "emoji-picker-react";
import ImageUploadPop from "../../layouts/ImageUploadPop";
import { Ban } from "lucide-react";
import DeleteMessagePopup from "../../layouts/DeleteMessagePopup";
import UnfriendPopup from "../../layouts/UnfriendPopup";

const Conversation = ({ msgNotif }) => {
  const db = getDatabase();
  const data = useSelector((state) => state.user.user);
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [replyMsg, setReplyMsg] = useState("");
  const [msgLoading, setMsgLoading] = useState(true);
  const [roomuser, setRoomuser] = useState(null);
  const { id } = useParams();
  const [msgImg, setMsgImg] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [imgUploadPop, setImgUploadPop] = useState(false);
  const [msgDeletePop, setMsgDeletePop] = useState(false);
  const [selectedMsg, setSelectedMsg] = useState(null);
  const [friendList, setFriendList] = useState([]);
  const [unFirendModalActive, setUnfriendModalActive] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

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
  }, [db]);

  const messagesEndRef = useRef(null);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    if (!data?.uid || !id) return;

    const requestRef = ref(db, "friendlist/");
    onValue(requestRef, (snapshot) => {
      snapshot.forEach((item) => {
        const request = item.val();

        // Proper grouping with ()
        if (
          (request.senderid === data.uid && request.reciverid === id) ||
          (request.reciverid === data.uid && request.senderid === id)
        ) {
          setRoomuser({ ...request, id: item.key });
        }
      });
    });
  }, [db, data?.uid, id]);

  const scrollToBottom = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      container.scrollTop = container.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messageList]);

  const handleMsgNotificationDelete = () => {
    if (!roomuser || !msgNotif?.length) return;

    msgNotif.forEach((item) => {
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
          set(push(ref(db, "messagenotification/")), {
            senderid: data?.uid,
            reciverid: reciverid,
          });
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
        msgImg: msgImg,
        replyMsg: replyMsg,
        status: "",
        time: moment().format(),
      })
        .then(() => {
          setMessage("");
          setReplyMsg("");
          set(push(ref(db, "messagenotification/")), {
            senderid: data?.uid,
            reciverid: reciverid,
          });
        })
        .catch((err) => {
          console.error(err);
          toast.error("Failed to send message.");
        });
    }
    setShowEmoji(false);
    setImgUploadPop(false);
    setMsgImg("");
  };
  const unFriendHandler = async () => {
    const friendListRef = ref(db, "friendlist/");
    const snapshot = await get(friendListRef);

    snapshot.forEach((item) => {
      const friend = item.val();
      const friendId =
        roomuser.senderid == data?.uid ? roomuser.reciverid : roomuser.senderid;
      if (
        (friend.senderid === data?.uid && friend.reciverid === friendId) ||
        (friend.senderid === friendId && friend.reciverid === data?.uid)
      ) {
        remove(ref(db, "friendlist/" + item.key));
        toast.success("Unfriended successfully");
        set(push(ref(db, "notification/")), {
          notifyReciver:
            friend.senderid === data?.uid ? friend.reciverid : friend.senderid,
          type: "negative",
          time: moment().format(),
          content: `${data?.displayName} unfriended you`,
        });
      }
    });
  };
  const areFriends =
    roomuser &&
    (friendList.includes(roomuser.senderid + data?.uid) ||
      friendList.includes(roomuser.reciverid + data?.uid) ||
      friendList.includes(data?.uid + roomuser.reciverid) ||
      friendList.includes(data?.uid + roomuser.senderid));

  if (!roomuser || !areFriends) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="convo mt-10 xl:mt-0 shadow-shadow flex justify-center items-center rounded-[20px] xl:w-[100%] h-full"
      >
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
      </motion.div>
    );
  }
  console.log(roomuser, "roomuser");

  return (
    <div
      onClick={handleMsgNotificationDelete}
      className="h-full flex flex-col bg-gradient-to-br from-white to-gray-50/50 backdrop-blur-xl p-6 rounded-3xl shadow-2xl border border-white/20 max-w-3xl mx-auto relative overflow-hidden"
    >
      {unFirendModalActive && (
        <UnfriendPopup
          unfriendPopup={setUnfriendModalActive}
          unfriendHandler={unFriendHandler}
          name={
            roomuser.senderid == data?.uid
              ? roomuser.recivername
              : roomuser.sendername
          }
          image={
            roomuser.senderid == data.uid
              ? roomuser.reciverimg
              : roomuser.senderimg
          }
        />
      )}
      {imgUploadPop && (
        <ImageUploadPop
          setImgUploadPop={setImgUploadPop}
          message={message}
          setMessage={setMessage}
          sentMessageHandler={sentMessageHandler}
          setMsgImg={setMsgImg}
        />
      )}
      {/* User Info - Fixed Height */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="flex-shrink-0 mb-4"
      >
        <div
          key={
            roomuser.senderid == data.uid
              ? roomuser.reciverid
              : roomuser.senderid
          }
          className="flex items-center gap-4 p-3 bg-white/80 rounded-xl border border-white/60 shadow hover:shadow-lg cursor-pointer transition-all "
        >
          <div className="relative">
            <img
              src={
                roomuser.senderid == data.uid
                  ? roomuser.reciverimg
                  : roomuser.senderimg
              }
              alt={roomuser.name}
              className="w-12 h-12 rounded-full object-cover ring-2 ring-white"
            />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
          <span className="font-medium text-gray-800 truncate flex-1">
            {roomuser.senderid == data.uid
              ? roomuser.recivername
              : roomuser.sendername}
          </span>

          {/* Three dot dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="p-1 hover:bg-gray-200 rounded-full transition-colors"
            >
              <svg
                className="w-5 h-5 text-gray-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
            </button>

            {showDropdown && (
              <>
                <div className="absolute right-0 top-full mt-1 w-32 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      setUnfriendModalActive(true);
                    }}
                    className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Unfriend
                  </button>
                </div>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowDropdown(false)}
                ></div>
              </>
            )}
          </div>
        </div>
      </motion.div>

      {/* Decorative Background */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-pink-200/20 to-yellow-200/20 rounded-full blur-2xl pointer-events-none"></div>

      {/* Messages Container - Flexible and Scrollable */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto  mb-6 space-y-6 pr-2"
      >
        <AnimatePresence initial={false}>
          {messageList?.map((msg) => (
            <motion.div
              key={msg.id}
              className="relative group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.3 }}
            >
              <div key={msg.id} className="relative group">
                {/* Reply Indicator */}
                {msg.replyMsg && msg.status != "deleted" && (
                  <div
                    className={`absolute z-10 ${
                      msg.senderid === data.uid
                        ? "-top-3 right-4"
                        : "-top-3 left-4"
                    } 
              px-3 py-1 bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm 
              border border-white/30 text-gray-700 text-xs rounded-full shadow-lg`}
                  >
                    {msg.replyMsg === "like" ? (
                      <AiFillLike className="text-2xl text-blue-500 animate-bounce" />
                    ) : msg.replyMsg === "love" || msg.replyMsg === "<3" ? (
                      <span className="text-2xl text-red-500 animate-pulse">
                        ❤️
                      </span>
                    ) : (
                      <span className="font-medium">↳ {msg.replyMsg}</span>
                    )}
                  </div>
                )}
                {msg.msgImg && msg.status != "deleted" && (
                  <div
                    className={`flex items-end gap-3 ${
                      msg.senderid === data.uid
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <img
                      src={msg.msgImg}
                      className="w-[220px] h-[180px] rounded-lg object-cover"
                      alt=""
                    />
                  </div>
                )}
                <div
                  className={`flex items-end gap-3 ${
                    msg.senderid === data.uid ? "justify-end" : "justify-start"
                  }`}
                >
                  {/* Delete Button */}
                  {msg.senderid === data.uid && msg.status != "deleted" && (
                    <button
                      onClick={() => {
                        setMsgDeletePop(true);
                        setSelectedMsg(msg);
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-all duration-300 p-2 hover:bg-red-100 rounded-full text-red-500 hover:text-red-600 transform hover:scale-110"
                    >
                      <AiTwotoneDelete className="text-lg" />
                    </button>
                  )}
                  {msgDeletePop && (
                    <DeleteMessagePopup
                      selectedMsg={selectedMsg}
                      setMsgDeletePop={setMsgDeletePop}
                    />
                  )}
                  {/* Reply Button */}
                  {msg.message &&
                    msg.senderid !== data.uid &&
                    msg.status != "deleted" && (
                      <button
                        onClick={() => setReplyMsg(msg.message)}
                        className="opacity-0 group-hover:opacity-100 transition-all duration-300 p-2 hover:bg-blue-100 rounded-full text-blue-500 hover:text-blue-600 transform hover:scale-110"
                      >
                        <MdOutlineReply className="text-lg" />
                      </button>
                    )}

                  {/* Message Bubble */}
                  {msg.message && (
                    <div
                      className={`relative max-w-[70%] ${
                        msg.senderid === data.uid ? "order-1" : "order-2"
                      }`}
                    >
                      <div
                        className={`px-5 py-3 rounded-2xl shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl ${
                          msg.senderid === data.uid
                            ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-br-md shadow-blue-200/50"
                            : "bg-white/80 text-gray-800 rounded-bl-md border border-gray-200/50 shadow-gray-200/50"
                        }`}
                      >
                        {/* Message Content */}
                        {msg.status === "deleted" ? (
                          <div className="text-sm  flex justify-center items-center gap-x-2 leading-relaxed italic break-words">
                            <Ban color="red" /> This Message is Deleted
                          </div>
                        ) : (
                          <div className="text-sm leading-relaxed break-words">
                            {msg.message === "like" ? (
                              <AiFillLike className="text-3xl animate-bounce" />
                            ) : msg.message === "love" ||
                              msg.message === "<3" ? (
                              <span className="text-3xl text-red-400 animate-pulse">
                                ❤️
                              </span>
                            ) : (
                              msg.message
                            )}
                          </div>
                        )}

                        {/* <div className="text-sm leading-relaxed break-words">
                        {msg.message === "like" ? (
                          <AiFillLike className="text-3xl animate-bounce" />
                        ) : msg.message === "love" || msg.message === "<3" ? (
                          <span className="text-3xl text-red-400 animate-pulse">
                            ❤️
                          </span>
                        ) : (
                          msg.message
                        )}
                      </div> */}
                        {/* Timestamp */}
                        <div
                          className={`text-xs mt-2 ${
                            msg.senderid === data.uid
                              ? "text-white/70"
                              : "text-gray-500"
                          }`}
                        >
                          {moment(msg.time).fromNow()}
                        </div>
                        {msg.from == "story" && (
                          <span className="text-[12px] text-gray-400 italic">
                            Message From Story
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
        <div className="h-4"></div>
      </div>

      {/* Input Section - Fixed */}
      <div className="flex-shrink-0 relative">
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
                    <span className="text-2xl text-red-500">❤️</span>
                  ) : (
                    `Replying to: ${replyMsg}`
                  )}
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setReplyMsg("")}
                className="p-2 hover:bg-red-100 rounded-full text-red-500 hover:text-red-600 transition-all duration-200"
              >
                <RxCross2 className="text-lg" />
              </motion.button>
            </div>
          </div>
        )}

        <div className="flex relative items-center gap-4 p-2 bg-white/60 backdrop-blur-xl rounded-2xl border border-white/30 shadow-lg">
          {showEmoji && (
            <div className="absolute bottom-20 left-0">
              <EmojiPicker
                onEmojiClick={(emoji) =>
                  setMessage((prev) => prev + emoji.emoji)
                }
                height={350}
              />
            </div>
          )}
          <div className="w-full relative">
            <motion.input
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && message.trim()) {
                  sentMessageHandler();
                }
              }}
              placeholder="Type your message..."
              className="flex-1 px-4 w-full py-3 pr-15 bg-transparent text-gray-800 placeholder-gray-500 text-sm focus:outline-none"
            />
            <span
              onClick={() => setShowEmoji(!showEmoji)}
              className="absolute top-1/2 rounded-full hover:bg-gray-100 p-1 text-gray-400 -translate-y-1/2 right-8"
            >
              <GrEmoji size={20} />
            </span>
            <span
              onClick={() => setImgUploadPop(true)}
              className="absolute top-1/2 rounded-full hover:bg-gray-100 p-1 text-gray-400 -translate-y-1/2 right-0"
            >
              <PiImageDuotone size={20} />
            </span>
          </div>

          {message.length === 0 ? (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => sentMessageHandler("like")}
              className="group p-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <AiFillLike className="text-xl group-hover:animate-bounce" />
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => sentMessageHandler()}
              className="group p-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <FaRegPaperPlane className="text-xl group-hover:translate-x-1 transition-transform duration-200" />
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Conversation;
