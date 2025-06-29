import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./user/userSlice";
// import { persistStore, persistReducer } from "redux-persist";
// import storage from "redux-persist/lib/storage"; // localStorage
// import { PERSIST, PURGE } from "redux-persist"; // Add PURGE for logout

// Persist config (only persist user data)
// const userPersistConfig = {
//   key: "user", // Unique key for user slice
//   storage,
//   version: 1,
// };

// Persist only the user reducer
// const persistedUserReducer = persistReducer(userPersistConfig, userReducer);

export const store = configureStore({
  reducer: {
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    }),
});

// export const persistor = persistStore(store);