import React, { useEffect, useState } from "react";
import Flex from "../../layouts/Flex";
import { FaPaperPlane, FaRegComment } from "react-icons/fa6";
import toast, { Toaster } from "react-hot-toast";
import {
  getDatabase,
  onValue,
  push,
  ref,
  remove,
  set,
} from "firebase/database";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import time from "../../layouts/time";
import { FaComment, FaHeart, FaRegComments } from "react-icons/fa";
import { CiHeart } from "react-icons/ci";
import moment from "moment";
import FullScreenOverlay from "../../layouts/FullscreenOverlay";

const CommentForm = ({ post, commentLength }) => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);
  const [reactorId, setReactorId] = useState([]);
  const [react, setReact] = useState([]);
  const [comment, setComment] = useState("");
  const [reactors, setReactors]= useState([])
  const [error, setError] = useState("");
  const [reactLength, setReactLength] = useState([]);
  const db = getDatabase();
  const [reactionPop, setReactionPop]= useState(false)

  useEffect(() => {
    const reactRef = ref(db, "react/");
    onValue(reactRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((react) => {
        if (
          react.val().reactorId == user?.uid &&
          react.val().blogId == post.id
        ) {
          arr.push(react.val().reactorId);
        }
      });
      setReactorId(arr);
    });
  }, [db, user, post]);
  useEffect(() => {
    const reactRef = ref(db, "react/");
    onValue(reactRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((react) => {
        if (
          react.val().blogId == post.id
        ) {
          arr.push({...react.val(), id:react.key});
        }
      });
      setReactors(arr);
    });
  }, [db, user, post]);
console.log("react",reactors);

  useEffect(() => {
    const reactRef = ref(db, "react/");
    onValue(reactRef, (snapshot) => {
      let reactArr = [];
      snapshot.forEach((react) => {
        if (
          react.val().reactorId == user?.uid &&
          react.val().blogId == post.id
        ) {
          reactArr.push({ ...react.val(), id: react.key });
        }
      });
      setReact(reactArr);
    });
  }, [db, user, post]);

  useEffect(() => {
    const reactRef = ref(db, "react/");
    onValue(reactRef, (snapshot) => {
      let reactArr = [];
      snapshot.forEach((react) => {
        if (react.val().blogId === post.id) {
          reactArr.push(react.val());
        }
      });
      setReactLength(reactArr);
    });
  }, [db, post]);

  const cancelReactHandler = () => {
    react.forEach((rec) => {
      if (rec.reactorId == user?.uid && rec.blogId == post.id) {
        remove(ref(db, "react/" + rec.id)).then(()=>{
                set(push(ref(db, "notification/")), {
                notifyReciver: post.bloggerId,
                type: "react",
                time: moment().format(),
                content: `${user?.displayName} remove react from your post "${post.description.slice(0,30)}..."`,
              });
        })
      }
    });
  };

  const reactHandler = () => {
    const reactData = {
      name: user?.displayName,
      date: time(),
      reactorId: user?.uid,
      blogId: post.id,
      bloggerId: post.bloggerId,
      blogImg: post.postImage,
      imageUrl: user?.photoURL,
    };
    set(push(ref(db, "react/")), reactData).then(() => {
      set(push(ref(db, "notification/")), {
                notifyReciver: post.bloggerId,
                type: "react",
                time: moment().format(),
                content: `${user?.displayName} react on your post "${post.description.slice(0,30)}..."`,
              });
    });
  };
  const handleSubmit = () => {
    if (!user) {
      navigate("/auth");
      return;
    }

    if (comment.trim() === "") {
      setError("Enter a Comment");
      return;
    }

    const commentData = {
      name: user?.displayName,
      comment: comment,
      date: moment().format(),
      commenterId: user?.uid,
      blogId: post.id,
      imageUrl: user?.photoURL,
    };

    set(push(ref(db, "comments/")), commentData)
      .then(() => {
        setComment("");
        setError("");
      })
      .catch(() => toast.error("Failed to publish comment."));
  };

  console.log(react);

return (
  <div className="bg-gradient-to-r font-secondary from-gray-50/80 to-white/80 backdrop-blur-sm rounded-2xl p-5 border border-gray-200/50">
    {
      reactionPop && (
<FullScreenOverlay reactors={reactors} setReactionPop={setReactionPop} />

      )
    }

    {/* Like and Comment Stats */}
    <div className="flex items-center justify-between mb-5">
      <div className="flex items-center gap-6">
        {/* Like Button */}
        {reactorId.includes(user?.uid) ? (
          <button
            onClick={cancelReactHandler}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 group"
          >
            <FaHeart size={18} className="group-hover:animate-pulse" />
            <span className="font-semibold text-sm">{reactLength.length}</span>
          </button>
        ) : (
          <button
            onClick={reactHandler}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white hover:bg-gradient-to-r hover:from-red-500 hover:to-pink-500 text-gray-600 hover:text-white border-2 border-gray-200 hover:border-red-500 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 group"
          >
            <CiHeart size={20} className="group-hover:hidden" />
            <FaHeart size={18} className="hidden group-hover:block group-hover:animate-pulse" />
            <span className="font-semibold text-sm">{reactLength.length}</span>
          </button>
        )}

        {/* Comment Count */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
          <FaRegComments size={18} />
          <span className="font-semibold text-sm">{commentLength} comments</span>
        </div>
      </div>

      {/* Additional Actions */}
                <button  onClick={()=>setReactionPop(true)}
            className="flex items-center gap-2 text-xs cursor-pointer text-purple-600 hover:text-purple-700 font-semibold mt-3 p-2 rounded-xl hover:bg-purple-50 transition-all duration-200"
          >
            {reactLength.length} People likes this post...
          </button>
    </div>

    {/* Comment Input Section */}
    <div className="flex items-start gap-4">
      {/* User Avatar */}
      {user && (
        <div className="flex-shrink-0">
          <img
            src={user.photoURL || "https://via.placeholder.com/40"}
            alt="Your avatar"
            className="w-10 h-10 rounded-full object-cover border-2 border-purple-200 shadow-md"
          />
        </div>
      )}

      {/* Input Container */}
      <div className="flex-1 flex gap-3">
        <div className="flex-1">
          {user ? (
            <>
              <div className="relative">
                <input
                  type="text"
                  name="comment"
                  value={comment}
                  onChange={(e) => {
                    setComment(e.target.value);
                    setError("");
                  }}
                  placeholder="Write a thoughtful comment..."
                  className="w-full px-5 py-3 text-sm rounded-2xl outline-none transition-all duration-300
                           border-2 border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100
                           bg-white/90 backdrop-blur-sm shadow-sm hover:shadow-md placeholder:text-gray-500
                           font-medium resize-none"
                />
                
                {/* Floating Actions */}
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  <button className="p-1.5 rounded-full text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.01M15 10h1.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                  <button className="p-1.5 rounded-full text-gray-400 hover:text-purple-600 hover:bg-purple-50 transition-all duration-200">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
              </div>

              {error && (
                <div className="mt-2 flex items-center gap-2 text-red-500 text-sm">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              )}
            </>
          ) : (
            <div className="px-5 py-3 text-sm rounded-2xl bg-gradient-to-r from-gray-100 to-gray-200 text-gray-600 font-medium border-2 border-gray-200 flex items-center gap-3">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Please signup or login to join the conversation
            </div>
          )}
        </div>

        {/* Submit Button */}
        {user && (
          <button
            onClick={handleSubmit}
            disabled={!comment.trim()}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 text-white shadow-lg hover:shadow-xl disabled:shadow-md transition-all duration-300 hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed flex items-center gap-2 font-semibold text-sm"
          >
            <FaComment size={16} />
            <span className="hidden sm:inline">Post</span>
          </button>
        )}
      </div>
    </div>

    {/* Quick Reactions */}
    {/* <div className="mt-4 flex items-center gap-2">
      <span className="text-xs text-gray-500 font-medium">Quick reactions:</span>
      <div className="flex items-center gap-1">
        {['👍', '❤️', '😂', '😮', '😢', '😡'].map((emoji, index) => (
          <button
            key={index}
            className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-lg hover:scale-125 transition-all duration-200"
          >
            {emoji}
          </button>
        ))}
      </div>
    </div> */}
  </div>
);
};

export default CommentForm;
