import { X } from "lucide-react";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteSkill, updateProfile } from "../services/operations/Auth";
import { setProfile } from "../redux/slice/auth";

export const Skills = () => {
  const { profile, token, user } = useSelector((state) => state.auth);
  const [skill, setSkill] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const dispatch = useDispatch();
  const isOwner = profile?._id === user?._id;

  const handleSubmit = async () => {
    try {
      const result = await updateProfile({ skills: skill }, token);
      if (result) {
        dispatch(setProfile(result));
        setSkill("");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDeleteSkill = async (skill) => {
    try {
      const result = await deleteSkill(skill, token);
      if (result) {
        dispatch(setProfile(result));
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-md p-6 sm:p-8 flex flex-col gap-4">
      <h1 className="font-semibold text-lg sm:text-xl mb-4">Skills</h1>
      <div className="flex flex-wrap gap-3">
        {profile.skills.length !== 0 ? (
          profile.skills.map((skill, index) => (
            <div
              key={index}
              className="flex justify-between items-center bg-blue-700 px-4 py-1 rounded-md shadow-md"
            >
              <span className="text-white text-md">{skill}</span>
              {isOwner && (
                <X
                  className="w-4 h-4 text-white cursor-pointer ml-2"
                  onClick={() => handleDeleteSkill(skill)}
                />
              )}
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500">No Skills Added So Far</p>
        )}
      </div>

      {isEdit && (
        <div className="flex gap-4 mt-4">
          <input
            className="flex-1 border border-gray-300 rounded-md p-2 outline-none"
            placeholder="Add Skill"
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
          />
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            onClick={handleSubmit}
          >
            Add
          </button>
        </div>
      )}

      {isEdit ? (
        <div className="flex gap-4 mt-4">
          <button
            className="bg-gray-500 px-6 py-2 rounded-md text-white hover:bg-gray-600"
            onClick={() => setIsEdit(false)}
          >
            Cancel
          </button>
        </div>
      ) : (
        isOwner && (
          <button
            className="bg-blue-600 px-6 py-2 rounded-md text-white hover:bg-blue-700 w-fit mt-4"
            onClick={() => setIsEdit(true)}
          >
            Add Skill
          </button>
        )
      )}
    </div>
  );
};
