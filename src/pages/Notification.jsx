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
    <div className="p-4 bg-white rounded-md shadow-md mx-auto mt-8">
      <Container>
      <div className="flex justify-between items-center mb-4 border-b pb-2">
        <h2 className="text-xl font-semibold text-black">Notifications</h2>
        {notifications.length > 0 && (
          <button
            onClick={clearAllNotifications}
            className="text-sm text-red-500 hover:underline"
          >
            Clear All
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <p className="text-gray-500 text-center">You have no notifications.</p>
      ) : (
        <ul className="space-y-3">
          {notifications.map((notif) => (
            <li
              key={notif.id}
              className={`flex items-start justify-between gap-4 p-4 rounded-lg transition relative
                ${
                  notif.type === 'positive'
                    ? 'bg-green-50'
                    : notif.type === 'negative'
                    ? 'bg-red-50'
                    : 'bg-gray-50'
                }
              `}
            >
              <div className="flex items-start gap-3">
                {getNotificationIcon(notif.type)}
                <div>
                  <p className="text-black text-sm">{notif.content}</p>
                  <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                </div>
              </div>
              <button
                onClick={() => deleteNotification(notif.id)}
                className="text-gray-400 hover:text-red-500 absolute top-2 right-2"
              >
                <AiOutlineDelete className="w-5 h-5" />
              </button>
            </li>
          ))}
        </ul>
      )}

      </Container>
    </div>
  );
};

export default Notification;
