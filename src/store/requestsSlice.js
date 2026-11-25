import { createSlice } from "@reduxjs/toolkit";

const requestsSlice = createSlice({
  name: "requests",
  initialState: null,
  reducers: {
    setRequests: (state, action) => action.payload,
    removeRequest: (state, action) =>
      state?.filter((r) => r._id !== action.payload),
    clearRequests: () => null,
  },
});

export const { setRequests, removeRequest, clearRequests } =
  requestsSlice.actions;
export default requestsSlice.reducer;
