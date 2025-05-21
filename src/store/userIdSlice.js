import { createSlice } from "@reduxjs/toolkit";

const initialState = "";

const userIdSlice = createSlice({
  name: "userId",
  initialState,
  reducers: {
    setuserId: (state, action) => {
      return action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setuserId } = userIdSlice.actions;

export default userIdSlice;
