import React, { useState } from "react";
import { HomeSidebar } from "./HomeSidebar";
import { useSelector } from "react-redux";
import { Notification } from "./Notification";

export const Notifications = () => {
  const { user } = useSelector((state) => state.auth);
  const { notification } = useSelector((state) => state.notification);
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[30%_70%] w-10/12 gap-6">
      <div className="hidden lg:block">
        <HomeSidebar user={user} />
      </div>
      <div className="flex flex-col gap-4 bg-white shadow-md p-4 rounded-md">
        {notification && notification.length > 0 ? (
          notification?.map((noti) => (
            <Notification key={noti._id} singleNotification={noti} />
          ))
        ) : (
          <div>No Notification at the moment</div>
        )}
      </div>
    </div>
  );
};
