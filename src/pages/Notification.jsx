import { getDatabase, onValue, ref, remove } from 'firebase/database';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  AiOutlineCheckCircle,
  AiOutlineCloseCircle,
  AiOutlineInfoCircle,
  AiOutlineDelete,
} from 'react-icons/ai';
import Container from '../layouts/Container';
import moment from 'moment';

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const db = getDatabase();
  const currentUser = useSelector((state) => state.user.user);

  useEffect(() => {
    const notificationRef = ref(db, 'notification/');
    onValue(notificationRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        const notification = item.val();
        if (notification.notifyReciver === currentUser.uid) {
          arr.unshift({
            id: item.key,
            ...notification,
          });
        }
      });
      setNotifications(arr);
      setLoading(false);
    });
  }, [currentUser]);

  const deleteNotification = (notificationId) => {
    remove(ref(db, 'notification/' + notificationId));
  };

  const clearAllNotifications = () => {
    notifications.forEach((notification) => {
      remove(ref(db, 'notification/' + notification.id));
    });
  };

  const getNotificationIcon = (type) => {
    if (type === 'positive') {
      return (
        <div className="w-10 h-10 bg-green-400 rounded-full flex items-center justify-center">
          <AiOutlineCheckCircle className="w-5 h-5 text-white" />
        </div>
      );
    } else if (type === 'negative') {
      return (
        <div className="w-10 h-10 bg-red-400 rounded-full flex items-center justify-center">
          <AiOutlineCloseCircle className="w-5 h-5 text-white" />
        </div>
      );
    } else {
      return (
        <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
          <AiOutlineInfoCircle className="w-5 h-5 text-gray-800" />
        </div>
      );
    }
  };

  if (loading) {
    return <div className="text-center text-gray-500 mt-5">Loading notifications...</div>;
  }

return (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 py-6 px-4">
    <Container>
      <div className="max-w-2xl mx-auto">
        
        {/* Header Section */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5-5-5 5h5zM7 7h10v2H7z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  Notifications
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  {notifications.length > 0 ? `${notifications.length} new updates` : 'All caught up!'}
                </p>
              </div>
            </div>

            {notifications.length > 0 && (
              <button
                onClick={clearAllNotifications}
                className="group flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 rounded-xl border border-red-200 transition-all duration-200 hover:shadow-md"
              >
                <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <span className="text-sm font-medium">Clear All</span>
              </button>
            )}
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {notifications.length === 0 ? (
            // Empty State
            <div className="bg-white/60 backdrop-blur-xl rounded-2xl border border-white/20 shadow-lg p-12 text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-5-5-5 5h5zM7 7h10v2H7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">All caught up!</h3>
              <p className="text-gray-500">You have no new notifications right now.</p>
              <div className="mt-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-600 rounded-xl border border-blue-200">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">Stay tuned for updates</span>
                </div>
              </div>
            </div>
          ) : (
            // Notifications
            notifications.map((notif, index) => (
              <div
                key={notif.id}
                className={`group relative bg-white/70 backdrop-blur-xl rounded-2xl border shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden
                  ${notif.type === 'positive' 
                    ? 'border-green-200 hover:border-green-300' 
                    : notif.type === 'negative' 
                    ? 'border-red-200 hover:border-red-300' 
                    : 'border-gray-200 hover:border-gray-300'
                  }
                  hover:scale-[1.02] hover:-translate-y-1
                `}
                style={{
                  animationDelay: `${index * 100}ms`,
                  animation: 'slideInUp 0.5s ease-out forwards'
                }}
              >
                {/* Color indicator */}
                <div className={`absolute left-0 top-0 bottom-0 w-1 
                  ${notif.type === 'positive' 
                    ? 'bg-gradient-to-b from-green-400 to-green-600' 
                    : notif.type === 'negative' 
                    ? 'bg-gradient-to-b from-red-400 to-red-600' 
                    : 'bg-gradient-to-b from-blue-400 to-blue-600'
                  }
                `}></div>

                <div className="p-6">
                  <div className="flex items-start gap-4">
                    
                    {/* Icon */}
                    <div className={`flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg
                      ${notif.type === 'positive' 
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                        : notif.type === 'negative' 
                        ? 'bg-gradient-to-r from-red-500 to-pink-500' 
                        : 'bg-gradient-to-r from-blue-500 to-purple-500'
                      }
                    `}>
                      {getNotificationIcon(notif.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-800 font-medium leading-relaxed mb-2">
                        {notif.content}
                      </p>
                      
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {moment(notif.time).fromNow()}
                        </div>
                        
                        <div className={`px-2 py-1 rounded-full text-xs font-medium
                          ${notif.type === 'positive' 
                            ? 'bg-green-100 text-green-700' 
                            : notif.type === 'negative' 
                            ? 'bg-red-100 text-red-700' 
                            : 'bg-blue-100 text-blue-700'
                          }
                        `}>
                          {notif.type === 'positive' ? 'Success' : notif.type === 'negative' ? 'Alert' : 'Info'}
                        </div>
                      </div>
                    </div>

                    {/* Delete Button */}
                    <button
                      onClick={() => deleteNotification(notif.id)}
                      className="opacity-0 group-hover:opacity-100 flex-shrink-0 w-8 h-8 bg-gray-100 hover:bg-red-100 text-gray-500 hover:text-red-600 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
                    >
                      <AiOutlineDelete className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            ))
          )}
        </div>

        {/* Bottom spacing */}
        <div className="h-20"></div>
      </div>
    </Container>
  </div>
);
};

export default Notification;
