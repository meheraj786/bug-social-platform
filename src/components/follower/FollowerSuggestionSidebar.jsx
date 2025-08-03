import React from "react";

const followers = [
  {
    name: "Product Hunt",
    username: "@ProductHunt",
    avatar: "https://i.pravatar.cc/150?img=12",
  },
  {
    name: "Mark Zuckerberg",
    username: "@MZuckerberg_",
    avatar: "https://i.pravatar.cc/150?img=5",
  },
  {
    name: "Ryan Hoover",
    username: "@rrhoover",
    avatar: "https://i.pravatar.cc/150?img=32",
  },
];

export default function FollowerSuggestionSidebar() {
  return (
    <div className="w-full lg:w-[400px] h-1/2 fixed bottom-0 border-t left-0 bg-white shadow-md rounded-xl p-4 space-y-4">
      <h2 className="text-gray-800 font-semibold text-lg">Who to follow</h2>

      {followers.map((follower, idx) => (
        <div key={idx} className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <img
              src={follower.avatar}
              alt={follower.name}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="text-gray-900 font-medium text-sm">
                {follower.name}
              </p>
              <p className="text-gray-500 text-xs">{follower.username}</p>
            </div>
          </div>
          <button className="text-sm bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-1 rounded-full shadow-md hover:scale-105 transition duration-200">
            Follow
          </button>
        </div>
      ))}

      <button className="text-sm text-blue-600 hover:underline mt-2">
        Show more
      </button>
    </div>
  );
}
