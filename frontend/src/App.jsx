import { useState } from "react";
import { Navbar } from "./components/Navbar";
import { Route, Routes } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { Login } from "./pages/Auth/Login";
import { Signup } from "./pages/Auth/Signup";

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow flex justify-center items-center">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
