import { createPortal } from 'react-dom';
import React from 'react';
import { Link } from 'react-router';
import { getDatabase, push, ref, remove, set } from 'firebase/database';
import moment from 'moment';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { current } from '@reduxjs/toolkit';

// Friends Modal Component
const FriendsModal = ({ friends, setFriendsPop}) => {

  const currentUser = useSelector((state) => state.user.user);
  const db=getDatabase()
  const unFriendHandler=(friend)=>{
remove(ref(db, "friendlist/" + friend.listId));
toast.success(`You Unfriend ${friend.name}`)
    set(push(ref(db, "notification/")), {
      notifyReciver: friend.id,
      type: "negative",
      time: moment().format(),
      content: `${currentUser?.displayName} unfriend you!`,
    });
  }
console.log(friends, "friends");

  return createPortal(
    <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex justify-center items-center z-[9999] p-4">
      {/* Modal Container */}
      <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 w-full max-w-md max-h-[80vh] overflow-hidden animate-modalSlideIn">
        
        {/* Header */}
        <div className="sticky top-0 bg-white/90 backdrop-blur-xl border-b border-gray-200/50 px-6 py-4 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A2.99 2.99 0 0 0 16.96 6H15c-.22 0-.42.1-.58.24l-3.15 2.83L9.85 6.24A.996.996 0 0 0 9.27 6H7.04c-1.29 0-2.4.84-2.8 2.06L1.7 16H4.3v6h15.4z"/>
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-800">Friends</h2>
                <p className="text-sm text-gray-500">{friends.length} {friends.length === 1 ? 'friend' : 'friends'}</p>
              </div>
            </div>
            
            {/* Close Button */}
            <button
              onClick={()=>setFriendsPop(false)}
              className="group w-10 h-10 bg-gray-100 hover:bg-red-100 rounded-2xl flex items-center justify-center transition-all duration-200 hover:scale-110"
            >
              <svg className="w-5 h-5 text-gray-500 group-hover:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-2 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          {friends.length === 0 ? (
            // Empty State
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 opacity-20">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A2.99 2.99 0 0 0 16.96 6H15c-.22 0-.42.1-.58.24l-3.15 2.83L9.85 6.24A.996.996 0 0 0 9.27 6H7.04c-1.29 0-2.4.84-2.8 2.06L1.7 16H4.3v6h15.4z"/>
                </svg>
              </div>
              <p className="text-gray-500 font-medium">No friends yet</p>
              <p className="text-sm text-gray-400 mt-1">Add some friends to see them here!</p>
            </div>
          ) : (
            // Friends List
            <ul className="space-y-2">
              {friends.map((friend, index) => (
                <li
                  key={friend.id}
                  className="group animate-fadeInUp"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <Link 
                    to={`/profile/${friend.id}`}
                    className="block"
                    onClick={()=>setFriendsPop(false)}
                  >
                    <div className="flex items-center gap-4 p-4 rounded-2xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg border border-transparent hover:border-blue-200/50">
                      
                      {/* Profile Image */}
                      <div className="relative">
                        <img
                          src={friend.image || '/default-avatar.png'}
                          alt={friend.name}
                          className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-lg group-hover:border-blue-300 transition-all duration-300"
                        />
                        
                        {/* Online Status */}
                        {friend.isOnline && (
                          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                        )}
                      </div>

                      {/* Friend Info */}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-800 group-hover:text-blue-700 transition-colors truncate">
                          {friend.name}
                        </p>
                      </div>
{
  friend.relationOwner==currentUser.uid && (<button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            unFriendHandler(friend);
                          }}
                          className="px-3 py-1 text-xs bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors"
                        >
                          Unfriend
                        </button>)
}
                      
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default FriendsModal