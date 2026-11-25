import { createSlice } from "@reduxjs/toolkit";

const feedSlice = createSlice({
  name: "feed",
  initialState: null,
  reducers: {
    setFeed: (state, action) => action.payload,
    removeFromFeed: (state, action) =>
      state?.filter((u) => u._id !== action.payload),
    clearFeed: () => null,
  },
});

export const { setFeed, removeFromFeed, clearFeed } = feedSlice.actions;
export default feedSlice.reducer;
