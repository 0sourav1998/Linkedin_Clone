import { Briefcase, School, X } from "lucide-react";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setProfile } from "../redux/slice/auth";
import { deleteEducation, updateProfile } from "../services/operations/Auth";

export const Education = () => {
  const { profile, token, user } = useSelector((state) => state.auth);
  const [addEducation, setAddEducation] = useState(false);
  const [currentlyStudying, setCurrentlyStudying] = useState(false);
  const dispatch = useDispatch();
  const isOwner = profile._id === user._id;
  const [education, setEducation] = useState({
    title: "",
    company: "",
    from: "",
    to: "",
    description: "",
  });

  const handleSubmit = async () => {
    try {
      const updatedEducationField = currentlyStudying
        ? { ...education, to: null }
        : education;
      const result = await updateProfile(
        { education: updatedEducationField },
        token
      );
      if (result) {
        dispatch(setProfile(result));
        setAddEducation(false);
        setEducation({
          title: "",
          company: "",
          from: "",
          to: "",
        });
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDeleteEdu = async (id) => {
    try {
      const result = await deleteEducation(id, token);
      if (result) {
        dispatch(setProfile(result));
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col gap-2 bg-white shadow-md p-8">
      <h1 className="font-semibold text-xl mb-1">Education</h1>
      {profile.education.length !== 0 ? (
        <div className="mt-4">
          {profile.education.map((edu, index) => (
            <div key={index} className="shadow-md p-6 flex justify-between">
              <div>
                <div className="flex gap-2 items-center">
                  <School className="size-5" />
                  <span className="font-bold">{edu.school}</span>
                </div>
                <p className="font-semibold">{edu.fieldOfStudy}</p>
                <p className="text-xs text-gray-600">
                  {new Date(edu.from).toLocaleString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })} {" "}
                  - {" "}
                  {edu.to === null ? (
                    <span>Present</span>
                  ) : (
                    new Date(edu.to).toLocaleString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  )}
                </p>
              </div>
              {isOwner && (
                <div>
                  <X
                    className="cursor-pointer"
                    onClick={() => handleDeleteEdu(edu._id)}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div>
          <p className="text-xs text-gray-600">No Education Added So Far</p>
        </div>
      )}
      <div>
        {addEducation && (
          <div className="flex flex-col gap-2">
            <input
              placeholder="Add School..."
              value={education.school}
              onChange={(e) =>
                setEducation({ ...education, school: e.target.value })
              }
              className="p-2 outline-none"
            />
            <input
              placeholder="Add Field Of Study..."
              value={education.fieldOfStudy}
              onChange={(e) =>
                setEducation({ ...education, fieldOfStudy: e.target.value })
              }
              className="p-2 outline-none"
            />
            <div className="flex flex-col gap-2">
              <label id="startDate">Start Date</label>
              <input
                htmlFor="startDate"
                value={education.from}
                onChange={(e) =>
                  setEducation({ ...education, from: e.target.value })
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
                checked={currentlyStudying}
                onChange={() => setCurrentlyStudying(!currentlyStudying)}
              />
              <label htmlFor="endDate">I am Currently Studying Here</label>
            </div>
            {!currentlyStudying && (
              <div className="flex flex-col gap-2">
                <label id="endDate">End Date</label>
                <input
                  htmlFor="endDate"
                  type="date"
                  className="p-2 outline-none"
                  value={education.to}
                  onChange={(e) =>
                    setEducation({ ...education, to: e.target.value })
                  }
                />
              </div>
            )}
          </div>
        )}
      </div>
      {!addEducation && isOwner && (
        <button
          className="bg-blue-500 text-white px-3 py-2 rounded-md mr-4 w-fit"
          onClick={() => setAddEducation(true)}
        >
          Add Education
        </button>
      )}
      {addEducation && (
        <div className="flex gap-4 mt-2">
          <button
            className="bg-blue-500 text-white px-3 py-2 rounded-md"
            onClick={handleSubmit}
          >
            Save Changes
          </button>
          <button
            className="bg-blue-500 text-white px-3 py-2 rounded-md"
            onClick={() => setAddEducation(false)}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};
