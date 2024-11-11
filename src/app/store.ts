import { configureStore } from "@reduxjs/toolkit";
import { enableMapSet } from 'immer';
import {
  persistStore,
} from "redux-persist";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import rootReducer from "./reducers";
import { customMiddleware } from "./middleware";

const persistConfig = {
  key: "mgroot",
  storage,
  whitelist: ["app","categories","profile","sidebar"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer)
enableMapSet()
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
    serializableCheck:false
    }).concat(customMiddleware),
});

export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
