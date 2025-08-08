import { UserMinus } from "lucide-react";
import React from "react";
import { createPortal } from "react-dom";

export default function UnfriendPopup({unfriendPopup,unfriendHandler, name, image}) {
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-md"></div>
      
      <div className="relative bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4 animate-in fade-in zoom-in duration-300">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-t-2xl"></div>
        
        <div className="flex justify-center mb-6">
          {
            image ? <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
            <img src={image} className="w-15 h-15 rounded-full"  alt="" />
          </div>:<div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
            <UserMinus className="w-8 h-8 text-white" />
          </div>
          }
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-3">
          Unfriend {name || "User"}?
        </h2>
        
        <p className="text-gray-600 text-center mb-8 leading-relaxed">
          Are you sure you want to remove this person from your friends list? 
          You can always send them a friend request again later.
        </p>
        
        <div className="flex gap-3">
          <button onClick={()=>unfriendPopup(false)} className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all duration-200 hover:scale-105 active:scale-95">
            Cancel
          </button>
          
          <button onClick={()=>{unfriendHandler()
            unfriendPopup(false)
          }} className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl">
            Unfriend
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}