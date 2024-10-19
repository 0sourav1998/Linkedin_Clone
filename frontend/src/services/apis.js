const BASE_URL = import.meta.env.VITE_BASE_URL 
console.log(BASE_URL);

export const authEndpoints = {
    SIGNUP : BASE_URL + `/api/v1/user/signup`,
    LOGIN : BASE_URL + `/api/v1/user/login`,
    SUGGESTED_USER : BASE_URL + `/api/v1/user/suggestedUsers`
}

export const connectionEndpoints = {
    GET_CONNECTIONS : BASE_URL + `/api/v1/connection/userConnections`,
    GET_CONNECTION_STATUS : BASE_URL + `/api/v1/connection/status/:id`,
    SEND_CONNECTIONS : BASE_URL + `/api/v1/connection/request/:id`,
    GET_ALL_CONNECTIONS : BASE_URL + `/api/v1/connection/allConnections`,
    GET_PENDING_REQUESTS : BASE_URL + `/api/v1/connection/getPendingRequest` ,
    ACCEPT_REQUEST : BASE_URL + `/api/v1/connection/accept/:id`,
    REJECT_REQUEST : BASE_URL + `/api/v1/connection/reject/:id`
}

export const notificationEndpoints = {
    GET_NOTIFICATIONS : BASE_URL + `/api/v1/notification/getAll`
}

export const postEndpoints = {
    ALL_POSTS : BASE_URL + `/api/v1/post/getFeeds`,
    CREATE_POST : BASE_URL + `/api/v1/post/create`,
    DELETE_POST : BASE_URL + `/api/v1/post/delete`,
    LIKE_POST : BASE_URL + `/api/v1/post/:id/like`,
    ADD_COMMENT : BASE_URL + `/api/v1/post//:id/comment`
} 