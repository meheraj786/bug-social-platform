import React, { useEffect, useState } from "react";
import { GoDotFill } from "react-icons/go";
import { FaImage, FaUser } from "react-icons/fa6";
import { MdOutlineDateRange } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { getDatabase, onValue, ref, remove, update } from "firebase/database";
import toast, { Toaster } from "react-hot-toast";
import CommentForm from "../commentForm/CommentForm";
import CommentList from "../commentList/CommentList";
import { useSelector } from "react-redux";
import { Link } from "react-router";
import Flex from "../../layouts/Flex";
import moment from "moment";
import { motion } from "motion/react";
import { Edit, Ellipsis, Trash2, X } from "lucide-react";

const BlogCard = ({ blog }) => {
  const [showMenu, setShowMenu] = useState(false);
  const user = useSelector((state) => state.user.user);
  const db = getDatabase();
  const [commentList, setCommentList] = useState([]);
  const [expandComments, setExpandComments] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editDescription, setEditDescription] = useState(blog.description);
  const [preview, setPreview] = useState(blog.postImage || "");
  const [imgLoading, setImgLoading] = useState(false);
  const [editImg, setEditImg] = useState(blog.postImage || "");
  const coudinaryApi = import.meta.env.VITE_CLOUDINARY_API;
  const handleChangeImage = async (e) => {
    setImgLoading(true);
    const file = e.target.files[0];
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "e-com app with firebase");
    data.append("cloud_name", "dlrycnxnh");

    const res = await fetch(coudinaryApi, {
      method: "POST",
      body: data,
    });
    const result = await res.json();
    setEditImg(result.secure_url);
    setPreview(result.secure_url);
    setImgLoading(false);
  };
  const deleteHandler = (id) => {
    remove(ref(db, "blogs/" + id)).then(() => {
      toast.success("Blog Successfully Deleted");
    });
  };
  const editBlogHandler = () => {
    update(ref(db, "/blogs/" + blog.id), {
      description: editDescription,
      postImage: editImg,
    });
    toast.success("Blog Successfully Edited");
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
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full max-w-4xl font-secondary mx-auto mb-8 bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border border-white/20 overflow-hidden group"
    >
      {
  blog.postType == "share" ? (
    <>
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
                {/* <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-sm"></div> */}
              </div>

              <div className="flex-1">
                <p className="font-bold  text-gray-900 group-hover/profile:text-purple-600 transition-colors duration-300">
                  {blog.name}
                  
                </p>
                <Flex className="gap-2 items-center text-xs text-gray-500 mt-0.5">
                  <MdOutlineDateRange size={14} className="text-gray-400" />
                  <span className="font-medium">
                    {moment(blog.time).fromNow()}
                  </span>
                  <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                  <span className="text-gray-400">Public</span>
                </Flex>
              </div>
            </Link>
          </Flex>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <span className="mr-2 text-xs text-gray-400 font-normal">Shared a post from {blog.bloggerId==blog.sharedBloggerId ? " his own" : blog.sharedBloggerName}</span>
            {user?.uid === blog.bloggerId && !editMode ? (
              <div className="relative">
                {/* Three Dot Button */}
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-2 flex items-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-all duration-200"
                >
                  
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
                      <span>Edit Post</span>
                    </button>

                    {/* Divider */}
                    <div className="h-px bg-gray-100 my-1"></div>

                    {/* Delete Option */}
                    <button
                      onClick={() => {
                        deleteHandler(blog.id);
                        setShowMenu(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
                    >
                      <Trash2 size={16} />
                      <span>Delete Post</span>
                    </button>
                  </div>
                )}
              </div>
            ) : blog.bloggerId == user?.uid && editMode ? (
              <button
                onClick={() => {
                  setEditMode(false);
                  editBlogHandler();
                }}
                className="w-full flex rounded-lg items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-green-600 transition-colors duration-200"
              >
                <Edit size={16} />
                <span>Save</span>
              </button>
            ) : null}
          </div>
        </Flex>
      </div>
      {/* Content Section */}
      <div className="px-6 pb-4">
        {editMode ? (
          <textarea
            className="w-full rounded-lg border border-gray-300 hover:border-purple-500"
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
          ></textarea>
        ) : (
          <div className="text-gray-800 text-base leading-relaxed whitespace-pre-wrap font-medium">
            {blog.description}
          </div>
        )}
      </div>

    {/* shared header  */}
      <div className="p-6 bg-gray-100 font-primary pb-4">
        <Flex className="justify-between items-start">
          <Flex className="gap-4 items-center flex-1">
            <Link
              to={`profile/${blog.sharedBloggerId}`}
              className="flex items-center gap-3 text-gray-800 hover:text-purple-600 transition-all duration-300 group/profile"
            >
              <div className="relative">
                {blog.sharedBloggerImg ? (
                  <img
                    src={blog.sharedBloggerImg}
                    className="w-12 h-12 rounded-full object-cover border-2 border-purple-200 group-hover/profile:border-purple-400 transition-colors duration-300 shadow-md"
                    alt="Profile"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center border-2 border-purple-200">
                    <FaUser className="w-5 h-5 text-gray-500" />
                  </div>
                )}
                {/* Online status indicator */}
                {/* <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-sm"></div> */}
              </div>

              <div className="flex-1">
                <p className="font-bold text-gray-900 group-hover/profile:text-purple-600 transition-colors duration-300">
                  {blog.sharedBloggerName}
                </p>
                <Flex className="gap-2 items-center text-xs text-gray-500 mt-0.5">
                  <MdOutlineDateRange size={14} className="text-gray-400" />
                  <span className="font-medium">
                    {moment(blog.sharedBlogTime).fromNow()}
                  </span>
                  <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                  <span className="text-gray-400">Public</span>
                </Flex>
              </div>
            </Link>
          </Flex>

          
        </Flex>
      </div>

      {/* shared Content Section */}
      <div className="px-6 bg-gray-100 pb-4">
          <div className="text-gray-800 text-base leading-relaxed whitespace-pre-wrap font-medium">
            {blog.sharedDescription}
          </div>

        {blog.postImage &&  (
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
    </>
  ) : (
    <>
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
                {/* <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-sm"></div> */}
              </div>

              <div className="flex-1">
                <p className="font-bold text-gray-900 group-hover/profile:text-purple-600 transition-colors duration-300">
                  {blog.name}
                </p>
                <Flex className="gap-2 items-center text-xs text-gray-500 mt-0.5">
                  <MdOutlineDateRange size={14} className="text-gray-400" />
                  <span className="font-medium">
                    {moment(blog.time).fromNow()}
                  </span>
                  <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                  <span className="text-gray-400">Public</span>
                </Flex>
              </div>
            </Link>
          </Flex>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {user?.uid === blog.bloggerId && !editMode ? (
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
                      <span>Edit Post</span>
                    </button>

                    {/* Divider */}
                    <div className="h-px bg-gray-100 my-1"></div>

                    {/* Delete Option */}
                    <button
                      onClick={() => {
                        deleteHandler(blog.id);
                        setShowMenu(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
                    >
                      <Trash2 size={16} />
                      <span>Delete Post</span>
                    </button>
                  </div>
                )}
              </div>
            ) : blog.bloggerId == user?.uid && editMode ? (
              <button
                onClick={() => {
                  setEditMode(false);
                  editBlogHandler();
                }}
                className="w-full flex rounded-lg items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-green-600 transition-colors duration-200"
              >
                <Edit size={16} />
                <span>Save</span>
              </button>
            ) : null}
          </div>
        </Flex>
      </div>

      {/* Content Section */}
      <div className="px-6 pb-4">
        {editMode ? (
          <textarea
            className="w-full rounded-lg border border-gray-300 hover:border-purple-500"
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
          ></textarea>
        ) : (
          <div className="text-gray-800 text-base leading-relaxed whitespace-pre-wrap font-medium">
            {blog.description}
          </div>
        )}

        {editMode && (
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer text-blue-600 hover:text-purple-600 transition-colors duration-200 px-4 py-2 rounded-full hover:bg-blue-50 group/media">
                <FaImage className="text-lg group-hover/media:scale-110 transition-transform duration-200" />
                <span className="text-sm font-semibold">Add Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleChangeImage}
                  disabled={!user}
                />
              </label>
            </div>
          </div>
        )}

        {editMode && preview && (
          <div className="mb-4 relative group/preview">
            <img
              src={preview}
              alt="Preview"
              className="rounded-2xl w-full max-h-64 object-cover shadow-lg"
            />
            <button
              onClick={() => {
                setPreview("");
                setEditImg("");
              }}
              className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg opacity-0 group-hover/preview:opacity-100 transition-opacity duration-200"
            >
              <X />
            </button>
            <div
              onClick={() => {
                setPreview("");
                setEditImg("");
              }}
              className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium"
            >
              Click to remove
            </div>
          </div>
        )}

        {blog.postImage && !editMode && (
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
    </>
  )
}


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
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 15l7-7 7 7"
                />
              </svg>
              Show Less
            </button>
          </div>
        ) : commentList.length <= 1 ? (
          <div className="mt-4 space-y-4">
            {commentList.map((comment) => (
              <CommentList comment={comment} post={blog} />
            ))}
          </div>
        ) : (
          <div className="mt-4 space-y-4">
            {commentList.slice(0, 1).map((comment) => (
              <CommentList comment={comment} post={blog} />
            ))}
            <button
              onClick={() => setExpandComments(true)}
              className="flex items-center gap-2 text-sm text-purple-600 hover:text-purple-700 font-semibold mt-3 p-2 rounded-xl hover:bg-purple-50 transition-all duration-200"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
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
