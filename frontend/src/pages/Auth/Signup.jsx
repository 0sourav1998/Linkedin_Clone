import React from "react";
import logo from "../../../public/logo.svg";
import { SignupForm } from "../../components/SignupForm";
import { useNavigate } from "react-router-dom";

export const Signup = () => {
  const navigate = useNavigate();
  return (
    <div className="w-full max-w-md flex flex-col items-center gap-2">
      <img src={logo} className="h-28 w-auto mx-auto" alt="Logo" />
      {/* <h2 className="text-center font-extrabold text-2xl text-gray-900">
        Make the Most Of Your Personal Life
      </h2> */}
      <div className="w-full shadow-md">
        <div className="bg-white py-8 px-4 shadow rounded-lg">
          <SignupForm />
          <p className="text-xs mt-4 text-center">
            Already Have An Account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-sm text-blue-700 cursor-pointer"
            >
              Login Now
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};