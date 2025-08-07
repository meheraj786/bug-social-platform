import { getDatabase, push, ref, remove, set } from "firebase/database";
import moment from "moment";
import React from "react";
import { createPortal } from "react-dom";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { Link } from "react-router";
import CustomToast from "./CustomToast";

const FollowingModal = ({ following, setFollowingPop }) => {
  const db = getDatabase();
  const currentUser = useSelector((state) => state.user.user);

  const unFollowHandler = (followingUser) => {
    remove(ref(db, "follow/" + followingUser.id));
    toast.custom((t) => (
      <CustomToast
        t={t}
        img={followingUser.followingimg}
        name={followingUser.followingname}
        content={`You're Unfollowing ${followingUser.followingUser}`}
      />
    ));

    set(push(ref(db, "notification/")), {
      notifyReciver: followingUser.followingid,
      type: "negative",
      time: moment().format(),
      content: `${currentUser?.displayName} unfollow you!`,
    });
  };
  console.log(following, "from modal");

  return createPortal(
    <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex justify-center items-center z-[9999] p-4">
      {/* Modal Container */}
      <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 w-full max-w-md max-h-[80vh] overflow-hidden animate-modalSlideIn">
        {/* Header */}
        <div className="sticky top-0 bg-white/90 backdrop-blur-xl border-b border-gray-200/50 px-6 py-4 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg">
                <svg
                  className="w-5 h-5 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-800">Following</h2>
                <p className="text-sm text-gray-500">
                  {following.length}{" "}
                  {following.length === 1 ? "person" : "people"}
                </p>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setFollowingPop(false)}
              className="group w-10 h-10 bg-gray-100 hover:bg-red-100 rounded-2xl flex items-center justify-center transition-all duration-200 hover:scale-110"
            >
              <svg
                className="w-5 h-5 text-gray-500 group-hover:text-red-500 transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-2 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          {following.length === 0 ? (
            // Empty State
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4 opacity-20">
                <svg
                  className="w-8 h-8 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
              </div>
              <p className="text-gray-500 font-medium">Not following anyone</p>
              <p className="text-sm text-gray-400 mt-1">
                Discover people to follow!
              </p>
            </div>
          ) : (
            // Following List
            <ul className="space-y-2">
              {following.map((user, index) => (
                <li
                  key={user.followingid}
                  className="group animate-fadeInUp"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <Link
                    to={`/profile/${user.followingid}`}
                    className="block"
                    onClick={(e) => {
                      setFollowingPop(false);
                      e.stopPropagation();
                    }}
                  >
                    <div className="flex items-center gap-4 p-4 rounded-2xl hover:bg-gradient-to-r hover:from-orange-50 hover:to-red-50 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg border border-transparent hover:border-orange-200/50">
                      {/* Profile Image */}
                      <div className="relative">
                        <img
                          src={user.followingimg || "/default-avatar.png"}
                          alt={user.followingname}
                          className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-lg group-hover:border-orange-300 transition-all duration-300"
                        />
                      </div>

                      {/* User Info */}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-800 group-hover:text-orange-700 transition-colors truncate">
                          {user.followingname}
                        </p>
                        <p className="text-sm text-gray-500 mt-1 truncate">
                          {user.bio || `@${user.followingname}`}
                        </p>
                      </div>

                      {/* Unfollow Button or Arrow */}
                      <div className="opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                      
                      {user.followerid == currentUser?.uid && (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            unFollowHandler(user);
                          }}
                          className="px-3 py-1 text-xs bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors"
                        >
                          Unfollow
                        </button>
                      )}
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

export default FollowingModal;
