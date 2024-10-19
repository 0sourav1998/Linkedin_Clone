import React, { useEffect, useState } from "react";
import {
  acceptRequest,
  getConnectionsStatus,
  rejectRequest,
  sendConnections,
} from "../services/operations/Connections";
import { useDispatch, useSelector } from "react-redux";
import { Check, Clock, Loader, UserCheck, X } from "lucide-react";
import { setSuggestedUser } from "../redux/slice/auth";

export const UserSuggested = ({ suggested }) => {
  const { user, token } = useSelector((state) => state?.auth);
  const { allConnections } = useSelector((state) => state.connection);
  const [status, setStatus] = useState("");
  const [acceptLoading, setAcceptLoading] = useState(false);
  const { suggestedUser } = useSelector((state) => state.auth);
  const [rejectLoading,setRejectLoading] = useState(false)
  const dispatch = useDispatch();

  const removeSuggestedUser = (userId) => {
    const updatedSuggestedUsers = suggestedUser.filter(
      (user) => user._id !== userId
    );
    dispatch(setSuggestedUser(updatedSuggestedUsers));
  };

  const handleAcceptReq = async () => {
    try {
      setAcceptLoading(true);
      await acceptRequest(connectionWithSuggested?._id, token);
      removeSuggestedUser(suggested._id);
      setStatus("connected");
    } catch (error) {
      console.log(error.message);
    } finally {
      setAcceptLoading(false);
    }
  };

  const handleDeleteReq = async () => {
    try {
      setRejectLoading(true)
      await rejectRequest(connectionWithSuggested?._id, token);
      removeSuggestedUser(suggested._id);
      setStatus("rejected");
    } catch (error) {
      console.log(error.message);
    }finally{
      setRejectLoading(false)
    }
  };

  const connectionWithSuggested = allConnections?.find(
    (connection) =>
      (connection?.receiver?._id === suggested?._id &&
        connection?.sender._id === user?._id) ||
      (connection?.sender?._id === suggested?._id &&
        connection?.receiver?._id === user?._id)
  );

  const isSender = connectionWithSuggested?.sender._id === user._id;
  const isReceiver = connectionWithSuggested?.receiver._id === user._id;

  const fetchConnectionStatus = async () => {
    try {
      const result = await getConnectionsStatus(suggested._id, token);
      setStatus(result?.status);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchConnectionStatus();
  }, [suggested._id, suggestedUser, token]);

  const sendConnection = async (id) => {
    await sendConnections(id, token);
    setStatus("pending");
  };

  const renderButton = () => {
    if (connectionWithSuggested) {
      if (
        connectionWithSuggested.status === "pending" ||
        status === "pending"
      ) {
        if (isReceiver) {
          return (
            <div className="flex gap-2">
              {acceptLoading ? (
                <Loader className="bg-white-500 text-black size-4 animate-spin rounded-full" />
              ) : (
                <button
                  onClick={handleAcceptReq}
                  className="bg-green-500 hover:bg-green-700 transition-all duration-300 rounded-full text-white px-4 py-2 text-xs"
                >
                  <Check className="size-4" />
                </button>
              )}
              <button
                onClick={handleDeleteReq}
                className="bg-red-500 hover:bg-red-700 transition-all duration-300 rounded-full text-white px-4 py-2 text-xs"
              >
                <X className="size-4" />
              </button>
            </div>
          );
        }

        return (
          <div className="bg-red-500 rounded-2xl text-white px-4 py-2 text-xs flex items-center gap-2">
            <Clock className="size-4 mr-1" />
            Pending
          </div>
        );
      }

      if (connectionWithSuggested.status === "connected") {
        return <div className="text-green-500">Connected</div>;
      }
    }

    if (!suggested?.connections?.includes(user?._id)) {
      return (
        <button
          onClick={() => sendConnection(suggested._id)}
          className="bg-blue-500 hover:bg-blue-700 rounded-2xl text-white px-4 py-2 text-xs flex items-center gap-2 transition-all duration-300"
        >
          <UserCheck className="size-4 mr-1" /> Connect
        </button>
      );
    }
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <img
          src={suggested?.profilePicture || "../../public/avatar.png"}
          className="size-12 rounded-full"
        />
        <div className="flex flex-col">
          <p>{suggested?.name}</p>
          <p className="text-xs text-info">{suggested?.headline}</p>
        </div>
      </div>
      <div>{renderButton()}</div>
    </div>
  );
};
