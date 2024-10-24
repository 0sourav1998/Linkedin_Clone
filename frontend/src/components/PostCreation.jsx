import { Image, Loader } from "lucide-react";
import React, { useRef, useState } from "react";
import { createPost } from "../services/operations/Post";
import { useDispatch, useSelector } from "react-redux";
import { setAllPosts } from "../redux/slice/Post";

export const PostCreation = ({ user }) => {
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const { token } = useSelector((state) => state.auth);
  const { allPosts } = useSelector((state) => state.post);
  const dispatch = useDispatch();

  const imageRef = useRef();

  const handleFileChange = async (e) => {
    try {
      const file = e.target.files[0];
      setImage(file);
      if (file) {
        const imageURL = URL.createObjectURL(file);
        setImagePreview(imageURL);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("content", content);
      if (image) {
        formData.append("image", image);
      }
      setLoading(true);
      const result = await createPost(formData, token);
      dispatch(setAllPosts([ result,...allPosts]));
      if (result) {
        setContent("");
        setImage(null);
        setImagePreview(null);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="bg-secondary rounded-lg shadow mb-4 sm:p-4 p-2">
      <div className="flex space-x-3">
        <img
          src={user?.profilePicture || "../assets/avatar.png"}
          className="size-12 rounded-full"
        />
        <textarea
          placeholder="What's On Your Mind ?"
          className="w-full p-3 rounded-lg bg-base-100 focus:bg-base-200 focus:outline-none resize-none transition-all duration-300 min-h-[100px]"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>
      {imagePreview && (
        <div className="sm:mt-4 mt-2">
          <img src={imagePreview} className="w-full h-auto rounded-lg" />
        </div>
      )}
      <div className="flex justify-between mt-4">
        <div className="flex sm:space-x-4 space-x-2">
          <Image
            onClick={() => imageRef.current.click()}
            className="cursor-pointer text-info hover:text-info-dark transition-all duration-300"
          />
          <input
            ref={imageRef}
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
          />
          <span className="text-info hover:text-info-dark">Photo</span>
        </div>
        <button
          onClick={handleSubmit}
          className="bg-primary text-white rounded-lg px-4 py-2 hover:bg-primary-dark transition-all duration-300"
        >
          {loading ? <Loader className="size-5 animate-spin" /> : "Share"}
        </button>
      </div>
    </div>
  );
};
