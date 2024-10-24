import React, { useState } from "react";
import { signup } from "../services/operations/Auth";
import { useNavigate } from "react-router-dom";

export const SignupForm = () => {
  const navigate = useNavigate();
  const handleSubmit = async () => {
    try {
      setLoading(true);
      await signup({ name, username, email, password }, navigate);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  return (
    <div className="flex flex-col gap-4 max-w-md mx-auto shadow-white shadow-lg">
      <input
        type="text"
        value={name}
        placeholder="Full Name"
        onChange={(e) => setName(e.target.value)}
        className="w-full input input-bordered"
      />
      <input
        type="email"
        value={email}
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
        className="w-full input input-bordered"
      />
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
          {loading ? "Loading..." : "Agree And Join"}
        </button>
      </div>
    </div>
  );
};
