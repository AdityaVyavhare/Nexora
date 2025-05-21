import { configureStore } from "@reduxjs/toolkit";
import userProfileSlice from "./userProfileSlice";
import postsSlice from "./postsSlice";
import userIdSlice from "./userIdSlice";
export const store = configureStore({
  reducer: {
    profile: userProfileSlice.reducer,
    posts: postsSlice.reducer,
    userId: userIdSlice.reducer,
  },
});
