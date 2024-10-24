import React, { useEffect, useState } from "react";
import { getNotifications } from "../services/operations/Notification";
import { setNotification } from "../redux/slice/notification";
import { useDispatch, useSelector } from "react-redux";
import logo from "../assets/small-logo.png";
import { Home, Users, Bell, LogOut, User, Search } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getAllUsersForSearch, logout } from "../services/operations/Auth";
import { getPendingReq } from "../services/operations/Connections";
import { setPendingReq } from "../redux/slice/connections";
import { setAllUser, setSearchResult } from "../redux/slice/auth";

export const Navbar = () => {
  const { token, user, suggestedUser, allUser } = useSelector(
    (state) => state.auth
  );
  const { pendingReq } = useSelector((state) => state.connection);
  const { notification } = useSelector((state) => state.notification);
  const [search, setSearch] = useState("");
  const [searchClick, setSearchClick] = useState(false);

  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const filterSearchResult =
    search.length > 0
      ? allUser?.filter((user) =>
          user?.name?.toLowerCase().startsWith(search.toLowerCase())
        )
      : [];

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

  useEffect(() => {
    setSearch("");
  }, [location.pathname]);

  return (
    <div className="bg-white p-2 border-b relative">
      <div className="max-w-7xl flex items-center sm:justify-between justify-center mx-auto">
        <div className="hidden sm:block">
          <img src={logo} alt="logo" className="h-10 w-10" />
        </div>

        {token && (
          <div className="lg:flex flex-row gap-2 w-1/2 hidden">
            <input
              className="w-full p-2 rounded-md outline-none focus-within:ring-2 focus-within:to-blue-500 bg-gray-100"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onClick={() => setSearchClick(true)}
            />
          </div>
        )}

        {token ? (
          <div className="flex items-center justify-between lg:gap-6 md:gap-5 sm:gap-5 gap-1">
            <div className="flex lg:hidden flex-row gap-2 w-1/2 md:w-full items-center">
              <input
                className="w-full p-2 rounded-md outline-none focus-within:ring-2 focus-within:to-blue-500 bg-gray-100"
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onClick={() => setSearchClick(true)}
              />
            </div>
            <Link to={"/"} className="flex flex-col items-center">
              <Home className="hover:text-blue-500 transition-all duration-300 cursor-pointer lg:size-6 size-5" />
              <span className="lg:text-lg hidden lg:block text-info">Home</span>
            </Link>
            <Link
              to={"/networks"}
              className="flex flex-col items-center relative"
            >
              <Users className="hover:text-blue-500 transition-all duration-300 cursor-pointer lg:size-6 size-5" />
              <span className="lg:text-lg hidden lg:block text-info">My Network</span>
              {unreadConnection !== 0 && (
                <span className="absolute sm:-right-2 md:-right-2 lg:right-7 -right-2 -top-1 size-4 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center">
                  {unreadConnection}
                </span>
              )}
            </Link>
            <Link to={"/notifications"}>
              <div className="flex flex-col items-center relative">
                <Bell className="hover:text-blue-500 transition-all duration-300 cursor-pointer lg:size-6 size-5" />
                <span className="lg:text-lg hidden lg:block text-info">Notification</span>
                {unreadNotification !== 0 && (
                  <span className="absolute sm:-right-2 md:-right-2 lg:right-7 -right-2 -top-1 size-4 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center">
                    {unreadNotification}
                  </span>
                )}
              </div>
            </Link>
            <Link to={`profile/${user?.username}`}>
              <div className="flex flex-col items-center relative">
                <User className="hover:text-blue-500 transition-all duration-300 cursor-pointer lg:size-6 size-5" />
                <span className="lg:text-lg hidden lg:block text-info">Me</span>
              </div>
            </Link>
            <div className="flex flex-col items-center">
              <LogOut
                onClick={handleLogout}
                className="hover:text-blue-500 transition-all duration-300 cursor-pointer lg:size-6 size-5"
              />
              <span className="lg:text-lg hidden lg:block text-info">Logout</span>
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
      {filterSearchResult?.length > 0 && (
        <div className="bg-white shadow-md absolute z-10 left-[17%] w-1/3 p-2">
          {filterSearchResult.map((user) => (
            <div
              key={user.id}
              className="flex px-6 py-2 gap-4 items-center border-b"
            >
              <Link to={`/profile/${user?.username}`}>
                <img
                  src={user.profilePicture || "../assets/avatar.png"}
                  className="w-10 h-10 rounded-full"
                />
              </Link>
              <span>{user?.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
