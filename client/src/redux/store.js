import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer from "./user/userSlice";
import {persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage"; // localStorage

const rootReducer = combineReducers({
  user: userReducer})

const persistConfig = {
  key: "root", // Root key for persistence
  storage, // Use localStorage for persistence
  version: 1, // Versioning for persistence
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    }),
});

export const persistor = persistStore(store);