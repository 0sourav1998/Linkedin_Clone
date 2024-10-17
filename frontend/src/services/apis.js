const BASE_URL = import.meta.env.VITE_BASE_URL 
console.log(BASE_URL);

export const authEndpoints = {
    SIGNUP : BASE_URL + `/api/v1/user/signup`,
    LOGIN : BASE_URL + `/api/v1/user/login`
}

export const connectionEndpoints = {
    GET_CONNECTIONS : BASE_URL + `/api/v1/connection/getAll`
}

export const notificationEndpoints = {
    GET_NOTIFICATIONS : BASE_URL + `/api/v1/notification/getAll`
}