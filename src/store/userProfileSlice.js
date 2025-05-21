import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

const userProfileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    addProfile: (state, action) => {
      return action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { addProfile } = userProfileSlice.actions;

export default userProfileSlice;
