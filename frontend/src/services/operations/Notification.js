import { apiConnector } from "../apiConnector";
import { notificationEndpoints } from "../apis";

const { GET_NOTIFICATIONS } = notificationEndpoints;

export const getNotifications = async (token) => {
  let result;
  try {
    const response = await apiConnector("GET", GET_NOTIFICATIONS, null, {
      Authorization: `Bearer ${token}`,
    });
    if (response?.data?.success) {
      result = response?.data?.notification;
    }
  } catch (error) {
    console.log(error.message);
  }
  return result;
};
