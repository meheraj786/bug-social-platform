import React, { useEffect, useState } from "react";
import Flex from "../../layouts/Flex";
import { GoDotFill } from "react-icons/go";
import { FaUser } from "react-icons/fa6";
import { MdOutlineDateRange } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { getDatabase, onValue, ref, remove } from "firebase/database";
import toast, { Toaster } from "react-hot-toast";
import CommentForm from "../commentForm/CommentForm";
import CommentList from "../commentList/CommentList";
import { useSelector } from "react-redux";

const BlogCard = ({ blog }) => {
  const user= useSelector((state)=>state.user.user)
  const db = getDatabase();
  const [commentList, setCommentList] = useState([]);
  const deleteHandler = (id) => {
    const db = getDatabase();
    remove(ref(db, "blogs/" + id)).then(() => {
      toast.success("Blog Successfully Deleted");
    });
  };
  useEffect(() => {
    const blogsRef = ref(db, "comments/");
    onValue(blogsRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((comment) => {
        const content = comment.val();
        const id = comment.key;
        if (id==blog.id) {
          arr.push({ ...content, id: id });
        }
      });
      setCommentList(arr);
    });
  }, []);

  return (
    <div className="blogCard mb-5 bg-white rounded-lg ">
      <Toaster position="top-right" reverseOrder={false} duration={2000} />
      <div className="p-6">
        <Flex>
          <Flex className="gap-x-2">
            <p className="text-gray-500 flex items-center gap-x-1">
              {" "}
              <FaUser />
              {blog.name}
            </p>
            <span className="text-gray-500 ">
              <GoDotFill size={24} />
            </span>
            <p className="text-gray-500 flex items-center gap-x-1">
              {" "}
              <MdOutlineDateRange size={24} />
              Published {blog.date}
            </p>
          </Flex>
          {
            user?.uid == blog.bloggerId && <button
            className="cursor-pointer"
            onClick={() => deleteHandler(blog.id)}
          >
            <RiDeleteBin6Line color="red" size={26} />
          </button>
          }
          
        </Flex>
        <h3 className="mt-5 mb-3 font-primary text-[24px] font-semibold">
          {blog.title}
        </h3>
        <p className="text-gray-800">{blog.description}</p>
      </div>
      <div className="p-6 bg-gray-50 rounded-b-lg border-t border-gray-200">
        <Flex>
          <h4 className="text-gray-500">Anonymous Blog Post</h4>
          <span className="text-gray-500">Published {blog.date}</span>
        </Flex>
        <CommentForm blog={blog} commentLength={commentList.length} />
        {
          commentList.map((comment)=>(
            <CommentList comment={comment} />
          ))
        }
      </div>
    </div>
  );
};

export default BlogCard;
