import {
  Loader,
  MessageCircle,
  Send,
  Share,
  ThumbsDown,
  ThumbsUp,
  Trash2,
} from "lucide-react";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addComment, deletePost, likePost } from "../services/operations/Post";
import { setAllPosts } from "../redux/slice/Post";
import { PostActions } from "./PostActions";
import { formatDistanceToNow } from "date-fns";
import { Link, useNavigate } from "react-router-dom";

export const Post = ({ post }) => {
  const { user, token } = useSelector((state) => state.auth);
  const [commentLoading, setCommentLoading] = useState(false);
  const { allPosts } = useSelector((state) => state.post);
  const [comment, setComment] = useState("");
  const navigate = useNavigate();
  const [showComment, setShowComment] = useState(false);
  const [isLiked, setIsLiked] = useState(
    post?.likes?.some((like) => like === user?._id)
  );
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const handleLike = async (id) => {
    try {
      const result = await likePost(id, token);
      if (result) {
        const userLiked = result.likes.some((like) => like === user._id);
        setIsLiked(userLiked);
        const updatedPosts = allPosts.map((p) =>
          p._id === result._id ? result : p
        );
        dispatch(setAllPosts(updatedPosts));
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
        const updatedPosts = allPosts?.map((post) =>
          post._id === result._id ? result : post
        );
        dispatch(setAllPosts(updatedPosts));
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
      console.log("Heyyyy");
    } catch (error) {
      console.log(error.message);
    }
  };

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
            <p className="text-xs text-gray-500">{post?.author?.headline}</p>
            <p className="text-xs text-gray-400">
              {formatDistanceToNow(new Date(post?.createdAt), {
                addSuffix: true,
              })}
            </p>
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
        <h1 className="text-gray-800 mb-2 sm:text-lg text-xs">{post?.content}</h1>
        {post?.image && (
          <Link to={`/post/${post._id}`}>
            <img
              src={post?.image}
              className="w-full h-64 object-cover rounded-lg border border-gray-200"
            />
          </Link>
        )}
      </div>
      <div className="flex justify-between items-center border-t border-gray-200 pt-3">
        <PostActions
          icon={
            <ThumbsUp
              className={isLiked ? "text-blue-500 fill-blue-300 sm:size-5 size-5" : "sm:size-5 size-5"}
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
              <Link>
                <img
                  className="w-10 h-10 rounded-full object-cover border border-gray-300"
                  src={comment?.user?.profilePicture || "/avatar.png"}
                  alt={comment?.user?.username}
                />
              </Link>
            </div>
            <div className="flex flex-col">
              <span className="font-semibold sm:text-sm text-xs text-gray-800">
                {comment?.user?.username}
              </span>
              <p className="sm:text-xs text-[10px] text-gray-500">
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
          className="w-full sm:p-3 p-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
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
