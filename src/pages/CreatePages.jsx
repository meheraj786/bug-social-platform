import { getDatabase, onValue, push, ref, set } from "firebase/database";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  BiPlus,
  BiX,
  BiImage,
  BiCategory,
  BiInfoCircle,
  BiSearch,
  BiFilter,
} from "react-icons/bi";
import { useSelector } from "react-redux";
import { Link } from "react-router";

const CreatePages = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [pages, setPages] = useState([]);
  const [msgNotif, setMsgNotif] = useState([]);

  // Create page states
  const [pageName, setPageName] = useState("");
  const [category, setCategory] = useState("");
  const [about, setAbout] = useState("");
  const [preview, setPreview] = useState("");
  const [imgLoading, setImgLoading] = useState(false);

  const user = useSelector((state) => state.user.user);
  const db = getDatabase();
  const coudinaryApi = import.meta.env.VITE_CLOUDINARY_API;

  // Upload image
  const handleChangeImage = async (e) => {
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
    setPreview(result.secure_url);
    setImgLoading(false);
  };

  // Create page
  const handleCreatePage = () => {
    if (!pageName || !category || !about || !preview) {
      toast.error("Please fill in all fields and upload an image");
      return;
    }

    const newPageRef = push(ref(db, "page/"));
    set(newPageRef, {
      about,
      adminId: user?.uid,
      adminName: user?.displayName || "",
      category,
      image: preview,
      pageName,
    }).then(()=>{
      toast.success("Page Successfully Created")
    })

    // Reset form
    setPageName("");
    setCategory("");
    setAbout("");
    setPreview("");
    setIsModalOpen(false);
  };

  // Fetch user's pages
  useEffect(() => {
    const requestRef = ref(db, "page/");
    onValue(requestRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        const page = item.val();
        if (page.adminId == user?.uid) {
          arr.push({ ...page, id: item.key });
        }
      });
      setPages(arr);
    });
  }, [db]);

  // Fetch message notifications
  useEffect(() => {
    const notificationRef = ref(db, "messagenotification/");
    onValue(notificationRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        arr.push(item.val().reciverid);
      });
      setMsgNotif(arr);
    });
  }, [db]);

  const categories = [
    "All",
    "Business",
    "Technology",
    "Food & Dining",
    "Travel",
    "Fashion",
    "Health & Fitness",
    "Entertainment",
    "Education",
    "Sports",
    "Art & Design",
  ];

  const filteredPages = pages.filter((page) => {
    const matchesSearch =
      page.pageName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      page.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || page.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Pages</h1>
          <p className="text-gray-600">
            Manage your pages and create new ones to connect with your audience
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <BiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
              <input
                type="text"
                placeholder="Search your pages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-200"
              />
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <BiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-200 bg-white"
                >
                  {categories.map((category) => (
                    <option key={category} value={category.toLowerCase()}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <BiPlus className="text-lg" />
                Create Page
              </button>
            </div>
          </div>
        </div>

        {/* Pages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPages.map((page) => (
            <div
              key={page.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="relative">
                <img
                  src={page.image}
                  alt={page.pageName}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 right-4">
                  <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-gray-700">
                    {page.category}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-semibold text-gray-900 mb-2 text-lg">
                  {page.pageName}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {page.about}
                </p>
                <div className="mt-4 flex gap-2">
                  <Link to={`/page-profile/${page.id}`}>
                    <button className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 text-sm font-medium">
                      View Page
                    </button>
                  </Link>
                  <Link to={`/pagemessages/${page.id}`}>
                    <button className="px-4 py-2 relative border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors duration-200 text-sm font-medium">
                      Messages
                      {msgNotif.includes(page.id) && (
                        <span className="w-3 h-3 bg-red-500 rounded-full top-0 right-0 absolute"></span>
                      )}
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredPages.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BiSearch className="text-3xl text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No pages found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>

      {/* Create Page Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">
                Create New Page
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <BiX className="text-2xl text-gray-500" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Page Image Upload */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <BiImage className="text-lg" />
                  Page Image
                </label>
                <input type="file" onChange={handleChangeImage} />
                {preview && (
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-20 h-20 rounded-lg object-cover mt-2"
                  />
                )}
                {imgLoading && (
                  <p className="text-xs text-gray-500">Uploading...</p>
                )}
              </div>

              {/* Page Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Page Name
                </label>
                <input
                  type="text"
                  value={pageName}
                  onChange={(e) => setPageName(e.target.value)}
                  placeholder="Enter your page name..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-200"
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <BiCategory className="text-lg" />
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-200 bg-white"
                >
                  <option value="">Select a category...</option>
                  {categories.slice(1).map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* About Section */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <BiInfoCircle className="text-lg" />
                  About Your Page
                </label>
                <textarea
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  placeholder="Tell people what your page is about..."
                  rows={4}
                  maxLength={500}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-200 resize-none"
                ></textarea>
                <p className="text-xs text-gray-500">
                  {about.length}/500 characters
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleCreatePage}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
              >
                Create Page
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatePages;
