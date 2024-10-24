import { formatDistanceToNow } from "date-fns";
import {
  Loader,
  MessageCircle,
  Send,
  Share,
  ThumbsUp,
  Trash2,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import copy from "copy-to-clipboard";
import {
  addComment,
  deletePost,
  fetchSinglePost,
  likePost,
} from "../services/operations/Post";
import { useDispatch, useSelector } from "react-redux";
import {PulseLoader} from "react-spinners";
import { setAllPosts, setPost } from "../redux/slice/Post";
import { PostActions } from "./PostActions";
import toast from "react-hot-toast";

export const SinglePost = () => {
  const { id } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { user, token } = useSelector((state) => state.auth);
  const { allPosts } = useSelector((state) => state.post);
  const { post } = useSelector((state) => state.post);

  const [commentLoading, setCommentLoading] = useState(false);
  const [comment, setComment] = useState("");
  const [showComment, setShowComment] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchPostLoading,setFetchPostLoading] = useState(false)

  const [isLiked, setIsLiked] = useState(
    post?.likes?.some((like) => like === user?._id)
  );

  const fetchPost = async () => {
    try {
      setFetchPostLoading(true)
      const result = await fetchSinglePost(id, token);
      console.log(result);
      dispatch(setPost(result));
    } catch (error) {
      console.log(error);
    }finally{
      setFetchPostLoading(false)
    }
  };

  useEffect(() => {
    if (token) {
      fetchPost();
    }
  }, [id, token]);

  const handleLike = async (id) => {
    try {
      const result = await likePost(id, token);
      if (result) {
        const userLiked = result.likes.some((like) => like === user._id);
        setIsLiked(userLiked);
        dispatch(setPost(result));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const postDeletion = async (id) => {
    try {
      setLoading(true);
      const result = await deletePost(id, token);
      if (result) {
        const filteredPostAfterDeletion = allPosts?.filter(
          (post) => post._id !== result._id
        );
        dispatch(setAllPosts(filteredPostAfterDeletion));
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (id) => {
    try {
      setCommentLoading(true);
      const result = await addComment(id, { content: comment }, token);
      if (result) {
        dispatch(setPost(result));
        setComment("");
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setCommentLoading(false);
    }
  };

  const handleShare = async () => {
    try {
      copy(window.location.href);
      toast.success("Link copied Successfully");
    } catch (error) {
      console.log(error.message);
    }
  };

  if(fetchPostLoading){
    return <PulseLoader className="size-24 flex justify-center items-center w-full  h-full"/>
  }

  return (
    <div className="shadow-lg sm:p-6 p-3 bg-white rounded-lg transition duration-300 hover:shadow-xl">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          <img
            onClick={() => navigate(`/profile/${post?.author?.username}`)}
            src={post?.author?.profilePicture || "../../public/avatar.png"}
            className="w-12 h-12 rounded-full object-cover border border-gray-200 cursor-pointer"
          />
          <div>
            <span className="font-semibold sm:text-lg text-sm text-gray-900">
              {post?.author?.name}
            </span>
            <p className="sm:text-xs text-[10px] text-gray-500">
              {post?.author?.headline}
            </p>
            {/* <p className="sm:text-xs text-[10px] text-gray-400">
              {formatDistanceToNow(new Date(post?.createdAt), {
                addSuffix: true,
              })}
            </p> */}
          </div>
        </div>
        {post?.author?._id === user?._id && (
          <div>
            {loading ? (
              <Loader className="animate-spin text-red-500" />
            ) : (
              <Trash2
                onClick={() => postDeletion(post._id)}
                className="cursor-pointer text-red-600 hover:text-red-800 transition-colors duration-300"
              />
            )}
          </div>
        )}
      </div>
      <div className="mb-4">
        <h1 className="text-gray-800 mb-2">{post?.content}</h1>
        {post?.image && (
          <img
            src={post?.image}
            className="w-full h-64 object-cover rounded-lg border border-gray-200"
          />
        )}
      </div>
      <div className="flex justify-between items-center border-t border-gray-200 pt-3">
        <PostActions
          icon={
            <ThumbsUp
              size={18}
              className={isLiked ? "text-blue-500 fill-blue-300" : ""}
            />
          }
          text={`Like (${post?.likes?.length})`}
          onClick={() => handleLike(post?._id)}
        />
        <PostActions
          icon={<MessageCircle size={18} />}
          text={`Comment (${post?.comments?.length})`}
          onClick={() => setShowComment((prev) => !prev)}
        />
        <PostActions
          icon={<Share size={18} />}
          text={`Share`}
          onClick={handleShare}
        />
      </div>
      {showComment &&
        post?.comments?.map((comment, index) => (
          <div
            key={index}
            className="flex gap-3 items-start p-3 mt-4 bg-gray-50 border border-gray-200 rounded-lg shadow-sm"
          >
            <div className="flex-shrink-0">
              <img
                className="w-10 h-10 rounded-full object-cover border border-gray-300"
                src={comment?.user?.profilePicture || "/avatar.png"}
                alt={comment?.user?.username}
              />
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-sm text-gray-800">
                {comment?.user?.username}
              </span>
              <p className="text-xs text-gray-500">
                {formatDistanceToNow(new Date(comment?.createdAt), {
                  addSuffix: true,
                })}
              </p>
              <p className="text-gray-700 text-sm">{comment.content}</p>
            </div>
          </div>
        ))}

      <div className="flex items-center gap-2 mt-4">
        <input
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
          placeholder="Add a comment..."
        />
        {commentLoading ? (
          <Loader className="animate-spin text-blue-500" />
        ) : (
          <Send
            onClick={() => handleAddComment(post._id)}
            className="cursor-pointer text-blue-600 hover:text-blue-800 transition-colors duration-300"
          />
        )}
      </div>
    </div>
  );
};
