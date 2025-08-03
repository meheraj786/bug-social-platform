import React from "react";
import { FaUser } from "react-icons/fa6";
import { GoDotFill } from "react-icons/go";
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdOutlineDateRange } from "react-icons/md";
import Flex from "../../layouts/Flex";
import { getDatabase, ref, remove } from "firebase/database";
import toast, { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";
import { Link } from "react-router";

const CommentList = ({ comment }) => {
  const user = useSelector((state) => state.user.user);

  const deleteHandler = (id) => {
    const db = getDatabase();
    remove(ref(db, "comments/" + id)).then(() => {
      toast.success("Comment Successfully Deleted");
    });
  };

  return (
    <div className="p-5 bg-white rounded-xl shadow-md mb-4">
      <Toaster position="top-right" reverseOrder={false} duration={2000} />
      
      <Flex className="justify-between items-start">
        <Flex className="gap-x-3 items-center">
          <Link
            to={`/profile/${comment.commenterId}`}
            className="flex items-center gap-2 text-sm text-gray-800 font-medium hover:underline"
          >
            {comment.imageUrl ? (
              <img
                src={comment.imageUrl}
                className="w-8 h-8 rounded-full object-cover border"
                alt="avatar"
              />
            ) : (
              <div className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full text-gray-600">
                <FaUser size={16} />
              </div>
            )}
            {comment.name}
          </Link>

          <span className="text-gray-400">
            <GoDotFill size={14} />
          </span>

          <p className="text-gray-500 text-xs flex items-center gap-1">
            <MdOutlineDateRange size={14} />
            {comment.date}
          </p>
        </Flex>

        {user?.uid === comment.commenterId && (
          <button
            className="text-red-500 hover:text-red-600 transition"
            onClick={() => deleteHandler(comment.id)}
          >
            <RiDeleteBin6Line size={18} />
          </button>
        )}
      </Flex>

      <p className="mt-3 text-sm text-gray-700 leading-relaxed">{comment.comment}</p>
    </div>
  );
};

export default CommentList;
