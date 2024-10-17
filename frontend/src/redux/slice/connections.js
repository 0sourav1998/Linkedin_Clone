import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  connections: []
};

const connectionSlice = createSlice({
  name: "connection",
  initialState,
  reducers: {
    setConnection: (state, action) => {
      state.connections = action.payload;
    }
  },
});

export const { setConnection } = connectionSlice.actions;
export default connectionSlice.reducer;
