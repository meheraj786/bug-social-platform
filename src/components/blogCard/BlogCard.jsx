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
    <div className="w-full max-w-4xl mx-auto mb-6 bg-white rounded-2xl shadow hover:shadow-lg transition duration-300 border border-gray-200">
      <Toaster position="top-right" reverseOrder={false} duration={2000} />

      <div className="p-5">
        <Flex className="justify-between items-start">
          <Flex className="gap-3 items-center">
            <Link
              to={`profile/${blog.bloggerId}`}
              className="flex items-center gap-2 text-gray-800 hover:text-purple-600 transition"
            >
              {blog.imageUrl ? (
                <img
                  src={blog.imageUrl}
                  className="w-10 h-10 rounded-full object-cover"
                  alt="Profile"
                />
              ) : (
                <FaUser className="w-10 h-10 text-gray-400" />
              )}
              <div>
                <p className="font-semibold text-sm">{blog.name}</p>
                <Flex className="gap-1 items-center text-xs text-gray-500">
                  <MdOutlineDateRange size={14} />
                  <span>{blog.time}</span>
                </Flex>
              </div>
            </Link>
          </Flex>

          {user?.uid === blog.bloggerId && (
            <button
              className="text-red-500 hover:text-red-600 transition"
              onClick={() => deleteHandler(blog.id)}
            >
              <RiDeleteBin6Line size={20} />
            </button>
          )}
        </Flex>

        <div className="mt-4 text-gray-800 text-sm whitespace-pre-wrap">
          {blog.description}
        </div>

        {blog.postImage && (
          <div className="mt-4">
            <img
              src={blog.postImage}
              alt="Post"
              className="rounded-lg w-full max-h-96 object-cover"
            />
          </div>
        )}
      </div>

      <div className="p-5 border-t border-gray-200 bg-gray-50 rounded-b-2xl">

        <CommentForm post={blog} commentLength={commentList.length} />
{
  expandComments ? (        <div className="mt-3 space-y-3">
          {commentList.map((comment) => (
            <CommentList key={comment.id} comment={comment} />
          ))}
        <p onClick={()=>setExpandComments(false)} className="text-xs cursor-pointer text-purple-500"> Show Less...</p>
        </div>): commentList.length <=1 ?  (        <div className="mt-3 space-y-3">
          {commentList.map((comment) => (
            <CommentList key={comment.id} comment={comment} />
          ))}
        </div>) : (<div className="mt-3 space-y-3">
          {commentList.slice(0,1).map((comment) => (
            <CommentList key={comment.id} comment={comment} />
          )
          )}
        <p onClick={()=>setExpandComments(true)} className="text-xs cursor-pointer text-purple-500"> Show More Comments...</p>
        </div>)
}

      </div>
    </div>
  );
};

export default BlogCard;
