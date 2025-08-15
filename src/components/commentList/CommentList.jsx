import React, { useState } from "react";
import { FaUser } from "react-icons/fa6";
import { GoDotFill } from "react-icons/go";
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdOutlineDateRange } from "react-icons/md";
import Flex from "../../layouts/Flex";
import { getDatabase, push, ref, remove, set, update } from "firebase/database";
import { useSelector } from "react-redux";
import { Link } from "react-router";
import moment from "moment";
import toast from "react-hot-toast";
import { Edit, Ellipsis, Trash2 } from "lucide-react";

const CommentList = ({ post,comment }) => {
  const user = useSelector((state) => state.user.user);
  const db= getDatabase()
  const [editComment, setEditComment]= useState(comment.comment)
  const [editMode, setEditMode]= useState(false)
  const [showMenu, setShowMenu]= useState(false)

  const deleteHandler = (id) => {
    const db = getDatabase();
    remove(ref(db, "comments/" + id)).then(()=>{
              set(push(ref(db, "notification/")), {
              notifyReciver: post.bloggerId,
              type: "comment",
              reactorId: user?.uid,
              time: moment().format(),
              content: `${
                user?.displayName
              } remove comment on your post "${post.description.slice(0, 30)}..."`,
            });
    })
  };
    const editCommentHandler = () => {
      update(ref(db, "/comments/" + comment.id), {
        comment: editComment,
      });
      toast.success("Blog Successfully Edited");
    };

return (
  <div className="bg-white/90 font-secondary backdrop-blur-sm rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 mb-4 p-5 border border-gray-100/50 group">
    
    {/* Header Section */}
    <div className="flex justify-between items-start mb-4">
      <div className="flex items-center gap-3 flex-1">
        {
          comment.isAuthorComment ? <Link
          to={`/page-profile/${comment.commenterId}`}
          className="flex items-center gap-3 text-gray-800 hover:text-purple-600 transition-all duration-300 group/profile"
        >
          <div className="relative">
            {comment.imageUrl ? (
              <img
                src={comment.imageUrl}
                className="w-10 h-10 rounded-full object-cover border-2 border-purple-200 group-hover/profile:border-purple-400 shadow-sm transition-colors duration-300"
                alt="avatar"
              />
            ) : (
              <div className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300 rounded-full text-gray-600 border-2 border-purple-200 group-hover/profile:border-purple-400 shadow-sm transition-colors duration-300">
                <FaUser size={16} />
              </div>
            )}
            {/* Online status indicator */}
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
          </div>
          
          <div className="flex-1">
            <p className="font-semibold font-primary text-sm group-hover/profile:text-purple-600 transition-colors duration-300">
              {comment.name}
            </p>
            <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
              <MdOutlineDateRange size={12} className="text-gray-400" />
              <span className="font-medium">{moment(comment.date).fromNow()}
</span>
              <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
              <span className="text-gray-400">Reply</span>
            </div>
          </div>
        </Link> : <Link
          to={`/profile/${comment.commenterId}`}
          className="flex items-center gap-3 text-gray-800 hover:text-purple-600 transition-all duration-300 group/profile"
        >
          <div className="relative">
            {comment.imageUrl ? (
              <img
                src={comment.imageUrl}
                className="w-10 h-10 rounded-full object-cover border-2 border-purple-200 group-hover/profile:border-purple-400 shadow-sm transition-colors duration-300"
                alt="avatar"
              />
            ) : (
              <div className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300 rounded-full text-gray-600 border-2 border-purple-200 group-hover/profile:border-purple-400 shadow-sm transition-colors duration-300">
                <FaUser size={16} />
              </div>
            )}
            {/* Online status indicator */}
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
          </div>
          
          <div className="flex-1">
            <p className="font-semibold font-primary text-sm group-hover/profile:text-purple-600 transition-colors duration-300">
              {comment.name}
            </p>
            <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
              <MdOutlineDateRange size={12} className="text-gray-400" />
              <span className="font-medium">{moment(comment.date).fromNow()}
</span>
              <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
              <span className="text-gray-400">Reply</span>
            </div>
          </div>
        </Link>
        }
        
      </div>
        {/* {user?.uid === comment.commenterId && ( */}

          <div className="flex items-center gap-2">
            {(user?.uid === comment.commenterId && !editMode) || (post.adminId==user?.uid && comment.commenterId==post.bloggerId && !editMode) ? (
              <div className="relative">
                {/* Three Dot Button */}
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-all duration-200"
                >
                  <Ellipsis size={16} />
                </button>

                {/* Dropdown Menu */}
                {showMenu && (
                  <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50 animate-fadeInUp">
                    {/* Edit Option */}
                    <button
                      onClick={() => {
                        setEditMode(true);
                        setShowMenu(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                    >
                      <Edit size={16} />
                      <span>Edit</span>
                    </button>

                    {/* Divider */}
                    <div className="h-px bg-gray-100 my-1"></div>

                    {/* Delete Option */}
                    <button
                      onClick={() => {
                        deleteHandler(comment.id);
                        setShowMenu(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
                    >
                      <Trash2 size={16} />
                      <span>Delete</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (user?.uid === comment.commenterId && editMode) || (post.adminId==user?.uid && comment.commenterId==post.bloggerId && editMode) ? (
              <button
                onClick={() => {
                  setEditMode(false);
                  editCommentHandler();
                }}
                className="w-full flex rounded-lg items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-green-600 transition-colors duration-200"
              >
                <Edit size={16} />
                <span>Save</span>
              </button>
            ): null}
          </div>
    </div>

    {/* Comment Content */}
    <div className="ml-13 mb-4">
      {
        editMode ? <textarea value={editComment} onChange={(e)=>setEditComment(e.target.value)} className="text-gray-800  w-full text-sm leading-relaxed font-medium whitespace-pre-wrap outline-none border border-gray-300 hover:border-purple-500 rounded-lg">
        {comment.comment}</textarea>
      : <p className="text-gray-800 text-sm leading-relaxed font-medium whitespace-pre-wrap">
        {comment.comment}
      </p>
      }
      
    </div>

    {/* Comment Actions */}
    {/* <div className="ml-13 flex items-center gap-6">
      <button className="flex items-center gap-2 text-xs text-gray-500 hover:text-red-500 transition-colors duration-200 font-medium">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
        <span>Like</span>
        <span className="text-gray-400">•</span>
        <span className="text-gray-400">3</span>
      </button>
      
      <button className="flex items-center gap-2 text-xs text-gray-500 hover:text-blue-500 transition-colors duration-200 font-medium">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
        </svg>
        <span>Reply</span>
      </button>
      
      <button className="flex items-center gap-2 text-xs text-gray-500 hover:text-purple-500 transition-colors duration-200 font-medium">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
        </svg>
        <span>Share</span>
      </button>
    </div>

    {/* Reply Section (Hidden by default) */}
    {/* <div className="ml-13 mt-4 hidden">
      <div className="bg-gray-50/80 rounded-xl p-3 border border-gray-200/50">
        <div className="flex items-center gap-3">
          <img
            src={user?.photoURL || "https://via.placeholder.com/32"}
            alt="Your avatar"
            className="w-8 h-8 rounded-full object-cover border border-gray-200"
          />
          <input
            type="text"
            placeholder="Write a reply..."
            className="flex-1 px-3 py-2 text-sm rounded-lg border border-gray-200 focus:border-blue-400 focus:outline-none bg-white"
          />
          <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-medium rounded-lg hover:shadow-md transition-all duration-200">
            Reply
          </button>
        </div>
      </div>
    </div> */}

    {/* Nested Replies Preview */}
    {/* <div className="ml-13 mt-3 space-y-2 hidden">
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <div className="w-6 h-px bg-gray-300"></div>
        <span>2 replies</span>
        <button className="text-blue-500 hover:text-blue-600 font-medium">View replies</button>
      </div>
    </div> */}

    {/* Quick Reactions */}
    {/* <div className="ml-13 mt-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      <span className="text-xs text-gray-400 mr-2">React:</span>
      {['👍', '❤️', '😂', '😮'].map((emoji, index) => (
        <button
          key={index}
          className="w-7 h-7 rounded-full hover:bg-gray-100 flex items-center justify-center text-sm hover:scale-110 transition-all duration-200"
        >
          {emoji}
        </button>
      ))}
    </div> */} 
  </div>
);
};

export default CommentList;
