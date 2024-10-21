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
  const isOwner = profile._id === user._id;

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
    <div className="shadow-md bg-white  p-8 flex flex-col gap-2">
      <h1 className="text-xl font-semibold mb-2">Skills</h1>
      <div className="flex gap-3 shadow-md p-4">
        {profile.skills.length !== 0 ? (
          profile?.skills?.map((skill, index) => (
            <div
              key={index}
              className="flex justify-between  items-center bg-blue-700 px-4 py-1 w-2/12 rounded-md"
            >
              <span className="text-md text-white">{skill}</span>
              {isOwner && (
                <span>
                  <X
                    className="size-4 text-white cursor-pointer"
                    onClick={() => handleDeleteSkill(skill)}
                  />
                </span>
              )}
            </div>
          ))
        ) : (
          <div>
            <p className="text-xs text-gray-600">No Skill Added So Far</p>
          </div>
        )}
      </div>
      {isEdit && (
        <div className="flex gap-4">
          <input
            className="w-[90%] outline-none p-2"
            placeholder="Add Skill"
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
          />
          <button
            className="bg-blue-500 rounded-md text-white px-4 py-2"
            onClick={handleSubmit}
          >
            Add
          </button>
        </div>
      )}
      {isEdit ? (
        <div className="flex gap-4">
          <button className="bg-blue-500 px-6 py-2 rounded-md text-white">
            Save
          </button>
          <button
            className="bg-blue-500 px-6 py-2 rounded-md text-white"
            onClick={() => setIsEdit(false)}
          >
            Cancel
          </button>
        </div>
      ) : (
        isOwner && (
          <button
            className="bg-blue-500 px-6 py-2 rounded-md text-white w-fit"
            onClick={() => setIsEdit(true)}
          >
            Add Skill
          </button>
        )
      )}
    </div>
  );
};
