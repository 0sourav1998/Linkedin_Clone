import { Briefcase, Loader, X } from "lucide-react";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteExperience, updateProfile } from "../services/operations/Auth";
import { setProfile } from "../redux/slice/auth";

export const Experience = () => {
  const { profile, token, user } = useSelector((state) => state.auth);
  const [addExperience, setAddExperience] = useState(false);
  const [currentlyWorking, setCurrentlyWorking] = useState(false);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const isOwner = profile._id === user._id;
  const [experience, setExperience] = useState({
    title: "",
    company: "",
    from: "",
    to: "",
    description: "",
  });

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const updatedWorkingData = currentlyWorking
        ? { ...experience, to: null }
        : experience;
      const result = await updateProfile(
        { experience: updatedWorkingData },
        token
      );
      if (result) {
        dispatch(setProfile(result));
        setAddExperience(false);
        setExperience({
          title: "",
          company: "",
          from: "",
          to: "",
          description: "",
        });
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteExp = async (id) => {
    try {
      const result = await deleteExperience(id, token);
      if (result) {
        dispatch(setProfile(result));
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col gap-6 bg-white shadow-lg rounded-lg p-6 sm:p-8">
      <h1 className="font-bold text-xl sm:text-2xl mb-4">
        My Experiences ({profile.experience.length})
      </h1>

      {profile.experience.length !== 0 ? (
        <div className="mt-4">
          {profile.experience.map((exp, index) => (
            <div
              key={index}
              className="shadow-md p-6 bg-gray-50 rounded-lg flex justify-between items-start hover:shadow-lg transition-shadow duration-300"
            >
              <div>
                <div className="flex gap-2 items-center mb-2">
                  <Briefcase className="w-6 h-6 text-blue-600" />
                  <span className="font-semibold text-lg">{exp.title}</span>
                </div>
                <p className="text-sm font-medium text-gray-700">{exp.company}</p>
                <p className="text-xs text-gray-500">
                  {new Date(exp.from).toLocaleString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}{" "}
                  -{" "}
                  {exp.to === null ? (
                    <span>Present</span>
                  ) : (
                    new Date(exp.to).toLocaleString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  )}
                </p>
                <p className="text-sm text-gray-600 mt-2">{exp.description}</p>
              </div>
              {isOwner && (
                <X
                  className="cursor-pointer text-red-500 hover:text-red-600 transition-colors duration-200"
                  onClick={() => handleDeleteExp(exp._id)}
                />
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-600">No Experience Added So Far</p>
      )}

      {addExperience && (
        <div className="bg-gray-300 p-4 shadow-lg rounded-md">
          <div className="flex flex-col gap-4">
            <input
              placeholder="Add a title..."
              required
              value={experience.title}
              onChange={(e) =>
                setExperience({ ...experience, title: e.target.value })
              }
              className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
            <input
              placeholder="Add a Company..."
              required
              value={experience.company}
              onChange={(e) =>
                setExperience({ ...experience, company: e.target.value })
              }
              className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Start Date</label>
              <input
                type="date"
                required
                value={experience.from}
                onChange={(e) =>
                  setExperience({ ...experience, from: e.target.value })
                }
                className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={currentlyWorking}
                onChange={() => setCurrentlyWorking(!currentlyWorking)}
                className="h-4 w-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
              />
              <label className="text-sm">I am Currently Working Here</label>
            </div>
            {!currentlyWorking && (
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">End Date</label>
                <input
                  type="date"
                  required
                  value={experience.to}
                  onChange={(e) =>
                    setExperience({ ...experience, to: e.target.value })
                  }
                  className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
            <textarea
              placeholder="Description..."
              required
              value={experience.description}
              onChange={(e) =>
                setExperience({ ...experience, description: e.target.value })
              }
              className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      )}

      {!addExperience && isOwner && (
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300 w-fit"
          onClick={() => setAddExperience(true)}
        >
          Add Experience
        </button>
      )}

      {addExperience && (
        <div className="flex items-center gap-4 mt-4">
          {loading ? (
            <button className="bg-blue-600 px-4 py-2 rounded-md">
              <Loader className="animate-spin w-6 h-6 text-white" />
            </button>
          ) : (
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-300"
              onClick={handleSubmit}
            >
              Save Changes
            </button>
          )}
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors duration-300"
            onClick={() => setAddExperience(false)}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};
