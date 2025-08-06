import React, { useEffect, useState } from "react";
import { GoDotFill } from "react-icons/go";
import { FaUser } from "react-icons/fa6";
import { MdOutlineDateRange } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { getDatabase, onValue, ref, remove } from "firebase/database";
import toast, { Toaster } from "react-hot-toast";
import CommentForm from "../commentForm/CommentForm";
import CommentList from "../commentList/CommentList";
import { useSelector } from "react-redux";
import { Link } from "react-router";
import Flex from "../../layouts/Flex";
import moment from "moment";
import {motion} from 'motion/react'

const BlogCard = ({ blog }) => {
  const user = useSelector((state) => state.user.user);
  const db = getDatabase();
  const [commentList, setCommentList] = useState([]);
  const [expandComments, setExpandComments]= useState(false)

  const deleteHandler = (id) => {
    remove(ref(db, "blogs/" + id)).then(() => {
      toast.success("Blog Successfully Deleted");
    });
  };

  useEffect(() => {
    const commentsRef = ref(db, "comments/");
    onValue(commentsRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((comment) => {
        const content = comment.val();
        const id = comment.key;
        if (content.blogId === blog.id) {
          arr.unshift({ ...content, id });
        }
      });
      setCommentList(arr);
    });
  }, [blog.id, db]);

return (
  <motion.div initial={{ opacity: 0, scale: 0.9 }}
  whileInView={{ opacity: 1, scale: 1 }}
  viewport={{ once: true, amount: 0.2 }} 
  transition={{ duration: 0.4, ease: "easeOut" }} className="w-full max-w-4xl font-secondary mx-auto mb-8 bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border border-white/20 overflow-hidden group">

    {/* Header Section */}
    <div className="p-6 font-primary pb-4">
      <Flex className="justify-between items-start">
        <Flex className="gap-4 items-center flex-1">
          <Link
            to={`profile/${blog.bloggerId}`}
            className="flex items-center gap-3 text-gray-800 hover:text-purple-600 transition-all duration-300 group/profile"
          >
            <div className="relative">
              {blog.imageUrl ? (
                <img
                  src={blog.imageUrl}
                  className="w-12 h-12 rounded-full object-cover border-2 border-purple-200 group-hover/profile:border-purple-400 transition-colors duration-300 shadow-md"
                  alt="Profile"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center border-2 border-purple-200">
                  <FaUser className="w-5 h-5 text-gray-500" />
                </div>
              )}
              {/* Online status indicator */}
              <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
            </div>
            
            <div className="flex-1">
              <p className="font-bold text-gray-900 group-hover/profile:text-purple-600 transition-colors duration-300">
                {blog.name}
              </p>
              <Flex className="gap-2 items-center text-xs text-gray-500 mt-0.5">
                <MdOutlineDateRange size={14} className="text-gray-400" />
                <span className="font-medium">{moment(blog.time).fromNow()}</span>
                <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                <span className="text-gray-400">Public</span>
              </Flex>
            </div>
          </Link>
        </Flex>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {user?.uid === blog.bloggerId && (
            <>
              <button className="p-2 rounded-full text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
              <button
                className="p-2 rounded-full text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
                onClick={() => deleteHandler(blog.id)}
              >
                <RiDeleteBin6Line size={16} />
              </button>
            </>
          )}
          
          <button className="p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-all duration-200">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
            </svg>
          </button>
        </div>
      </Flex>
    </div>

    {/* Content Section */}
    <div className="px-6 pb-4">
      <div className="text-gray-800 text-base leading-relaxed whitespace-pre-wrap font-medium">
        {blog.description}
      </div>

      {blog.postImage && (
        <div className="mt-5 relative overflow-hidden rounded-2xl group/image">
          <img
            src={blog.postImage}
            alt="Post"
            className="w-full max-h-96 object-cover transition-transform duration-500 group-hover/image:scale-105"
          />
          <div className="absolute inset-0 bg-black/0 group-hover/image:bg-black/5 transition-colors duration-300"></div>
        </div>
      )}
    </div>



    {/* Comments Section */}
    <div className="px-6 py-4 bg-gradient-to-br from-gray-50/50 to-white border-t border-gray-100">
      <CommentForm post={blog} commentLength={commentList.length} />
      
      {expandComments ? (
        <div className="mt-4 space-y-4">
          {commentList.map((comment) => (
              <CommentList comment={comment} />
          ))}
          <button 
            onClick={() => setExpandComments(false)} 
            className="flex items-center gap-2 text-sm text-purple-600 hover:text-purple-700 font-semibold mt-3 p-2 rounded-xl hover:bg-purple-50 transition-all duration-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
            Show Less
          </button>
        </div>
      ) : commentList.length <= 1 ? (
        <div className="mt-4 space-y-4">
          {commentList.map((comment) => (
              <CommentList comment={comment} />
          ))}
        </div>
      ) : (
        <div className="mt-4 space-y-4">
          {commentList.slice(0, 1).map((comment) => (
              <CommentList comment={comment} />
          ))}
          <button 
            onClick={() => setExpandComments(true)} 
            className="flex items-center gap-2 text-sm text-purple-600 hover:text-purple-700 font-semibold mt-3 p-2 rounded-xl hover:bg-purple-50 transition-all duration-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
            View {commentList.length - 1} more comments
          </button>
        </div>
      )}
    </div>
  </motion.div>
);
};

export default BlogCard;
