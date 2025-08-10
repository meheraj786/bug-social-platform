import { MoreHorizontal, X, Heart, Send, Play, Pause, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import moment from "moment";
import { getDatabase, push, ref, remove, set } from "firebase/database";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { Link } from "react-router";

const StoryViewer = ({ story, onClose }) => {
  const [pause, setPause] = useState(false);
  const db=getDatabase()
  const [message, setMessage]= useState("")
  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    if (pause) return;

    const interval = setInterval(() => {
      onClose();
    }, 3000);

    return () => clearInterval(interval);
  }, [pause, onClose]);
  const storyDeleteHandler=()=>{
     remove(ref(db, "story/" + story.id));
     toast.success("Story Deleted")
     onClose()
  }

  const formatTime = (time) => {
    return moment(time).fromNow();
  };
  const sentMessageHandler = () => {


        set(push(ref(db, "message")), {
          senderid: user?.uid,
          sendername: user?.displayName,
          reciverid: story.storyCreatorId,
          recivername: story.storyCreatorName,
          message: message,
          msgImg: story.storyImage || "",
          replyMsg: story.storyText || "",
          status:"reply",
          from:"story",
          time: moment().format(),
        })
          .then(() => {
            set(push(ref(db, "messagenotification/")), {
              senderid: user?.uid,
              reciverid: story.storyCreatorId,
            });
            toast.success("Message Send")
          })
          .catch((err) => {
            console.error(err);
            toast.error("Failed to send message.");
          });
      setMessage("")
    };

  return (
    <div onClick={()=>setPause(!pause)} className="fixed inset-0 bg-gradient-to-br from-purple-500 to-blue-500 z-50 flex items-center justify-center">
      {/* Header */}
      <div className="absolute pt-20  top-8 left-4 right-4 z-20 flex items-center justify-between">
        <Link to={`/profile/${story.storyCreatorId}`}>
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-white p-0.5">
            <div className="w-full h-full rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
              {story?.storyCreatorImage ? (
                <img
                  src={story.storyCreatorImage}
                  alt="Creator"
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <span className="text-sm font-bold text-purple-600">
                  {story?.storyCreatorName?.charAt(0)?.toUpperCase()}
                </span>
              )}
            </div>
          </div>
          <div>
            <p className="text-white font-semibold text-sm drop-shadow-lg">
              {story?.storyCreatorName}
            </p>
            <p className="text-white text-opacity-90 text-xs drop-shadow-lg">
              {formatTime(story?.time)}
            </p>
          </div>
        </div>
</Link>
        <div className="flex items-center space-x-2">
          {/* Pause/Play Button */}
          <button
            onClick={() => setPause(!pause)}
            className="w-8 h-8 bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur-sm rounded-full flex items-center justify-center transition-all"
          >
            {pause ? (
              <Play className="w-4 h-4 text-black" />
            ) : (
              <Pause className="w-4 h-4 text-black" />
            )}
          </button>

          {/* More Options */}
          {
            story.storyCreatorId==user?.uid && <button onClick={storyDeleteHandler} className="w-8 h-8 bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur-sm rounded-full flex items-center justify-center transition-all">
            <Trash2 className="w-4 h-4 text-black" />
          </button>
          }
          

          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-8 h-8 bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur-sm rounded-full flex items-center justify-center transition-all"
          >
            <X className="w-4 h-4 text-black" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-center w-full h-full px-4 z-10">
        {story?.storyImage ? (
          // Image Story
          <div className="relative max-w-sm w-full">
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-4">
              <img
                src={story.storyImage}
                alt="Story"
                className="w-full max-h-[60vh] object-contain rounded-lg shadow-2xl"
              />
            </div>
          </div>
        ) : (
          // Text Only Story
          <div className="max-w-md w-full">
            <div className="  rounded-2xl p-8 text-center shadow-2xl">
              <p className="text-white text-3xl font-bold leading-relaxed drop-shadow-lg">
                {story?.storyText}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Story Text Overlay (for image stories) */}
      {story?.storyImage && story?.storyText && (
        <div className="absolute bottom-24 left-4 right-4 z-20">
          <div className="rounded-xl px-6 py-4 shadow-lg">
            <p className="text-white text-lg font-semibold text-center drop-shadow-lg">
              {story?.storyText}
            </p>
          </div>
        </div>
      )}
            {/* Bottom Actions */}
      <div className="absolute bottom-4 left-4 right-4 z-20">
        <div className="flex items-center space-x-3">
          <div className="flex-1 bg-white bg-opacity-20 backdrop-blur-sm rounded-full px-4 py-3">
            <input
  value={message}
  onChange={(e) => {
    setMessage(e.target.value);
    setPause(true);
  }} 
  onFocus={() => setPause(true)}
  onBlur={() => setPause(false)} 
  type="text"
  placeholder="Reply to story..."
  className="w-full bg-transparent text-black placeholder-black placeholder-opacity-80 text-sm focus:outline-none font-medium"
/>
          </div>
          <button disabled={!message} onClick={sentMessageHandler} className="w-12 h-12 bg-white bg-opacity-20 backdrop-blur-sm hover:bg-opacity-30 rounded-full flex items-center justify-center transition-all">
            <Send className="w-5 h-5 text-black" />
          </button>
        </div>
      </div>
    </div>
    
  );
};

export default StoryViewer;
