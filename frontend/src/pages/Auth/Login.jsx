import React from 'react'
import { LoginForm } from '../../components/LoginForm'
import logo from "../../assets/logo.svg";
import { useNavigate } from 'react-router-dom';

export const Login = () => {
  const navigate = useNavigate();
  return (
    <div className="w-full max-w-md flex flex-col items-center gap-2 mt-8">
      <img src={logo} className="h-28 w-auto mx-auto" alt="Logo" />
      <div className="w-full shadow-md">
        <div className="bg-white py-8 px-4 shadow rounded-lg">
          <LoginForm />
          <p className="text-xs mt-4 text-center">
            Don't Have An Account?{" "}
            <span
              onClick={() => navigate("/signup")}
              className="text-sm text-blue-700 cursor-pointer"
            >
              Signup Now
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}
