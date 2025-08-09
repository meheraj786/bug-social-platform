import { Plus, X } from 'lucide-react';
import React from 'react'

const StoryModal = ({setStoryText, storyText, addStoryHandler, handleImageSelect, selectedImage, setSelectedImage, setShowAddStoryModal}) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-2xl bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h3 className="text-lg font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Add New Story
          </h3>
          <button
            onClick={()=>setShowAddStoryModal(false)}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Text Area */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Story Text
            </label>
            <textarea
              value={storyText}
              onChange={(e) => setStoryText(e.target.value.slice(0, 30))}
              maxLength={30}
              placeholder="What's happening?"
              className="w-full h-20 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <div className="text-right text-xs text-gray-500 mt-1">
              {storyText.length}/30
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Add Image
            </label>
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                id="imageInput"
              />
              <label
                htmlFor="imageInput"
                className="flex items-center justify-center w-full h-12 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-all cursor-pointer group"
              >
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Plus className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-600 group-hover:text-purple-600">
                    Choose Image
                  </span>
                </div>
              </label>
            </div>
            {selectedImage && (
              <div className="mt-3 relative">
                <img
                  src={selectedImage}
                  alt="Selected"
                  className="w-full h-32 object-cover rounded-lg border border-gray-200"
                />
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-2 right-2 w-6 h-6 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors"
                >
                  <X className="w-3 h-3 text-white" />
                </button>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              onClick={()=>setShowAddStoryModal(false)}
              className="flex-1 py-3 px-4 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button onClick={addStoryHandler} className="flex-1 py-3 px-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl font-medium hover:from-purple-600 hover:to-blue-600 transition-all shadow-lg">
              Share Story
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StoryModal