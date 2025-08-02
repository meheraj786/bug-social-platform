import { createSlice } from "@reduxjs/toolkit";


export const roomSlice= createSlice({
  name: "chatRoom",
  initialState: {
    value: localStorage.getItem("room") ? JSON.parse(localStorage.getItem("room")) : null
  },
  reducers:{
    roomUser: (state,action)=>{
      state.value= action.payload
      localStorage.setItem("room", JSON.stringify(action.payload))
    }
  }
})

export default roomSlice.reducer
export const {roomUser}= roomSlice.actions