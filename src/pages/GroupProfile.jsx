import {
  getDatabase,
  onValue,
  push,
  ref,
  remove,
  set,
} from "firebase/database";
import { Lock, Upload, User } from "lucide-react";
import moment from "moment";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { Link, Navigate, useParams } from "react-router";
import CustomToast from "../layouts/CustomToast";
import { UserX } from "lucide-react";
import BlogCard from "../components/blogCard/BlogCard";
import NoBlog from "../components/noBlog/NoBlog";
import { FaHackerNews, FaUserSecret } from "react-icons/fa6";

const GroupProfile = () => {
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [group, setGroup] = useState(null);
  const { id } = useParams();
  const user = useSelector((state) => state.user.user);
  const db = getDatabase();
  const coudinaryApi = import.meta.env.VITE_CLOUDINARY_API;
  const [requestedId, setRequestedId] = useState([]);
  const [allRequest, setAllRequest] = useState([]);
  const [ownRequest, setOwnRequest] = useState([]);
  const [members, setMembers] = useState([]);
  const [membersId, setMembersId] = useState([]);
  const [friendList, setFriendList] = useState([]);
  const [sameRequestedId, setSameRequestedId] = useState([]);
  const [expandedSections, setExpandedSections] = useState({
    members: false,
    addMembers: false,
    joinRequests: false,
  });
  const [description, setDescription] = useState("");
  const [preview, setPreview] = useState("");
  const [groupPost, setGroupPost] = useState([]);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "e-com app with firebase");
    data.append("cloud_name", "dlrycnxnh");

    const res = await fetch(coudinaryApi, {
      method: "POST",
      body: data,
    });
    const result = await res.json();
    setPreview(result.secure_url);
  };

  const handlePost = () => {
    if (!description && !preview) {
      toast.error("Please add some text or image to post.");
      return;
    }

    const postData = {
      adminId: group?.adminId,
      groupName: group?.groupName,
      groupImage: group?.image,
      groupId: group?.id,
      bloggerId: user?.uid,
      bloggerImg: user?.photoURL,
      bloggerName: user?.displayName,
      description: description,
      visibility: group?.visibility,
      postImage: preview,
      postType: "groupPost",
      isAnonymous: isAnonymous,
      time: moment().format(),
    };

    set(push(ref(db, "blogs/")), postData)
      .then(() => {
        resetForm();
        toast.success("Post Successfully Published");
      })
      .catch((err) => {
        toast.error("Error publishing post!");
        console.error(err);
      });
  };

  const resetForm = () => {
    setDescription("");
    setPreview("");
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Fetch group
  useEffect(() => {
    const requestRef = ref(db, "member/");
    onValue(requestRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        const group = item.val();
        if (group.groupId == id) {
          arr.push({ ...group, id: item.key });
        }
      });
      setMembers(arr);
      setMembersId(arr.map((grp) => grp.memberId));
    });
  }, [db, id]);
  useEffect(() => {
    const requestRef = ref(db, "group/");
    onValue(requestRef, (snapshot) => {
      snapshot.forEach((item) => {
        const group = item.val();

        if (item.key == id) {
          setGroup({ ...group, id: item.key });
        }
      });
    });
  }, [db, id]);
  useEffect(() => {
    const followRef = ref(db, "joinrequest/");
    onValue(followRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((data) => {
        const req = data.val();
        arr.push(req.followingid);
      });
      setRequestedId(arr);
    });
  }, [db, id]);
  useEffect(() => {
    const followRef = ref(db, "joinrequest/");
    onValue(followRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((data) => {
        const req = data.val();
        arr.push(req.requestedId);
      });
      setRequestedId(arr);
    });
  }, [db, id]);
  useEffect(() => {
    const followRef = ref(db, "joinrequest/");
    onValue(followRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((data) => {
        const req = data.val();
        arr.push({ ...req, id: data.key });
      });
      setAllRequest(arr);
      setOwnRequest(arr.filter((req) => req.groupId === group?.id));
      setSameRequestedId(arr.map((req) => req.requestedId));
    });
  }, [db, group]);
  useEffect(() => {
    const requestRef = ref(db, "friendlist/");
    onValue(requestRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        const request = item.val();
        if (request.senderid === user?.uid || request.reciverid === user?.uid) {
          const isSender = request.senderid === user?.uid;
          const friendId = isSender ? request.reciverid : request.senderid;
          const friendName = isSender
            ? request.recivername
            : request.sendername;
          const friendEmail = isSender
            ? request.reciveremail
            : request.senderemail;
          const friendImage = isSender ? request.reciverimg : request.senderimg;

          if (
            !membersId.includes(friendId) &&
            !sameRequestedId.includes(friendId)
          ) {
            arr.push({
              id: friendId,
              name: friendName,
              email: friendEmail,
              image: friendImage,
              listId: item.key,
            });
          }
        }
      });
      setFriendList(arr);
    });
  }, [db, membersId, sameRequestedId]);

  useEffect(() => {
    const blogsRef = ref(db, "blogs/");
    onValue(blogsRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((blog) => {
        const content = blog.val();
        const blogId = blog.key;

        if (group?.id && String(content.groupId) === String(group.id)) {
          arr.unshift({ ...content, id: blogId });
        }
      });
      setGroupPost(arr);
    });
  }, [db, group]);

  const addFriendAsMember = (friend) => {
    if (!group) return;

    set(push(ref(db, "member/")), {
      memberId: friend.id,
      memberName: friend.name,
      groupId: group.id,
      adminId: group?.adminId,
      memberImg: friend.image,
      groupName: group.groupName,
      groupImage: group.image,
      time: moment().format(),
    })
      .then(() => {
        toast.success(`${friend.name} added to ${group.groupName}`);

        // Optional: notification
        set(push(ref(db, "notification/")), {
          notifyReceiver: friend.id,
          type: "positive",
          time: moment().format(),
          content: `You were added to ${group.groupName} by ${user.displayName}`,
        });
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to add friend as member.");
      });
  };

  const cancelRequestHandler = () => {
    allRequest.map((req) => {
      if (req.requestedId == user?.uid && req.groupId == group?.id) {
        remove(ref(db, "joinrequest/" + req.id)).then(() => {
          toast.success("Request Canceled");
        });
      }
    });
  };
  const groupJoinRequest = () => {
    set(push(ref(db, "joinrequest/")), {
      requestedId: user?.uid,
      requestedName: user?.displayName,
      groupId: group?.id,
      adminId: group?.adminId,
      requestedImage: user?.photoURL,
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
      content: `${user?.displayName} send join request to your group ${group?.groupName}!`,
    });
  };
  const handleAccept = (req) => {
    // 1. Add the user to members
    set(push(ref(db, "member/")), {
      memberId: req.requestedId,
      memberName: req.requestedName,
      adminId: req.adminId,
      groupId: req.groupId,
      memberImg: req.requestedImage,
      groupName: req.groupName,
      groupImage: req.groupImage,
      time: moment().format(),
    })
      .then(() => {
        // 2. Remove the join request
        remove(ref(db, "joinrequest/" + req.id));

        // 3. Send a notification to the admin
        set(push(ref(db, "notification/")), {
          notifyReceiver: req.requestedId,
          type: "positive",
          time: moment().format(),
          content: `Your request to join ${req.groupName} has been accepted!`,
        });

        // 4. Show success toast
        toast.custom((t) => (
          <CustomToast
            t={t}
            img={req.groupImage}
            name={req.groupName}
            content={`${req.requestedName} is now a member of ${req.groupName}`}
          />
        ));
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to accept request. Please try again.");
      });
  };
  const handleReject = (req) => {
    remove(ref(db, "joinrequest/" + req.id)).then(() => {
      toast.success("You Rejected that Request");

      set(push(ref(db, "notification/")), {
        notifyReceiver: req.requestedId,
        type: "negative",
        time: moment().format(),
        content: `Sorry, your request to join ${req.groupName} was rejected.`,
      });

      toast.custom((t) => (
        <CustomToast
          t={t}
          img={req.groupImage}
          name={req.groupName}
          content={`${req.requestedName} is now a member of ${req.groupName}`}
        />
      ));
    });
  };
  const kickoutHandler = (member) => {
    remove(ref(db, "member/" + member.id)).then(() => {
      toast.success("Removed Successfull");

      set(push(ref(db, "notification/")), {
        notifyReceiver: member.memberId,
        type: "negative",
        time: moment().format(),
        content: `You're removed from ${member.groupName}.`,
      });

      toast.custom((t) => (
        <CustomToast
          t={t}
          img={member.memberImg}
          name={member.memberName}
          content={`${member.memberName} removed from ${member.groupName}`}
        />
      ));
    });
  };

      if (!user) {
    return <Navigate to="/login"/>;
  }

  return (
    <div className="bg-gradient-to-br min-h-[150vh] font-secondary from-gray-50 via-blue-50/30 to-purple-50/30">
      {/* Followers Modal Dummy */}
      {/* <FollowersModal /> */}

      {/* Cover Section with Glass Effect */}
      {group?.image && (
        <div className="relative object-cover object-center w-full h-100 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 overflow-hidden">
          <img
            src={group?.image}
            className="w-full object-cover h-full"
            alt=""
          />
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4">
        {/* Profile Info Card */}
        <div className="relative -mt-8 mb-8">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
            <div className="flex justify-between items-start flex-wrap gap-6 ">
              <div className="flex-1">
                <h1 className="text-4xl font-bold font-primary bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
                  {group?.groupName}
                </h1>
                <p className="text-lg flex justify-start items-center gap-x-1 text-gray-500 font-medium mb-4">
                  {" "}
                  <Lock size={18} /> {group?.visibility || "Public"}
                </p>
                <p className="text-sm text-gray-500 font-medium mb-4">
                  @{group?.groupName}
                </p>

                {/* Stats */}
                <div className="flex gap-8 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-800">
                      {groupPost.length}
                    </div>
                    <div className="text-sm text-gray-500 font-medium">
                      Posts
                    </div>
                  </div>

                  <div className="text-center cursor-pointer">
                    <div className="text-2xl font-bold text-gray-800">
                      {members.length}
                    </div>
                    <div className="text-sm font-medium text-gray-500">
                      Members
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                {group?.adminId !== user?.uid &&
                  !membersId.includes(user?.uid) &&
                  (requestedId.includes(user?.uid) ? (
                    <button
                      onClick={cancelRequestHandler}
                      className="px-6 py-3 rounded-2xl font-semibold shadow-lg flex items-center gap-2 border-2 transition-all duration-200 bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
                    >
                      Cancel Request
                    </button>
                  ) : (
                    <button
                      onClick={groupJoinRequest}
                      className="px-6 py-3 rounded-2xl font-semibold shadow-lg flex items-center gap-2 border-2 transition-all duration-200 bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                    >
                      Join Request
                    </button>
                  ))}
                {membersId.includes(user?.uid) &&
                  group?.adminId != user?.uid && (
                    <>
                    <Link to={`/messages/groupchat/${group?.id}`}>
                      <button className="px-6 py-3 rounded-2xl font-semibold shadow-lg flex items-center gap-2 border-2 transition-all duration-200 bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100">
                        Message
                      </button>
                    
                    </Link>
                      <button
                        onClick={() =>
                          kickoutHandler({
                            memberId: user?.uid,
                            memberName: user?.displayName,
                            memberImg: user?.photoURL,
                            groupName: group?.groupName,
                            id: members.find((m) => m.memberId === user?.uid)
                              ?.id,
                          })
                        }
                        className="px-6 py-3 rounded-2xl font-semibold shadow-lg flex items-center gap-2 border-2 transition-all duration-200 bg-yellow-50 border-yellow-200 text-yellow-700 hover:bg-yellow-100"
                      >
                        Leave
                      </button>
                    </>
                  )}
                  {group?.adminId == user?.uid && (
                    <Link to={`/messages/groupchat/${group?.id}`}>
                      <button className="px-6 py-3 rounded-2xl font-semibold shadow-lg flex items-center gap-2 border-2 transition-all duration-200 bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100">
                        Message
                      </button>
                    
                    </Link>
                  )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-8 pb-8">
          <div className="w-full lg:w-1/3 space-y-6">
            {/* About Card */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-6">
              <h3 className="text-xl font-primary font-bold text-gray-800 mb-4 flex items-center gap-2">
                About
              </h3>
              <p className="text-gray-700 font-medium">{group?.about}</p>
            </div>
            {group?.adminId == user?.uid && (
              <>
                {/* Members Section - Collapsible */}
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 overflow-hidden">
                  {/* Header - Always visible */}
                  <div
                    onClick={() => toggleSection("members")}
                    className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50/50 transition-all duration-200"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
                      <h3 className="font-semibold text-gray-800 text-lg">
                        Members
                      </h3>
                      <span className="text-sm text-gray-500 ml-2">
                        ({members.length})
                      </span>
                    </div>
                    <div
                      className={`transform transition-transform duration-200 ${
                        expandedSections.members ? "rotate-180" : ""
                      }`}
                    >
                      <svg
                        className="w-5 h-5 text-gray-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>

                  {/* Content - Collapsible */}
                  <div
                    className={`transition-all duration-300 ease-in-out ${
                      expandedSections.members
                        ? "max-h-96 opacity-100"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="px-6 pb-6 max-h-80 overflow-y-auto space-y-4">
                      {members.map((member, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between gap-4 p-4 bg-gradient-to-r from-gray-50/80 to-white/80 rounded-2xl border border-gray-200/50 hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
                        >
                          {/* Left: Image + Info */}
                          <div className="flex items-center gap-4 flex-1">
                            <img
                              src={member.memberImg}
                              alt={member.memberName}
                              className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-gray-900 font-semibold text-sm truncate">
                                {member.memberName}
                              </p>
                            </div>
                          </div>
                          {member.adminId == user?.uid && (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => kickoutHandler(member)}
                                className="text-xs bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white px-3 py-1 rounded-full shadow-md hover:shadow-lg transition-all duration-200 font-medium"
                              >
                                Kickout
                              </button>
                            </div>
                          )}
                          {member.adminId == member.memberId && (
                            <div className="flex items-center gap-2">
                              <button className="text-xs bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white px-3 py-1 rounded-full shadow-md hover:shadow-lg transition-all duration-200 font-medium">
                                Admin
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Add Members Section - Collapsible */}
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 overflow-hidden">
                  {/* Header - Always visible */}
                  <div
                    onClick={() => toggleSection("addMembers")}
                    className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50/50 transition-all duration-200"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-6 bg-gradient-to-b from-green-500 to-teal-500 rounded-full"></div>
                      <h3 className="font-semibold text-gray-800 text-lg">
                        Add Members
                      </h3>
                      <span className="text-sm text-gray-500 ml-2">
                        ({friendList.length})
                      </span>
                    </div>
                    <div
                      className={`transform transition-transform duration-200 ${
                        expandedSections.addMembers ? "rotate-180" : ""
                      }`}
                    >
                      <svg
                        className="w-5 h-5 text-gray-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>

                  {/* Content - Collapsible */}
                  <div
                    className={`transition-all duration-300 ease-in-out ${
                      expandedSections.addMembers
                        ? "max-h-96 opacity-100"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="px-6 pb-6 max-h-80 overflow-y-auto space-y-4">
                      {friendList.map((friend, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between gap-4 p-4 bg-gradient-to-r from-gray-50/80 to-white/80 rounded-2xl border border-gray-200/50 hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
                        >
                          {/* Left: Image + Info */}
                          <div className="flex items-center gap-4 flex-1">
                            <img
                              src={friend.image}
                              alt={friend.name}
                              className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-gray-900 font-semibold text-sm truncate">
                                {friend.name}
                              </p>
                              <p className="text-gray-500 text-xs truncate">
                                {friend.email}
                              </p>
                            </div>
                          </div>

                          {/* Right: Add Button */}
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => addFriendAsMember(friend)}
                              className="text-xs bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white px-3 py-1 rounded-full shadow-md hover:shadow-lg transition-all duration-200 font-medium"
                            >
                              Add
                            </button>
                          </div>
                        </div>
                      ))}

                      {/* Empty State */}
                      {friendList.length === 0 && (
                        <div className="text-center py-8">
                          <p className="text-gray-500">
                            No friends available to add.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Join Requests Section - Collapsible */}
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 overflow-hidden">
                  {/* Header - Always visible */}
                  <div
                    onClick={() => toggleSection("joinRequests")}
                    className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50/50 transition-all duration-200"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-6 bg-gradient-to-b from-orange-500 to-red-500 rounded-full"></div>
                      <h3 className="font-semibold text-gray-800 text-lg">
                        Join Requests
                      </h3>
                      {ownRequest.length > 0 && (
                        <span className="text-xs bg-red-500 text-white px-2 py-1 rounded-full ml-2">
                          {ownRequest.length}
                        </span>
                      )}
                    </div>
                    <div
                      className={`transform transition-transform duration-200 ${
                        expandedSections.joinRequests ? "rotate-180" : ""
                      }`}
                    >
                      <svg
                        className="w-5 h-5 text-gray-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>

                  {/* Content - Collapsible */}
                  <div
                    className={`transition-all duration-300 ease-in-out ${
                      expandedSections.joinRequests
                        ? "max-h-96 opacity-100"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="px-6 pb-6 max-h-80 overflow-y-auto space-y-4">
                      {ownRequest.map((req, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between gap-4 p-4 bg-gradient-to-r from-gray-50/80 to-white/80 rounded-2xl border border-gray-200/50 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 group"
                        >
                          {/* Left side: Image + Info */}
                          <div className="flex items-center gap-4 flex-1">
                            <img
                              src={req.requestedImage}
                              alt={req.requestedName}
                              className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 group-hover:border-blue-400 transition-colors duration-300"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-gray-900 font-semibold text-sm truncate">
                                {req.requestedName}
                              </p>
                              <p className="text-gray-500 text-xs truncate">
                                {req.groupName}
                              </p>
                            </div>
                          </div>

                          {/* Right side: Buttons */}
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleAccept(req)}
                              className="text-xs bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-4 py-2 rounded-full shadow-md hover:shadow-lg transition-all duration-200 font-medium"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => handleReject(req)}
                              className="text-xs bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-4 py-2 rounded-full shadow-md hover:shadow-lg transition-all duration-200 font-medium"
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      ))}

                      {ownRequest.length === 0 && (
                        <div className="text-center py-8">
                          <p className="text-gray-500">
                            No pending join requests.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
            {/* Followers Preview - Remains the same */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-primary font-bold text-gray-800">
                  Members Preview
                </h3>
                <span className="text-sm text-gray-500 cursor-pointer">
                  {members.length} Members
                </span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {group?.visibility == "private" &&
                membersId.includes(user?.uid) ? (
                  <>
                    {members.map((i, idx) => (
                      <div key={idx}>
                        <img
                          src={i.memberImg}
                          alt="member"
                          className="w-full aspect-square rounded-2xl object-cover shadow-md"
                        />
                      </div>
                    ))}
                  </>
                ) : group?.visibility == "public" ? (
                  <>
                    {members.map((i) => (
                      <div key={i}>
                        <img
                          src={i.memberImg}
                          alt="member"
                          className="w-full aspect-square rounded-2xl object-cover shadow-md"
                        />
                      </div>
                    ))}
                  </>
                ) : group?.visibility == "private" ? null : null}
              </div>
            </div>
          </div>

          {/* Posts Section */}
          <div className="w-full lg:w-2/3 space-y-6">
            {/* Create Post Card */}
            {membersId.includes(user?.uid) && (
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-6">
                <div className="flex items-start gap-4">
                  {isAnonymous ? (
                    <div className="w-12 h-12 flex justify-center items-center rounded-full object-cover border-2 border-purple-200">
                      {" "}
                      <FaUserSecret size={30} />{" "}
                    </div>
                  ) : (
                    <img
                      src={user?.photoURL || "https://via.placeholder.com/50"}
                      alt="avatar"
                      className="w-12 h-12 rounded-full object-cover border-2 border-purple-200"
                    />
                  )}

                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="What's on your mind?"
                    className="w-full p-4 rounded-2xl border-2 border-gray-200 bg-gray-50/50"
                  />
                </div>
                {/* Anonymous Option */}
                <div className="flex items-center gap-3 mt-4">
                  <button
                    type="button"
                    onClick={() => setIsAnonymous(!isAnonymous)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-full border transition 
    ${
      isAnonymous
        ? "bg-gray-800 text-white border-gray-800"
        : "bg-gray-100 border-gray-300 text-gray-600"
    }`}
                  >
                    {isAnonymous ? <UserX size={18} /> : <User size={18} />}
                    <span className="text-sm">
                      {isAnonymous
                        ? "Posting as Anonymous"
                        : "Post with my name"}
                    </span>
                  </button>
                </div>

                {/* Image Preview */}
                {preview && (
                  <div className="mt-4">
                    <img
                      src={preview}
                      alt="preview"
                      className="w-full max-h-60 object-cover rounded-2xl"
                    />
                  </div>
                )}

                <div className="mt-4 flex justify-between items-center gap-3">
                  <label className="inline-flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition">
                    <Upload className="w-5 h-5 text-gray-500" />
                    <span className="text-sm text-gray-600">Upload image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>

                  <div className="flex gap-3">
                    <button
                      onClick={resetForm}
                      className="bg-gray-200 px-6 py-3 rounded-2xl font-semibold"
                    >
                      Clear
                    </button>
                    <button
                      onClick={handlePost}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-2xl font-semibold"
                    >
                      Post
                    </button>
                  </div>
                </div>
              </div>
            )}

            {group?.visibility == "public" ? (
              <>
                {groupPost.map((blog) => (
                  <BlogCard key={blog.id} blog={blog} />
                ))}
              </>
            ) : group?.visibility == "private" &&
              membersId.includes(user?.uid) ? (
              <>
                {groupPost.map((blog) => (
                  <BlogCard key={blog.id} blog={blog} />
                ))}
              </>
            ) : group?.visibility == "private" &&
              !membersId.includes(user?.uid) ? (
              <>
                <NoBlog />
              </>
            ) : null}

            {/* Empty State Example */}

            {groupPost.length == 0 && (
              <div className="bg-white/80 p-12 text-center rounded-3xl shadow-xl">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  No posts yet
                </h3>
                <p className="text-gray-600">This group hasn't any post yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupProfile;
