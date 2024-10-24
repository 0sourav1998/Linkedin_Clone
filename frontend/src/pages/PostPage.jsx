import React from "react";
import { HomeSidebar } from "../components/HomeSidebar";
import { useSelector } from "react-redux";
import { SinglePost } from "../components/SinglePost";

export const PostPage = () => {
  const { user } = useSelector((state) => state.auth);
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[30%_70%] sm:w-10/12 w-full gap-6">
      <div className="hidden lg:block">
        <HomeSidebar user={user} />
      </div>
      <div className="flex flex-col gap-6">
        <SinglePost />
      </div>
    </div>
  );
};
