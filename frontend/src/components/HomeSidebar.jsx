import { Bell, Home, UserPlus } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

export const HomeSidebar = ({ user }) => {
  return (
    <div className="bg-secondary rounded-lg shadow">
      <div className="p-4 text-center">
        <div
          className="h-16 rounded-t-lg bg-cover bg-center relative"
          style={{
            backgroundImage: `url("${
              user?.bannerImage || "../../public/banner.png"
            }")`,
          }}
        />
        <Link to={`/profile/${user?.username}`}>
          <img
            src={user?.profilePicture || "../../public/avatar.png"}
            className="h-20 w-20 rounded-full mx-auto absolute -mt-12 ml-6"
          />
        </Link>
        <h2 className="text-sm font-semibold mt-12">{user?.name}</h2>
        <p className="text-info text-xs">{user?.headline}</p>
        <p className="text-info text-xs">
          {user?.connections?.length} connections
        </p>
      </div>
      <div className="border-t border-base-100 p-4">
        <nav>
          <ul className="space-y-2">
            <li>
              <Link
                to={"/"}
                className="flex items-center py-2 px-4 hover:bg-primary hover:text-white gap-2"
              >
                <Home size={16} />
                <span className="text-[14px] font-semibold">Home</span>
              </Link>
            </li>
            <li>
              <Link
                to={"/networks"}
                className="flex items-center py-2 px-4 hover:bg-primary hover:text-white gap-3"
              >
                <UserPlus size={20} />
                <span className="text-[14px] font-semibold">My Network</span>
              </Link>
            </li>
            <li>
              <Link
                to={"/notifications"}
                className="flex items-center py-2 px-4 hover:bg-primary hover:text-white gap-3"
              >
                <Bell size={20} />
                <span className="text-[14px] font-semibold">Notifications</span>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      <div className="border-t border-base-100 mt-2 p-4">
        <Link
          to={`/profile/${user?.username}`}
          className="text-sm font-semibold"
        >
          Visit Your Profile
        </Link>
      </div>
    </div>
  );
};
