import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import {
  get,
  getDatabase,
  onValue,
  push,
  ref,
  remove,
  set,
} from "firebase/database";
import moment from "moment";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { 
  Plus, 
  MessageCircle, 
  UserCheck, 
  Users, 
  Rss,
  MoveDiagonal2,
  Search,
  X 
} from "lucide-react";

const SearchResultModal = ({ isOpen, onClose }) => {
  // Single set of state variables - no duplicates
  const [friendList, setFriendList] = useState([]);
  const [friendListLoading, setFriendListLoading] = useState(true);
  const [selectFriend, setSelectedFriend] = useState(null);
  const [unFriendPop, setUnfriendPop] = useState(false);
  const [userList, setUserList] = useState([]);
  const [requestList, setRequestList] = useState([]);
  const [userLoading, setUserLoading] = useState(true);
  const [friendRequestList, setFriendRequestList] = useState([]);
  const [requestListLoading, setRequestListLoading] = useState(true);
  const [groupsList, setGroupsList] = useState([]);
  const [requestedId, setRequestedId] = useState([]);
  const [joinRequests, setjoinRequests] = useState([]);
  const [joinedGroups, setJoinedGroups] = useState([]);
  const [joinedGroupsId, setJoinedGroupsId] = useState([]);
  const [followedPages, setFollowedPages] = useState([]);
  const [pagesList, setPagesList] = useState([]);
  const [followedPageId, setFollowedPageId] = useState([]);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  
  // Load more states for different sections
  const [friendsLoadMore, setFriendsLoadMore] = useState(3);
  const [usersLoadMore, setUsersLoadMore] = useState(3);
  const [pagesLoadMore, setPagesLoadMore] = useState(3);
  const [suggestedPagesLoadMore, setSuggestedPagesLoadMore] = useState(3);

  const db = getDatabase();
  const currentUser = useSelector((state) => state.user.user);

  // Search filter functions
  const filterBySearch = (items, searchFields) => {
    if (!searchQuery.trim()) return items;
    
    const query = searchQuery.toLowerCase().trim();
    return items.filter(item => 
      searchFields.some(field => {
        const value = field.split('.').reduce((obj, key) => obj?.[key], item);
        return value?.toLowerCase().includes(query);
      })
    );
  };

  // Apply search filters
  const filteredFriendList = filterBySearch(friendList, ['name']);
  const filteredUserList = filterBySearch(
    userList.filter(user => 
      !requestList.includes(user.id + currentUser.uid) &&
      !requestList.includes(currentUser.uid + user.id)
    ), 
    ['username', 'email']
  );
  const filteredGroupsList = filterBySearch(groupsList, ['groupName', 'category']);
  const filteredJoinedGroups = filterBySearch(joinedGroups, ['groupName']);
  const filteredPagesList = filterBySearch(
    pagesList.filter(page => !followedPageId.includes(page.id)), 
    ['pageName', 'category']
  );
  const filteredFollowedPages = filterBySearch(followedPages, ['followingname']);

  // Pages data fetching
  useEffect(() => {
    const requestRef = ref(db, "page/");
    onValue(requestRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        const page = item.val();
        if (!followedPageId.includes(item.key)) {
          arr.push({ ...page, id: item.key });
        }
      });
      setPagesList(arr);
    });
  }, [db, followedPageId]);

  useEffect(() => {
    const followRef = ref(db, "follow/");
    onValue(followRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((data) => {
        const follow = data.val();
        if (follow.followerid == currentUser?.uid && follow.adminid) {
          arr.push({ ...follow, id: data.key });
        }
      });
      setFollowedPages(arr);
      setFollowedPageId(arr.map((f) => f.followingid));
    });
  }, [db, currentUser?.uid]);

  // Groups data fetching
  useEffect(() => {
    const followRef = ref(db, "member/");
    onValue(followRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((data) => {
        const member = data.val();
        if (member.memberId == currentUser?.uid) {
          arr.push({ ...member, id: data.key });
        }
      });
      setJoinedGroups(arr);
      setJoinedGroupsId(arr.map((r) => r.groupId));
    });
  }, [db, currentUser?.uid]);

  useEffect(() => {
    const followRef = ref(db, "joinrequest/");
    onValue(followRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((data) => {
        const req = data.val();
        if (req.requestedId == currentUser?.uid) {
          arr.push({ ...req, id: data.key });
        }
      });
      setjoinRequests(arr);
      setRequestedId(arr.map((r) => r.groupId));
    });
  }, [db, currentUser?.uid]);

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

  // Friends data fetching
  useEffect(() => {
    const requestRef = ref(db, "friendRequest/");
    onValue(requestRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        const request = item.val();
        if (request.reciverid === currentUser.uid) {
          arr.push({ ...request, id: item.key });
        }
      });
      setFriendRequestList(arr);
      setRequestListLoading(false);
    });
  }, [currentUser.uid, db]);

  useEffect(() => {
    const userRef = ref(db, "users/");
    onValue(userRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        const user = item.val();
        const userId = item.key;
        if (userId !== currentUser.uid) {
          arr.push({ ...user, id: userId });
        }
      });
      setUserList(arr);
      setUserLoading(false);
    });
  }, [currentUser.uid, db]);

  useEffect(() => {
    const requestRef = ref(db, "friendRequest/");
    onValue(requestRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        const request = item.val();
        arr.push(request.reciverid + request.senderid);
      });
      setRequestList(arr);
    });
  }, [db]);

  useEffect(() => {
    const requestRef = ref(db, "friendlist/");
    onValue(requestRef, (snapshot) => {
      let friendListIds = [];
      let friendsData = [];
      
      snapshot.forEach((item) => {
        const request = item.val();
        // For checking if users are already friends
        friendListIds.push(request.reciverid + request.senderid);
        
        // For displaying friend list
        if (request.senderid === currentUser.uid || request.reciverid === currentUser.uid) {
          const isSender = request.senderid === currentUser.uid;
          const friendId = isSender ? request.reciverid : request.senderid;
          const friendName = isSender ? request.recivername : request.sendername;
          const friendEmail = isSender ? request.reciveremail : request.senderemail;
          const friendImage = isSender ? request.reciverimg : request.senderimg;

          friendsData.push({
            id: friendId,
            name: friendName,
            email: friendEmail,
            image: friendImage,
            listId: item.key,
          });
        }
      });
      
      setRequestList(friendListIds);
      setFriendList(friendsData);
      setFriendListLoading(false);
    });
  }, [currentUser.uid, db]);

  // Handler functions
  const followHandler = (following) => {
    set(push(ref(db, "follow/")), {
      followerid: currentUser?.uid,
      followername: currentUser?.displayName,
      followingid: following.id,
      followerimg: currentUser?.photoURL,
      followingname: following.pageName,
      followingimg: following.image,
      adminid: following.adminId,
      time: moment().format(),
    });
    
    toast.success(`You're Following ${following.pageName}`);
    
    set(push(ref(db, "notification/")), {
      notifyReciver: following.adminId,
      type: "positive",
      time: moment().format(),
      content: `${currentUser?.displayName} starts following your page ${following.pageName}!`,
    });
  };

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
    
    toast.success(`You sent join request to ${group?.groupName}`);
    
    set(push(ref(db, "notification/")), {
      notifyReciver: group?.adminId,
      type: "positive",
      time: moment().format(),
      content: `${currentUser?.displayName} send join request to your group ${group?.groupName}!`,
    });
  };

  const cancelFriendRequest = (friend, dontShow) => {
    remove(ref(db, "friendRequest/" + friend.id))
      .then(() => {
        if (!dontShow) {
          toast.success("Friend request canceled");
          set(push(ref(db, "notification/")), {
            notifyReciver: friend.senderid,
            type: "negative",
            time: moment().format(),
            content: `${friend.recivername} canceled your friend request`,
          });
        }
      })
      .catch((error) => {
        console.error(error);
        toast.error("Failed to cancel request");
      });
  };

  const acceptFriendReq = (user) => {
    set(push(ref(db, "friendlist/")), {
      senderid: user.senderid,
      sendername: user.sendername,
      senderimg: user.senderimg,
      reciverid: currentUser.uid,
      reciverimg: currentUser.photoURL,
      recivername: currentUser.displayName,
    });
    
    toast.success(`You accept Friend Request from ${user.sendername}`);
    
    const dontShow = true;
    cancelFriendRequest(user, dontShow);
    
    set(push(ref(db, "notification/")), {
      notifyReciver: user.senderid,
      type: "positive",
      time: moment().format(),
      content: `${user.recivername} Accept your friend request`,
    });
  };

  const handleRequest = (item) => {
    set(push(ref(db, "friendRequest/")), {
      senderid: currentUser.uid,
      sendername: currentUser.displayName,
      reciverid: item.id,
      senderimg: currentUser.photoURL,
      recivername: item.username,
      time: moment().format(),
    });
    
    toast.success(`You sent Friend Request to ${item.username}`);
  };

  const cancelRequest = (friend) => {
    const requestRef = ref(db, "friendRequest/");

    get(requestRef)
      .then((snapshot) => {
        snapshot.forEach((item) => {
          const request = item.val();
          const key = item.key;
          if (
            (request.senderid === currentUser.uid && request.reciverid === friend.id) ||
            (request.reciverid === currentUser.uid && request.senderid === friend.id)
          ) {
            toast.success("Friend request canceled");
            return remove(ref(db, "friendRequest/" + key));
          }
        });
      })
      .catch((error) => {
        console.error("Error canceling request:", error);
        toast.error("Failed to cancel request");
      });
  };

  const unFriendHandler = async () => {
    const friendListRef = ref(db, "friendlist/");
    const snapshot = await get(friendListRef);

    snapshot.forEach((item) => {
      const friend = item.val();
      if (
        (friend.senderid === currentUser.uid && friend.reciverid === selectFriend.id) ||
        (friend.senderid === selectFriend.id && friend.reciverid === currentUser.uid)
      ) {
        remove(ref(db, "friendlist/" + item.key));
        toast.success("Unfriended successfully");
        set(push(ref(db, "notification/")), {
          notifyReciver: friend.senderid === currentUser.uid ? friend.reciverid : friend.senderid,
          type: "negative",
          time: moment().format(),
          content: `${currentUser.displayName} unfriended you`,
        });
      }
    });
  };

  const getCategoryColor = (category) => {
    const colors = {
      Technology: "bg-gradient-to-r from-blue-500 to-cyan-500",
      "Food & Dining": "bg-gradient-to-r from-orange-500 to-red-500",
      "Health & Fitness": "bg-gradient-to-r from-green-500 to-emerald-500",
      "Design & Art": "bg-gradient-to-r from-purple-500 to-pink-500",
      "Travel & Tourism": "bg-gradient-to-r from-teal-500 to-blue-500",
      Business: "bg-gradient-to-r from-green-600 to-green-800",
      Brand: "bg-gradient-to-r from-blue-600 to-blue-800",
      Education: "bg-gradient-to-r from-blue-500 to-blue-500",
      Entertainment: "bg-gradient-to-r from-pink-500 to-red-500",
      Sports: "bg-gradient-to-r from-green-400 to-lime-500",
      "Fashion & Lifestyle": "bg-gradient-to-r from-pink-400 to-purple-400",
      "Finance & Banking": "bg-gradient-to-r from-yellow-500 to-orange-500",
      "Marketing & Advertising": "bg-gradient-to-r from-purple-500 to-indigo-500",
      "News & Media": "bg-gradient-to-r from-gray-500 to-gray-700",
      Automotive: "bg-gradient-to-r from-red-400 to-red-600",
      "Real Estate": "bg-gradient-to-r from-green-600 to-teal-500",
      Music: "bg-gradient-to-r from-indigo-400 to-pink-500",
      Science: "bg-gradient-to-r from-cyan-500 to-blue-500",
      "Non-Profit": "bg-gradient-to-r from-rose-400 to-fuchsia-500",
      Gaming: "bg-gradient-to-r from-purple-600 to-pink-600",
    };
    return colors[category] || "bg-gradient-to-r from-gray-500 to-gray-600";
  };

  // Clear search function
  const clearSearch = () => {
    setSearchQuery("");
  };


  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-7xl w-full h-[70vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Discover & Connect
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 text-black rounded-full transition-colors"
          >
            <X/>
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-6 border-b border-gray-100">
          <div className="relative max-w-2xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search friends, users, groups, or pages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-700 placeholder-gray-400"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute inset-y-0 right-0 pr-4 flex items-center"
              >
                <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6 p-6 overflow-y-auto max-h-[calc(90vh-240px)]">
          
          {/* Friends Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white/90 backdrop-blur-xl border border-gray-200/50 rounded-2xl p-4 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg text-gray-800">Your Friends</h3>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                {searchQuery ? 
                  `${filteredFriendList.length} found` : 
                  (friendList.length == 0 ? "No Friends" : `${friendList.length} Friend${friendList.length !== 1 ? 's' : ''}`)
                }
              </div>
            </div>

            <div className="space-y-3 max-h-80 overflow-y-auto">
              {filteredFriendList.slice(0, friendsLoadMore).map((friend, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50/80 rounded-xl border border-gray-200/50 hover:shadow-lg transition-all group">
                  <div className="relative">
                    <img
                      src={friend.image}
                      alt={friend.name}
                      className="w-10 h-10 rounded-full object-cover border-2 border-purple-200 group-hover:border-purple-400 transition-colors"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link to={`/profile/${friend.id}`}>
                      <p className="text-gray-900 font-semibold text-sm hover:text-purple-600 transition-colors truncate">
                        {friend.name}
                      </p>
                    </Link>
                    <p className="text-gray-500 text-xs">@{friend.name}</p>
                  </div>
                  <div className="flex gap-1">
                    <Link to={`/messages/chat/${friend.id}`}>
                      <button className="text-xs bg-gradient-to-r from-purple-600 to-blue-600 text-white px-3 py-1.5 rounded-full shadow-md hover:scale-105 transition-all font-medium">
                        Chat
                      </button>
                    </Link>
                    <button
                      onClick={() => {
                        setSelectedFriend(friend);
                        setUnfriendPop(true);
                      }}
                      className="text-xs bg-white border border-gray-300 hover:border-red-300 text-gray-600 hover:text-red-600 px-3 py-1.5 rounded-full shadow-md hover:scale-105 transition-all font-medium"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}

              {filteredFriendList.length > 3 && (
                <button
                  onClick={() => setFriendsLoadMore(prev => 
                    filteredFriendList.length <= prev ? 3 : prev + 3
                  )}
                  className="w-full px-3 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 text-white text-sm font-medium hover:scale-105 transition-all"
                >
                  {filteredFriendList.length <= friendsLoadMore ? 'Show Less' : 'Load More'}
                </button>
              )}
            </div>

            {filteredFriendList.length === 0 && (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-gray-500 font-medium">
                  {searchQuery ? "No friends found" : "No friends yet"}
                </p>
                <p className="text-gray-400 text-sm">
                  {searchQuery ? "Try a different search term" : "Start connecting with people!"}
                </p>
              </div>
            )}
          </motion.div>

          {/* Add Friends Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="bg-white/90 backdrop-blur-xl border border-gray-200/50 rounded-2xl p-4 space-y-4"
          >
            <h3 className="font-bold text-lg text-gray-800">Add Friends</h3>

            {/* Friend Requests */}
            {friendRequestList.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-6 bg-gradient-to-b from-purple-500 to-blue-500 rounded-full"></div>
                  <h4 className="font-semibold text-gray-800">Friend Requests</h4>
                  <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                    {friendRequestList.length}
                  </span>
                </div>

                {friendRequestList.map((user, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 bg-purple-50/80 rounded-xl border border-purple-200/50">
                    <div className="relative">
                      <img
                        src={user?.senderimg}
                        alt={user?.sendername}
                        className="w-10 h-10 rounded-full object-cover border-2 border-purple-200"
                      />
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white flex items-center justify-center">
                        <span className="text-white text-xs font-bold">!</span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link to={`/profile/${user?.senderid}`}>
                        <p className="text-gray-900 font-semibold text-sm hover:text-purple-600 transition-colors truncate">
                          {user?.sendername}
                        </p>
                      </Link>
                      <p className="text-gray-500 text-xs truncate">{user?.senderemail}</p>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => acceptFriendReq(user)}
                        className="text-xs bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-1.5 rounded-full shadow-md hover:scale-105 transition-all font-medium"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => cancelFriendRequest(user)}
                        className="text-xs bg-white border border-gray-300 hover:border-red-300 text-gray-600 hover:text-red-600 px-3 py-1.5 rounded-full shadow-md hover:scale-105 transition-all font-medium"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Suggested Users */}
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {friendRequestList.length > 0 && (
                <div className="flex items-center gap-2">
                  <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
                  <h4 className="font-semibold text-gray-800">Suggested</h4>
                  {searchQuery && (
                    <span className="text-xs text-gray-500">({filteredUserList.length} found)</span>
                  )}
                </div>
              )}

              {filteredUserList.slice(0, usersLoadMore).map((user, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50/80 rounded-xl border border-gray-200/50 hover:shadow-lg transition-all group">
                  <div className="relative">
                    <img
                      src={user.imageUrl}
                      alt={user.username}
                      className="w-10 h-10 rounded-full object-cover border-2 border-gray-200 group-hover:border-blue-400 transition-colors"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link to={`/profile/${user.id}`}>
                      <p className="text-gray-900 font-semibold text-sm hover:text-blue-600 transition-colors truncate">
                        {user.username}
                      </p>
                    </Link>
                    <p className="text-gray-500 text-xs truncate">{user.email}</p>
                  </div>
                  <div>
                    {requestList.includes(user.id + currentUser.uid) || requestList.includes(currentUser.uid + user.id) ? (
                      <button
                        onClick={() => cancelRequest(user)}
                        className="text-xs bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1.5 rounded-full shadow-md hover:scale-105 transition-all font-medium"
                      >
                        Pending
                      </button>
                    ) : (
                      <button
                        onClick={() => handleRequest(user)}
                        className="text-xs bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1.5 rounded-full shadow-md hover:scale-105 transition-all font-medium"
                      >
                        Add Friend
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {filteredUserList.length > 3 && (
                <button
                  onClick={() => setUsersLoadMore(prev => 
                    filteredUserList.length <= prev ? 3 : prev + 3
                  )}
                  className="w-full px-3 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 text-white text-sm font-medium hover:scale-105 transition-all"
                >
                  {filteredUserList.length <= usersLoadMore ? 'Show Less' : 'Load More'}
                </button>
              )}

              {filteredUserList.length === 0 && searchQuery && (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                    <Search className="w-6 h-6 text-gray-400" />
                  </div>
                  <p className="text-gray-500 font-medium">No users found</p>
                  <p className="text-gray-400 text-sm">Try a different search term</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Groups Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="bg-white/90 backdrop-blur-xl border border-gray-200/50 rounded-2xl p-4 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg text-gray-800">Discover Groups</h3>
              <span className="text-sm text-gray-500">
                {searchQuery ? 
                  `${filteredGroupsList.length + filteredJoinedGroups.length} found` : 
                  `${groupsList.length + joinedGroups.length} groups found`
                }
              </span>
            </div>

            <div className="space-y-3 max-h-80 overflow-y-auto">
              {/* Joined Groups */}
              {filteredJoinedGroups.length > 0 && (
                <>
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-5 bg-gradient-to-b from-green-500 to-blue-500 rounded-full"></div>
                    <h4 className="font-semibold text-gray-800">Joined</h4>
                    <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                      {filteredJoinedGroups.length}
                    </span>
                  </div>

                  {filteredJoinedGroups.map((group) => (
                    <div key={group.id} className="p-3 bg-green-50/80 rounded-xl border border-green-200/50">
                      <div className="flex items-center gap-3">
                        <img
                          src={group.groupImage}
                          alt={group.groupName}
                          className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-md"
                        />
                        <div className="flex-1 min-w-0">
                          <Link to={`/group-profile/${group.groupId}`}>
                            <h4 className="text-gray-900 font-semibold text-sm hover:text-green-600 truncate">
                              {group.groupName}
                            </h4>
                          </Link>
                          <p className="text-xs text-gray-500">{group.visibility}</p>
                        </div>
                        <div className="flex flex-col gap-1">
                          <Link to={`/group-profile/${group.groupId}`}>
                            <button className="text-xs bg-gradient-to-r from-purple-500 to-blue-500 text-white px-3 py-1 rounded-full shadow-md hover:scale-105 transition-all font-medium flex items-center gap-1">
                              <Rss className="w-3 h-3" />
                              Post
                            </button>
                          </Link>
                          <Link to={`/messages/groupchat/${group.groupId}`}>
                            <button className="text-xs bg-white border border-gray-300 text-gray-600 hover:text-blue-600 px-3 py-1 rounded-full shadow-md hover:scale-105 transition-all font-medium flex items-center gap-1">
                              <MessageCircle className="w-3 h-3" />
                              Chat
                            </button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}

              {/* Suggested Groups */}
              <div className="space-y-2">
                {filteredJoinedGroups.length > 0 && (
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-4 bg-gradient-to-b from-purple-500 to-blue-500 rounded-full"></div>
                    <h4 className="font-semibold text-gray-800">Suggested Groups</h4>
                    {searchQuery && (
                      <span className="text-xs text-gray-500">({filteredGroupsList.length} found)</span>
                    )}
                  </div>
                )}

                {filteredGroupsList.map((group) => (
                  <div key={group.id} className="p-3 bg-gray-50 rounded-xl border border-gray-200/50 hover:shadow-lg transition-all">
                    <div className="flex items-center gap-3">
                      <img
                        src={group.image}
                        alt={group.groupName}
                        className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-md"
                      />
                      <div className="flex-1 min-w-0">
                        <Link to={`/group-profile/${group.id}`}>
                          <h4 className="text-gray-900 font-semibold text-sm hover:text-purple-600 truncate">
                            {group.groupName}
                          </h4>
                        </Link>
                        <div className="inline-block bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs px-2 py-0.5 rounded-full font-medium mt-1">
                          {group.category}
                        </div>
                      </div>
                      {group.adminId !== currentUser?.uid && (
                        <div>
                          {!requestedId.includes(group.id) ? (
                            <button
                              onClick={() => groupJoinRequest(group)}
                              className="text-xs bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1.5 rounded-full shadow-md hover:scale-105 transition-all font-medium flex items-center gap-1"
                            >
                              <Plus className="w-3 h-3" />
                              Join
                            </button>
                          ) : (
                            <button
                              onClick={() => cancelJoinRequest(group)}
                              className="text-xs bg-gradient-to-r from-red-500 to-orange-500 text-white px-3 py-1.5 rounded-full shadow-md hover:scale-105 transition-all font-medium flex items-center gap-1"
                            >
                              <Plus className="w-3 h-3" />
                              Cancel Request
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Empty State */}
            {filteredGroupsList.length === 0 && filteredJoinedGroups.length === 0 && (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-gray-500 font-medium mb-2">
                  {searchQuery ? "No groups found" : "No groups found"}
                </p>
                <p className="text-gray-400 text-sm">
                  {searchQuery ? "Try a different search term" : "Check back later for new group suggestions!"}
                </p>
              </div>
            )}
          </motion.div>

          {/* Pages Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="bg-white/90 backdrop-blur-xl border border-gray-200/50 rounded-2xl p-4 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg text-gray-800">Discover Pages</h3>
              <span className="text-sm text-gray-500">
                {searchQuery ? 
                  `${filteredPagesList.length + filteredFollowedPages.length} found` : 
                  `${pagesList.length} pages found`
                }
              </span>
            </div>

            <div className="space-y-3 max-h-80 overflow-y-auto">
              {/* Followed Pages */}
              {filteredFollowedPages.length > 0 && (
                <>
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-5 bg-gradient-to-b from-green-500 to-blue-500 rounded-full"></div>
                    <h4 className="font-semibold text-gray-800">Following</h4>
                    <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                      {filteredFollowedPages.length}
                    </span>
                  </div>

                  {filteredFollowedPages.slice(0, pagesLoadMore).map((page) => (
                    <div key={page.id} className="p-3 bg-green-50/80 rounded-xl border border-green-200/50">
                      <div className="flex items-center gap-3">
                        <img
                          src={page.followingimg}
                          alt={page.followingname}
                          className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-md"
                        />
                        <div className="flex-1 min-w-0">
                          <Link to={`/page-profile/${page.followingid}`}>
                            <h4 className="text-gray-900 font-semibold text-sm hover:text-green-600 truncate">
                              {page.followingname}
                            </h4>
                          </Link>
                        </div>
                        <div className="flex flex-col gap-1">
                          <button className="text-xs bg-gradient-to-r from-red-500 to-pink-500 text-white px-2 py-1 rounded-full shadow-md hover:scale-105 transition-all font-medium flex items-center gap-1">
                            <UserCheck className="w-3 h-3" />
                            Following
                          </button>
                          <Link to={`/messages/chat/${page.followingid}`}>
                            <button className="text-xs bg-white border border-gray-300 text-gray-600 hover:text-blue-600 px-2 py-1 rounded-full shadow-md hover:scale-105 transition-all font-medium flex items-center gap-1">
                              <MessageCircle className="w-3 h-3" />
                              Message
                            </button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}

                  {filteredFollowedPages.length > 3 && (
                    <button
                      onClick={() => setPagesLoadMore(prev => 
                        filteredFollowedPages.length <= prev ? 3 : prev + 3
                      )}
                      className="w-full px-3 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 text-white text-sm font-medium hover:scale-105 transition-all"
                    >
                      {filteredFollowedPages.length <= pagesLoadMore ? 'Show Less' : 'Load More'}
                    </button>
                  )}
                </>
              )}

              {/* Suggested Pages */}
              <div className="space-y-2">
                {filteredFollowedPages.length > 0 && (
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-4 bg-gradient-to-b from-purple-500 to-blue-500 rounded-full"></div>
                    <h4 className="font-semibold text-gray-800">Suggested Pages</h4>
                    {searchQuery && (
                      <span className="text-xs text-gray-500">({filteredPagesList.length} found)</span>
                    )}
                  </div>
                )}

                {filteredPagesList.slice(0, suggestedPagesLoadMore).map((page) => (
                  <div key={page.id} className="p-3 bg-gray-50 rounded-xl border border-gray-200/50 hover:shadow-lg transition-all">
                    <div className="flex items-center gap-3">
                      <img
                        src={page.image}
                        alt={page.pageName}
                        className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-md"
                      />
                      <div className="flex-1 min-w-0">
                        <Link to={`/page-profile/${page.id}`}>
                          <h4 className="text-gray-900 font-semibold text-sm hover:text-purple-600 truncate">
                            {page.pageName}
                          </h4>
                        </Link>
                        <div className={`inline-block ${getCategoryColor(page.category)} text-white text-xs px-2 py-0.5 rounded-full font-medium mt-1`}>
                          {page.category}
                        </div>
                      </div>
                      {page.adminId !== currentUser?.uid && (
                        <div>
                          <button
                            onClick={() => followHandler(page)}
                            className="text-xs bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1.5 rounded-full shadow-md hover:scale-105 transition-all font-medium flex items-center gap-1"
                          >
                            <Plus className="w-3 h-3" />
                            Follow
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {filteredPagesList.length > 3 && (
                  <button
                    onClick={() => setSuggestedPagesLoadMore(prev => 
                      filteredPagesList.length <= prev ? 3 : prev + 3
                    )}
                    className="w-full px-3 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 text-white text-sm font-medium hover:scale-105 transition-all"
                  >
                    {filteredPagesList.length <= suggestedPagesLoadMore ? 'Show Less' : 'Load More'}
                  </button>
                )}
              </div>
            </div>

            {/* Empty State */}
            {filteredPagesList.length === 0 && filteredFollowedPages.length === 0 && (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-gray-500 font-medium mb-2">
                  {searchQuery ? "No pages found" : "No pages found"}
                </p>
                <p className="text-gray-400 text-sm">
                  {searchQuery ? "Try a different search term" : "Check back later for new page suggestions!"}
                </p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Unfriend Popup */}
        {unFriendPop && selectFriend && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-60 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full"
            >
              <div className="text-center">
                <img
                  src={selectFriend.image}
                  alt={selectFriend.name}
                  className="w-16 h-16 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  Unfriend {selectFriend.name}?
                </h3>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to remove {selectFriend.name} from your friends list?
                </p>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => setUnfriendPop(false)}
                    className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      unFriendHandler();
                      setUnfriendPop(false);
                      setSelectedFriend(null);
                    }}
                    className="px-6 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-full font-medium transition-all"
                  >
                    Unfriend
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResultModal;

            