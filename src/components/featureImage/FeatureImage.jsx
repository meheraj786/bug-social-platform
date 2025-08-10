import React, { useEffect, useState } from "react";
import { Plus, User } from "lucide-react";
import Container from "../../layouts/Container";
import StoryModal from "../../layouts/StoryModal";
import { getDatabase, onValue, push, ref, set } from "firebase/database";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import moment from "moment";
import StoryViewer from "../storyViewer/StoryViewer";

const FeatureImage = () => {
  const [showAddStoryModal, setShowAddStoryModal] = useState(false);
  const db = getDatabase();
  const user = useSelector((state) => state.user.user);
  const coudinaryApi = import.meta.env.VITE_CLOUDINARY_API;
  const [followingId, setFollowingId] = useState([]);
  const [friendList, setFriendList] = useState([]);
  const [storyText, setStoryText] = useState("");
  const [imgLoading, setImgLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [story, setStory] = useState([]);
  const [activeStory, setActiveStory] = useState(null);

  useEffect(() => {
    const followRef = ref(db, "follow/");
    onValue(followRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((data) => {
        const follow = data.val();
        if (follow.followerid == user?.uid) {
          arr.push(follow.followingid);
        }
      });
      setFollowingId(arr);
    });
  }, [db, user]);

  useEffect(() => {
    const requestRef = ref(db, "story/");
    onValue(requestRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        const story = item.val();
        const storyId = item.key;

        const storyTime = moment(story.time);
        const hoursPassed = moment().diff(storyTime, "hours");

        if (hoursPassed < 24) {
          if (
            friendList.includes(user?.uid + story.storyCreatorId) ||
            friendList.includes(story.storyCreatorId + user?.uid) ||
            story.storyCreatorId == user?.uid ||
            followingId.includes(story.storyCreatorId)
          ) {
            arr.unshift({ ...story, id: storyId });
          }
        }
      });
      setStory(arr);
    });
  }, [db, user, friendList, followingId]);

  useEffect(() => {
    const requestRef = ref(db, "friendlist/");
    onValue(requestRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        const request = item.val();
        arr.push(request.reciverid + request.senderid);
      });
      setFriendList(arr);
    });
  }, [db]);

  const handleImageSelect = async (e) => {
    setImgLoading(true);
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
    setSelectedImage(result.secure_url);
    setImgLoading(false);
  };

const addStoryHandler = () => {
  const storyData = {
    storyCreatorId: user?.uid,
    storyCreatorName: user?.displayName,
    storyCreatorImage: user?.photoURL,
    storyText: storyText || "",
    storyImage: selectedImage || "",
    time: moment().format(),
  };

  if (storyText || selectedImage) {
    set(push(ref(db, "story/")), storyData).then(() => {
      toast.success("Story Added Successfully!");
      setSelectedImage(null);
      setStoryText("");
      setShowAddStoryModal(false);
    });
  } else {
    toast.error("Please fill the story details!");
  }
};


  const AddStoryCard = () => (
    <div className="flex-shrink-0">
      <div
        onClick={() => setShowAddStoryModal(true)}
        className="flex flex-col items-center space-y-2 cursor-pointer group"
      >
        <div className="relative">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center border-2 border-gray-300 group-hover:border-purple-400 transition-all duration-300 group-hover:scale-105 overflow-hidden">
            <div className="w-full h-full rounded-3xl bg-gray-100 flex items-center justify-center">
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt="User"
                  className="w-full h-full object-cover rounded-3xl"
                />
              ) : (
                <User className="w-6 h-6 text-gray-500" />
              )}
            </div>
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center border-2 border-white shadow-lg">
            <Plus className="w-3 h-3 text-white" />
          </div>
        </div>
        <span className="text-xs font-medium text-gray-600 group-hover:text-purple-600 transition-colors">
          Add Story
        </span>
      </div>
    </div>
  );

  const StoryCard = ({ s }) => {
    const gradientClass = "from-purple-500 via-purple-600 to-blue-500";
    const hoverGradientClass = "hover:from-purple-600 hover:to-blue-600";

    return (
      <div
        onClick={() => setActiveStory(s)}
        className="flex-shrink-0 cursor-pointer"
      >
        <div className="flex flex-col items-center space-y-2 group">
          <div
            className={`w-16 h-16 rounded-3xl bg-gradient-to-br ${gradientClass} ${hoverGradientClass} p-0.5 transition-all duration-300 group-hover:scale-105 shadow-lg`}
          >
            <div className="w-full h-full rounded-3xl bg-white flex items-center justify-center overflow-hidden">
              {s?.storyImage ? (
                <img
                  className="w-full h-full object-cover rounded-3xl"
                  src={s?.storyImage}
                  alt="Story"
                />
              ) : (
                <div className="w-full h-full rounded-3xl bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center p-1">
                  <span className="text-[10px] text-white text-center font-medium">
                    {s?.storyText?.substring(0, 20)}
                    {s?.storyText?.length > 20 ? "..." : ""}
                  </span>
                </div>
              )}
            </div>
          </div>
          <span className="text-xs font-medium text-gray-700 group-hover:text-purple-600 transition-colors max-w-16 text-center truncate">
            {s?.storyCreatorName}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full mx-auto p-4">
      {showAddStoryModal && (
        <StoryModal
          storyText={storyText}
          setStoryText={setStoryText}
          addStoryHandler={addStoryHandler}
          setShowAddStoryModal={setShowAddStoryModal}
          handleImageSelect={handleImageSelect}
          selectedImage={selectedImage}
          setSelectedImage={setSelectedImage}
          imgLoading={imgLoading}
        />
      )}

      {activeStory && (
        <StoryViewer
          story={activeStory}
          onClose={() => setActiveStory(null)}
        />
      )}

      <Container>
        <div className="bg-white mx-40 rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Stories
            </h2>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
              <span>Active now</span>
            </div>
          </div>

          <div className="flex space-x-4 overflow-x-auto pb-2">
            <AddStoryCard />
            {story.map((s) => (
              <StoryCard key={s.id} s={s} />
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default FeatureImage;