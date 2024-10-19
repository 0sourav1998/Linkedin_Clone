import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllPosts } from "../services/operations/Post";
import { HomeSidebar } from "../components/HomeSidebar";
import { currentUser, suggestedUser } from "../services/operations/Auth";
import { PostCreation } from "../components/PostCreation";
import { setAllPosts } from "../redux/slice/Post";
import { Post } from "../components/Post";
import { SuggestedUsers } from "../components/SuggestedUsers";
import { setCurrentUser } from "../redux/slice/auth";

export const HomePage = () => {
  const { token, user, currentUser } = useSelector((state) => state.auth);

  const fetchCurrentUser = async () => {
    const result = await currentUser(token);
    dispatch(setCurrentUser(result));
  };
  useEffect(() => {
    if (token) {
      fetchCurrentUser();
    }
  }, [user, token]);

  const { allPosts } = useSelector((state) => state.post);
  const dispatch = useDispatch();
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
    fetchPosts();
    fetchOtherUsers();
  }, [token]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 w-10/12 gap-6">
      <div className="hidden lg:block">
        <HomeSidebar user={user} />
      </div>
      <div className="flex flex-col gap-6">
        <PostCreation user={user} />
        {allPosts &&
          allPosts?.map((post) => <Post key={post?._id} post={post} />)}
      </div>
      <SuggestedUsers />
    </div>
  );
};
