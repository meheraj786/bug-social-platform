import { Trash2 } from "lucide-react";
import React from "react";
import { createPortal } from "react-dom";

export default function DeleteMessagePopup({msgDeleteHandler, id, setMsgDeletePop}) {
  return  createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Blurred Background Overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-md"></div>
      
      {/* Popup Container */}
      <div className="relative bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4 animate-in fade-in zoom-in duration-300">
        {/* Purple-Blue Gradient Top Border */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-t-2xl"></div>
        
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-lg">
            <Trash2 className="w-8 h-8 text-white" />
          </div>
        </div>
        
        {/* Title */}
        <h2 className="text-2xl font-bold text-base-content text-center mb-3">
          Delete Message?
        </h2>
        
        {/* Message */}
        <p className="text-base-content/70 text-center mb-8 leading-relaxed">
          Are you sure you want to delete this message? This action cannot be undone 
          and the message will be permanently removed.
        </p>
        
        {/* Buttons */}
        <div className="flex gap-3">
          {/* Cancel Button */}
          <button onClick={()=>setMsgDeletePop(false)} className="flex-1 px-6 py-3 bg-base-200 hover:bg-base-300 text-base-content font-semibold rounded-xl transition-all duration-200 hover:scale-105 active:scale-95">
            Cancel
          </button>
          
          {/* Delete Button */}
          <button onClick={()=>{msgDeleteHandler(id)
            setMsgDeletePop(false)
          }} className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl">
            Delete
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}