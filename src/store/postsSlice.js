import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    setPosts: (state, action) => {
      return action.payload;
    },
    addPost: (state, action) => {
      state.unshift(action.payload);
    },
    toggleLike: (state, action) => {
      const updatedPost = action.payload;
      const index = state.findIndex((p) => p.id === updatedPost.id);
      if (index !== -1) {
        state[index] = updatedPost;
      }
    },
    toggleSave: (state, action) => {
      const { postId } = action.payload;
      const postIndex = state.findIndex((post) => post.id === postId);

      if (postIndex !== -1) {
        state[postIndex].isSaved = !state[postIndex].isSaved;
      }
    },
  },
});

export const { setPosts, addPost, toggleLike, toggleSave } = postsSlice.actions;
export default postsSlice;
