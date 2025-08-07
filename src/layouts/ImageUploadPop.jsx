import React, { useState } from 'react'
import { createPortal } from 'react-dom';
import { FaImage, FaPaperPlane, FaTimes } from 'react-icons/fa';

const ImageUploadPop = ({setImgUploadPop, setMsgImg,setMessage, message, sentMessageHandler }) => {
  const coudinaryApi = import.meta.env.VITE_CLOUDINARY_API;
  const [preview, setPreview]= useState("")
  const [loading, setLoading]= useState(false)
    const handleChangeImage = async (e) => {
    setLoading(true);
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


    setPreview(result.secure_url)
    setMsgImg(result.secure_url)
    setLoading(false);
  };
return createPortal(
  <div className='w-full flex justify-center items-center h-full fixed top-0 left-0 z-[888] bg-black/40 backdrop-blur-sm'>
    <div className='relative max-w-md w-full mx-4'>
      {/* Close Button */}
      <button 
        className='absolute -top-4 -right-4 z-10 bg-white hover:bg-gray-50 text-gray-700 p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110'
        onClick={() => setImgUploadPop(false)}
      >
        <FaTimes className="text-lg" />
      </button>

      {/* Main Container */}
      <div className='bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden'>
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 p-6 text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Share Your Photo</h2>
          <p className="text-purple-100 text-sm">Choose an image to send</p>
        </div>

        {/* Content */}
        <div className='p-6'>
          {/* Upload Area */}
          {!preview && (
            <div className="space-y-6">
              <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center bg-gradient-to-br from-purple-50/50 to-blue-50/50 hover:from-purple-100/50 hover:to-blue-100/50 transition-all duration-300">
                <label className="flex flex-col items-center gap-4 cursor-pointer group">
                  <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-4 rounded-full group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <FaImage className="text-2xl text-white" />
                  </div>
                  <div>
                    <span className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                      Add Photo
                    </span>
                    <p className="text-sm text-gray-500 mt-1">Click to browse or drag & drop</p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleChangeImage}
                  />
                </label>
              </div>
              
              {/* Choose Image Button */}
              <label className="block w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-xl cursor-pointer transition-colors duration-200 text-center shadow-lg hover:shadow-xl">
                <div className="flex items-center justify-center gap-2">
                  <FaImage className="text-base" />
                  <span>Choose Image</span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleChangeImage}
                />
              </label>
            </div>
          )}

          {/* Preview Area */}
          {preview && (
            <div className="space-y-4">
              <div className="relative group/preview">
                <div className="relative overflow-hidden rounded-2xl shadow-xl border-2 border-purple-200">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full max-h-80 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover/preview:opacity-100 transition-opacity duration-300"></div>
                </div>
                
                {/* Remove Button */}
                <button 
                  className="absolute top-3 right-3 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white p-2 rounded-full shadow-lg opacity-0 group-hover/preview:opacity-100 transition-all duration-300 hover:scale-110"
                  onClick={()=>{
                    setMsgImg("")
                    setPreview("")
                  }}
                >
                  <FaTimes className="w-4 h-4" />
                </button>

                {/* Info Badge */}
                <div className="absolute bottom-3 left-3 bg-gradient-to-r from-purple-600/90 to-blue-600/90 backdrop-blur-sm text-white px-4 py-2 rounded-full text-xs font-medium shadow-lg border border-white/20">
                  Ready to send
                </div>
              </div>

              {/* Caption Input */}
              <div className="space-y-3">
                <input 
                  type="text" 
                  placeholder="Add a caption..."
                  value={message}
                  onChange={(e)=>setMessage(e.target.value)}
                  className='w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 text-gray-700 placeholder-gray-400 bg-gray-50 focus:bg-white'
                />
                
                {/* Action Buttons */}
                <div className='flex w-full gap-3'>
                  <label className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-xl cursor-pointer transition-colors duration-200 text-center border border-gray-300">
                    <div className="flex items-center justify-center gap-2">
                      <FaImage className="text-base" />
                      <span>Change</span>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={()=>setMsgImg("")}
                    />
                  </label>

                  <button 
                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
                    onClick={()=>sentMessageHandler()}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <FaPaperPlane className="text-base" />
                      <span>Send</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>,
  document.body
);
}

export default ImageUploadPop