import { configureStore } from '@reduxjs/toolkit'
import authSlice from './authSlice'
import homeSlice from './homeSlice'

export const store = configureStore({
  reducer: {
    auth: authSlice,
    home: homeSlice,
  }
})