import React, { useEffect } from "react";
import { getConnections } from "../services/operations/Connections";
import { getNotifications } from "../services/operations/Notification";
import { useDispatch, useSelector } from "react-redux";
import { setNotification } from "../redux/slice/notification";
import { setConnection } from "../redux/slice/connections";

export const HomePage = () => {

  return <div>HomePage</div>;
};
