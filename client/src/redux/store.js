import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./user/userSlice"; // Adjust the path as necessary
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // default is localStorage

// Set up persist configuration
const persistConfig = {
  key: "root",
  storage, // or you can use sessionStorage if you prefer
  version: 1,
};

const persistedReducer = persistReducer(persistConfig, userReducer);

export const store = configureStore({
  reducer: {
    user: persistedReducer, // Persist the user reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
