import React, { useState } from "react";
import Flex from "../../layouts/Flex";
import { FaPaperPlane, FaRegComment } from "react-icons/fa6";
import toast, { Toaster } from "react-hot-toast";
import { getDatabase, push, ref, set } from "firebase/database";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import Button from "../../layouts/Button";
const newDate = () => {
  const date = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  return date;
};

const CommentForm = ({blog, commentLength}) => {
  const navigate= useNavigate()
  const user= useSelector((state)=>state.user.user)
  
  const [commentInfo, setCommentInfo] = useState({
    comment: "",
    nameErr: "",
    commentErr: "",
  });

  const handleChange = (e) => {
    setCommentInfo({
      ...commentInfo,
      commentErr: "",
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    if (!user) {
      navigate("/auth")
    }else if (commentInfo.comment.trim() === "") {
      setCommentInfo((prev) => ({
        ...prev,
        commentErr: "Enter a Title",
      }));
    } else {
      const date = newDate();
      const db = getDatabase();
      set(push(ref(db, "comments/")), {
        name: user.displayName,
        comment: commentInfo.comment,
        date: date,
        commenterId: user.uid,
        blogId: blog.id
      }).then(() => {
        toast.success("Comment Published Successfully!");
        setCommentInfo({
          comment: "",
          commentErr: "",
        });
      });
    }
  };

  return (
    <div className="mt-5 font-secondary border-b lg:border-b-0 pb-1 lg:pb-0 bg-gray-50 ">
      <Toaster position="top-right" reverseOrder={false} duration={2000} />
      <h3 className="text-[18px] text-gray-600 font-primary flex items-center gap-x-2 font-semibold">
        <FaRegComment />
        Comments ({commentLength})
      </h3>
      <Flex className="flex-col lg:flex-row">
        <div className="lg:w-[92%]">
          {
            user ? (<>
                      <input
            value={commentInfo.comment}
            onChange={(e) => handleChange(e)}
            type="text"
            name="comment"
            className="w-full mt-3 px-4 py-2 text-[14px] border-2 border-gray-300 rounded-lg outline-none"
            placeholder="Add a Comment..."
          />
          <p className="text-red-400 text-[12px]">{commentInfo.commentErr}</p>
            </>): (<>
            <div className="w-full mt-3 px-4 py-2 text-[14px] border-2 border-gray-300 rounded-lg outline-none">
Please Signup or Login to Comment
            </div>
            </>)
          }

        </div>
        <div className="lg:w-[5%] text-center">
          
          <button
            onClick={handleSubmit}
            className="rounded-lg bg-black text-white border-2 hover:bg-white hover:text-black px-4 py-[10px] text-[14px] cursor-pointer transition-all  mt-3"
          
          >
            <FaPaperPlane className="ms-auto" size={20} />
          </button>
        </div>
      </Flex>
    </div>
  );
};

export default CommentForm;
