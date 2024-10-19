import React from "react";
import { useSelector } from "react-redux";
import { HomeSidebar } from "./HomeSidebar";
import { Connection } from "./Connection";
import { UserPlus } from "lucide-react";
import UserCard from "./UserCard";

export const Connections = () => {
  const { pendingReq, allConnections } = useSelector(
    (state) => state.connection
  );
  const { user } = useSelector((state) => state.auth);
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[30%_70%] w-10/12 gap-6">
      <div className="hidden lg:block">
        <HomeSidebar user={user} />
      </div>
      <div className="flex flex-col gap-4 bg-white shadow-md p-4 rounded-md">
        {pendingReq && pendingReq.length > 0 ? (
          pendingReq?.map((request) => (
            <Connection key={request._id} request={request} />
          ))
        ) : (
          <div className="bg-white rounded-lg shadow p-6 text-center mb-6">
            <UserPlus size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              No Connection Requests
            </h3>
            <p className="text-gray-600">
              You don&apos;t have any pending connection requests at the moment.
            </p>
            <p className="text-gray-600 mt-2">
              Explore suggested connections below to expand your network!
            </p>
          </div>
        )}
        {user?.connections?.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">My Connections</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {user?.connections?.map((connection) => (
                <UserCard
                  key={connection._id}
                  user={connection}
                  isConnection={true}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
