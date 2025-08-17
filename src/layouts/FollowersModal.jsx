import { getDatabase, onValue, push, ref, set } from "firebase/database";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { Link } from "react-router";
import CustomToast from "./CustomToast";
import { ArrowRight } from "lucide-react";

const FollowersModal = ({ followers, setFollowersPop }) => {
  const db = getDatabase();
  const [followerId, setFollowerId] = useState([]);

  const user = useSelector((state) => state.user.user);
useEffect(() => {
  const followRef = ref(db, "follow/");
  onValue(followRef, (snapshot) => {
    let arr = [];
    snapshot.forEach((data) => {
      const follow = data.val();
      if (follow.followerid === user?.uid) {
        arr.push(follow.followingid);
      }
    });
    setFollowerId(arr);
  });
}, [db, user]);
  const followHandler = (following) => {
    set(push(ref(db, "follow/")), {
      followerid: user?.uid,
      followername: user?.displayName,
      followingid: following.followerid,
      followerimg: user?.photoURL,
      followingname: following.followername,
      followingimg: following.followerimg,
      time: moment().format(),
    });
    toast.custom((t) => (
      <CustomToast
        t={t}
        img={following.followerimg}
        name={following.followername}
        content={`You're Following ${following.followername}`}
      />
    ));
    set(push(ref(db, "notification/")), {
      notifyReciver: following.followerid,
      type: "positive",
      time: moment().format(),
      content: `${user?.displayName} starts following you!`,
    });
  };

  return createPortal(
    <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex justify-center items-center z-[9999] p-4">
      {/* Modal Container */}
      <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 w-full max-w-md max-h-[80vh] overflow-hidden animate-modalSlideIn">
        {/* Header */}
        <div className="sticky top-0 bg-white/90 backdrop-blur-xl border-b border-gray-200/50 px-6 py-4 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg">
                <svg
                  className="w-5 h-5 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-800">Followers</h2>
                <p className="text-sm text-gray-500">
                  {followers.length}{" "}
                  {followers.length === 1 ? "follower" : "followers"}
                </p>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setFollowersPop(false)}
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
          {followers.length === 0 ? (
            // Empty State
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4 opacity-20">
                <svg
                  className="w-8 h-8 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </div>
              <p className="text-gray-500 font-medium">No followers yet</p>
              <p className="text-sm text-gray-400 mt-1">
                Share your content to get followers!
              </p>
            </div>
          ) : (
            // Followers List
            <ul className="space-y-2">
              {followers.map((follower, index) => (
                <li
                  key={follower.followerid}
                  className="group animate-fadeInUp"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <Link
                    to={`/profile/${follower.followerid}`}
                    className="block"
                    onClick={() => setFollowersPop(false)}
                  >
                    <div className="flex items-center gap-4 p-4 rounded-2xl hover:bg-gradient-to-r hover:from-green-50 hover:to-teal-50 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg border border-transparent hover:border-green-200/50">
                      {/* Profile Image */}
                      <div className="relative">
                        <img
                          src={follower.followerimg || "/default-avatar.png"}
                          alt={follower.followername}
                          className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-lg group-hover:border-green-300 transition-all duration-300"
                        />
                      </div>

                      {/* Follower Info */}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-800 group-hover:text-green-700 transition-colors truncate">
                          {follower.followername}
                        </p>
                      </div>

                      {/* Follow Back Button or Arrow */}
                      <div className="opacity-0 group-hover:opacity-100 transition-all duration-300">
                        {!followerId.includes(follower.followerid) && follower.followingid==user?.uid ?(
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                followHandler(follower);
                              }}
                              className="px-3 py-1 text-xs bg-green-100 text-green-600 rounded-full hover:bg-green-200 transition-colors"
                            >
                              Follow Back
                            </button>
                          ): <ArrowRight className="w-5 h-5 text-green-500 transform group-hover:translate-x-1 transition-transform"/>
                        
                          }
                          
                      </div>
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

export default FollowersModal;
