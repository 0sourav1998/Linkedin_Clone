import { toDate } from "date-fns";
import { apiConnector } from "../apiConnector";
import { notificationEndpoints } from "../apis";
import {toast} from "react-hot-toast"

const { GET_NOTIFICATIONS , MARK_AS_READ , DELETE_NOTIFICATION} = notificationEndpoints;

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


export const markAsRead = async(id,token)=>{
  let result ;
  try {
    const MARL_AS_READ_URL = MARK_AS_READ.replace(":id",id)
    const response = await apiConnector("PUT",MARL_AS_READ_URL,null,{
      Authorization : `Bearer ${token}`
    });
    if(response.data?.success){
      toast.success(response?.data?.message);
      result = response?.data?.updatedNotification
    }
  } catch (error) {
    console.log(error.message)
  }
  return result ;
}

export const deleteNotification = async(id,token)=>{
  let result ;
  try {
    const DELETE_URL = DELETE_NOTIFICATION.replace(":id",id)
    const response = await apiConnector("DELETE",DELETE_URL,null,{
      Authorization : `Bearer ${token}`
    });
    if(response.data?.success){
      toast.success(response?.data?.message);
      result = response?.data?.deletedNotification
    }
  } catch (error) {
    console.log(error.message)
  }
  return result ;
}
