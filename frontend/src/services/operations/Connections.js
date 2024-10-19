import toast from "react-hot-toast";
import { apiConnector } from "../apiConnector";
import { connectionEndpoints } from "../apis";

const {
  GET_CONNECTION_STATUS,
  SEND_CONNECTIONS,
  GET_ALL_CONNECTIONS,
  GET_PENDING_REQUESTS,
  ACCEPT_REQUEST,
  REJECT_REQUEST,
} = connectionEndpoints;

export const getConnectionsStatus = async (id, token) => {
  let result;
  try {
    const STATUS_URL = GET_CONNECTION_STATUS.replace(":id", id);
    const response = await apiConnector("GET", STATUS_URL, null, {
      Authorization: `Bearer ${token}`,
    });
    if (response) {
      console.log("RES", response?.data);
      result = response?.data;
    }
  } catch (error) {
    console.log(error.message);
  }
  return result;
};

export const sendConnections = async (id, token) => {
  let result;
  try {
    const URL = SEND_CONNECTIONS.replace(":id", id);
    console.log(URL);
    const response = await apiConnector("POST", URL, null, {
      Authorization: `Bearer ${token}`,
    });
    if (response?.data?.success) {
      toast.success(response?.data?.message);
      result = response?.data?.newConnection;
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
  return result;
};

export const getAllConnections = async (token) => {
  let result;
  try {
    const response = await apiConnector("GET", GET_ALL_CONNECTIONS, null, {
      Authorization: `Bearer ${token}`,
    });
    if (response?.data?.success) {
      result = response?.data?.allConnections;
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
  return result;
};

export const getPendingReq = async (token) => {
  let result;
  try {
    const response = await apiConnector("GET", GET_PENDING_REQUESTS, null, {
      Authorization: `Bearer ${token}`,
    });
    if (response?.data?.success) {
      result = response?.data?.pendingConnections;
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
  return result;
};

export const acceptRequest = async (id, token) => {
  try {
    const ACCEPT_URL = ACCEPT_REQUEST.replace(":id", id);
    const response = await apiConnector("PUT", ACCEPT_URL, null, {
      Authorization: `Bearer ${token}`,
    });
    if (response?.data?.success) {
      toast.success(response?.data?.message);
    }
  } catch (error) {
    toast.error(error.response.data.message);
  }
};

export const rejectRequest = async (id, token) => {
  try {
    const REJECT_URL = REJECT_REQUEST.replace(":id", id);
    const response = await apiConnector("PUT", REJECT_URL, null, {
      Authorization: `Bearer ${token}`,
    });
    if (response?.data?.success) {
      toast.success(response?.data?.message);
    }
  } catch (error) {
    toast.error(error.response.data.message);
  }
};
