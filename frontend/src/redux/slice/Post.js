import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  allPosts : [] ,
  post : null
};

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    setAllPosts: (state, action) => {
      state.allPosts = action.payload;
    },
    setPost : (state,action)=>{
      state.post = action.payload
    }
  },
});

export const { setAllPosts , setPost} = postSlice.actions;
export default postSlice.reducer;
