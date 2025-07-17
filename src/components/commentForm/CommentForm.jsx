import React, { useState } from "react";
import Flex from "../../layouts/Flex";
import { FaPaperPlane, FaRegComment } from "react-icons/fa6";
import toast, { Toaster } from "react-hot-toast";
import { getDatabase, ref, set } from "firebase/database";
const newDate = () => {
  const date = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  return date;
};

const CommentForm = ({blog, commentLength}) => {
  const [commentInfo, setCommentInfo] = useState({
    name: "",
    comment: "",
    nameErr: "",
    commentErr: "",
  });

  const handleChange = (e) => {
    setCommentInfo({
      ...commentInfo,
      nameErr: "",
      commentErr: "",
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    if (commentInfo.name.trim() === "") {
      setCommentInfo((prev) => ({
        ...prev,
        nameErr: "Enter Your Name",
      }));
    } else if (commentInfo.comment.trim() === "") {
      setCommentInfo((prev) => ({
        ...prev,
        commentErr: "Enter a Title",
      }));
    } else {
      const date = newDate();
      const db = getDatabase();
      set(ref(db, "comments/" + blog.id), {
        name: commentInfo.name,
        comment: commentInfo.comment,
        date: date,
      }).then(() => {
        toast.success("Comment Published Successfully!");
        setCommentInfo({
          name: "",
          comment: "",
          nameErr: "",
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
        <div className="lg:w-[22%]">
          <input
            value={commentInfo.name}
            onChange={(e) => handleChange(e)}
            name="name"
            type="text"
            className="w-full mt-3 px-4 py-2 text-[14px] border-2 border-gray-300 rounded-lg outline-none"
            placeholder="Your Name"
          />
          <p className="text-red-400 text-[12px]">{commentInfo.nameErr}</p>
        </div>
        <div className="lg:w-[72%]">
          <input
            value={commentInfo.comment}
            onChange={(e) => handleChange(e)}
            type="text"
            name="comment"
            className="w-full mt-3 px-4 py-2 text-[14px] border-2 border-gray-300 rounded-lg outline-none"
            placeholder="Add a Comment..."
          />
          <p className="text-red-400 text-[12px]">{commentInfo.commentErr}</p>
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
