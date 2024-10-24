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
  const isOwner = profile?._id === user?._id;
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
    <div className="flex flex-col gap-4 bg-white shadow-lg rounded-md p-6 sm:p-8">
      <h1 className="font-semibold sm:text-xl text-lg mb-3">Education</h1>
      {profile?.education?.length !== 0 ? (
        <div className="space-y-4">
          {profile?.education?.map((edu, index) => (
            <div
              key={index}
              className="flex justify-between items-start bg-gray-100 p-4 rounded-lg shadow-md"
            >
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <School className="w-5 h-5 text-blue-600" />
                  <span className="font-bold text-lg">{edu.school}</span>
                </div>
                <p className="font-medium">{edu.fieldOfStudy}</p>
                <p className="text-sm text-gray-600">
                  {new Date(edu.from).toLocaleString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}{" "}
                  -{" "}
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
                <X
                  className="cursor-pointer text-red-500 hover:text-red-700"
                  onClick={() => handleDeleteEdu(edu?._id)}
                />
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500">No Education Added So Far</p>
      )}
      {addEducation && (
        <div className="flex flex-col gap-4 bg-gray-200 p-6 rounded-md shadow-md">
          <input
            placeholder="Add School..."
            value={education.school}
            onChange={(e) =>
              setEducation({ ...education, school: e.target.value })
            }
            className="p-2 border border-gray-300 rounded-md outline-none"
          />
          <input
            placeholder="Add Field Of Study..."
            value={education.fieldOfStudy}
            onChange={(e) =>
              setEducation({ ...education, fieldOfStudy: e.target.value })
            }
            className="p-2 border border-gray-300 rounded-md outline-none"
          />
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold">Start Date</label>
            <input
              value={education.from}
              onChange={(e) =>
                setEducation({ ...education, from: e.target.value })
              }
              type="date"
              className="p-2 border border-gray-300 rounded-md outline-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              id="endDate"
              type="checkbox"
              checked={currentlyStudying}
              onChange={() => setCurrentlyStudying(!currentlyStudying)}
            />
            <label htmlFor="endDate">I am Currently Studying Here</label>
          </div>
          {!currentlyStudying && (
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold">End Date</label>
              <input
                type="date"
                className="p-2 border border-gray-300 rounded-md outline-none"
                value={education.to}
                onChange={(e) =>
                  setEducation({ ...education, to: e.target.value })
                }
              />
            </div>
          )}
        </div>
      )}
      {!addEducation && isOwner && (
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 w-fit"
          onClick={() => setAddEducation(true)}
        >
          Add Education
        </button>
      )}
      {addEducation && (
        <div className="flex gap-4 mt-4">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            onClick={handleSubmit}
          >
            Save Changes
          </button>
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
            onClick={() => setAddEducation(false)}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};
