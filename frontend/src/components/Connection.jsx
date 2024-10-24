import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSuggestedUser, setUser } from "../redux/slice/auth";
import {
  acceptRequest,
  rejectRequest,
} from "../services/operations/Connections";
import { setPendingReq } from "../redux/slice/connections";

export const Connection = ({ request }) => {
  const [acceptLoading, setAcceptLoading] = useState(false);
  const [rejectLoading, setRejectLoading] = useState(false);
  const { user, token, suggestedUser } = useSelector((state) => state?.auth);
  const [status, setStatus] = useState("");
  const { pendingReq } = useSelector((state) => state.connection);

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
      const result = await acceptRequest(request?._id, token);
      dispatch(setUser(result));
      const updatedReq = pendingReq?.filter((req) => req._id !== result._id);
      dispatch(setPendingReq(updatedReq));
      removeSuggestedUser(request._id);
      setStatus("connected");
    } catch (error) {
      console.log(error.message);
    } finally {
      setAcceptLoading(false);
    }
  };

  const handleDeleteReq = async () => {
    try {
      setRejectLoading(true);
      const result = await rejectRequest(request?._id, token);
      const updatedReq = pendingReq?.filter((req) => req._id !== result._id);
      dispatch(setPendingReq(updatedReq));
      removeSuggestedUser(request._id);
      setStatus("rejected");
    } catch (error) {
      console.log(error.message);
    } finally {
      setRejectLoading(false);
    }
  };
  return (
    <div>
      <div className="mt-2 flex items-center justify-between bg-gray-200 shadow-md md:p-4 p-2">
        <div className="flex items-center md:gap-2 gap-1">
          <div>
            <img
              src={request?.sender?.profilePicture || "../../public/avatar.png"}
              alt=""
              className="size-12 rounded-full"
            />
          </div>
          <div>
            <p className="font-semibold text-[10px] md:sm lg:text-lg">{request?.sender?.name}</p>
            <p className="sm:text-xs text-[10px] text-gray-600">{request?.sender?.headline}</p>
          </div>
        </div>
        <div className="flex sm:gap-4 gap-2">
          <button
            onClick={handleAcceptReq}
            className="bg-blue-800 text-xs md:text-sm lg:text-lg text-white sm:px-4 sm:py-2 px-2 py-1 hover:bg-blue-900 transition-all duration-300 rounded-md"
          >
            Accept
          </button>
          <button
            onClick={handleDeleteReq}
            className="bg-red-800 text-xs md:text-sm lg:text-lg text-white px-4 py-2 hover:bg-red-900 transition-all duration-300 rounded-md"
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
};
