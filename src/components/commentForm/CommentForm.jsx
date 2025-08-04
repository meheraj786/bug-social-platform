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

const CommentForm = ({ post, commentLength }) => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);
  const [reactorId, setReactorId] = useState([]);
  const [react, setReact] = useState([]);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [reactLength, setReactLength] = useState([]);
  const db = getDatabase();

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
        remove(ref(db, "react/" + rec.id));
      }
    });
    toast.success("cancel React");
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
      toast.success("React");
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
      date: time(),
      commenterId: user?.uid,
      blogId: post.id,
      imageUrl: user?.photoURL,
    };

    set(push(ref(db, "comments/")), commentData)
      .then(() => {
        toast.success("Comment Published Successfully!");
        setComment("");
        setError("");
      })
      .catch(() => toast.error("Failed to publish comment."));
  };

  console.log(react);

  return (
    <div className=" font-secondary border-b lg:border-b-0 pb-1 lg:pb-0 bg-gray-50">
      <Toaster position="top-right" reverseOrder={false} />

      <h3 className="text-[18px] text-gray-600 font-primary flex items-center gap-x-5 font-medium">
        {reactorId.includes(user?.uid) ? (
          <span
            onClick={cancelReactHandler}
            className="flex items-center gap-x-1 text-purple-600 hover:scale-105 transition-all duration-200 cursor-pointer"
          >
            <FaHeart size={25} />
            {/* <CiHeart /> */}
            <span className="text-sm">{reactLength.length}</span>
          </span>
        ) : (
          <span
            onClick={reactHandler}
            className="flex items-center gap-x-1 text-purple-600 hover:scale-105 transition-all duration-200 cursor-pointer"
          >
            {/* <FaHeart /> */}
            <CiHeart size={25} />
            <span className="text-sm">{reactLength.length}</span>
          </span>
        )}

        <span className="flex items-center gap-x-1 text-blue-600">
          <FaRegComments size={25} />
          <span className="text-sm">{commentLength}</span>
        </span>
      </h3>

      <Flex className="flex-col lg:flex-row items-start lg:items-center gap-2">
        <div className="lg:w-[90%] w-full">
          {user ? (
            <>
              <input
                type="text"
                name="comment"
                value={comment}
                onChange={(e) => {
                  setComment(e.target.value);
                  setError("");
                }}
                placeholder="What's on your mind?"
                className="w-full mt-3 px-4 py-2 text-[14px] rounded-xl outline-none transition-all duration-300
             border-2 border-transparent focus:border-blue-500 focus:ring-2 focus:ring-purple-500/50
             bg-white shadow-md hover:shadow-lg placeholder:text-gray-400"
              />

              {error && <p className="text-red-400 text-[12px]">{error}</p>}
            </>
          ) : (
            <div
              className="w-full mt-3 px-4 py-2 text-[14px] rounded-xl outline-none transition-all duration-300
             border-2 border-transparent focus:border-blue-500 focus:ring-2 focus:ring-purple-500/50
             bg-white shadow-md hover:shadow-lg placeholder:text-gray-400"
            >
              Please Signup or Login to Comment
            </div>
          )}
        </div>

        <div className="lg:w-[8%] w-full text-center">
          <button
            onClick={handleSubmit}
            className="w-full rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-2 hover:bg-white hover:text-black px-4 py-[10px] text-[14px] cursor-pointer transition-all mt-3 flex justify-center items-center"
          >
            <FaComment size={18} />

          </button>
        </div>
      </Flex>
    </div>
  );
};

export default CommentForm;
