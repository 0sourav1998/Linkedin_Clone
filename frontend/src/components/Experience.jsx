import { Briefcase, X } from "lucide-react";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteExperience, updateProfile } from "../services/operations/Auth";
import { setProfile } from "../redux/slice/auth";

export const Experience = () => {
  const { profile, token, user } = useSelector((state) => state.auth);
  const [addExperience, setAddExperience] = useState(false);
  const [currentlyWorking, setCurrentlyWorking] = useState(false);
  const dispatch = useDispatch();
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
      const updatedWorkingData = currentlyWorking ? ({...experience,to:null}) : (experience)
      const result = await updateProfile({ experience: updatedWorkingData }, token);
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
    <div className="flex flex-col gap-2 mb-4 bg-white shadow-md p-8">
      <h1 className="font-semibold text-xl mb-1">
        My Experiences ({profile.experience.length})
      </h1>
      {profile.experience.length !== 0 ? (
        <div className="mt-4">
          {profile.experience.map((exp, index) => (
            <div key={index} className="shadow-md p-6 flex justify-between">
              <div>
                <div className="flex gap-2 items-center">
                  <Briefcase className="size-5" />
                  <span className="font-bold">{exp.title}</span>
                </div>
                <p className="font-semibold">{exp.company}</p>
                <p className="text-xs text-gray-600">
                  {new Date(exp.from).toLocaleString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })} {" "}
                  - {" "}
                  {
                    exp.to === null ? (<span>Present</span>) : (new Date(exp.to).toLocaleString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }))
                  }
                </p>
                <p className="text-xs text-gray-600">{exp.description}</p>
              </div>
              {isOwner && (
                <div>
                  <X
                    className="cursor-pointer"
                    onClick={() => handleDeleteExp(exp._id)}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div>
          <p className="text-xs text-gray-600">No Experience Added So Far</p>
        </div>
      )}
      <div>
        {addExperience && (
          <div className="flex flex-col gap-2">
            <input
              placeholder="Add a title..."
              value={experience.title}
              onChange={(e) =>
                setExperience({ ...experience, title: e.target.value })
              }
              className="p-2 outline-none"
            />
            <input
              placeholder="Add a Company..."
              value={experience.company}
              onChange={(e) =>
                setExperience({ ...experience, company: e.target.value })
              }
              className="p-2 outline-none"
            />
            <div className="flex flex-col gap-2">
              <label id="startDate">Start Date</label>
              <input
                htmlFor="startDate"
                value={experience.from}
                onChange={(e) =>
                  setExperience({ ...experience, from: e.target.value })
                }
                type="date"
                className="p-2 outline-none"
              />
            </div>
            <div className="flex gap-2">
              <input
                id="endDate"
                type="checkbox"
                placeholder="Add Ending Date..."
                checked={currentlyWorking}
                onChange={() => setCurrentlyWorking(!currentlyWorking)}
              />
              <label htmlFor="endDate">I am Currently Working Here</label>
            </div>
            {!currentlyWorking && (
              <div className="flex flex-col gap-2">
                <label id="endDate">End Date</label>
                <input
                  htmlFor="endDate"
                  type="date"
                  className="p-2 outline-none"
                  value={experience.to}
                  onChange={(e) =>
                    setExperience({ ...experience, to: e.target.value })
                  }
                />
              </div>
            )}
            <div>
              <textarea
                placeholder="Description..."
                value={experience.description}
                onChange={(e) =>
                  setExperience({ ...experience, description: e.target.value })
                }
                className="p-2 outline-none w-full"
              ></textarea>
            </div>
          </div>
        )}
      </div>
      {!addExperience && isOwner && (
        <button
          className="bg-blue-500 text-white px-3 py-2 rounded-md mr-4 w-fit"
          onClick={() => setAddExperience(true)}
        >
          Add Experience
        </button>
      )}
      {addExperience && (
        <div className="flex gap-4 mt-2">
          <button
            className="bg-blue-500 text-white px-3 py-2 rounded-md"
            onClick={handleSubmit}
          >
            Save Changes
          </button>
          <button
            className="bg-blue-500 text-white px-3 py-2 rounded-md"
            onClick={() => setAddExperience(false)}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};
