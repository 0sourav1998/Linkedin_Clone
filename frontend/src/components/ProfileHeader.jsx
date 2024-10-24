import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile } from "../services/operations/Auth";
import { setProfile } from "../redux/slice/auth";
import { Camera, Loader } from "lucide-react";

export const ProfileHeader = () => {
  const { profile, user } = useSelector((state) => state.auth);
  const isOwner = profile._id === user._id;

  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [headline, setHeadline] = useState();

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
    setHeadline(user.headline);
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
    <div className="w-full sm:max-w-4xl bg-white shadow-xl sm:p-10 p-6 mx-auto mt-3 rounded-lg">
      <div className="relative sm:w-[50vw] w-full h-32 sm:h-60">
        <img
          src={bannerPreview || profile?.bannerImage || "/banner.png"}
          alt="Banner"
          className="w-full h-full object-cover rounded-lg shadow-md"
        />
        {isEdit && (
          <div className="absolute inset-0 bg-opacity-50 bg-black flex justify-center items-center cursor-pointer">
            <input
              className="hidden"
              type="file"
              ref={bannerRef}
              onChange={handleBannerChange}
            />
            <Camera
              className="text-white w-10 h-10"
              onClick={() => bannerRef.current.click()}
            />
          </div>
        )}
        <div className="">
          <img
            src={imagePreview || profile?.profilePicture || "/avatar.png"}
            alt="Profile"
            className="w-24 h-24 md:w-32 md:h-32 rounded-full absolute top-[70%] left-1/2 transform -translate-x-1/2 border-4 border-white shadow-lg object-cover"
          />
          {isEdit && (
            <div className="absolute sm:left-[57%] left-[63%] top-[70%]  transform -translate-x-1/2 bg-blue-500 p-2 rounded-full cursor-pointer hover:bg-blue-600 transition">
              <input
                className="hidden"
                type="file"
                ref={profileRef}
                onChange={handleImageChange}
              />
              <Camera
                className="text-white sm:w-6 sm:h-6 size-4"
                onClick={() => profileRef.current.click()}
              />
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col items-center gap-6 sm:mt-24 mt-16 text-center">
        <div>
          {isEdit ? (
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full sm:text-3xl text-xl font-bold text-gray-900 text-center border-b-2 border-gray-300 focus:border-blue-500 transition p-2 outline-none"
            />
          ) : (
            <h1 className="text-3xl font-bold text-gray-900">{profile?.name}</h1>
          )}
        </div>

        <div>
          {isEdit ? (
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full sm:text-base text-sm text-gray-600 text-center border-b-2 border-gray-300 focus:border-blue-500 transition p-2 outline-none"
            />
          ) : (
            <p className="text-sm sm:text-base text-gray-600">{profile?.email}</p>
          )}
        </div>

        <div>
          {isEdit ? (
            <input
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              className="w-full sm:text-lg text-base font-medium text-gray-700 text-center border-b-2 border-gray-300 focus:border-blue-500 transition p-2 outline-none"
            />
          ) : (
            <p className="text-lg font-medium text-gray-700">{profile?.headline}</p>
          )}
        </div>

        {isOwner ? (
          isEdit ? (
            <div className="flex gap-4">
              {loading ? (
                <button className="flex items-center bg-blue-600 px-6 py-2 rounded-lg text-white hover:bg-blue-700 transition">
                  <Loader className="animate-spin w-6 h-6" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="bg-blue-600 px-6 py-2 rounded-lg text-white hover:bg-blue-700 transition"
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
                className="bg-red-600 px-6 py-2 rounded-lg text-white hover:bg-red-700 transition"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsEdit(true)}
              className="bg-blue-600 px-6 py-2 rounded-lg text-white hover:bg-blue-700 transition"
            >
              Edit Profile
            </button>
          )
        ) : user?.connections.find((connection) => connection._id === profile._id) ? (
          <button className="bg-blue-600 px-6 py-2 rounded-lg text-white hover:bg-blue-700 transition">
            Connected
          </button>
        ) : (
          <button className="bg-red-600 px-6 py-2 rounded-lg text-white hover:bg-red-700 transition">
            Not Connected
          </button>
        )}
      </div>
    </div>
  );
};
