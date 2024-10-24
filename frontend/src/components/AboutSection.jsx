import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setProfile } from "../redux/slice/auth";
import { updateProfile } from "../services/operations/Auth";
import { Loader } from "lucide-react";

export const AboutSection = () => {
  const { profile, user, token } = useSelector((state) => state.auth);
  const [edit, setIsEdit] = useState(false);
  const [about, setAbout] = useState("");
  const [loading, setLoading] = useState(false);
  const isOwner = profile?._id === user?._id;
  const dispatch = useDispatch();

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const result = await updateProfile({ about }, token);
      if (result) {
        dispatch(setProfile(result));
        setIsEdit(false);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setAbout(user?.about);
  }, [edit]);

  return (
    <div className="w-full max-w-4xl mx-auto rounded-lg bg-white shadow-md p-8 space-y-4">
      <h1 className="text-2xl font-semibold text-gray-800">About</h1>
      
      {edit ? (
        <textarea
          className="w-full p-3 text-sm md:text-base rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={about}
          onChange={(e) => setAbout(e.target.value)}
          rows={4}
          placeholder="Tell something about yourself..."
        />
      ) : (
        <p className="text-gray-700 text-sm md:text-base">{profile?.about || "N/A"}</p>
      )}

      {isOwner && (
        <div className="flex justify-start gap-4 mt-4">
          {!edit ? (
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all duration-300"
              onClick={() => setIsEdit(true)}
            >
              Edit
            </button>
          ) : (
            <div className="flex gap-4">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all duration-300"
                onClick={handleSubmit}
              >
                {loading ? <Loader className="animate-spin w-6 h-6 text-white" /> : "Save Changes"}
              </button>
              <button
                className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition-all duration-300"
                onClick={() => setIsEdit(false)}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
