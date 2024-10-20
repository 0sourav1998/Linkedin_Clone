import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile } from "../services/operations/Auth";
import { setProfile } from "../redux/slice/auth";
import { Camera } from "lucide-react";

export const ProfileHeader = () => {
  const { profile, user } = useSelector((state) => state.auth);
  const isOwner = profile._id === user._id;

  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [headline, setHeadLine] = useState();

  const bannerRef = useRef();
  const profileRef = useRef();

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [banner, setBanner] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);

  const { token } = useSelector((state) => state.auth);

  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    setName(user.name);
    setEmail(user.email);
    setHeadLine(user.headline);
  }, []);

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("headline", headline);
    formData.append("profilePicture", image);
    formData.append("bannerImage", banner);
    try {
      setLoading(true);
      const result = await updateProfile(formData, token);
      if (result) {
        dispatch(setProfile(result));
        setIsEdit(false);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleBannerChange = (e) => {
    const bannerFile = e.target.files[0];
    const file = URL.createObjectURL(bannerFile);
    if (file) {
      setBannerPreview(file);
      setBanner(bannerFile);
    }
  };

  const handleImageChange = (e) => {
    const imageFile = e.target.files[0];
    const file = URL.createObjectURL(imageFile);
    if (file) {
      setImagePreview(file);
      setImage(imageFile);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-2">
      {/* Banner Section */}
      <div className="relative w-[50vw] h-48 md:h-60">
        <img
          src={bannerPreview || profile?.bannerImage || "/banner.png"}
          alt="Banner"
          className="w-full h-full object-cover rounded-lg shadow-md"
        />
        {isEdit && (
          <div>
            <input
              className="hidden"
              type="file"
              ref={bannerRef}
              onChange={handleBannerChange}
            />
            <Camera
              className="size-8 text-white absolute right-2 top-1 cursor-pointer"
              onClick={() => bannerRef.current.click()}
            />
          </div>
        )}
        {/* Profile Picture */}
        <img
          src={imagePreview || profile?.profilePicture || "/avatar.png"}
          alt="Profile"
          className="w-32 h-32 md:w-40 md:h-40 rounded-full absolute top-[60%] left-1/2 transform -translate-x-1/2 border-4 border-white shadow-lg object-cover"
        />
        {isEdit && (
          <div>
            <input
              className="hidden"
              type="file"
              ref={profileRef}
              onChange={handleImageChange}
            />
            <Camera
              className="size-10 text-white absolute left-[55%] top-[60%] cursor-pointer rounded-full bg-blue-600 p-2"
              onClick={() => profileRef.current.click()}
            />
          </div>
        )}
      </div>

      {/* Profile Details */}
      <div className="flex flex-col items-center gap-3 mt-20 text-center">
        {/* Name */}
        <div>
          {isEdit ? (
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 text-2xl md:text-3xl font-bold text-center text-gray-900"
            />
          ) : (
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              {profile?.name}
            </h1>
          )}
        </div>

        {/* Email */}
        <div>
          {isEdit ? (
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 text-sm md:text-base text-gray-600 text-center"
            />
          ) : (
            <p className="text-sm md:text-base text-gray-600">
              {profile?.email}
            </p>
          )}
        </div>

        {/* Headline */}
        <div>
          {isEdit ? (
            <input
              value={headline}
              onChange={(e) => setHeadLine(e.target.value)}
              className="w-full p-2 text-base md:text-lg text-gray-700 font-medium text-center"
            />
          ) : (
            <p className="text-base md:text-lg text-gray-700 font-medium">
              {profile?.headline}
            </p>
          )}
        </div>

        {/* Edit Buttons */}
        {isOwner ? (
          isEdit ? (
            <div className="flex gap-4">
              {loading ? (
                <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300">
                  Loading...
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300"
                >
                  Save Changes
                </button>
              )}
              <button
                onClick={() => {
                  setIsEdit(false);
                  setImagePreview(null);
                }}
                disabled={loading}
                className="mt-4 px-4 rounded-md py-2 bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-300"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsEdit(true)}
              className="mt-4  px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300"
            >
              Edit Profile
            </button>
          )
        ) : (
          <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors duration-300">
            Connect
          </button>
        )}
      </div>
    </div>
  );
};
