import { createSlice } from "@reduxjs/toolkit";

const connectionsSlice = createSlice({
  name: "connections",
  initialState: null,
  reducers: {
    setConnections: (state, action) => action.payload,
    clearConnections: () => null,
  },
});

export const { setConnections, clearConnections } = connectionsSlice.actions;
export default connectionsSlice.reducer;
