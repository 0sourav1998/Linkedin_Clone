import React, { useEffect } from "react";
import { getNotifications } from "../services/operations/Notification";
import { setNotification } from "../redux/slice/notification";
import { useDispatch, useSelector } from "react-redux";
import logo from "../../public/small-logo.png";
import { Home, Users, Bell, LogOut } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { logout } from "../services/operations/Auth";
import { getPendingReq } from "../services/operations/Connections";
import { setPendingReq } from "../redux/slice/connections";

export const Navbar = () => {
  const { token, user } = useSelector((state) => state.auth);
  const { pendingReq } = useSelector((state) => state.connection);
  const { notification } = useSelector((state) => state.notification);
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    try {
      dispatch(logout(navigate));
    } catch (error) {
      console.log(error.message);
    }
  };

  const fetchPendingConnection = async () => {
    try {
      const response = await getPendingReq(token);
      console.log("res", response);
      dispatch(setPendingReq(response));
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

  const unreadNotification = notification?.filter(
    (notif) => !notif.read
  ).length;
  const unreadConnection = pendingReq?.length;

  useEffect(() => {
    if (token) {
      fetchPendingConnection();
      fetchNotification();
    }
  }, [token, user, location.pathname]);

  return (
    <div className="bg-white p-2 border-b">
      <div className="max-w-7xl flex justify-between mx-auto">
        <div>
          <img src={logo} alt="logo" className="h-10 w-10" />
        </div>
        {token ? (
          <div className="flex flex-row gap-6">
            <Link to={"/"} className="flex flex-col items-center">
              <Home className="hover:text-blue-500 transition-all duration-300 cursor-pointer" />
              <span>Home</span>
            </Link>
            <Link
              to={"/networks"}
              className="flex flex-col items-center relative"
            >
              <Users className="hover:text-blue-500 transition-all duration-300 cursor-pointer" />
              <span>My Network</span>
              {unreadConnection !== 0 && (
                <span className="absolute right-5 -top-1 size-4 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center">
                  {unreadConnection}
                </span>
              )}
            </Link>
            <Link to={"/notifications"}>
              <div className="flex flex-col items-center relative">
                <Bell className="hover:text-blue-500 transition-all duration-300 cursor-pointer" />
                <span>Notification</span>
                {unreadNotification !== 0 && (
                  <span className="absolute right-5 -top-1 size-4 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center">
                    {unreadNotification}
                  </span>
                )}
              </div>
            </Link>
            <div className="flex flex-col items-center">
              <LogOut
                onClick={handleLogout}
                className="hover:text-blue-500 transition-all duration-300 cursor-pointer"
              />
              <span>Logout</span>
            </div>
          </div>
        ) : (
          <div className="flex gap-4">
            <Link to={"/signup"}>
              <button className="bg-green-500 text-white p-2 hover:bg-green-600 transition-all duration-300 rounded-md">
                Signup
              </button>
            </Link>
            <Link to={"/login"}>
              <button className="bg-blue-500 text-white p-2 hover:bg-blue-600 transition-all duration-300 rounded-md">
                Login
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
