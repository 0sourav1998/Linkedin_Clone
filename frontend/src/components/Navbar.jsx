import React, { useEffect } from "react";
import { getNotifications } from "../services/operations/Notification";
import { setNotification } from "../redux/slice/notification";
import { setConnection } from "../redux/slice/connections";
import { getConnections } from "../services/operations/Connections";
import { useDispatch, useSelector } from "react-redux";
import logo from "../../public/small-logo.png";
import { Home, Users, Bell, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../services/operations/Auth";

export const Navbar = () => {
  const { token } = useSelector((state) => state.auth);
  const { connection } = useSelector((state) => state.connection);
  const { notification } = useSelector((state) => state.notification);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogout = () => {
    try {
      dispatch(logout(navigate));
    } catch (error) {
      console.log(error.message);
    }
  };
  const fetchConnection = async () => {
    try {
      const response = await getConnections(token);
      console.log("res", response);
      dispatch(setConnection(response));
    } catch (error) {
      console.log(error.message);
    }
  };
  const fetchNotification = async () => {
    try {
      const response = await getNotifications(token);
      dispatch(setNotification(response));
    } catch (error) {
      console.log(error.message);
    }
  };
  useEffect(() => {
    fetchConnection();
    fetchNotification();
  }, [token]);
  const unreadNotification = ["1","2","3"]
  const unreadConnection = connection?.length;

  return (
    <div className="bg-white p-2 border-b">
      <div className="max-w-7xl flex justify-between mx-auto">
        <div>
          <img src={logo} alt="logo" className="h-10 w-10" />
        </div>
        <div className="flex flex-row gap-6">
          <Link to={"/"} className="flex flex-col items-center">
            <Home className="hover:text-blue-500 transition-all duration-300 cursor-pointer" />
            <span>Home</span>
          </Link>
          <Link to={"/network"} className="flex flex-col items-center relative">
            <Users className="hover:text-blue-500 transition-all duration-300 cursor-pointer" />
            <span>My Network</span>
            {unreadConnection && (
              <span className="absolute right-5 -top-1 size-4 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center">
                {unreadConnection}
              </span>
            )}
          </Link>
          <div className="flex flex-col items-center relative">
            <Bell className="hover:text-blue-500 transition-all duration-300 cursor-pointer" />
            <span>Notification</span>
            {unreadNotification.length !== 0 && (
              <span className="absolute right-5 -top-1 size-4 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center">
                {unreadNotification?.length}
              </span>
            )}
          </div>
          <div className="flex flex-col items-center">
            <LogOut
              onClick={handleLogout}
              className="hover:text-blue-500 transition-all duration-300 cursor-pointer"
            />
            <span>Logout</span>
          </div>
        </div>
      </div>
    </div>
  );
};
