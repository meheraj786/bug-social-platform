import moment from 'moment';
import React from 'react'
import { createPortal } from 'react-dom';
import { useSelector } from 'react-redux';
import Flex from './Flex';
import { Link } from 'react-router';
import { MdOutlineDateRange } from 'react-icons/md';
import { FaUser } from 'react-icons/fa6';
import { FaBriefcase, FaCalendar, FaShoppingCart } from 'react-icons/fa';

const SharePostModal = ({ blog, shareHandler, shareCaption, setShareCaption, setSharePop }) => {
  const user = useSelector((state) => state.user.user);
  
  const handleClose = () => {
    setSharePop(false);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handleShare = () => {
    shareHandler()
    handleClose();
  };

  return createPortal(
    <div 
      className='w-full h-full fixed top-0 left-0 bg-black/40 flex justify-center items-center backdrop-blur-sm z-[888]'
      onClick={handleBackdropClick}
    >
      <div className='bg-white rounded-xl w-11/12 max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl'>
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Share Post</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* User Info Section */}
          <div className="p-6 font-primary pb-4">
            <div className="flex justify-between items-start">
              <div className="flex gap-4 items-center flex-1">
                <div className="flex items-center gap-3 text-gray-800">
                  <div className="relative">
                    {user?.photoURL ? (
                      <img
                        src={user?.photoURL}
                        className="w-12 h-12 rounded-full object-cover border-2 border-purple-200 shadow-md"
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
                    <p className="font-bold text-gray-900">
                      {user?.displayName}
                    </p>
                    <div className="flex gap-2 items-center text-xs text-gray-500 mt-0.5">
                      <MdOutlineDateRange size={14} className="text-gray-400" />
                      <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                      <span className="text-gray-400">Public</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Caption Textarea */}
            <div className="mt-4">
              <textarea 
                className='w-full p-3 rounded-lg border border-gray-300 hover:border-purple-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 resize-none outline-none'
                placeholder="Write a caption..."
                rows={3}
                value={shareCaption}
                onChange={(e) => setShareCaption(e.target.value)}
              />
            </div>
          </div>

          {/* Divider */}
          <div className="px-6">
            <div className="border-t border-gray-200 mb-6"></div>
          </div>

          {/* Original Post Content */}
          <div className="px-6 pb-6">
            {/* Original Post Header */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex gap-4 items-center flex-1">
                <Link
                  to={`profile/${blog.bloggerId}`}
                  className="flex items-center gap-3 text-gray-800 hover:text-purple-600 transition-all duration-300 group/profile"
                >
                  <div className="relative">
                    {blog.imageUrl ? (
                      <img
                        src={blog.imageUrl}
                        className="w-10 h-10 rounded-full object-cover border-2 border-purple-200 group-hover/profile:border-purple-400 transition-colors duration-300 shadow-md"
                        alt="Profile"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center border-2 border-purple-200">
                        <FaUser className="w-4 h-4 text-gray-500" />
                      </div>
                    )}
                    {/* Online status indicator */}
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
                  </div>

                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 group-hover/profile:text-purple-600 transition-colors duration-300 text-sm">
                      {blog.name}
                    </p>
                    <div className="flex gap-2 items-center text-xs text-gray-500 mt-0.5">
                      <MdOutlineDateRange size={12} className="text-gray-400" />
                      <span className="font-medium">
                        {moment(blog.time).fromNow()}
                      </span>
                      <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                      <span className="text-gray-400">Public</span>
                    </div>
                  </div>
                </Link>
              </div>
            </div>

            {/* Original Post Content */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap font-medium mb-3">
                {blog.description}
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

              {blog.postImage && (
                <div className="relative overflow-hidden rounded-xl group/image">
                  <img
                    src={blog.postImage}
                    alt="Post"
                    className="w-full max-h-64 object-cover transition-transform duration-500 group-hover/image:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover/image:bg-black/5 transition-colors duration-300"></div>
                </div>
              )}
            </div>
          </div>
        </div>


        {/* Modal Footer */}
        <div className="flex items-center justify-between p-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            onClick={handleShare}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 font-medium"
          >
            Share Post
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}

export default SharePostModal