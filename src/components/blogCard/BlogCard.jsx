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
import { FaCalendar, FaBriefcase, FaShoppingCart, FaNewspaper, FaUsers, FaUserSecret } from 'react-icons/fa';

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

   const getContentTypeIcon = (type) => {
    switch (type) {
      case 'event': return <FaCalendar className="text-blue-500" />;
      case 'job': return <FaBriefcase className="text-green-500" />;
      case 'product': return <FaShoppingCart className="text-purple-500" />;
      default: return <FaNewspaper className="text-gray-500" />;
    }
  };

  const getContentTypeBadge = (type) => {
    const badges = {
      event: { label: 'Event', color: 'bg-blue-100 text-blue-700' },
      job: { label: 'Job Post', color: 'bg-green-100 text-green-700' },
      product: { label: 'Product', color: 'bg-purple-100 text-purple-700' },
      general: { label: 'Post', color: 'bg-gray-100 text-gray-700' }
    };
    const badge = badges[type] || badges.general;
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${badge.color}`}>
        {getContentTypeIcon(type)}
        {badge.label}
      </span>
    );
  };




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
                  <Ellipsis size={16}/>
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
              to={blog.isPageShare ? `/page-profile/${blog.sharedBloggerId}`: `/profile/${blog.sharedBloggerId}`}
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
                  {/* Extra Content Based on Type */}
        {blog.eventDate && (
          <div className="mt-4 p-4 bg-blue-50 rounded-2xl border border-blue-100">
            <Flex className="items-center gap-3">
              <FaCalendar className="text-blue-600" />
              <div>
                <p className="font-semibold text-blue-900">Event Details</p>
                <p className="text-sm text-blue-700">
                  {moment(blog.eventDate).format('MMMM Do, YYYY')}
                  {blog.eventTime && ` at ${blog.eventTime}`}
                </p>
              </div>
            </Flex>
          </div>
        )}

        {blog.jobSalary && (
          <div className="mt-4 p-4 bg-green-50 rounded-2xl border border-green-100">
            <Flex className="items-center gap-3">
              <FaBriefcase className="text-green-600" />
              <div>
                <p className="font-semibold text-green-900">Salary Range</p>
                <p className="text-sm text-green-700">{blog.jobSalary}</p>
              </div>
            </Flex>
          </div>
        )}

        {blog.productPrice && (
          <div className="mt-4 p-4 bg-purple-50 rounded-2xl border border-purple-100">
            <Flex className="items-center gap-3">
              <FaShoppingCart className="text-purple-600" />
              <div>
                <p className="font-semibold text-purple-900">Price</p>
                <p className="text-sm text-purple-700">{blog.productPrice}</p>
              </div>
            </Flex>
          </div>
        )}

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
  )
  : blog.postType == "pagePost" ? 
  (
    <>
      {/* Header Section */}
      <div className="p-6 font-primary pb-4">
        <Flex className="justify-between items-start">
          <Flex className="gap-4 items-center flex-1">
            <div className="flex items-center gap-3 text-gray-800 hover:text-purple-600 transition-all duration-300 group/profile">
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
              </div>

              <div className="flex-1">
                <Link to={`/page-profile/${blog.bloggerId}`}>
                <Flex className="items-center gap-2">
                  <p className="font-bold text-gray-900 group-hover/profile:text-purple-600 transition-colors duration-300">
                    {blog.name}
                  </p>
                  {getContentTypeBadge(blog.contentType)}
                </Flex>
                </Link>
                <Flex className="gap-2 items-center text-xs text-gray-500 mt-0.5">
                  <MdOutlineDateRange size={14} className="text-gray-400" />
                  <span className="font-medium">
                    {moment(blog.time).fromNow()}
                  </span>
                  <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                  <span className="text-gray-400">Public</span>
                </Flex>
              </div>
            </div>
          </Flex>

          <div className="flex items-center gap-2">
            {user?.uid === blog.adminId && !editMode ? (
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-2 flex items-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-all duration-200"
                >
                  <Ellipsis size={16}/>
                </button>
                {showMenu && (
                  <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50 animate-fadeInUp">
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
                    <div className="h-px bg-gray-100 my-1"></div>
                    <button
                      onClick={() => {setShowMenu(false)
                        deleteHandler(blog.id)
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
                    >
                      <Trash2 size={16} />
                      <span>Delete Post</span>
                    </button>
                  </div>
                )}
              </div>
            ) : blog.adminId === user?.uid && editMode ? (
              <button
                onClick={() => {setEditMode(false)
                  editBlogHandler()
                }}
                className="flex rounded-lg items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-green-600 transition-colors duration-200"
              >
                <Edit size={16} />
                <span>Save</span>
              </button>
            ) : null}
          </div>
        </Flex>
      </div>

      <div className="px-6 pb-4">
        {editMode ? (
          <textarea
            className="w-full rounded-lg border border-gray-300 hover:border-purple-500"
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
          />
        ) : (
          <div className="text-gray-800 text-base leading-relaxed whitespace-pre-wrap font-medium">
            {blog.description}
          </div>
        )}

        {blog.contentType === 'event' && blog.eventDate && (
          <div className="mt-4 p-4 bg-blue-50 rounded-2xl border border-blue-100">
            <Flex className="items-center gap-3">
              <FaCalendar className="text-blue-600" />
              <div>
                <p className="font-semibold text-blue-900">Event Details</p>
                <p className="text-sm text-blue-700">
                  {moment(blog.eventDate).format('MMMM Do, YYYY')}
                  {blog.eventTime && ` at ${blog.eventTime}`}
                </p>
              </div>
            </Flex>
          </div>
        )}

        {blog.contentType === 'job' && blog.jobSalary && (
          <div className="mt-4 p-4 bg-green-50 rounded-2xl border border-green-100">
            <Flex className="items-center gap-3">
              <FaBriefcase className="text-green-600" />
              <div>
                <p className="font-semibold text-green-900">Salary Range</p>
                <p className="text-sm text-green-700">{blog.jobSalary}</p>
              </div>
            </Flex>
          </div>
        )}

        {blog.contentType === 'product' && blog.productPrice && (
          <div className="mt-4 p-4 bg-purple-50 rounded-2xl border border-purple-100">
            <Flex className="items-center gap-3">
              <FaShoppingCart className="text-purple-600" />
              <div>
                <p className="font-semibold text-purple-900">Price</p>
                <p className="text-sm text-purple-700">{blog.productPrice}</p>
              </div>
            </Flex>
          </div>
        )}

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
    </>
  )
  : blog.postType == "groupPost" ? 
  (
    <>
      {/* Group Header Section */}
      <div className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50 font-primary pb-4 border-b border-indigo-100">
        <Flex className="justify-between items-start">
          <Flex className="gap-4 items-center flex-1">
            <Link
              to={`/group-profile/${blog.groupId}`}
              className="flex items-center gap-3 text-gray-800 hover:text-indigo-600 transition-all duration-300 group/group"
            >
              <div className="relative">
                {blog.groupImage ? (
                  <img
                    src={blog.groupImage}
                    className="w-12 h-12 rounded-xl object-cover border-2 border-indigo-200 group-hover/group:border-indigo-400 transition-colors duration-300 shadow-md"
                    alt="Group"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-200 to-purple-300 flex items-center justify-center border-2 border-indigo-200">
                    <FaUsers className="w-5 h-5 text-indigo-600" />
                  </div>
                )}
              </div>

              <div className="flex-1">
                <Flex className="items-center gap-2">
                  <p className="font-bold text-gray-900 group-hover/group:text-indigo-600 transition-colors duration-300">
                    {blog.groupName}
                  </p>
                  <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs font-medium rounded-full">
                    Group
                  </span>
                </Flex>
                <Flex className="gap-2 items-center text-xs text-gray-500 mt-0.5">
                  <MdOutlineDateRange size={14} className="text-gray-400" />
                  <span className="font-medium">
                    {moment(blog.time).fromNow()}
                  </span>
                  <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                  <span className="text-gray-400">{blog.visibility}</span>
                </Flex>
              </div>
            </Link>
          </Flex>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {user?.uid === blog.adminId && !editMode ? (
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-2 flex items-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-white/60 transition-all duration-200"
                >
                  <Ellipsis size={16}/>
                </button>
                {showMenu && (
                  <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50 animate-fadeInUp">
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
                    <div className="h-px bg-gray-100 my-1"></div>
                    <button
                      onClick={() => {setShowMenu(false)
                        deleteHandler(blog.id)
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
                    >
                      <Trash2 size={16} />
                      <span>Delete Post</span>
                    </button>
                  </div>
                )}
              </div>
            ) : user?.uid === blog.adminId && editMode ? (
              <button
                onClick={() => {setEditMode(false)
                  editBlogHandler()
                }}
                className="flex rounded-lg items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-white/60 hover:text-green-600 transition-colors duration-200"
              >
                <Edit size={16} />
                <span>Save</span>
              </button>
            ) : null}
          </div>
        </Flex>
      </div>

      {/* Blogger Info Section - Only show if not anonymous */}
      {!blog.isAnonymous && (
        <div className="p-6 bg-white font-primary pb-4 border-b border-gray-100">
          <Flex className="gap-4 items-center">
            <Link
              to={`/profile/${blog.bloggerId}`}
              className="flex items-center gap-3 text-gray-800 hover:text-purple-600 transition-all duration-300 group/blogger"
            >
              <div className="relative">
                {blog.bloggerImg ? (
                  <img
                    src={blog.bloggerImg}
                    className="w-10 h-10 rounded-full object-cover border-2 border-gray-200 group-hover/blogger:border-purple-400 transition-colors duration-300 shadow-sm"
                    alt="Blogger"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center border-2 border-gray-200">
                    <FaUser className="w-4 h-4 text-gray-500" />
                  </div>
                )}
              </div>

              <div>
                <p className="font-semibold text-sm text-gray-900 group-hover/blogger:text-purple-600 transition-colors duration-300">
                  {blog.bloggerName}
                </p>
                {
                  blog.bloggerId==blog.adminId ? <p className="text-sm text-purple-500">Group Admin</p> : <p className="text-xs text-gray-500">Group Member</p>
                }
                
              </div>
            </Link>
          </Flex>
        </div>
      )}

      {/* Anonymous Indicator - Only show if anonymous */}
      {blog.isAnonymous && (
        <div className="p-6 bg-white font-primary pb-4 border-b border-gray-100">
          <Flex className="gap-3 items-center">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center">
              <FaUserSecret className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-semibold text-sm text-gray-700">Anonymous Member</p>
              <p className="text-xs text-gray-500">Posted anonymously</p>
            </div>
          </Flex>
        </div>
      )}

      {/* Content Section */}
      <div className="px-6 pb-4 bg-white">
        {editMode ? (
          <textarea
            className="w-full rounded-lg border border-gray-300 hover:border-purple-500 p-3 min-h-[120px] resize-vertical"
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            placeholder="What's on your mind?"
          />
        ) : (
          <div className="text-gray-800 text-base leading-relaxed whitespace-pre-wrap font-medium">
            {blog.description}
          </div>
        )}

        {editMode && (
          <div className="flex items-center justify-between mb-4 mt-4">
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer text-indigo-600 hover:text-purple-600 transition-colors duration-200 px-4 py-2 rounded-full hover:bg-indigo-50 group/media">
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
              className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium cursor-pointer"
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
  ) :
  (
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
