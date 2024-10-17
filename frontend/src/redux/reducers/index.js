import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "../slice/auth.js"
import connectionReducer from "../slice/connections.js"
import notificationReducer from "../slice/notification.js"


export const rootReducer = combineReducers({
    auth : authReducer,
    connection : connectionReducer,
    notification : notificationReducer
})