import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "../slice/auth.js"
import connectionReducer from "../slice/connections.js"
import notificationReducer from "../slice/notification.js"
import postReducer from "../slice/Post.js"


export const rootReducer = combineReducers({
    auth : authReducer,
    connection : connectionReducer,
    notification : notificationReducer,
    post : postReducer
})