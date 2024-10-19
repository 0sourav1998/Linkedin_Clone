import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  allConnections: [],
  pendingReq: [],
};

const connectionSlice = createSlice({
  name: "connection",
  initialState,
  reducers: {
    setAllConnection: (state, action) => {
      state.allConnections = action.payload;
    },
    setPendingReq: (state, action) => {
      state.pendingReq = action.payload;
    },
  },
});

export const { setAllConnection, setPendingReq } = connectionSlice.actions;
export default connectionSlice.reducer;
