import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, Plus, UserCheck, MessageCircle, Rss } from "lucide-react";
import { Link, Navigate } from "react-router";
import { useSelector } from "react-redux";
import { getDatabase, onValue, push, ref, remove, set } from "firebase/database";
import toast from "react-hot-toast";
import moment from "moment";
import CustomToast from "./CustomToast";

const GroupListSidebar = () => {
  // Dummy joined groups

  const currentUser = useSelector((state) => state.user.user);
  const [groupsList, setGroupsList] = useState([]);
  const db = getDatabase();

  const [requestedId, setRequestedId] = useState([]);
  const [joinRequests, setjoinRequests]= useState([])
  const [joinedGroups, setJoinedGroups]= useState([])
  const [joinedGroupsId, setJoinedGroupsId]= useState([])

  useEffect(() => {
    const followRef = ref(db, "member/");
    onValue(followRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((data) => {
        const member = data.val();
        if (member.memberId == currentUser?.uid) {
          arr.push({...member, id: data.key});
        }
      });
      setJoinedGroups(arr)
      setJoinedGroupsId(arr.map((r)=>r.groupId));
    });
  }, [db]);

  useEffect(() => {
    const followRef = ref(db, "joinrequest/");
    onValue(followRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((data) => {
        const req = data.val();
        if (req.requestedId == currentUser?.uid) {
          arr.push({...req, id: data.key});
        }
      });
      setjoinRequests(arr)
      setRequestedId(arr.map((r)=>r.groupId));
    });
  }, [db]);
  useEffect(() => {
    const requestRef = ref(db, "group/");
    onValue(requestRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        const group = item.val();
        if (!joinedGroupsId.includes(item.key)) {
          arr.push({ ...group, id: item.key });
        }
      });
      setGroupsList(arr);
    });
  }, [db, joinedGroupsId]);

const cancelJoinRequest = (group) => {
  const request = joinRequests.find(
    (r) => r.requestedId === currentUser?.uid && r.groupId === group.id
  );

  if (request) {
    remove(ref(db, "joinrequest/" + request.id))
      .then(() => toast.success("Request Canceled"))
      .catch(() => toast.error("Something went wrong"));
  }
};

  const groupJoinRequest = (group) => {
    set(push(ref(db, "joinrequest/")), {
      requestedId: currentUser?.uid,
      requestedName: currentUser?.displayName,
      groupId: group?.id,
      adminId: group?.adminId,
      requestedImage: currentUser?.photoURL,
      groupName: group?.groupName,
      groupImage: group?.image,
      time: moment().format(),
    });
    toast.custom((t) => (
      <CustomToast
        t={t}
        img={group?.image}
        name={group?.groupName}
        content={`You sent join request to ${group?.groupName}`}
      />
    ));
    set(push(ref(db, "notification/")), {
      notifyReciver: group?.adminId,
      type: "positive",
      time: moment().format(),
      content: `${currentUser?.displayName} send join request to your group ${group?.groupName}!`,
    });
  };
    if (!currentUser) {
  return <Navigate to="/"/>;
}
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full lg:w-[400px] h-[45%] mt-[80px] fixed top-0 right-0 bg-white/90 backdrop-blur-xl shadow-2xl rounded-2xl border border-gray-200/50 p-4 lg:p-6 overflow-y-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between sticky top-0 bg-white/90 backdrop-blur-xl py-4 px-2 lg:px-0 border-b border-gray-200/50 z-10">
        <h2 className="text-transparent bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text font-bold text-xl">
          Discover Groups
        </h2>
        <span className="text-sm text-gray-500">
          {groupsList.length + joinedGroups.length} groups found
        </span>
      </div>

      {/* Joined Groups */}
      {joinedGroups.length > 0 && (
        <div className="mt-4 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-1 h-6 bg-gradient-to-b from-green-500 to-blue-500 rounded-full"></div>
            <h3 className="font-semibold text-gray-800">Joined</h3>
            <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">
              {joinedGroups.length}
            </span>
          </div>

          {joinedGroups.map((group, idx) => (
            <motion.div
              key={group.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="relative overflow-hidden bg-gradient-to-r from-green-50/80 to-blue-50/80 rounded-2xl border border-green-200/50 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 group"
            >
              <div className="p-4 flex items-center gap-4">
                <div className="relative flex-shrink-0">
                  <img
                    src={group.groupImage}
                    alt={group.groupName}
                    className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md group-hover:shadow-lg transition-shadow duration-300"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <Link to={`/group-profile/${group.groupId}`}>
                    <h4 className="text-gray-900 font-semibold text-sm hover:text-green-600 truncate cursor-pointer">
                      {group.groupName}
                    </h4>
                  </Link>
                  <p className="text-xs text-gray-500 truncate">
                    {group.visibility}
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  
                  <Link to={`/group-profile/${group.groupId}`}>
                  <button className="text-xs bg-gradient-to-r from-purple-500 to-blue-500 text-white px-3 py-1.5 rounded-full shadow-md hover:scale-105 transition-all font-medium flex items-center gap-1">
                    <Rss className="w-3 h-3" />
                    Post
                  </button>
                  </Link>
                  <Link to={`/messages/groupchat/${group.groupId}`}>
                    <button className="text-xs bg-white border border-gray-300 text-gray-600 hover:text-blue-600 px-3 py-1.5 rounded-full shadow-md hover:scale-105 transition-all font-medium flex items-center gap-1">
                      <MessageCircle className="w-3 h-3" />
                      Chat
                    </button>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Suggested Groups */}
      <div className="mt-6 space-y-4">
        {joinedGroups.length > 0 && (
          <div className="flex items-center gap-2">
            <div className="w-1 h-6 bg-gradient-to-b from-purple-500 to-blue-500 rounded-full"></div>
            <h3 className="font-semibold text-gray-800">Suggested Groups</h3>
          </div>
        )}

        {groupsList.map((group, idx) => (
          <motion.div
            key={group.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="relative overflow-hidden bg-gray-50 rounded-2xl border border-gray-200/50 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 group"
          >
            <div className="p-4 flex items-center gap-4">
              <div className="relative flex-shrink-0">
                <img
                  src={group.image}
                  alt={group.groupName}
                  className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md group-hover:shadow-lg transition-shadow duration-300"
                />
              </div>
              <div className="flex-1 min-w-0">
                <Link to={`/group-profile/${group.id}`}>
                  <h4 className="text-gray-900 font-semibold text-sm hover:text-purple-600 truncate cursor-pointer">
                    {group.groupName}
                  </h4>
                </Link>
                <div className="inline-block bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs px-2 py-0.5 rounded-full font-medium mt-1">
                  {group.category}
                </div>
              </div>
              {group.adminId === currentUser?.uid ? null : (
                <div className="flex flex-col gap-2">
                  {!requestedId.includes(group.id) ? (
                    <button
                      onClick={() => groupJoinRequest(group)}
                      className="text-xs bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1.5 rounded-full shadow-md hover:scale-105 transition-all font-medium flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      Join
                    </button>
                  ) : requestedId.includes(group.id) ?                     <button
                      onClick={() => cancelJoinRequest(group)}
                      className="text-xs bg-gradient-to-r from-red-500 to-orange-500 text-white px-3 py-1.5 rounded-full shadow-md hover:scale-105 transition-all font-medium flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      Cancel Request
                    </button> : null}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {groupsList.length === 0 && joinedGroups.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
            <Users className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500 font-medium mb-2">No groups found</p>
          <p className="text-gray-400 text-sm">
            Check back later for new group suggestions!
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default GroupListSidebar;
