import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: null,
  suggestedUser : [] ,
  currentUser : null ,
  profile : null ,
  allUser : [] ,
  searchResult : null
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setSuggestedUser : (state,action)=>{
      state.suggestedUser = action.payload;
    },
    setCurrentUser : (state,action)=>{
      state.currentUser = action.payload
    } ,
    setProfile : (state,action)=>{
      state.profile = action.payload;
    } ,
    setAllUser : (state,action)=>{
      state.allUser = action.payload
    } ,
    setSearchResult : (state,action)=>{
      state.searchResult = action.payload
    }
  },
});

export const { setToken, setUser ,setSuggestedUser , setCurrentUser , setProfile , setAllUser , setSearchResult} = authSlice.actions;
export default authSlice.reducer;
