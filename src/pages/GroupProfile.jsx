import { getDatabase, onValue, ref } from 'firebase/database';
import { Lock } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router';

const GroupProfile = () => {
  const [group, setGroup]= useState(null)
  const {id}= useParams()
  const db= getDatabase()




    // Fetch user's pages
    useEffect(() => {
      const requestRef = ref(db, "group/");
      onValue(requestRef, (snapshot) => {
        snapshot.forEach((item) => {
          const group = item.val();
          console.log(group, "allGroup");
          
          if (item.key == id) {
            setGroup({ ...group, id: item.key });
          }
        });
      });
    }, [db,id]);
    console.log(group, "group");
    
return (
  <div className="bg-gradient-to-br font-secondary from-gray-50 via-blue-50/30 to-purple-50/30 min-h-screen">
    {/* Followers Modal Dummy */}
    {/* <FollowersModal /> */}

    {/* Cover Section with Glass Effect */}
    {
      group?.image && (
            <div className="relative object-cover object-center w-full h-100 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 overflow-hidden">
        <img src={group?.image} className='w-full object-cover h-full' alt="" />
    </div>
      )
    }
    {/* <div className="relative w-full h-100 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 bg-white rounded-full blur-lg animate-bounce"></div>
        <div className="absolute top-1/2 left-1/2 w-16 h-16 bg-white rounded-full blur-md animate-ping"></div>
      </div>
    </div> */}

    <div className="max-w-6xl mx-auto px-4">
      {/* Profile Info Card */}
      <div className="relative -mt-8 mb-8">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
          <div className="flex justify-between items-start flex-wrap gap-6 ">
            <div className="flex-1">
              <h1 className="text-4xl font-bold font-primary bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
                {group?.groupName}
              </h1>
              <p className="text-lg flex justify-start items-center gap-x-1 text-gray-500 font-medium mb-4"> <Lock size={18}/> {group?.visibility || "Public"}</p>
              <p className="text-sm text-gray-500 font-medium mb-4">@{group?.groupName}</p>

              {/* Stats */}
              <div className="flex gap-8 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-800">12</div>
                  <div className="text-sm text-gray-500 font-medium">Posts</div>
                </div>

                <div className="text-center cursor-pointer">
                  <div className="text-2xl font-bold text-gray-800">34</div>
                  <div className="text-sm font-medium text-gray-500">Members</div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button className="bg-white border-2 border-gray-200 px-6 py-3 rounded-2xl text-gray-700 font-semibold shadow-lg flex items-center gap-2">
                Join Request
              </button>
              <button className="bg-white border-2 border-gray-200 px-6 py-3 rounded-2xl text-gray-700 font-semibold shadow-lg flex items-center gap-2">
                Message
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-8 pb-8">
        {/* Sidebar */}
        <div className="w-full lg:w-1/3 space-y-6">
          {/* About Card */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-6">
            <h3 className="text-xl font-primary font-bold text-gray-800 mb-4 flex items-center gap-2">
              About
            </h3>
            <p className="text-gray-700 font-medium">{group?.about}</p>
          </div>

          {/* Followers Preview */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-primary font-bold text-gray-800">Members</h3>
              <span className="text-sm text-gray-500 cursor-pointer">34 Members</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[1, 2, 3].map((i) => (
                <div key={i}>
                  <img
                    src="https://via.placeholder.com/80"
                    alt="friend"
                    className="w-full aspect-square rounded-2xl object-cover shadow-md"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Posts Section */}
        <div className="w-full lg:w-2/3 space-y-6">
          {/* Create Post Card */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-6">
            <div className="flex items-start gap-4">
              <img
                src="https://via.placeholder.com/50"
                alt="avatar"
                className="w-12 h-12 rounded-full object-cover border-2 border-purple-200"
              />
              <textarea
                rows={3}
                placeholder="What's on your mind?"
                className="w-full p-4 rounded-2xl border-2 border-gray-200 bg-gray-50/50"
              />
            </div>
            <div className="mt-4 flex justify-end gap-3">
              <button className="bg-gray-200 px-6 py-3 rounded-2xl font-semibold">Clear</button>
              <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-2xl font-semibold">
                Post
              </button>
            </div>
          </div>

          {/* Post List */}
          {[1, 2].map((post) => (
            <div key={post} className="bg-white/80 p-6 rounded-3xl shadow-xl">
              <h4 className="font-bold text-lg mb-2">Dummy Post Title {post}</h4>
              <p className="text-gray-600">
                This is a dummy post description. Replace it with your actual data.
              </p>
            </div>
          ))}

          {/* Empty State Example */}
          {/* <div className="bg-white/80 p-12 text-center rounded-3xl shadow-xl">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No posts yet</h3>
            <p className="text-gray-600">This user hasn't posted anything yet.</p>
          </div> */}
        </div>
      </div>
    </div>
  </div>
);

}

export default GroupProfile