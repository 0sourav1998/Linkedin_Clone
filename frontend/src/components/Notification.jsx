import {
  Eye,
  Loader,
  MessageCircle,
  ThumbsUp,
  Trash2,
  UserCheck,
} from "lucide-react";
import React, { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import {
  deleteNotification,
  markAsRead,
} from "../services/operations/Notification";
import { useDispatch, useSelector } from "react-redux";
import { setNotification } from "../redux/slice/notification";
import { Link } from "react-router-dom";
import avatar from "../assets/avatar.png"

export const Notification = ({ singleNotification }) => {
  const { token } = useSelector((state) => state.auth);
  const { notification } = useSelector((state) => state.notification);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const NotificationIcon = () => {
    if (singleNotification.type === "Like") {
      return <ThumbsUp className="sm:size-6 size-5 text-blue-500" />;
    } else if (singleNotification.type === "Comment") {
      return <MessageCircle className="sm:size-6 size-5 text-green-500" />;
    } else if (singleNotification.type === "ConnectionRequest") {
      return <UserCheck className="sm:size-6 size-5 text-purple-500" />;
    }
    return null; 
  };

  const NotificationTitle = () => {
    if (singleNotification.type === "Like") {
      return (
        <p className="sm:text-sm text-[10px]">
          <strong>{singleNotification?.relatedUser?.name}</strong> Liked Your
          Post
        </p>
      );
    } else if (singleNotification.type === "Comment") {
      return (
        <p className="sm:text-sm text-[10px]">
          <strong>{singleNotification?.relatedUser?.name}</strong> Commented On
          Your Post
        </p>
      );
    } else if (singleNotification.type === "ConnectionRequest") {
      return (
        <p className="sm:text-sm text-[10px]">
          <strong>{singleNotification?.relatedUser?.name}</strong> Accepts Your
          Connection Request
        </p>
      );
    }
    return null;
  };

  const NotificationForRelatedPost = () => {
    if (
      singleNotification.type === "Like" ||
      singleNotification.type === "Comment"
    ) {
      return (
        singleNotification?.relatedPost?.image && (
          <img
            src={singleNotification?.relatedPost?.image}
            className="size-12 rounded-md"
          />
        )
      );
    }
    return null;
  };

  const handleMarkAsRead = async () => {
    try {
      setLoading(true);
      const result = await markAsRead(singleNotification._id, token);
      const updateNotification = notification?.map((noti) =>
        noti._id === result._id ? result : noti
      );
      dispatch(setNotification(updateNotification));
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteNoti = async () => {
    try {
      const result = await deleteNotification(singleNotification._id, token);
      if (result) {
        const updatedNotification = notification?.filter(
          (noti) => noti._id !== result._id
        );
        dispatch(setNotification(updatedNotification));
      }
    } catch (error) {
      console.log(error);
    }
  };
  const notificationActions = () => {
    if (singleNotification.read === false) {
      return (
        <div className="flex sm:gap-3 gap-1.5">
          {loading ? (
            <Loader className="size-6 animate-spin p-1 rounded-full" />
          ) : (
            <Eye
              onClick={handleMarkAsRead}
              className="sm:size-6 size-4 text-blue-600 hover:text-blue-800 transition-all duration-300 cursor-pointer bg-white sm:p-1 p-0.5 rounded-full"
            />
          )}

          <Trash2
            onClick={deleteNoti}
            className="sm:size-6 size-4 text-red-600 hover:text-red-900 transition-all duration-300 cursor-pointer bg-white sm:p-1 p-0.5  rounded-full"
          />
        </div>
      );
    } else {
      return (
        <Trash2
          onClick={deleteNoti}
          className="sm:size-6 size-4 text-red-600 hover:text-red-900 transition-all duration-300 cursor-pointer bg-white sm:p-1 p-0.5 rounded-full"
        />
      );
    }
  };

  return (
    <div
      className={`flex flex-row justify-between bg-gray-200 shadow-md sm:p-4 p-2 ${
        singleNotification?.read === false
          ? "border border-red-600"
          : "border border-blue-600"
      }`}
    >
      <div className="flex items-center gap-4">
        <div className="sm:size-12 size-10 rounded-full">
          <Link to={`/profile/${singleNotification?.relatedUser?.username}`}>
          <img
            src={
              singleNotification?.relatedUser?.profilePicture ||
              avatar
            }
            className="rounded-full"
            alt=""
          />
          </Link>
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex flex-row gap-2 items-center">
            {NotificationIcon()}
            {NotificationTitle()}
          </div>
          <div className="">
            <p className="text-xs">
              {formatDistanceToNow(new Date(singleNotification?.createdAt), {
                addSuffix: true,
              })}
            </p>
          </div>
          <div>
            <Link to={`/post/${singleNotification?.relatedPost?._id}`}>
              {NotificationForRelatedPost()}
            </Link>
          </div>
        </div>
      </div>
      <div>{notificationActions()}</div>
    </div>
  );
};
