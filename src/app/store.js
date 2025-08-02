import { configureStore } from '@reduxjs/toolkit'
import  userReducer  from '../features/user/userSlice'
import roomReducer from '../features/chatRoom/chatRoom'

export const store = configureStore({
  reducer: {
    user: userReducer,
    roomUser: roomReducer,
  },
})
