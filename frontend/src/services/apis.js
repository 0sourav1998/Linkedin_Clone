const BASE_URL = import.meta.env.VITE_BASE_URL;

export const authEndpoints = {
  SIGNUP: BASE_URL + `/api/v1/user/signup`,
  LOGIN: BASE_URL + `/api/v1/user/login`,
  SUGGESTED_USER: BASE_URL + `/api/v1/user/suggestedUsers`,
  GET_CURRENT_USER: BASE_URL + `/api/v1/user/:username`,
  UPDATE_PROFILE: BASE_URL + `/api/v1/user/update`,
  DELETE_EXP: BASE_URL + `/api/v1/user/delete/exp/:id`,
  DELETE_EDU: BASE_URL + `/api/v1/user/delete/edu/:id`,
  DELETE_SKILL : BASE_URL + `/api/v1/user/delete/skill/:skill`,
  GET_ALL_FOR_SEARCH : BASE_URL +`/api/v1/user/getAllUser`
};

export const connectionEndpoints = {
  GET_CONNECTIONS: BASE_URL + `/api/v1/connection/userConnections`,
  GET_CONNECTION_STATUS: BASE_URL + `/api/v1/connection/status/:id`,
  SEND_CONNECTIONS: BASE_URL + `/api/v1/connection/request/:id`,
  GET_ALL_CONNECTIONS: BASE_URL + `/api/v1/connection/allConnections`,
  GET_PENDING_REQUESTS: BASE_URL + `/api/v1/connection/getPendingRequest`,
  ACCEPT_REQUEST: BASE_URL + `/api/v1/connection/accept/:id`,
  REJECT_REQUEST: BASE_URL + `/api/v1/connection/reject/:id`,
};

export const notificationEndpoints = {
  GET_NOTIFICATIONS: BASE_URL + `/api/v1/notification/getAll`,
  MARK_AS_READ: BASE_URL + `/api/v1/notification/:id`,
  DELETE_NOTIFICATION: BASE_URL + `/api/v1/notification/delete/:id`,
};

export const postEndpoints = {
  ALL_POSTS: BASE_URL + `/api/v1/post/getFeeds`,
  CREATE_POST: BASE_URL + `/api/v1/post/create`,
  DELETE_POST: BASE_URL + `/api/v1/post/delete`,
  LIKE_POST: BASE_URL + `/api/v1/post/:id/like`,
  ADD_COMMENT: BASE_URL + `/api/v1/post/:id/comment`,
  FETCH_SINGLE_POST: BASE_URL + `/api/v1/post/post/:id`,
};
