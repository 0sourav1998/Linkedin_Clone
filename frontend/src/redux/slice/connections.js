import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  allConnections: [],
  pendingReq: [],
  connectionStatus : [] ,
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
    setConnectionStatus : (state,action)=>{
      state.connectionStatus = action.payload
    }
  },
});

export const { setAllConnection, setPendingReq ,setConnectionStatus } = connectionSlice.actions;
export default connectionSlice.reducer;
