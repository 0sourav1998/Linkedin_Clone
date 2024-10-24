import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/operations/Auth";
import { useDispatch } from "react-redux";
import { Loader } from "lucide-react";

export const LoginForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const handleSubmit = async () => {
    try {
      setLoading(true);
      dispatch(login({ username, password }, navigate));
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex flex-col gap-4 max-w-md mx-auto shadow-white shadow-lg">
      <input
        type="text"
        value={username}
        placeholder="Username"
        onChange={(e) => setUsername(e.target.value)}
        className="w-full input input-bordered"
      />
      <input
        type="password"
        value={password}
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
        className="w-full input input-bordered"
      />
      <div className="mt-4">
        <button onClick={handleSubmit} className="btn btn-primary p-2 w-full">
          {loading ? (
            <Loader className="animate-spin w-6 h-6 text-white" />
          ) : (
            "Login"
          )}
        </button>
      </div>
    </div>
  );
};
