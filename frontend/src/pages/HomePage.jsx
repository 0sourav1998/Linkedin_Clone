import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllPosts } from "../services/operations/Post";
import { HomeSidebar } from "../components/HomeSidebar";
import {
  currentUser,
  getAllUsersForSearch,
  suggestedUser,
} from "../services/operations/Auth";
import { PostCreation } from "../components/PostCreation";
import { setAllPosts } from "../redux/slice/Post";
import { Post } from "../components/Post";
import { SuggestedUsers } from "../components/SuggestedUsers";
import { setAllUser } from "../redux/slice/auth";
import Footer from "../components/Footer";
import { Users } from "lucide-react";

export const HomePage = () => {
  const { token, user, allUser } = useSelector((state) => state.auth);
  const [search, setSearch] = useState("");

  const fetchCurrentUser = async () => {
    const result = await getAllUsersForSearch(token);
    dispatch(setAllUser(result));
  };
  
  useEffect(() => {
    if (token) {
      fetchCurrentUser();
    }
  }, [user, token]);

  const { allPosts } = useSelector((state) => state.post);
  const dispatch = useDispatch();

  const fetchAllUser = async () => {
    try {
      const result = await getAllUsersForSearch(token);
      dispatch(setAllUser(result));
    } catch (error) {
      console.log(error);
    }
  };

  const fetchPosts = async () => {
    try {
      const result = await fetchAllPosts(token);
      dispatch(setAllPosts(result));
    } catch (error) {
      console.log(error.message);
    }
  };
  const fetchOtherUsers = async () => {
    try {
      dispatch(suggestedUser(token));
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchAllUser();
  }, []);
  useEffect(() => {
    fetchPosts();
    fetchOtherUsers();
  }, [token]);

  return (
    <div className="w-full">

    <div className="grid grid-cols-1 lg:grid-cols-[25%_43%_32%] sm:w-8/12 w-full gap-6 mx-auto">
      <div className="hidden lg:block">
        <HomeSidebar user={user} />
      </div>
      <div className="flex flex-col gap-6">
        <PostCreation user={user} />
        {allPosts &&
          allPosts?.map((post) => <Post key={post?._id} post={post} />)}
          {allPosts?.length === 0 && (
					<div className='bg-white rounded-lg shadow p-8 text-center'>
						<div className='mb-6'>
							<Users size={64} className='mx-auto text-blue-500' />
						</div>
						<h2 className='text-2xl font-bold mb-4 text-gray-800'>No Posts Yet</h2>
						<p className='text-gray-600 mb-6'>Connect with others to start seeing posts in your feed!</p>
					</div>
				)}
      </div>
      <SuggestedUsers />
    </div>

    </div>
  );
};
