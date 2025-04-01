import { configureStore } from "@reduxjs/toolkit";
import userReducer from  './user/userSlice'// Adjust the path as necessary

export const store = configureStore({
  reducer: {user: userReducer},
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
