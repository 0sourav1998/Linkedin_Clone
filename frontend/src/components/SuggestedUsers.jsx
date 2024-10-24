import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { UserSuggested } from "./UserSuggested";
import { getAllConnections } from "../services/operations/Connections";
import { setAllConnection } from "../redux/slice/connections";

export const SuggestedUsers = () => {
  const { suggestedUser, token } = useSelector((state) => state?.auth);
  const dispatch = useDispatch();

  const allConnections = async () => {
    try {
      const result = await getAllConnections(token);
      dispatch(setAllConnection(result));
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    allConnections();
  }, [token]);
  return (
    <div className="hidden lg:block bg-white rounded-md shadow-md h-fit p-4">
      <h1 className="text-xl font-semibold mb-4">People You May Know</h1>
      {suggestedUser?.map((suggested) => (
        <div key={suggested._id} className="mb-2">
          <UserSuggested suggested={suggested} />
        </div>
      ))}
    </div>
  );
};
